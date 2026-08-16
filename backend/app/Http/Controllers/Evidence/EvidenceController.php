<?php

namespace App\Http\Controllers\Evidence;

use App\Http\Controllers\Controller;
use App\Http\Requests\Evidence\UploadEvidenceRequest;
use App\Http\Resources\EvidenceResource;
use App\Models\EvidenceFile;
use App\Models\Report;
use App\Services\Evidence\EvidenceService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\URL;
use Throwable;

class EvidenceController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly EvidenceService $evidenceService) {}

    /** POST /api/reports/{report}/evidence */
    public function store(UploadEvidenceRequest $request, Report $report): JsonResponse
    {
        Gate::authorize('create', EvidenceFile::class);

        try {
            $evidence = $this->evidenceService->store($report, $request->file('file'));
            return $this->created(new EvidenceResource($evidence), 'Evidence uploaded successfully.');
        } catch (Throwable $e) {
            return $this->error($e->getMessage(), 500);
        }
    }

    /** GET /api/reports/{report}/evidence */
    public function index(Report $report): JsonResponse
    {
        try {
            $files = $this->evidenceService->getForReport($report);
            return $this->success(EvidenceResource::collection($files));
        } catch (Throwable $e) {
            return $this->error('Failed to retrieve evidence.', 500);
        }
    }

    /** DELETE /api/evidence/{evidence} */
    public function destroy(EvidenceFile $evidence): JsonResponse
    {
        Gate::authorize('delete', $evidence);

        try {
            $this->evidenceService->delete($evidence);
            return $this->success(null, 'Evidence deleted successfully.');
        } catch (Throwable $e) {
            return $this->error('Deletion failed.', 500);
        }
    }

    /** GET /api/evidence/{evidence}/download-url */
    public function getDownloadUrl(EvidenceFile $evidence): JsonResponse
    {
        Gate::authorize('view', $evidence);

        // Generate a 15-minute temporary signed download URL
        $url = URL::temporarySignedRoute(
            'evidence.download',
            now()->addMinutes(15),
            ['evidence' => $evidence->id]
        );

        return $this->success(['download_url' => $url]);
    }
}
