<?php

namespace App\Http\Controllers\Notification;

use App\Http\Controllers\Controller;
use App\Http\Resources\NotificationResource;
use App\Models\Notification;
use App\Services\Notification\NotificationService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Throwable;

class NotificationController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly NotificationService $service) {}

    /** GET /api/notifications */
    public function index(): JsonResponse
    {
        try {
            $userId        = auth()->id();
            $notifications = $this->service->getForUser($userId);
            $unreadCount   = $this->service->unreadCount($userId);

            return $this->success([
                'unread_count'  => $unreadCount,
                'notifications' => NotificationResource::collection($notifications),
            ], 'Notifications retrieved.');
        } catch (Throwable $e) {
            return $this->error('Failed to load notifications.', 500);
        }
    }

    /** PATCH /api/notifications/{notification}/read */
    public function markRead(Notification $notification): JsonResponse
    {
        if ($notification->user_id !== auth()->id()) {
            return $this->forbidden('You are not authorized to access this notification.');
        }

        try {
            $updated = $this->service->markRead($notification);
            return $this->success(new NotificationResource($updated), 'Notification marked as read.');
        } catch (Throwable $e) {
            return $this->error('Failed to update notification.', 500);
        }
    }
}
