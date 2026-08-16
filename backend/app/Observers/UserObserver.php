<?php

namespace App\Observers;

use App\Models\User;
use Illuminate\Support\Facades\Log;

/**
 * UserObserver
 *
 * Logs user lifecycle events to the security channel.
 */
class UserObserver
{
    public function created(User $user): void
    {
        Log::channel('security')->info('New user registered', [
            'user_id' => $user->id,
            'email'   => $user->email,
            'ip'      => request()->ip(),
        ]);
    }

    public function deleted(User $user): void
    {
        Log::channel('security')->warning('User account deleted', [
            'user_id'    => $user->id,
            'email'      => $user->email,
            'deleted_by' => auth()->id(),
        ]);
    }

    public function updated(User $user): void
    {
        if ($user->wasChanged('status')) {
            Log::channel('security')->info('User status changed', [
                'user_id'    => $user->id,
                'old_status' => $user->getOriginal('status'),
                'new_status' => $user->status,
                'changed_by' => auth()->id(),
            ]);
        }
    }
}
