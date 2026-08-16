<?php

namespace App\Listeners;

use App\Events\ReportCreated;
use App\Models\ActivityLog;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Log;

class LogReportCreation implements ShouldQueue
{
    public function handle(ReportCreated $event): void
    {
        $report = $event->report;

        ActivityLog::create([
            'user_id'    => $report->user_id, // Null for anonymous reports
            'action'     => ($report->is_anonymous ? 'Anonymous report' : 'Report') . " submitted: {$report->reference_no}",
            'ip_address' => request()->ip() ?? '0.0.0.0',
            'user_agent' => request()->userAgent(),
        ]);

        Log::channel('activity')->info('Report submitted', [
            'reference_no' => $report->reference_no,
            'user_id'       => $report->user_id,
            'is_anonymous'  => $report->is_anonymous,
        ]);
    }
}
