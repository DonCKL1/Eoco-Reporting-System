<?php

namespace App\Services\Report;

use App\Enums\PriorityEnum;
use App\Enums\ReportStatusEnum;
use App\Models\AnonymousToken;
use App\Models\Report;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class AnonymousReportService
{
    /**
     * Create an anonymous report with a tracking token.
     *
     * @param  array<string, mixed>  $data
     * @return array{report: Report, token: string}
     */
    public function createAnonymousReport(array $data): array
    {
        return DB::transaction(function () use ($data): array {
            // Note: ReportObserver handles reference_no, and dispatches ReportCreated
            // which creates initial status history and activity log entries.
            $report = Report::create([
                'user_id'       => null,
                'category_id'   => $data['category_id'],
                'title'         => $data['title'],
                'description'   => $data['description'],
                'incident_date' => $data['incident_date'] ?? null,
                'location'      => $data['location'] ?? null,
                'is_anonymous'  => true,
                'priority'      => PriorityEnum::Low->value,
                'status'        => ReportStatusEnum::Submitted->value,
                'risk_score'    => 0,
            ]);

            // Generate a cryptographically secure tracking token
            $plainToken = Str::random(64);

            AnonymousToken::create([
                'report_id'  => $report->id,
                'token'      => hash('sha256', $plainToken),
                'expires_at' => now()->addDays(90),
            ]);

            return ['report' => $report->load('category'), 'token' => $plainToken];
        });
    }

    /**
     * Track an anonymous report by plain token.
     *
     * @throws ModelNotFoundException
     */
    public function trackByToken(string $plainToken): Report
    {
        $hashed = hash('sha256', $plainToken);

        $anonymousToken = AnonymousToken::where('token', $hashed)
            ->where(fn ($q) => $q->whereNull('expires_at')->orWhere('expires_at', '>', now()))
            ->firstOrFail();

        return $anonymousToken->report()->with('category')->firstOrFail();
    }
}
