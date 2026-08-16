<?php

namespace App\Http\Controllers\Analytics;

use App\Http\Controllers\Controller;
use App\Services\Analytics\AnalyticsService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Throwable;

class AnalyticsController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly AnalyticsService $service) {}

    /** GET /api/dashboard/stats */
    public function stats(): JsonResponse
    {
        try {
            return $this->success($this->service->getStats());
        } catch (Throwable $e) {
            return $this->error('Failed to load stats.', 500);
        }
    }

    /** GET /api/dashboard/reports-by-category */
    public function reportsByCategory(): JsonResponse
    {
        try {
            return $this->success($this->service->reportsByCategory());
        } catch (Throwable $e) {
            return $this->error('Failed to load reports by category.', 500);
        }
    }

    /** GET /api/dashboard/status-summary */
    public function statusSummary(): JsonResponse
    {
        try {
            return $this->success($this->service->statusSummary());
        } catch (Throwable $e) {
            return $this->error('Failed to load status summary.', 500);
        }
    }
}
