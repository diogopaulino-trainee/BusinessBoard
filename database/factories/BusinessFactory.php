<?php

namespace Database\Factories;

use App\Models\Business;
use App\Models\BusinessType;
use App\Models\State;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * Factory class for generating test data for the Business model.
 */
class BusinessFactory extends Factory
{
    /**
     * The associated model for this factory.
     *
     * @var string
     */
    protected $model = Business::class;

    /**
     * Define the default state for the Business model.
     *
     * @return array<string, mixed> The generated attributes for a business.
     */
    public function definition()
    {
        return [
            'name' => $this->faker->company,    // Generates a random company name
            'business_type_id' => BusinessType::factory(),  // Creates a related business type
            'user_id' => User::factory(),   // Creates an associated user
            'state_id' => State::factory(),    // Assigns the business to a random state
            'value' => $this->faker->randomFloat(2, 1000, 10000),   // Generates a random value between 1000 and 10000
        ];
    }
}
