<?php

namespace Tests\Feature;

use App\Models\AnonymousToken;
use App\Models\EvidenceFile;
use App\Models\Report;
use App\Models\ReportCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class CrimeReportingTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private User $officer;
    private User $citizen;
    private ReportCategory $category;

    protected function setUp(): void
    {
        parent::setUp();

        // Clear Spatie Permission cache to ensure permissions are registered correctly
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create roles and permissions
        $adminRole = Role::create(['name' => 'Admin']);
        $officerRole = Role::create(['name' => 'Officer']);
        $citizenRole = Role::create(['name' => 'Citizen']);

        Permission::create(['name' => 'create report']);
        Permission::create(['name' => 'upload evidence']);
        Permission::create(['name' => 'view evidence']);
        Permission::create(['name' => 'assign reports']);
        Permission::create(['name' => 'update report status']);

        $adminRole->givePermissionTo(Permission::all());
        $officerRole->givePermissionTo(['upload evidence', 'view evidence', 'update report status']);
        $citizenRole->givePermissionTo(['create report', 'upload evidence', 'view evidence']);

        // Create users
        $this->admin = User::factory()->create(['status' => 'active']);
        $this->admin->assignRole('Admin');

        $this->officer = User::factory()->create(['status' => 'active']);
        $this->officer->assignRole('Officer');

        $this->citizen = User::factory()->create(['status' => 'active']);
        $this->citizen->assignRole('Citizen');

        $this->category = ReportCategory::create([
            'name' => 'Financial Fraud',
            'description' => 'Money laundering and general fraud'
        ]);

        Storage::fake('local');
    }

    /**
     * Test creating and tracking anonymous reports.
     */
    public function test_anonymous_report_submission_and_tracking(): void
    {
        $response = $this->postJson('/api/anonymous-reports', [
            'category_id' => $this->category->id,
            'title' => 'Suspicious Transaction',
            'description' => 'An anonymous tip about suspicious transactions.',
            'incident_date' => now()->subDay()->format('Y-m-d'),
            'location' => 'Accra',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'reference_no',
                    'tracking_token',
                    'warning'
                ]
            ]);

        $token = $response->json('data.tracking_token');
        $this->assertNotEmpty($token);

        // Verify report was created in database
        $this->assertDatabaseHas('reports', [
            'title' => 'Suspicious Transaction',
            'is_anonymous' => true,
            'user_id' => null
        ]);

        // Track using plain token
        $trackResponse = $this->getJson("/api/track/{$token}");
        $trackResponse->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.status', 'submitted');
    }

    /**
     * Test uploading evidence and getting a secure temporary signed download URL.
     */
    public function test_evidence_upload_and_secure_download(): void
    {
        $report = Report::factory()->create([
            'user_id' => $this->citizen->id,
            'category_id' => $this->category->id,
            'status' => 'submitted'
        ]);

        $file = UploadedFile::fake()->image('evidence.jpg');

        $response = $this->actingAs($this->citizen)
            ->postJson("/api/reports/{$report->id}/evidence", [
                'file' => $file
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true);

        $evidenceId = $response->json('data.id');
        $this->assertNotNull($evidenceId);

        // Generate signed URL
        $urlResponse = $this->actingAs($this->citizen)
            ->getJson("/api/evidence/{$evidenceId}/download-url");

        $urlResponse->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'download_url'
                ]
            ]);

        $downloadUrl = $urlResponse->json('data.download_url');
        $this->assertNotEmpty($downloadUrl);

        // Verify signed download
        $downloadResponse = $this->getJson($downloadUrl);
        $downloadResponse->assertStatus(200)
            ->assertHeader('Content-Disposition', 'attachment; filename=evidence.jpg');
    }

    /**
     * Test case assignment logic and events.
     */
    public function test_case_assignment_to_officer(): void
    {
        Event::fake([
            \App\Events\ReportAssigned::class,
        ]);

        $report = Report::factory()->create([
            'user_id' => $this->citizen->id,
            'category_id' => $this->category->id,
            'status' => 'submitted'
        ]);

        $response = $this->actingAs($this->admin)
            ->postJson("/api/reports/{$report->id}/assign", [
                'officer_id' => $this->officer->id
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.officer.id', $this->officer->id);

        $this->assertDatabaseHas('case_assignments', [
            'report_id' => $report->id,
            'officer_id' => $this->officer->id,
        ]);

        // Verify report status is now assigned
        $this->assertDatabaseHas('reports', [
            'id' => $report->id,
            'status' => 'assigned'
        ]);

        Event::assertDispatched(\App\Events\ReportAssigned::class);
    }
}
