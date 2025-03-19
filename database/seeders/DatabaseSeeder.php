<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database with initial data.
     */
    public function run(): void
    {
        // Call individual seeders to populate the database
        $this->call([
            UserSeeder::class,          // Seeds the users table
            BusinessTypeSeeder::class, // Seeds the business_types table
            StateSeeder::class,       // Seeds the states table
            BusinessSeeder::class,   // Seeds the businesses table
        ]);
    }
}
