<?php

namespace App\Listeners;

use App\Events\ReportStatusChanged;
use App\Models\CaseStatusHistory;
use App\Models\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Mail\ReportStatusChangedMail;

/**
 * HandleStatusChange
 *
 * Listens for ReportStatusChanged and:
 *   1. Creates an immutable status history record
 *   2. Notifies the report owner
 *   3. Queues a status-change email to the owner
 *   4. Logs the change
 */
class HandleStatusChange implements ShouldQueue
{
    public function handle(ReportStatusChanged $event): void
    {
        $report = $event->report;

        // Immutable audit record
        CaseStatusHistory::create([
            'report_id'  => $report->id,
            'old_status' => $event->oldStatus->value,
            'new_status' => $event->newStatus->value,
            'changed_by' => $event->changedBy->id,
            'changed_at' => now(),
        ]);

        // In-app notification to report owner
        if ($report->user_id) {
            Notification::create([
                'user_id' => $report->user_id,
                'title'   => 'Report Status Updated',
                'body'    => "Report {$report->reference_no} status changed to: {$event->newStatus->label()}",
            ]);

            // Queue email
            if ($report->user?->email) {
                Mail::to($report->user->email)->queue(new ReportStatusChangedMail($report, $event->newStatus));
            }
        }

        Log::channel('activity')->info('Report status changed', [
            'reference_no' => $report->reference_no,
            'from'         => $event->oldStatus->value,
            'to'           => $event->newStatus->value,
            'changed_by'   => $event->changedBy->id,
        ]);
    }

    public function failed(ReportStatusChanged $event, \Throwable $exception): void
    {
        Log::channel('security')->error('Status change notification failed', [
            'error' => $exception->getMessage(),
        ]);
    }
}
