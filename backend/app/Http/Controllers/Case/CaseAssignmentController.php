<?php

namespace App\Http\Controllers\Case;

use App\Http\Controllers\Controller;
use App\Http\Requests\Case\AssignCaseRequest;
use App\Http\Resources\CaseAssignmentResource;
use App\Http\Resources\ReportResource;
use App\Models\Report;
use App\Models\User;
use App\Services\Case\CaseAssignmentService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;
use Throwable;

class CaseAssignmentController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly CaseAssignmentService $service) {}

    /** POST /api/reports/{report}/assign */
    public function assign(AssignCaseRequest $request, Report $report): JsonResponse
    {
        Gate::authorize('create', \App\Models\CaseAssignment::class);

        try {
            $officer    = User::findOrFail($request->officer_id);
            $assignment = $this->service->assign($report, $officer, auth()->user());

            return $this->created(
                new CaseAssignmentResource($assignment),
                'Case assigned successfully.'
            );
        } catch (\App\Exceptions\AssignmentException $e) {
            return $this->error($e->getMessage(), 422);
        } catch (Throwable $e) {
            return $this->error('Assignment failed.', 500);
        }
    }

    /** GET /api/assigned-reports */
    public function assignedReports(): JsonResponse
    {
        Gate::authorize('viewAny', \App\Models\CaseAssignment::class);

        try {
            $reports = $this->service->getAssignedReports(auth()->user());
            return $this->paginated(ReportResource::collection($reports));
        } catch (Throwable $e) {
            return $this->error('Failed to load assigned reports.', 500);
        }
    }
}
