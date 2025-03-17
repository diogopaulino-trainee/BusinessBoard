<?php

namespace Database\Factories;

use App\Models\BusinessType;
use Illuminate\Database\Eloquent\Factories\Factory;

class BusinessTypeFactory extends Factory
{
    protected $model = BusinessType::class;

    public function definition()
    {
        return [
            'name' => $this->faker->word,
        ];
    }
}
