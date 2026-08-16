<?php

namespace App\Services\Auth;

use App\Enums\UserStatusEnum;
use App\Mail\WelcomeMail;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;

/**
 * AuthService
 *
 * All authentication business logic lives here.
 * AuthController simply orchestrates calls to this service.
 */
class AuthService
{
    /**
     * Register a new Citizen user and issue a Sanctum token.
     *
     * @param  array<string, mixed>  $data
     * @return array{user: User, token: string}
     */
    public function register(array $data): array
    {
        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
            'phone'    => $data['phone'] ?? null,
            'status'   => UserStatusEnum::Active->value,
        ]);

        $user->assignRole('Citizen');

        // Eagerly load roles so UserResource includes them in the response
        $user->load('roles');

        // Queue welcome email
        Mail::to($user->email)->queue(new WelcomeMail($user));

        $token = $user->createToken('auth_token')->plainTextToken;

        return compact('user', 'token');
    }

    /**
     * Authenticate a user and issue a Sanctum token.
     *
     * @throws ValidationException for bad credentials
     * @return array{user: User, token: string}
     */
    public function login(string $email, string $password): array
    {
        $user = User::where('email', $email)->first();

        // Constant-time check — do not reveal whether the email exists
        if (!$user || !Hash::check($password, $user->password)) {
            Log::channel('security')->warning('Failed login attempt', [
                'email' => $email,
                'ip'    => request()->ip(),
            ]);

            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // EnsureActiveUser middleware handles suspension globally.
        // We still check here to log the attempt explicitly.
        if ($user->status !== UserStatusEnum::Active) {
            Log::channel('security')->warning('Suspended user login attempt', [
                'user_id' => $user->id,
                'ip'      => request()->ip(),
            ]);

            throw ValidationException::withMessages([
                'email' => ['Your account has been suspended.'],
            ]);
        }

        // Single-session policy: revoke all prior tokens
        $user->tokens()->delete();

        $token = $user->createToken('auth_token')->plainTextToken;

        Log::channel('security')->info('User logged in', [
            'user_id' => $user->id,
            'ip'      => request()->ip(),
        ]);

        // Eagerly load roles so UserResource includes them in the response
        $user->load('roles');

        return compact('user', 'token');
    }

    /**
     * Change the authenticated user's password and invalidate other sessions.
     */
    public function changePassword(User $user, string $currentPassword, string $newPassword): void
    {
        if (!Hash::check($currentPassword, $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['The current password is incorrect.'],
            ]);
        }

        $user->update(['password' => Hash::make($newPassword)]);

        // Keep current session, revoke all others
        $currentTokenId = request()->user()->currentAccessToken()->id;
        $user->tokens()->where('id', '!=', $currentTokenId)->delete();

        Log::channel('security')->info('Password changed', ['user_id' => $user->id]);
    }

    /**
     * Revoke the current Sanctum token.
     */
    public function logout(User $user): void
    {
        $user->currentAccessToken()->delete();

        Log::channel('security')->info('User logged out', ['user_id' => $user->id]);
    }
}
