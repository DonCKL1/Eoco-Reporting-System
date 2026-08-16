<?php

namespace App\Services\Evidence;

use App\Events\EvidenceUploaded;
use App\Exceptions\EvidenceUploadException;
use App\Models\EvidenceFile;
use App\Models\Report;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Exception;

class EvidenceService
{
    /**
     * Store an uploaded evidence file for a report.
     *
     * @throws EvidenceUploadException
     */
    public function store(Report $report, UploadedFile $file): EvidenceFile
    {
        try {
            // Store inside storage/app/private/evidence/{report_id}
            $path = $file->store("private/evidence/{$report->id}", 'local');

            if (!$path) {
                throw new Exception('File could not be written to disk.');
            }

            $evidence = EvidenceFile::create([
                'report_id'     => $report->id,
                'filename'      => basename($path),
                'original_name' => $file->getClientOriginalName(),
                'file_type'     => $file->getMimeType(),
                'file_size'     => $file->getSize(),
                'path'          => $path,
                'encrypted'     => false,
                'uploaded_at'   => now(),
            ]);

            // Dispatch event for log/notification side-effects
            EvidenceUploaded::dispatch($evidence, auth()->user());

            return $evidence;
        } catch (Exception $e) {
            throw new EvidenceUploadException('Failed to upload evidence: ' . $e->getMessage());
        }
    }

    /**
     * Get all evidence files for a report.
     */
    public function getForReport(Report $report): \Illuminate\Database\Eloquent\Collection
    {
        return $report->evidenceFiles()->latest('uploaded_at')->get();
    }

    /**
     * Delete an evidence file.
     */
    public function delete(EvidenceFile $evidence): void
    {
        if (Storage::disk('local')->exists($evidence->path)) {
            Storage::disk('local')->delete($evidence->path);
        }

        $evidence->delete();
    }
}
