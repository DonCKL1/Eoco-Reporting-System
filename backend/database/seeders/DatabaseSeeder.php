<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

/**
 * DatabaseSeeder
 *
 * Root seeder for the EOCO Crime Reporting Portal.
 *
 * Execution order matters:
 *   1. RolePermissionSeeder — roles and permissions must exist before users are assigned roles.
 *   2. ReportCategorySeeder — categories are independent and can run in any order after roles.
 *   3. AdminUserSeeder      — requires the Admin role to already exist.
 */
class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RolePermissionSeeder::class,
            ReportCategorySeeder::class,
            AdminUserSeeder::class,
            OfficerUserSeeder::class,
            WantedPersonSeeder::class,
            SampleCaseSeeder::class,
        ]);
    }
}
