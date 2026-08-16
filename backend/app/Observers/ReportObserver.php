<?php

namespace App\Observers;

use App\Enums\ReportStatusEnum;
use App\Events\ReportCreated;
use App\Models\Report;
use Illuminate\Support\Facades\DB;

/**
 * ReportObserver
 *
 * Handles automatic side effects on Report model lifecycle events.
 * This removes these concerns from services, keeping them focused on
 * business rules rather than persistence side effects.
 */
class ReportObserver
{
    /**
     * Before the report is inserted — generate a unique reference number.
     * Runs in the same transaction as the insert.
     */
    public function creating(Report $report): void
    {
        if (empty($report->reference_no)) {
            $report->reference_no = $this->generateReferenceNumber();
        }
    }

    /**
     * After the report is persisted — fire the ReportCreated event.
     * Listeners handle: status history, activity log, notifications.
     */
    public function created(Report $report): void
    {
        ReportCreated::dispatch($report);
    }

    /**
     * After a soft-delete — fire a generic domain event for logging if needed.
     */
    public function deleted(Report $report): void
    {
        \Log::channel('reporting')->info('Report soft-deleted', [
            'reference_no' => $report->reference_no,
            'deleted_by'   => auth()->id(),
        ]);
    }

    /**
     * Generate EOCO-YYYY-XXXXXX using a DB-level lock to prevent race conditions.
     */
    private function generateReferenceNumber(): string
    {
        return DB::transaction(function (): string {
            $year  = now()->year;
            // Use FOR UPDATE to prevent concurrent inserts generating the same number
            $count = Report::withTrashed()
                ->lockForUpdate()
                ->whereYear('created_at', $year)
                ->count() + 1;

            return sprintf('EOCO-%d-%06d', $year, $count);
        });
    }
}
