<?php

namespace App\Policies;

use App\Models\EvidenceFile;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class EvidencePolicy
{
    use HandlesAuthorization;

    public function view(User $user, EvidenceFile $evidence): bool
    {
        if ($user->hasAnyRole(['Admin', 'Supervisor'])) {
            return true;
        }

        if ($user->hasRole('Officer')) {
            return $evidence->report->caseAssignments()->where('officer_id', $user->id)->exists();
        }

        return $evidence->report->user_id === $user->id;
    }

    public function create(User $user): bool
    {
        return $user->hasAnyRole(['Admin', 'Supervisor', 'Officer', 'Citizen']);
    }

    public function delete(User $user, EvidenceFile $evidence): bool
    {
        if ($user->hasAnyRole(['Admin', 'Supervisor'])) {
            return true;
        }

        // Original uploader (from the report's owner)
        return $evidence->report->user_id === $user->id;
    }
}
