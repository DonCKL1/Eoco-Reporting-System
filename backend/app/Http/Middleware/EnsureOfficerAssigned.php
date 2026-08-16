<?php

namespace App\Http\Middleware;

use App\Models\Report;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * EnsureOfficerAssigned
 *
 * Verifies that the authenticated officer is assigned to the {report}
 * before allowing them to access note, status, or evidence endpoints.
 *
 * Usage in routes: ->middleware('officer.assigned')
 */
class EnsureOfficerAssigned
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // Only enforce for Officers — admin/supervisor bypass
        if (!$user || !$user->hasRole('Officer')) {
            return $next($request);
        }

        /** @var Report|null $report */
        $report = $request->route('report');

        if (!$report instanceof Report) {
            return $next($request);
        }

        $isAssigned = $report->caseAssignments()
            ->where('officer_id', $user->id)
            ->exists();

        if (!$isAssigned) {
            return response()->json([
                'success' => false,
                'message' => 'You are not assigned to this case.',
            ], 403);
        }

        return $next($request);
    }
}
