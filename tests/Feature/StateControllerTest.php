<?php

namespace Tests\Feature;

use App\Models\State;
use Illuminate\Support\Facades\Log;
use Tests\TestCase;

/**
 * StateControllerTest - Tests the StateController endpoints.
 */
class StateControllerTest extends TestCase
{
    /**
     * Test creating a new state.
     * This verifies that a state can be created successfully via the API.
     */
    public function test_can_create_state()
    {
        Log::info('Starting test: Create State');

        // Ensure no duplicate states exist before testing
        State::where('name', 'New State')->delete();
        Log::info('Removed any existing states with the same name');

        // Payload for state creation
        $payload = ['name' => 'New State'];

        Log::info('Sending request to create State', $payload);
        $response = $this->postJson('/api/states', $payload);

        // Log error if request fails
        if ($response->status() !== 201) {
            Log::error('Error creating State', ['response' => $response->json()]);
        }

        // Assert response status
        $response->assertStatus(201);
        Log::info('State successfully created', ['response' => $response->json()]);

        // Verify the state exists in the database
        $this->assertDatabaseHas('states', ['name' => 'New State']);
        Log::info('Verification complete: State is present in the database');
    }

    /**
     * Test that a duplicate state cannot be created.
     * This ensures that the system prevents duplicate state names.
     */
    public function test_cannot_create_duplicate_state()
    {
        Log::info('Starting test: Create duplicate State');

        // Create an initial state
        $state = State::factory()->create();
        Log::info('Original State created successfully', ['id' => $state->id, 'name' => $state->name]);

        // Attempt to create a duplicate state
        $payload = ['name' => $state->name];

        Log::info('Sending request to create duplicate State', $payload);
        $response = $this->postJson('/api/states', $payload);

        // Assert response status
        $response->assertStatus(422);
        Log::info('Duplicate State creation was correctly prevented');
    }

    /**
     * Test deleting a state that has no associated businesses.
     * This verifies that a state can be deleted successfully if no businesses are linked to it.
     */
    public function test_can_delete_state_without_businesses()
    {
        Log::info('Starting test: Delete State');

        // Create a state to be deleted
        $state = State::factory()->create();
        Log::info('State created successfully', ['id' => $state->id]);

        // Send request to delete the state
        Log::info('Sending request to delete State', ['state_id' => $state->id]);
        $response = $this->deleteJson("/api/states/{$state->id}");

        // Assert response status
        $response->assertStatus(200);
        Log::info('State successfully deleted');

         // Verify the state is no longer in the database
         $this->assertDatabaseMissing('states', ['id' => $state->id]);
         Log::info('Verification complete: State has been removed from the database');
    }
}
