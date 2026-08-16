<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class OfficerUserSeeder extends Seeder
{
    public function run(): void
    {
        $password = Hash::make('password123'); // For testing

        $officers = [
            ['name' => 'Kwame Mensah', 'email' => 'kwame.mensah@eoco.gov.gh', 'role' => 'Officer'],
            ['name' => 'Abena Osei', 'email' => 'abena.osei@eoco.gov.gh', 'role' => 'Officer'],
            ['name' => 'Kofi Yeboah', 'email' => 'kofi.yeboah@eoco.gov.gh', 'role' => 'Officer'],
            ['name' => 'Ama Asare', 'email' => 'ama.asare@eoco.gov.gh', 'role' => 'Officer'],
            ['name' => 'Yaw Asante', 'email' => 'yaw.asante@eoco.gov.gh', 'role' => 'Supervisor'],
            ['name' => 'Esi Owusu', 'email' => 'esi.owusu@gmail.com', 'role' => 'Citizen'],
            ['name' => 'Kojo Appiah', 'email' => 'kojo.appiah@gmail.com', 'role' => 'Citizen'],
        ];

        foreach ($officers as $data) {
            $user = User::firstOrCreate(
                ['email' => $data['email']],
                [
                    'name' => $data['name'],
                    'password' => $password,
                    'phone' => '024' . rand(1000000, 9999999),
                    'status' => 'active',
                    'email_verified_at' => now(),
                ]
            );

            // Assign proper role using syncRoles
            $role = Role::firstOrCreate(['name' => $data['role'], 'guard_name' => 'web']);
            $user->syncRoles([$role]);
        }
    }
}
