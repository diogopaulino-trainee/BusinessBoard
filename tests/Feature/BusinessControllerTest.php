<?php

namespace Tests\Feature;

use App\Models\Business;
use App\Models\BusinessType;
use App\Models\State;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Tests\TestCase;


/**
 * BusinessControllerTest - Tests the BusinessController endpoints.
 */
class BusinessControllerTest extends TestCase
{
    /**
     * Test creating a business.
     * This verifies that a business can be created successfully via the API.
     */
    public function test_can_create_business()
    {
        Log::info('Starting test: Create Business');

        // Creating related entities
        $businessType = BusinessType::factory()->create();
        Log::info('BusinessType created successfully', ['id' => $businessType->id]);

        $user = User::factory()->create();
        Log::info('User created successfully', ['id' => $user->id]);

        $state = State::factory()->create();
        Log::info('State created successfully', ['id' => $state->id]);

        // Business creation payload
        $payload = [
            'name' => 'Test Business',
            'business_type_id' => $businessType->id,
            'user_id' => $user->id,
            'state_id' => $state->id,
            'value' => 1000
        ];

        Log::info('Sending request to create Business', $payload);
        $response = $this->postJson('/api/businesses', $payload);

        // Uncomment to debug response
        // dd($response->json());

        // Asserting the response status
        $response->assertStatus(201);
        Log::info('Business successfully created', ['response' => $response->json()]);

        // Verifying the business exists in the database
        $this->assertDatabaseHas('businesses', ['name' => 'Test Business']);
        Log::info('Business is present in the database');
    }

    /**
     * Test updating a business.
     * This verifies that a business can be updated successfully via the API.
     */
    public function test_can_update_business()
    {
        Log::info('Starting test: Update Business');

        // Creating a business to update
        $business = Business::factory()->create();
        Log::info('Original Business created successfully', ['id' => $business->id]);

        // Creating a new state to update the business with
        $newState = State::factory()->create();
        Log::info('New State created successfully', ['id' => $newState->id]);

        // Update payload
        $payload = ['state_id' => $newState->id];

        Log::info('Sending request to update Business', ['business_id' => $business->id, 'payload' => $payload]);
        $response = $this->putJson("/api/businesses/{$business->id}", $payload);

        // Asserting the response status
        $response->assertStatus(200);
        Log::info('Business successfully updated', ['response' => $response->json()]);

        // Verifying the update in the database
        $this->assertDatabaseHas('businesses', ['id' => $business->id, 'state_id' => $newState->id]);
        Log::info('Update successfully reflected in the database');
    }

    /**
     * Test deleting a business.
     * This verifies that a business can be deleted successfully via the API.
     */
    public function test_can_delete_business()
    {
        Log::info('Starting test: Delete Business');

        // Creating a business to delete
        $business = Business::factory()->create();
        Log::info('Business created successfully', ['id' => $business->id]);

        Log::info('Sending request to delete Business', ['business_id' => $business->id]);
        $response = $this->deleteJson("/api/businesses/{$business->id}");

        // Asserting the response status
        $response->assertStatus(200);
        Log::info('Business successfully deleted');

        // Verifying the business is no longer in the database
        $this->assertDatabaseMissing('businesses', ['id' => $business->id]);
        Log::info('Business has been removed from the database');
    }
}
