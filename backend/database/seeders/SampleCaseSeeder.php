<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Report;
use App\Models\ReportCategory;
use App\Models\CaseAssignment;
use App\Models\CaseStatusHistory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class SampleCaseSeeder extends Seeder
{
    public function run(): void
    {
        $officers = User::role('officer')->get();
        $supervisor = User::role('supervisor')->first();
        $citizens = User::role('citizen')->get();
        $categories = ReportCategory::all();

        if ($officers->isEmpty() || !$supervisor || $citizens->isEmpty() || $categories->isEmpty()) {
            return;
        }

        // Create 20 reports
        for ($i = 0; $i < 20; $i++) {
            $citizen = $citizens->random();
            $category = $categories->random();
            
            $report = Report::create([
                'user_id' => $citizen->id,
                'category_id' => $category->id,
                'reference_no' => 'ECO-' . strtoupper(Str::random(8)),
                'title' => 'Suspicious Activity Report ' . ($i + 1),
                'description' => 'Detailed description of the suspicious activity ' . ($i + 1) . ' observed by the citizen. Further investigation is required.',
                'incident_date' => now()->subDays(rand(1, 60))->toDateString(),
                'location' => 'Accra, Region ' . rand(1, 5),
                'status' => ['submitted', 'investigating', 'resolved', 'closed'][rand(0, 3)],
                'priority' => ['low', 'medium', 'high', 'critical'][rand(0, 3)],
                'is_anonymous' => false,
                'created_at' => now()->subDays(rand(5, 60)),
            ]);

            // Create initial status history
            CaseStatusHistory::create([
                'report_id' => $report->id,
                'old_status' => 'submitted',
                'new_status' => 'submitted',
                'changed_by' => $citizen->id,
                'changed_at' => $report->created_at,
                'created_at' => $report->created_at,
            ]);

            // Assign to officer if not just submitted
            if ($report->status !== 'submitted') {
                $officer = $officers->random();
                
                CaseAssignment::create([
                    'report_id' => $report->id,
                    'officer_id' => $officer->id,
                    'assigned_by' => $supervisor->id,
                    'assigned_at' => $report->created_at->addDay(),
                    'created_at' => $report->created_at->addDay(),
                ]);

                CaseStatusHistory::create([
                    'report_id' => $report->id,
                    'old_status' => 'submitted',
                    'new_status' => 'investigating',
                    'changed_by' => $supervisor->id,
                    'changed_at' => $report->created_at->addDay(),
                    'created_at' => $report->created_at->addDay(),
                ]);
            }
            
            if ($report->status === 'resolved' || $report->status === 'closed') {
                CaseStatusHistory::create([
                    'report_id' => $report->id,
                    'old_status' => 'investigating',
                    'new_status' => $report->status,
                    'changed_by' => $officer->id ?? clone $supervisor->id,
                    'changed_at' => $report->created_at->addDays(5),
                    'created_at' => $report->created_at->addDays(5),
                ]);
            }
        }
    }
}
