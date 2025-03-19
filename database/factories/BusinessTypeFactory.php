<?php

namespace Database\Factories;

use App\Models\BusinessType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * Factory class for generating test data for the BusinessType model.
 */
class BusinessTypeFactory extends Factory
{
    /**
     * The associated model for this factory.
     *
     * @var string
     */
    protected $model = BusinessType::class;

    /**
     * Define the default state for the BusinessType model.
     *
     * @return array<string, mixed> The generated attributes for a business type.
     */
    public function definition()
    {
        return [
            'name' => $this->faker->word,   // Generates a random word as the business type name
        ];
    }
}
