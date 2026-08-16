<?php

namespace App\Http\Controllers\Role;

use App\Http\Controllers\Controller;
use App\Services\Role\RoleService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Throwable;

class PermissionController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly RoleService $service) {}

    /** GET /api/permissions */
    public function index(): JsonResponse
    {
        try {
            $permissions = $this->service->getAllPermissions();
            return $this->success($permissions->pluck('name'));
        } catch (Throwable $e) {
            return $this->error('Failed to retrieve permissions.', 500);
        }
    }
}
