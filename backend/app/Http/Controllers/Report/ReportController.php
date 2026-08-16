<?php

namespace App\Http\Controllers\Report;

use App\Http\Controllers\Controller;
use App\Http\Requests\Report\StoreReportRequest;
use App\Http\Requests\Report\UpdateReportRequest;
use App\Http\Resources\ReportResource;
use App\Models\Report;
use App\Services\Report\ReportService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Throwable;

class ReportController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly ReportService $reportService) {}

    /** GET /api/reports */
    public function index(): JsonResponse
    {
        $this->authorize('viewAny', Report::class);

        try {
            $reports = $this->reportService->getReports(auth()->user());
            return $this->paginated(
                ReportResource::collection($reports),
                'Reports retrieved successfully.'
            );
        } catch (Throwable $e) {
            return $this->error('Failed to retrieve reports.', 500);
        }
    }

    /** POST /api/reports */
    public function store(StoreReportRequest $request): JsonResponse
    {
        $this->authorize('create', Report::class);

        try {
            $report = $this->reportService->createReport(auth()->user(), $request->validated());
            return $this->created(new ReportResource($report), 'Report submitted successfully.');
        } catch (Throwable $e) {
            return $this->error('Report submission failed.', 500);
        }
    }

    /** GET /api/reports/{report} */
    public function show(Report $report): JsonResponse
    {
        $this->authorize('view', $report);

        try {
            $detailedReport = $this->reportService->getReport(auth()->user(), $report);
            return $this->success(new ReportResource($detailedReport));
        } catch (Throwable $e) {
            return $this->error('Unable to retrieve report.', 500);
        }
    }

    /** PUT /api/reports/{report} */
    public function update(UpdateReportRequest $request, Report $report): JsonResponse
    {
        $this->authorize('update', $report);

        try {
            $updated = $this->reportService->updateReport($report, $request->validated());
            return $this->success(new ReportResource($updated), 'Report updated successfully.');
        } catch (Throwable $e) {
            return $this->error('Update failed.', 500);
        }
    }

    /** DELETE /api/reports/{report} */
    public function destroy(Report $report): JsonResponse
    {
        $this->authorize('delete', $report);

        try {
            $this->reportService->deleteReport($report);
            return $this->success(null, 'Report deleted successfully.');
        } catch (Throwable $e) {
            return $this->error('Delete failed.', 500);
        }
    }
}
