<?php

namespace App\Services\Category;

use App\Models\ReportCategory;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use RuntimeException;

/**
 * CategoryService
 *
 * Encapsulates all business logic for the Report Categories module.
 * Controllers should never interact with the ReportCategory model directly;
 * all reads and writes are routed through this service.
 */
class CategoryService
{
    /**
     * Retrieve all report categories ordered alphabetically.
     *
     * @return Collection<int, ReportCategory>
     */
    public function getAllCategories(): Collection
    {
        return ReportCategory::orderBy('name')->get();
    }

    /**
     * Create a new report category.
     *
     * @param  array<string, mixed>  $data
     */
    public function createCategory(array $data): ReportCategory
    {
        return DB::transaction(function () use ($data): ReportCategory {
            return ReportCategory::create([
                'name'        => $data['name'],
                'description' => $data['description'] ?? null,
            ]);
        });
    }

    /**
     * Update an existing report category.
     *
     * @param  array<string, mixed>  $data
     */
    public function updateCategory(ReportCategory $category, array $data): ReportCategory
    {
        return DB::transaction(function () use ($category, $data): ReportCategory {
            $category->update([
                'name'        => $data['name'],
                'description' => $data['description'] ?? $category->description,
            ]);

            return $category->fresh();
        });
    }

    /**
     * Delete a report category.
     *
     * Business rule: A category that already has reports linked to it cannot
     * be deleted to preserve referential integrity and historical accuracy.
     *
     * @throws RuntimeException if the category has associated reports.
     */
    public function deleteCategory(ReportCategory $category): void
    {
        // Guard: prevent deletion if any reports belong to this category
        if ($category->reports()->exists()) {
            throw new RuntimeException(
                "Cannot delete the \"{$category->name}\" category because it has " .
                "existing reports associated with it. Reassign or archive those " .
                "reports before deleting this category."
            );
        }

        $category->delete();
    }
}
