<?php

namespace Database\Seeders;

use App\Models\Business;
use App\Models\BusinessType;
use App\Models\State;
use App\Models\User;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class BusinessSeeder extends Seeder
{
    /**
     * Seed the 'businesses' table with random data.
     */ 
    public function run(): void
    {
        $faker = Faker::create();

        // Retrieve all existing users, business types, and states
        $users = User::all();
        $types = BusinessType::all();
        $states = State::all();

        // Check if business types and states exist before seeding
        if ($types->isEmpty() || $states->isEmpty()) {
            $this->command->warn("Warning: No business types or states found. Verify the seeders.");
            return;
        }

        // Generate 50 random businesses
        foreach (range(1, 50) as $index) {
            $randomUser = $users->random(); // Select a random user

            Business::create([
                'name' => $faker->company, // Generate a fake company name
                'business_type_id' => $types->random()->id, // Assign a random business type
                'user_id' => $randomUser->id, // Assign a random user
                'state_id' => $states->random()->id, // Assign a random state
                'value' => $faker->randomFloat(2, 1000, 10000), // Generate a random business value
            ]);
        }
    }
}
