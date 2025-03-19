<?php

namespace App\Http\Controllers;

use App\Mail\WelcomeMail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

/**
 * Class UserController
 * 
 * Handles user-related operations such as retrieving and creating users.
 */
class UserController extends Controller
{
    /**
     * Retrieves all users.
     * 
     * @return \Illuminate\Http\JsonResponse List of all registered users.
     */
    public function index()
    {
        // Fetch all users from the database and return as a JSON response.
        $users = User::all();
        return response()->json($users);
    }

    /**
     * Creates a new user.
     * 
     * @param  \Illuminate\Http\Request  $request The request containing user data.
     * @return \Illuminate\Http\JsonResponse The created user or validation errors.
     */
    public function store(Request $request)
    {
        // Validate the request data to ensure name and unique email are provided.
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
        ]);

        // Create a new user with a default password.
        $user = User::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'password' => bcrypt('password'),
        ]);

        // Send a welcome email to the newly created user.
        Mail::to($user->email)->send(new WelcomeMail($user));

        // Return success response with the created user data.
        return response()->json($user, 201);
    }
}
