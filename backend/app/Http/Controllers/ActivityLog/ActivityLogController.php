<?php

namespace App\Http\Controllers\ActivityLog;

use App\Http\Controllers\Controller;
use App\Http\Resources\ActivityLogResource;
use App\Services\ActivityLog\ActivityLogService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Throwable;

class ActivityLogController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly ActivityLogService $service) {}

    /** GET /api/activity-logs */
    public function index(): JsonResponse
    {
        \Illuminate\Support\Facades\Gate::authorize('viewAny', \App\Models\ActivityLog::class);

        try {
            $perPage = request()->integer('per_page', 25);
            $logs    = $this->service->getPaginated($perPage);

            return $this->paginated(ActivityLogResource::collection($logs));
        } catch (Throwable $e) {
            return $this->error('Failed to load activity logs.', 500);
        }
    }
}
