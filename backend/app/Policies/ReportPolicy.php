<?php

namespace App\Policies;

use App\Enums\ReportStatusEnum;
use App\Models\Report;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

/**
 * ReportPolicy
 *
 * Centralises all report access rules.
 * Never put "if hasRole()" checks in controllers — use $this->authorize() instead.
 */
class ReportPolicy
{
    use HandlesAuthorization;

    /** Admin and Supervisor see everything; Officer sees assigned; Citizen sees own. */
    public function viewAny(User $user): bool
    {
        return true; // All authenticated users may list (scope applied in service)
    }

    public function view(User $user, Report $report): bool
    {
        if ($user->hasAnyRole(['Admin', 'Supervisor'])) {
            return true;
        }

        if ($user->hasRole('Officer')) {
            return $report->caseAssignments()->where('officer_id', $user->id)->exists();
        }

        // Citizen — own reports only
        return $report->user_id === $user->id;
    }

    /** Any authenticated user may submit a report. */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Citizen may only edit their own submitted reports.
     * Admin/Supervisor may edit any report at any stage.
     */
    public function update(User $user, Report $report): bool
    {
        if ($user->hasRole('Admin')) {
            return true;
        }

        if ($user->hasRole('Citizen')) {
            return $report->user_id === $user->id
                && $report->status === ReportStatusEnum::Submitted;
        }

        return false;
    }

    /** Only Admin may permanently delete (soft-delete). Citizen can delete own submitted reports. */
    public function delete(User $user, Report $report): bool
    {
        if ($user->hasRole('Admin')) {
            return true;
        }

        return $report->user_id === $user->id
            && $report->status === ReportStatusEnum::Submitted;
    }

    /** Only Admin and Supervisor may assign reports. */
    public function assign(User $user): bool
    {
        return $user->hasAnyRole(['Admin', 'Supervisor']);
    }

    /** Admin, Supervisor, and the assigned Officer may update status. */
    public function updateStatus(User $user, Report $report): bool
    {
        if ($user->hasAnyRole(['Admin', 'Supervisor'])) {
            return true;
        }

        if ($user->hasRole('Officer')) {
            return $report->caseAssignments()->where('officer_id', $user->id)->exists();
        }

        return false;
    }
}
