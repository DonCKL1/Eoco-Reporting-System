<?php

namespace App\Http\Controllers\Report;

use App\Http\Controllers\Controller;
use App\Http\Requests\Report\StoreAnonymousReportRequest;
use App\Http\Resources\AnonymousTrackResource;
use App\Services\Report\AnonymousReportService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Throwable;

class AnonymousReportController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly AnonymousReportService $service) {}

    /** POST /api/anonymous-reports */
    public function store(StoreAnonymousReportRequest $request): JsonResponse
    {
        try {
            $result = $this->service->createAnonymousReport($request->validated());

            return $this->created([
                'reference_no'   => $result['report']->reference_no,
                'tracking_token' => $result['token'],
                'warning'        => 'Store your tracking token securely. It cannot be recovered.',
            ], 'Your report has been submitted anonymously.');
        } catch (Throwable $e) {
            return $this->error('Submission failed.', 500);
        }
    }

    /** GET /api/track/{token} */
    public function track(string $token): JsonResponse
    {
        try {
            $report = $this->service->trackByToken($token);
            return $this->success(new AnonymousTrackResource($report));
        } catch (ModelNotFoundException) {
            return $this->error('Invalid or expired tracking token.', 404);
        } catch (Throwable $e) {
            return $this->error('Tracking failed.', 500);
        }
    }
}
