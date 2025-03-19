<?php

use App\Http\Controllers\BusinessController;
use App\Http\Controllers\BusinessTypeController;
use App\Http\Controllers\StateController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

/**
 * Grouping all API routes under the 'api' middleware.
 * This ensures all routes within this group follow API standards.
 */
Route::middleware('api')->group(function () {

    /**
     * Business Routes - Handles CRUD operations for businesses.
     */
    Route::get('/businesses', [BusinessController::class, 'index']);
    Route::post('/businesses', [BusinessController::class, 'store']);
    Route::put('/businesses/{business}', [BusinessController::class, 'update']);
    Route::delete('/businesses/{business}', [BusinessController::class, 'destroy']);

    /**
     * State Routes - Manages business states (columns in the board).
     */
    Route::get('/states', [StateController::class, 'index']);
    Route::post('/states', [StateController::class, 'store']);
    Route::put('/states/{state}', [StateController::class, 'update']);
    Route::delete('/states/{state}', [StateController::class, 'destroy']);

    /**
     * Business Type Routes - Fetch available business categories.
     */
    Route::get('/business-types', [BusinessTypeController::class, 'index']);

    /**
     * User Routes - Manage sales representatives (users).
     */
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
});
