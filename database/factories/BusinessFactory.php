<?php

namespace Database\Factories;

use App\Models\Business;
use App\Models\BusinessType;
use App\Models\State;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class BusinessFactory extends Factory
{
    protected $model = Business::class;

    public function definition()
    {
        return [
            'name' => $this->faker->company,
            'business_type_id' => BusinessType::factory(),
            'user_id' => User::factory(),
            'state_id' => State::factory(),
            'value' => $this->faker->randomFloat(2, 1000, 10000),
        ];
    }
}
