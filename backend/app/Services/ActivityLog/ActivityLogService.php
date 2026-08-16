<?php

namespace App\Services\ActivityLog;

use App\Models\ActivityLog;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * ActivityLogService — logs system events and provides admin retrieval.
 */
class ActivityLogService
{
    /**
     * Record an activity event. Call this from other services.
     */
    public function log(string $action, ?int $userId = null): void
    {
        ActivityLog::create([
            'user_id'    => $userId ?? auth()->id(),
            'action'     => $action,
            'ip_address' => request()->ip() ?? '0.0.0.0',
            'user_agent' => request()->userAgent(),
        ]);
    }

    /**
     * Get paginated activity logs for admin review.
     */
    public function getPaginated(int $perPage = 25): LengthAwarePaginator
    {
        return ActivityLog::with('user')
            ->latest()
            ->paginate($perPage);
    }
}
