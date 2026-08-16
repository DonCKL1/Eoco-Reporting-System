<?php

namespace App\Services\User;

use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Hash;
use RuntimeException;

class UserService
{
    public function getPaginated(): LengthAwarePaginator
    {
        return User::with('roles')->latest()->paginate(20);
    }

    public function createUser(array $data): User
    {
        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
            'phone'    => $data['phone'] ?? null,
            'status'   => 'active',
        ]);

        $user->assignRole($data['role']);
        return $user->load('roles');
    }

    public function updateUser(User $user, array $data): User
    {
        $user->update(array_filter([
            'name'   => $data['name'] ?? null,
            'email'  => $data['email'] ?? null,
            'phone'  => $data['phone'] ?? null,
            'status' => $data['status'] ?? null,
            'password' => isset($data['password']) ? Hash::make($data['password']) : null,
        ], fn ($v) => !is_null($v)));

        if (!empty($data['role'])) {
            $user->syncRoles([$data['role']]);
        }

        return $user->fresh(['roles']);
    }

    public function deleteUser(User $user): void
    {
        // Prevent deleting the only admin
        if ($user->hasRole('Admin') && User::role('Admin')->count() <= 1) {
            throw new RuntimeException('Cannot delete the only administrator account.', 422);
        }
        $user->delete();
    }
}
