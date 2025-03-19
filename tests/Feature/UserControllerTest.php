<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

/**
 * UserControllerTest - Tests the UserController endpoints.
 */
class UserControllerTest extends TestCase
{
    /**
     * UserControllerTest - Tests the UserController endpoints.
     */
    public function test_can_create_user()
    {
        Log::info('Starting test: Create User');

        // Fake email sending to avoid sending real emails during tests
        Mail::fake();
        Log::info('Email sending simulation activated');

        // Ensure no duplicate users exist before testing
        User::where('email', 'john@example.com')->delete();
        Log::info('Removed any existing user with email john@example.com');

        // Payload for user creation
        $payload = [
            'name' => 'John Doe',
            'email' => 'john@example.com'
        ];

        Log::info('Sending request to create User', $payload);
        $response = $this->postJson('/api/users', $payload);

        // Log error if request fails
        if ($response->status() !== 201) {
            Log::error('Error creating User', ['response' => $response->json()]);
        }

        // Assert response status
        $response->assertStatus(201);
        Log::info('User successfully created', ['response' => $response->json()]);

        // Verify the user exists in the database
        $this->assertDatabaseHas('users', ['email' => 'john@example.com']);
        Log::info('Verification complete: User is present in the database');
    }

    /**
     * Test that a duplicate user cannot be created.
     * This ensures that the system prevents duplicate user registrations.
     */
    public function test_cannot_create_duplicate_user()
    {
        Log::info('Starting test: Prevent duplicate User creation');

        // Remove existing user to avoid conflicts
        User::where('email', 'john@example.com')->delete();
        Log::info('Removed any previous user with email john@example.com');

        // Create an initial user
        User::factory()->create(['email' => 'john@example.com']);
        Log::info('Original user created', ['email' => 'john@example.com']);

        // Attempt to create a duplicate user
        $payload = [
            'name' => 'John Doe',
            'email' => 'john@example.com'
        ];

        Log::info('Sending request to create duplicate User', $payload);
        $response = $this->postJson('/api/users', $payload);

        // Log error if the system allows duplicate users
        if ($response->status() !== 422) {
            Log::error('The system allowed duplicate User creation', ['response' => $response->json()]);
        }

        // Assert response status
        $response->assertStatus(422);
        Log::info('Duplicate User creation was correctly prevented');
    }
}
