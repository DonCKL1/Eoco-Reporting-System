<?php

namespace App\Services\Analytics;

use App\Models\Report;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class AnalyticsService
{
    public function getStats(): array
    {
        return [
            'total_reports'     => Report::count(),
            'submitted'         => Report::where('status', 'submitted')->count(),
            'under_review'      => Report::where('status', 'under_review')->count(),
            'investigating'     => Report::where('status', 'investigating')->count(),
            'resolved'          => Report::where('status', 'resolved')->count(),
            'closed'            => Report::where('status', 'closed')->count(),
            'critical_reports'  => Report::where('priority', 'critical')->count(),
            'total_citizens'    => User::role('Citizen')->count(),
            'total_officers'    => User::role('Officer')->count(),
        ];
    }

    public function reportsByCategory(): array
    {
        return DB::table('reports')
            ->join('report_categories', 'reports.category_id', '=', 'report_categories.id')
            ->select('report_categories.name as category', DB::raw('count(*) as total'))
            ->whereNull('reports.deleted_at')
            ->groupBy('report_categories.name')
            ->orderByDesc('total')
            ->get()
            ->toArray();
    }

    public function statusSummary(): array
    {
        return DB::table('reports')
            ->select('status', DB::raw('count(*) as total'))
            ->whereNull('deleted_at')
            ->groupBy('status')
            ->get()
            ->toArray();
    }

    public function reportsByMonth(): array
    {
        return DB::table('reports')
            ->select(DB::raw("DATE_FORMAT(created_at, '%Y-%m') as month"), DB::raw('count(*) as total'))
            ->whereNull('deleted_at')
            ->whereYear('created_at', now()->year)
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->toArray();
    }

    public function officerWorkload(): array
    {
        return DB::table('case_assignments')
            ->join('users', 'case_assignments.officer_id', '=', 'users.id')
            ->select('users.name as officer', DB::raw('count(*) as assigned_cases'))
            ->groupBy('users.name')
            ->orderByDesc('assigned_cases')
            ->get()
            ->toArray();
    }

    public function getDashboardSummary(): array
    {
        return array_merge($this->getStats(), [
            'reports_by_category' => $this->reportsByCategory(),
            'reports_by_month'    => $this->reportsByMonth(),
            'officer_workload'    => $this->officerWorkload(),
        ]);
    }
}
