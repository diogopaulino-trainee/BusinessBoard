<?php

namespace App\Http\Controllers;

use App\Models\State;
use Illuminate\Http\Request;

class StateController extends Controller
{
    public function index()
    {
        return response()->json(State::all());
    }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required|string|unique:states'],
        [
            'name.unique' => 'A state with this name already exists.',
            'name.required' => 'State name is required.'
        ]);

        $state = State::create($request->all());

        return response()->json([
            'message' => 'State created successfully.',
            'state' => $state
        ], 201);
    }

    public function update(Request $request, State $state)
    {
        $request->validate(['name' => 'required|string|unique:states,name,' . $state->id]);

        if ($state->name === $request->name) {
            return response()->json([
                'message' => 'No changes were made. The state name remains the same.',
                'state' => $state
            ]);
        }

        $state->update($request->all());

        return response()->json([
            'message' => 'State updated successfully.',
            'state' => $state
        ]);
    }

    public function destroy(State $state)
    {
        // Before deleting, check if there are businesses linked to this state
        if ($state->businesses()->count() > 0) {
            return response()->json([
                'error' => 'You cannot delete a state that has businesses associated with it.'
            ], 400);
        }

        $state->delete();

        return response()->json([
            'message' => 'State deleted successfully.'
        ]);
    }
}
