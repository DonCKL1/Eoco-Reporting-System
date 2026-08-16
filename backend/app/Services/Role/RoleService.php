<?php

namespace App\Services\Role;

use Illuminate\Database\Eloquent\Collection;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleService
{
    public function getRoles(): Collection
    {
        return Role::with('permissions')->get();
    }

    public function createRole(array $data): Role
    {
        $role = Role::create(['name' => $data['name'], 'guard_name' => 'web']);

        if (!empty($data['permissions'])) {
            $role->syncPermissions($data['permissions']);
        }

        return $role->load('permissions');
    }

    public function getAllPermissions(): Collection
    {
        return Permission::orderBy('name')->get();
    }
}
