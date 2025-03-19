<?php

namespace Database\Seeders;

use App\Models\BusinessType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BusinessTypeSeeder extends Seeder
{
    /**
     * Seed the 'business_types' table with predefined categories.
     */
    public function run(): void
    {
        // List of predefined business types
        $businessTypes = [
            'Technology',
            'Retail',
            'Finance',
            'Healthcare',
            'Education',
            'Marketing',
            'Automotive',
            'Hospitality',
            'Manufacturing',
            'Real Estate'
        ];

        // Insert each business type into the database
        foreach ($businessTypes as $type) {
            BusinessType::create(['name' => $type]);
        }
    }
}
