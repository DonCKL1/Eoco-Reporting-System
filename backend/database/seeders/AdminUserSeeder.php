<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/**
 * AdminUserSeeder
 *
 * Creates the initial System Administrator account for the EOCO Crime
 * Reporting Portal and assigns the Admin role.
 *
 * This seeder is idempotent — if the admin account already exists it will
 * be updated in place; no duplicate user will be created.
 *
 * ⚠️  Change the default password immediately after first login in production.
 */
class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // updateOrCreate ensures we never insert a duplicate admin account
        $admin = User::updateOrCreate(
            [
                'email' => 'admin@eoco.gov.gh',
            ],
            [
                'name' => 'System Administrator',
                'password' => Hash::make(env('ADMIN_PASSWORD', 'Admin@123')),
                'phone' => null,
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );

        // Assign the Admin role (Spatie syncRoles is idempotent)
        $admin->syncRoles(['Admin']);

        $this->command->info('Admin user seeded: admin@eoco.gov.gh');
        $this->command->warn('Remember to change the default password in production!');
    }
}
