<?php

namespace App\Services\Report;

use App\Enums\PriorityEnum;
use App\Enums\ReportStatusEnum;
use App\Exceptions\ReportNotAccessibleException;
use App\Models\Report;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

/**
 * ReportService
 *
 * Core report business logic.
 * Reference number generation and initial status history are handled
 * by ReportObserver and CreateInitialStatusHistory listener respectively.
 * This service is now focused purely on CRUD rules.
 */
class ReportService
{
    /**
     * Role-scoped report listing.
     */
    public function getReports(User $user): LengthAwarePaginator
    {
        $query = Report::with(['category', 'user'])->withCount('evidenceFiles');

        if ($user->hasAnyRole(['Admin', 'Supervisor'])) {
            // Full visibility — no filter
        } elseif ($user->hasRole('Officer')) {
            $query->whereHas('caseAssignments', fn ($q) => $q->where('officer_id', $user->id));
        } else {
            // Citizen — own reports only
            $query->where('user_id', $user->id);
        }

        return $query->latest()->paginate(15);
    }

    /**
     * Fetch a single report with full relationships.
     *
     * @throws ReportNotAccessibleException
     */
    public function getReport(User $user, Report $report): Report
    {
        if ($user->hasRole('Citizen') && $report->user_id !== $user->id) {
            throw new ReportNotAccessibleException();
        }

        return $report->load(['category', 'user', 'evidenceFiles', 'caseAssignments.officer', 'statusHistories.changedBy']);
    }

    /**
     * Create a report for an authenticated citizen.
     * Reference number is set by ReportObserver::creating().
     * Status history is created by CreateInitialStatusHistory listener.
     */
    public function createReport(User $user, array $data): Report
    {
        return DB::transaction(function () use ($user, $data): Report {
            $report = Report::create([
                'user_id'       => $user->id,
                'category_id'   => $data['category_id'],
                'title'         => $data['title'],
                'description'   => $data['description'],
                'incident_date' => $data['incident_date'] ?? null,
                'location'      => $data['location'] ?? null,
                'is_anonymous'  => false,
                'priority'      => $data['priority'] ?? PriorityEnum::Low->value,
                'status'        => ReportStatusEnum::Submitted->value,
                'risk_score'    => 0,
            ]);

            return $report->load('category');
        });
    }

    /**
     * Update a report.
     * Citizens can only update their own submitted reports (enforced by ReportPolicy).
     */
    public function updateReport(Report $report, array $data): Report
    {
        return DB::transaction(function () use ($report, $data): Report {
            $report->update(array_filter([
                'category_id'   => $data['category_id'] ?? null,
                'title'         => $data['title'] ?? null,
                'description'   => $data['description'] ?? null,
                'incident_date' => $data['incident_date'] ?? null,
                'location'      => $data['location'] ?? null,
                'priority'      => $data['priority'] ?? null,
            ], fn ($v) => !is_null($v)));

            return $report->fresh(['category']);
        });
    }

    /**
     * Soft-delete a report.
     */
    public function deleteReport(Report $report): void
    {
        $report->delete();
    }
}
