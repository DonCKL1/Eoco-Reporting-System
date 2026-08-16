<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

/**
 * RolePermissionSeeder
 *
 * Creates all application roles and permissions for the EOCO Crime Reporting
 * Portal and assigns the correct permission sets to each role.
 *
 * This seeder is fully idempotent — running it multiple times will not
 * create duplicate roles or permissions.
 */
class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions so fresh data is loaded
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // ──────────────────────────────────────────────────────────────────
        // 1. Define all permissions grouped by domain
        // ──────────────────────────────────────────────────────────────────
        $permissions = [
            // Reports
            'create report',
            'view own reports',
            'view all reports',
            'view assigned reports',   // Officers see only their assigned cases
            'edit reports',
            'assign reports',
            'update report status',
            'close reports',
            'delete reports',

            // Evidence
            'upload evidence',
            'view evidence',
            'delete evidence',

            // Messages
            'send messages',
            'view messages',

            // Notifications
            'view notifications',

            // Analytics
            'view analytics',

            // Categories
            'create categories',
            'edit categories',
            'delete categories',

            // Users
            'view users',
            'create users',
            'edit users',
            'delete users',

            // Roles & Permissions
            'manage roles',
            'manage permissions',

            // Audit
            'view activity logs',
        ];

        // Create permissions using firstOrCreate to ensure idempotency
        foreach ($permissions as $permission) {
            Permission::firstOrCreate(
                ['name' => $permission, 'guard_name' => 'web']
            );
        }

        // ──────────────────────────────────────────────────────────────────
        // 2. Create roles
        // ──────────────────────────────────────────────────────────────────
        $adminRole      = Role::firstOrCreate(['name' => 'Admin',      'guard_name' => 'web']);
        $supervisorRole = Role::firstOrCreate(['name' => 'Supervisor', 'guard_name' => 'web']);
        $officerRole    = Role::firstOrCreate(['name' => 'Officer',    'guard_name' => 'web']);
        $citizenRole    = Role::firstOrCreate(['name' => 'Citizen',    'guard_name' => 'web']);

        // ──────────────────────────────────────────────────────────────────
        // 3. Assign permissions to roles
        // ──────────────────────────────────────────────────────────────────

        // Admin — receives every permission in the system
        $adminRole->syncPermissions(Permission::all());

        // Supervisor — oversight, assignment, and analytics
        $supervisorRole->syncPermissions([
            'view all reports',
            'assign reports',
            'update report status',
            'close reports',
            'view analytics',
            'view activity logs',
            'view evidence',
            'view messages',
        ]);

        // Officer — investigative work on assigned cases
        $officerRole->syncPermissions([
            'view assigned reports',
            'update report status',
            'upload evidence',
            'view evidence',
            'send messages',
            'view messages',
        ]);

        // Citizen — basic report submission and follow-up
        $citizenRole->syncPermissions([
            'create report',
            'view own reports',
            'upload evidence',
            'send messages',
            'view messages',
            'view notifications',
        ]);

        $this->command->info('Roles and permissions seeded successfully.');
    }
}
