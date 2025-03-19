<?php

namespace Database\Seeders;

use App\Models\State;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * This will populate the 'states' table with predefined states.
     */
    public function run(): void
    {
        // List of predefined business states
        $states = [
            'New',
            'In Negotiation',
            'Under Review',
            'Pending Approval',
            'Approved',
            'On Hold',
            'In Revision',
            'Rejected',
            'Canceled',
            'Closed'
        ];

        // Insert each state into the 'states' table
        foreach ($states as $state) {
            State::create(['name' => $state]);
        }
    }
}
