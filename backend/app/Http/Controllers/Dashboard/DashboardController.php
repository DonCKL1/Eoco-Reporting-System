<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Report;
use App\Models\CaseAssignment;
use App\Services\Analytics\AnalyticsService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Throwable;

class DashboardController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly AnalyticsService $service) {}

    /** GET /api/dashboard */
    public function index(): JsonResponse
    {
        try {
            $user = auth()->user();

            if ($user->hasRole('admin') || $user->hasRole('supervisor')) {
                return $this->success(
                    $this->service->getDashboardSummary(),
                    'Dashboard summary retrieved.'
                );
            }

            if ($user->hasRole('officer')) {
                // Officer specific stats
                $assignedCount = CaseAssignment::where('officer_id', $user->id)->count();
                $resolvedCount = Report::whereHas('assignments', function($q) use ($user) {
                    $q->where('officer_id', $user->id);
                })->where('status', 'resolved')->count();
                
                $statusSummary = DB::table('reports')
                    ->join('case_assignments', 'reports.id', '=', 'case_assignments.report_id')
                    ->where('case_assignments.officer_id', $user->id)
                    ->select('reports.status', DB::raw('count(*) as total'))
                    ->whereNull('reports.deleted_at')
                    ->groupBy('reports.status')
                    ->get()
                    ->toArray();

                return $this->success([
                    'total_assigned' => $assignedCount,
                    'resolved_cases' => $resolvedCount,
                    'status_summary' => $statusSummary,
                ], 'Officer dashboard summary retrieved.');
            }

            // Citizen specific stats
            $totalReports = Report::where('user_id', $user->id)->count();
            $statusSummary = DB::table('reports')
                ->where('user_id', $user->id)
                ->select('status', DB::raw('count(*) as total'))
                ->whereNull('deleted_at')
                ->groupBy('status')
                ->get()
                ->toArray();

            return $this->success([
                'total_reports' => $totalReports,
                'status_summary' => $statusSummary,
            ], 'Citizen dashboard summary retrieved.');

        } catch (Throwable $e) {
            return $this->error('Dashboard data retrieval failed: ' . $e->getMessage(), 500);
        }
    }
}
