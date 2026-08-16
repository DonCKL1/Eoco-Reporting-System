<?php

namespace App\Http\Controllers\Case;

use App\Http\Controllers\Controller;
use App\Http\Requests\Case\UpdateStatusRequest;
use App\Http\Resources\CaseStatusHistoryResource;
use App\Http\Resources\ReportResource;
use App\Models\Report;
use App\Services\Case\CaseStatusService;
use App\Enums\ReportStatusEnum;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Throwable;

class CaseStatusController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly CaseStatusService $service) {}

    /** PATCH /api/reports/{report}/status */
    public function update(UpdateStatusRequest $request, Report $report): JsonResponse
    {
        $this->authorize('updateStatus', $report);

        try {
            $newStatus = ReportStatusEnum::from($request->status);
            $updated   = $this->service->updateStatus($report, $newStatus, auth()->user());

            return $this->success(
                new ReportResource($updated),
                "Status updated to '{$newStatus->label()}'."
            );
        } catch (\App\Exceptions\InvalidStatusTransitionException $e) {
            return $this->error($e->getMessage(), 422, [
                'current_status'      => $e->render()->getData()->current_status,
                'allowed_transitions' => $e->render()->getData()->allowed_transitions,
            ]);
        } catch (Throwable $e) {
            return $this->error('Status update failed.', 500);
        }
    }

    /** GET /api/reports/{report}/history */
    public function history(Report $report): JsonResponse
    {
        $this->authorize('view', $report);

        try {
            $history = $this->service->getHistory($report);
            return $this->success(CaseStatusHistoryResource::collection($history));
        } catch (Throwable $e) {
            return $this->error('Failed to load history.', 500);
        }
    }
}
