<?php

namespace App\Services\Message;

use App\Events\MessageSent;
use App\Models\Message;
use App\Models\Report;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class MessageService
{
    public function getForUser(User $user): LengthAwarePaginator
    {
        return Message::with(['sender', 'receiver', 'report'])
            ->where(fn ($q) => $q->where('sender_id', $user->id)->orWhere('receiver_id', $user->id))
            ->latest()
            ->paginate(20);
    }

    public function getForReport(Report $report, User $user): LengthAwarePaginator
    {
        return Message::with(['sender', 'receiver'])
            ->where('report_id', $report->id)
            ->where(fn ($q) => $q->where('sender_id', $user->id)->orWhere('receiver_id', $user->id))
            ->latest()
            ->paginate(20);
    }

    public function send(User $sender, array $data): Message
    {
        return DB::transaction(function () use ($sender, $data): Message {
            $message = Message::create([
                'report_id'   => $data['report_id'],
                'sender_id'   => $sender->id,
                'receiver_id' => $data['receiver_id'],
                'message'     => $data['message'],
                'is_read'     => false,
            ]);

            // Fire event for logging and notifications
            MessageSent::dispatch($message);

            return $message->load(['sender', 'receiver']);
        });
    }
}
