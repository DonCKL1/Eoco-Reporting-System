<?php

namespace App\Http\Controllers\Search;

use App\Http\Controllers\Controller;
use App\Http\Requests\Search\SearchReportRequest;
use App\Http\Resources\ReportResource;
use App\Services\Search\SearchService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Throwable;

class SearchController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly SearchService $service) {}

    /** GET /api/search/reports */
    public function reports(SearchReportRequest $request): JsonResponse
    {
        try {
            $results = $this->service->searchReports(auth()->user(), $request->validated());
            return $this->paginated(ReportResource::collection($results));
        } catch (Throwable $e) {
            return $this->error('Search operation failed.', 500);
        }
    }
}
