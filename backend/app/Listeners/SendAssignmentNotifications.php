<?php

namespace App\Listeners;

use App\Events\ReportAssigned;
use App\Models\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Mail\ReportAssignedMail;

/**
 * SendAssignmentNotifications
 *
 * Listens for ReportAssigned and:
 *   1. Sends an in-app notification to the officer
 *   2. Sends an in-app notification to the report owner (if not anonymous)
 *   3. Queues emails to both parties
 *   4. Writes to the activity log
 */
class SendAssignmentNotifications implements ShouldQueue
{
    public function handle(ReportAssigned $event): void
    {
        $assignment = $event->assignment;
        $report     = $assignment->report;
        $officer    = $assignment->officer;

        // In-app notification to officer
        Notification::create([
            'user_id' => $officer->id,
            'title'   => 'New Case Assigned',
            'body'    => "You have been assigned to report {$report->reference_no}: {$report->title}",
        ]);

        // In-app notification to citizen (if not anonymous)
        if ($report->user_id) {
            Notification::create([
                'user_id' => $report->user_id,
                'title'   => 'Report Assigned',
                'body'    => "Report {$report->reference_no} has been assigned to an investigating officer.",
            ]);
        }

        // Queue email to officer
        if ($officer->email) {
            Mail::to($officer->email)->queue(new ReportAssignedMail($assignment));
        }

        // Activity log
        Log::channel('activity')->info('Report assigned', [
            'reference_no' => $report->reference_no,
            'officer_id'   => $officer->id,
            'officer_name' => $officer->name,
            'assigned_by'  => $assignment->assigned_by,
        ]);
    }

    public function failed(ReportAssigned $event, \Throwable $exception): void
    {
        Log::channel('security')->error('Assignment notification failed', [
            'error' => $exception->getMessage(),
        ]);
    }
}
