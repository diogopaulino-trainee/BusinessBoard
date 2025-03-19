<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * This will populate the 'users' table with an admin user and additional test users.
     */
    public function run()
    {
        // Creating a default user with known credentials
        User::create([
            'name' => 'John Doe',
            'email' => 'johndoe@example.com',
            'password' => Hash::make('password'),
        ]);

        // Generating additional random users using the factory
        User::factory(5)->create();
    }
}
