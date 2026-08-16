<?php

namespace App\Http\Controllers\Category;

use App\Http\Controllers\Controller;
use App\Http\Requests\Category\StoreCategoryRequest;
use App\Http\Requests\Category\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\ReportCategory;
use App\Services\Category\CategoryService;
use Illuminate\Http\JsonResponse;
use Throwable;

/**
 * CategoryController
 *
 * Thin controller for the Report Categories module.
 * All business logic is delegated to CategoryService.
 * Authorisation is enforced at the route level via Spatie permission middleware.
 */
class CategoryController extends Controller
{
    public function __construct(
        private readonly CategoryService $categoryService
    ) {}

    // ─── Public ──────────────────────────────────────────────────────────────

    /**
     * GET /api/categories
     *
     * Return all categories — publicly accessible, no authentication required.
     */
    public function index(): JsonResponse
    {
        try {
            $categories = $this->categoryService->getAllCategories();

            return response()->json([
                'success' => true,
                'data'    => CategoryResource::collection($categories),
            ]);
        } catch (Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve categories.',
            ], 500);
        }
    }

    // ─── Admin ────────────────────────────────────────────────────────────────

    /**
     * POST /api/categories
     *
     * Create a new report category.
     * Requires: auth:sanctum + 'create categories' permission.
     */
    public function store(StoreCategoryRequest $request): JsonResponse
    {
        try {
            $category = $this->categoryService->createCategory($request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Category created successfully.',
                'data'    => new CategoryResource($category),
            ], 201);
        } catch (Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create category.',
            ], 500);
        }
    }

    /**
     * PUT /api/categories/{category}
     *
     * Update an existing report category.
     * Requires: auth:sanctum + 'edit categories' permission.
     */
    public function update(UpdateCategoryRequest $request, ReportCategory $category): JsonResponse
    {
        try {
            $updated = $this->categoryService->updateCategory($category, $request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Category updated successfully.',
                'data'    => new CategoryResource($updated),
            ]);
        } catch (Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update category.',
            ], 500);
        }
    }

    /**
     * DELETE /api/categories/{category}
     *
     * Delete a report category.
     * Blocked if the category has associated reports.
     * Requires: auth:sanctum + 'delete categories' permission.
     */
    public function destroy(ReportCategory $category): JsonResponse
    {
        try {
            $this->categoryService->deleteCategory($category);

            return response()->json([
                'success' => true,
                'message' => "Category \"{$category->name}\" deleted successfully.",
            ]);
        } catch (\RuntimeException $e) {
            // Business rule violation — category has linked reports
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        } catch (Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete category.',
            ], 500);
        }
    }
}
