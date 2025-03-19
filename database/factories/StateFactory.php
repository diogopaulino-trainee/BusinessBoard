<?php

namespace Database\Factories;

use App\Models\State;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * Factory class for generating test data for the State model.
 */
class StateFactory extends Factory
{
    /**
     * The associated model for this factory.
     *
     * @var string
     */
    protected $model = State::class;

    /**
     * Define the default state for the State model.
     *
     * @return array<string, mixed> The generated attributes for a state.
     */
    public function definition()
    {
        return [
            'name' => $this->faker->state,  // Generates a random state name
        ];
    }
}
