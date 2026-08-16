<?php

namespace App\Listeners;

use App\Events\EvidenceUploaded;
use App\Models\ActivityLog;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Log;

class LogEvidenceUpload implements ShouldQueue
{
    public function handle(EvidenceUploaded $event): void
    {
        $evidence   = $event->evidence;
        $uploadedBy = $event->uploadedBy;

        ActivityLog::create([
            'user_id'    => $uploadedBy->id,
            'action'     => "Uploaded evidence '{$evidence->original_name}' for report {$evidence->report->reference_no}",
            'ip_address' => request()->ip() ?? '0.0.0.0',
            'user_agent' => request()->userAgent(),
        ]);

        Log::channel('activity')->info('Evidence uploaded', [
            'evidence_id'  => $evidence->id,
            'report_id'    => $evidence->report_id,
            'uploaded_by'  => $uploadedBy->id,
            'file_name'    => $evidence->original_name,
        ]);
    }
}
