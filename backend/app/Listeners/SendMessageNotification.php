<?php

namespace App\Listeners;

use App\Events\MessageSent;
use App\Models\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Log;

class SendMessageNotification implements ShouldQueue
{
    public function handle(MessageSent $event): void
    {
        $message = $event->message;

        Notification::create([
            'user_id' => $message->receiver_id,
            'title'   => 'New Message Received',
            'body'    => "You have received a new message regarding report {$message->report->reference_no}",
            'is_read' => false,
        ]);

        Log::channel('activity')->info('Message sent', [
            'message_id'  => $message->id,
            'sender_id'   => $message->sender_id,
            'receiver_id' => $message->receiver_id,
            'report_id'   => $message->report_id,
        ]);
    }
}
