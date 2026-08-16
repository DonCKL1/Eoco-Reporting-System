<?php

namespace App\Services\Case;

use App\Enums\ReportStatusEnum;
use App\Events\ReportAssigned;
use App\Exceptions\AssignmentException;
use App\Models\CaseAssignment;
use App\Models\Report;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Exception;

class CaseAssignmentService
{
    /**
     * Assign a report to an officer.
     *
     * @throws AssignmentException
     */
    public function assign(Report $report, User $officer, User $assignedBy): CaseAssignment
    {
        if (!$officer->hasRole('Officer')) {
            throw new AssignmentException('The selected user is not an Officer.');
        }

        $exists = CaseAssignment::where('report_id', $report->id)
            ->where('officer_id', $officer->id)
            ->exists();

        if ($exists) {
            throw new AssignmentException("Officer {$officer->name} is already assigned to this report.");
        }

        try {
            return DB::transaction(function () use ($report, $officer, $assignedBy): CaseAssignment {
                $assignment = CaseAssignment::create([
                    'report_id'   => $report->id,
                    'officer_id'  => $officer->id,
                    'assigned_by' => $assignedBy->id,
                    'assigned_at' => now(),
                ]);

                // Update report status to assigned
                $report->update(['status' => ReportStatusEnum::Assigned->value]);

                // Fire event for notifications, emails, and logging
                ReportAssigned::dispatch($assignment);

                return $assignment->load(['officer', 'assigner']);
            });
        } catch (Exception $e) {
            throw new AssignmentException('Assignment failed: ' . $e->getMessage());
        }
    }

    /**
     * Get all reports assigned to the authenticated officer.
     */
    public function getAssignedReports(User $officer): LengthAwarePaginator
    {
        return Report::with(['category', 'caseAssignments.officer'])
            ->whereHas('caseAssignments', fn ($q) => $q->where('officer_id', $officer->id))
            ->latest()
            ->paginate(15);
    }
}
