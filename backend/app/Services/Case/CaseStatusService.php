<?php

namespace App\Services\Case;

use App\Enums\ReportStatusEnum;
use App\Events\ReportStatusChanged;
use App\Exceptions\InvalidStatusTransitionException;
use App\Models\Report;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

/**
 * CaseStatusService
 *
 * Manages report status transitions using the ReportStatusEnum transition matrix.
 * Side effects (history, notification, email, log) are handled by HandleStatusChange listener.
 */
class CaseStatusService
{
    /**
     * Transition a report to a new status.
     *
     * @throws InvalidStatusTransitionException
     */
    public function updateStatus(Report $report, ReportStatusEnum $newStatus, User $changedBy): Report
    {
        $currentStatus = ReportStatusEnum::from($report->status);

        if ($currentStatus === $newStatus) {
            throw new InvalidStatusTransitionException($currentStatus, $newStatus);
        }

        if (!$currentStatus->canTransitionTo($newStatus)) {
            throw new InvalidStatusTransitionException($currentStatus, $newStatus);
        }

        return DB::transaction(function () use ($report, $newStatus, $currentStatus, $changedBy): Report {
            $report->update(['status' => $newStatus->value]);

            // Dispatch event — listener creates history, sends notifications, logs
            ReportStatusChanged::dispatch($report, $currentStatus, $newStatus, $changedBy);

            return $report->fresh();
        });
    }

    /**
     * Get the full status change history for a report.
     */
    public function getHistory(Report $report): Collection
    {
        return $report->statusHistories()
            ->with('changedBy')
            ->orderBy('changed_at')
            ->get();
    }
}
