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
    public function run(): void
    {
        $faker = Faker::create();

        $users = User::all();
        $types = BusinessType::all();
        $states = State::all();

        if ($types->isEmpty() || $states->isEmpty()) {
            $this->command->warn("Warning: No business types or states found. Verify the seeders.");
            return;
        }

        foreach (range(1, 5) as $index) {
            $randomUser = $users->random();

            Business::create([
                'name' => $faker->company,
                'business_type_id' => $types->random()->id,
                'user_id' => $randomUser->id,
                'state_id' => $states->random()->id,
                'value' => $faker->randomFloat(2, 1000, 10000),
            ]);
        }
    }
}
