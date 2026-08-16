<?php

namespace App\Http\Middleware;

use App\Models\Report;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * EnsureReportOwner
 *
 * For Citizen-role requests, ensures the report in the route belongs to them.
 * Admin/Supervisor/Officer bypass this check.
 *
 * Usage: ->middleware('report.owner')
 */
class EnsureReportOwner
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user || !$user->hasRole('Citizen')) {
            return $next($request);
        }

        /** @var Report|null $report */
        $report = $request->route('report');

        if ($report instanceof Report && $report->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'You do not have access to this report.',
            ], 403);
        }

        return $next($request);
    }
}
