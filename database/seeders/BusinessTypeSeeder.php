<?php

namespace Database\Seeders;

use App\Models\BusinessType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BusinessTypeSeeder extends Seeder
{
    public function run(): void
    {
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

        foreach ($businessTypes as $type) {
            BusinessType::create(['name' => $type]);
        }
    }
}
