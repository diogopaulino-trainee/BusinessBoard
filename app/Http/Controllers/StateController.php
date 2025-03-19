<?php

namespace App\Http\Controllers;

use App\Models\State;
use Illuminate\Http\Request;

/**
 * Class StateController
 * 
 * Handles CRUD operations for states.
 */
class StateController extends Controller
{
    /**
     * Retrieves all states.
     * 
     * @return \Illuminate\Http\JsonResponse List of all states.
     */
    public function index()
    {
        // Fetch all states from the database and return them as JSON response.
        return response()->json(State::all());
    }

    /**
     * Creates a new state.
     * 
     * @param  \Illuminate\Http\Request  $request The request containing state data.
     * @return \Illuminate\Http\JsonResponse The created state or validation errors.
     */
    public function store(Request $request)
    {
        // Validate the request to ensure a unique and required state name.
        $request->validate(['name' => 'required|string|unique:states'],
        [
            'name.unique' => 'A state with this name already exists.',
            'name.required' => 'State name is required.'
        ]);

        // Create a new state record.
        $state = State::create($request->all());

        // Return success message with created state data.
        return response()->json([
            'message' => 'State created successfully.',
            'state' => $state
        ], 201);
    }

    /**
     * Updates an existing state.
     * 
     * @param  \Illuminate\Http\Request  $request The request containing updated state data.
     * @param  \App\Models\State  $state The state to be updated.
     * @return \Illuminate\Http\JsonResponse The updated state data.
     */
    public function update(Request $request, State $state)
    {
        // Validate that the new state name is unique except for the current state.
        $request->validate(['name' => 'required|string|unique:states,name,' . $state->id]);

        // Check if the state name remains unchanged.
        if ($state->name === $request->name) {
            return response()->json([
                'message' => 'No changes were made. The state name remains the same.',
                'state' => $state
            ]);
        }

        // Update the state name.
        $state->update($request->all());

        // Return success message with updated state data.
        return response()->json([
            'message' => 'State updated successfully.',
            'state' => $state
        ]);
    }

    /**
     * Deletes a state if no businesses are associated with it.
     * 
     * @param  \App\Models\State  $state The state to be deleted.
     * @return \Illuminate\Http\JsonResponse Success or error message.
     */
    public function destroy(State $state)
    {
        // Prevent deletion if the state has businesses linked to it.
        if ($state->businesses()->count() > 0) {
            return response()->json([
                'error' => 'You cannot delete a state that has businesses associated with it.'
            ], 400);
        }

        // Delete the state.
        $state->delete();

        // Return success message.
        return response()->json([
            'message' => 'State deleted successfully.'
        ]);
    }
}
