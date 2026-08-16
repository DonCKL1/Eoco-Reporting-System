<?php

namespace App\Http\Controllers\Role;

use App\Http\Controllers\Controller;
use App\Http\Requests\Role\StoreRoleRequest;
use App\Http\Resources\RoleResource;
use App\Services\Role\RoleService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;
use Throwable;

class RoleController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly RoleService $service) {}

    /** GET /api/roles */
    public function index(): JsonResponse
    {
        Gate::authorize('manage roles', \Spatie\Permission\Models\Role::class);

        try {
            $roles = $this->service->getRoles();
            return $this->success(RoleResource::collection($roles));
        } catch (Throwable $e) {
            return $this->error('Failed to load roles.', 500);
        }
    }

    /** POST /api/roles */
    public function store(StoreRoleRequest $request): JsonResponse
    {
        Gate::authorize('manage roles', \Spatie\Permission\Models\Role::class);

        try {
            $role = $this->service->createRole($request->validated());
            return $this->created(new RoleResource($role), 'Role created successfully.');
        } catch (Throwable $e) {
            return $this->error($e->getMessage(), 500);
        }
    }
}
