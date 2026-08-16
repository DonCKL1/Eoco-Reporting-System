<?php

namespace App\Policies;

use App\Models\CaseAssignment;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class AssignmentPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['Admin', 'Supervisor', 'Officer']);
    }

    public function create(User $user): bool
    {
        return $user->hasAnyRole(['Admin', 'Supervisor']);
    }

    public function view(User $user, CaseAssignment $assignment): bool
    {
        if ($user->hasAnyRole(['Admin', 'Supervisor'])) {
            return true;
        }

        return $assignment->officer_id === $user->id;
    }
}
