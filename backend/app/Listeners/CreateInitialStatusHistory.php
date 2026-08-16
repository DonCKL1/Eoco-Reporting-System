<?php

namespace App\Listeners;

use App\Enums\ReportStatusEnum;
use App\Events\ReportCreated;
use App\Models\CaseStatusHistory;
use Illuminate\Contracts\Queue\ShouldQueue;

/**
 * CreateInitialStatusHistory
 *
 * Listens for ReportCreated and inserts the first immutable status history record.
 * This removes the status-history creation concern from services entirely.
 */
class CreateInitialStatusHistory implements ShouldQueue
{
    public function handle(ReportCreated $event): void
    {
        $report = $event->report;

        CaseStatusHistory::create([
            'report_id'  => $report->id,
            'old_status' => '',
            'new_status' => ReportStatusEnum::Submitted->value,
            'changed_by' => $report->user_id ?? 1, // System user for anonymous reports
            'changed_at' => now(),
        ]);
    }
}
