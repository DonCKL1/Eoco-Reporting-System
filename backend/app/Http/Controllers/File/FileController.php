<?php

namespace App\Http\Controllers\File;

use App\Http\Controllers\Controller;
use App\Models\EvidenceFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

/**
 * FileController
 *
 * Handles secure downloads of private evidence files using signed URLs.
 */
class FileController extends Controller
{
    /**
     * Download the specified evidence file.
     * Guarded by signed middleware.
     */
    public function download(Request $request, EvidenceFile $evidence): BinaryFileResponse
    {
        // Enforce signature check
        if (!$request->hasValidSignature()) {
            abort(403, 'Invalid or expired signature.');
        }

        // Retrieve file from private storage
        $filePath = Storage::disk('local')->path($evidence->path);

        if (!Storage::disk('local')->exists($evidence->path)) {
            abort(404, 'File not found on disk.');
        }

        return response()->download($filePath, $evidence->original_name, [
            'Content-Type' => $evidence->file_type,
        ]);
    }
}
