<?php

namespace App\Http\Controllers;

use App\Models\BusinessType;
use Illuminate\Http\Request;

/**
 * Class BusinessTypeController
 * 
 * Handles operations related to business types.
 */
class BusinessTypeController extends Controller
{
    /**
     * Retrieves all business types.
     * 
     * @return \Illuminate\Http\JsonResponse A list of all available business types.
     */
    public function index()
    {
        // Fetch all business types from the database and return them as JSON response.
        return response()->json(BusinessType::all());
    }
}
