<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\User\UserService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;
use Throwable;

class UserController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly UserService $service) {}

    /** GET /api/users */
    public function index(): JsonResponse
    {
        Gate::authorize('viewAny', User::class);

        try {
            $users = $this->service->getPaginated();
            return $this->paginated(UserResource::collection($users));
        } catch (Throwable $e) {
            return $this->error('Failed to load users.', 500);
        }
    }

    /** POST /api/users */
    public function store(StoreUserRequest $request): JsonResponse
    {
        Gate::authorize('create', User::class);

        try {
            $user = $this->service->createUser($request->validated());
            return $this->created(new UserResource($user), 'User created successfully.');
        } catch (Throwable $e) {
            return $this->error($e->getMessage(), 500);
        }
    }

    /** PUT /api/users/{user} */
    public function update(UpdateUserRequest $request, User $user): JsonResponse
    {
        Gate::authorize('update', $user);

        try {
            $updated = $this->service->updateUser($user, $request->validated());
            return $this->success(new UserResource($updated), 'User updated successfully.');
        } catch (Throwable $e) {
            return $this->error($e->getMessage(), 500);
        }
    }

    /** DELETE /api/users/{user} */
    public function destroy(User $user): JsonResponse
    {
        Gate::authorize('delete', $user);

        try {
            $this->service->deleteUser($user);
            return $this->success(null, 'User deleted successfully.');
        } catch (\RuntimeException $e) {
            return $this->error($e->getMessage(), 422);
        } catch (Throwable $e) {
            return $this->error('Failed to delete user.', 500);
        }
    }
}
