<?php

namespace App\Policies;

use App\Models\Message;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class MessagePolicy
{
    use HandlesAuthorization;

    /** A user may view a message if they are the sender or receiver. */
    public function view(User $user, Message $message): bool
    {
        if ($user->hasAnyRole(['Admin', 'Supervisor'])) {
            return true;
        }

        return $message->sender_id === $user->id || $message->receiver_id === $user->id;
    }

    /** Authenticated users with the send permission may send messages. */
    public function create(User $user): bool
    {
        return $user->can('send messages');
    }
}
