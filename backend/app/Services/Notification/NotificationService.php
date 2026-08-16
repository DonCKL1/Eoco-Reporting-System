<?php

namespace App\Services\Notification;

use App\Models\Notification;

/**
 * NotificationService — used by other services to send in-app notifications.
 */
class NotificationService
{
    /**
     * Send a notification to a specific user.
     */
    public function send(int $userId, string $title, string $body): void
    {
        Notification::create([
            'user_id' => $userId,
            'title'   => $title,
            'body'    => $body,
            'is_read' => false,
        ]);
    }

    /**
     * Get all notifications for the authenticated user.
     */
    public function getForUser(int $userId): \Illuminate\Database\Eloquent\Collection
    {
        return Notification::where('user_id', $userId)
            ->latest()
            ->get();
    }

    /**
     * Mark a single notification as read.
     */
    public function markRead(Notification $notification): Notification
    {
        $notification->update(['is_read' => true]);
        return $notification;
    }

    /**
     * Count unread notifications for a user.
     */
    public function unreadCount(int $userId): int
    {
        return Notification::where('user_id', $userId)
            ->where('is_read', false)
            ->count();
    }
}
