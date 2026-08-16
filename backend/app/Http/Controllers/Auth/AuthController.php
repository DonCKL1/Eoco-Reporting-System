<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ChangePasswordRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Services\Auth\AuthService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Throwable;

/**
 * AuthController
 *
 * Thin orchestrator — all business logic lives in AuthService.
 * Uses ApiResponse trait for standardised JSON envelopes.
 */
class AuthController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly AuthService $authService) {}

    /** POST /api/register */
    public function register(RegisterRequest $request): JsonResponse
    {
        try {
            $result = $this->authService->register($request->validated());

            return $this->created([
                'user'  => new UserResource($result['user']),
                'roles' => $result['user']->getRoleNames(),
                'token' => $result['token'],
            ], 'Registration successful. Welcome to EOCO.');
        } catch (Throwable $e) {
            return $this->error('Registration failed. Please try again.', 500);
        }
    }

    /** POST /api/login */
    public function login(LoginRequest $request): JsonResponse
    {
        try {
            $result = $this->authService->login(
                $request->email,
                $request->password
            );

            return $this->success([
                'user'  => new UserResource($result['user']),
                'roles' => $result['user']->getRoleNames(),
                'token' => $result['token'],
            ], 'Login successful.');
        } catch (ValidationException $e) {
            return $this->error($e->getMessage(), 422, $e->errors());
        } catch (Throwable $e) {
            return $this->error($e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine(), 500);
        }
    }

    /** GET /api/me */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user()->loadMissing('roles');

        return $this->success([
            'user'  => new UserResource($user),
            'roles' => $user->getRoleNames(),
        ]);
    }

    /** PUT /api/me */
    public function updateProfile(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $request->user()->id],
        ]);

        $request->user()->update($validated);

        return $this->success([
            'user'  => new UserResource($request->user()->fresh()),
            'roles' => $request->user()->getRoleNames(),
        ], 'Profile updated successfully.');
    }

    /** POST /api/logout */
    public function logout(Request $request): JsonResponse
    {
        $this->authService->logout($request->user());
        return $this->success(null, 'Logged out successfully.');
    }

    /** PUT /api/change-password */
    public function changePassword(ChangePasswordRequest $request): JsonResponse
    {
        try {
            $this->authService->changePassword(
                $request->user(),
                $request->current_password,
                $request->password
            );

            return $this->success(null, 'Password changed successfully.');
        } catch (ValidationException $e) {
            return $this->error($e->getMessage(), 422, $e->errors());
        } catch (Throwable $e) {
            return $this->error('Password change failed.', 500);
        }
    }
}
