<?php

namespace App\Services\Search;

use App\Models\Report;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;

class SearchService
{
    public function searchReports(User $user, array $filters): LengthAwarePaginator
    {
        $query = Report::with(['category', 'user'])
            ->when(!$user->hasAnyRole(['Admin', 'Supervisor']), function ($q) use ($user) {
                if ($user->hasRole('Officer')) {
                    $q->whereHas('caseAssignments', fn ($sq) => $sq->where('officer_id', $user->id));
                } else {
                    $q->where('user_id', $user->id);
                }
            })
            ->when(!empty($filters['q']), fn ($q) =>
                $q->where(fn ($sq) => $sq
                    ->where('title', 'like', "%{$filters['q']}%")
                    ->orWhere('description', 'like', "%{$filters['q']}%")
                )
            )
            ->when(!empty($filters['reference_no']), fn ($q) =>
                $q->where('reference_no', 'like', "%{$filters['reference_no']}%")
            )
            ->when(!empty($filters['category_id']), fn ($q) =>
                $q->where('category_id', $filters['category_id'])
            )
            ->when(!empty($filters['status']), fn ($q) =>
                $q->where('status', $filters['status'])
            )
            ->when(!empty($filters['priority']), fn ($q) =>
                $q->where('priority', $filters['priority'])
            )
            ->when(!empty($filters['date_from']), fn ($q) =>
                $q->whereDate('created_at', '>=', $filters['date_from'])
            )
            ->when(!empty($filters['date_to']), fn ($q) =>
                $q->whereDate('created_at', '<=', $filters['date_to'])
            );

        return $query->latest()->paginate($filters['per_page'] ?? 15);
    }
}
