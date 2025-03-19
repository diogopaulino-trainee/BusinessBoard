<?php

namespace App\Http\Controllers;

use App\Models\Business;
use App\Models\BusinessType;
use App\Models\State;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

/**
 * Class BusinessController
 * 
 * Handles CRUD operations for businesses.
 */
class BusinessController extends Controller
{
    /**
     * Retrieves all businesses with related business type, user, and state.
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        // Fetch all businesses including related businessType, user, and state
        $businesses = Business::with(['businessType', 'user', 'state'])->get();
        
        // Return businesses as JSON response
        return response()->json($businesses);
    }

    /**
     * Stores a new business in the database.
     * 
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        // Validate incoming request data to ensure required fields are provided
        $request->validate([
            'name' => 'required|string|max:255',    // Business name is required (max 255 characters)
            'business_type_id' => 'required|exists:business_types,id',  // Must be a valid business type ID
            'user_id' => 'required|exists:users,id',    // Must be a valid user ID (sales representative)
            'state_id' => 'required|exists:states,id',  // Must be a valid state ID (column in the board)
            'value' => 'required|numeric|min:0',    // Business value must be a non-negative number
        ]);

        // Create a new business record using the validated data
        $business = Business::create($request->all());

        // Load the user relationship to return full details
        $business->load('user');

        // Return the created business with status code 201 (Created)
        return response()->json($business, 201);
    }

    /**
     * Updates an existing business with new details.
     * 
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Business $business
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Business $business)
    {
        // Validate incoming request data for updates
        $validated = $request->validate([
            'state_id' => 'required|exists:states,id',  // Ensure state ID exists
            'name' => 'nullable|string|max:255',    // Name can be updated, but not required
            'business_type_id' => 'nullable|exists:business_types,id',  // Business type can be updated
            'user_id' => 'nullable|exists:users,id',    // Sales representative can be updated
            'value' => 'nullable|numeric|min:0',    // Business value must be numeric and non-negative
        ]);

        // Update the business details with validated data
        $business->update($validated);

        // Return the updated business including related models
        return response()->json($business->load('businessType', 'user', 'state'));
    }

    /**
     * Deletes a business from the database.
     * 
     * @param \App\Models\Business $business
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Business $business)
    {
        // Delete the specified business from the database
        $business->delete();

        // Return a success message confirming deletion
        return response()->json(['message' => 'Negócio removido com sucesso']);
    }
}

