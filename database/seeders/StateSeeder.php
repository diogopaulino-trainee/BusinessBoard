<?php

namespace Database\Seeders;

use App\Models\State;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StateSeeder extends Seeder
{
    public function run(): void
    {
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

        foreach ($states as $state) {
            State::create(['name' => $state]);
        }
    }
}
