<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/**
 * Web Routes - Handles frontend navigation using Inertia.js.
 * These routes return Inertia-rendered React components.
 */

/**
 * Home Route - Loads the 'Welcome' page.
 * This serves as the landing page of the application.
 */
Route::get('/', function () {
    return Inertia::render('Welcome');
});

/**
 * Business Board Route - Loads the main Business Board interface.
 * This is where users can manage businesses using the drag-and-drop board.
 */
Route::get('/business-board', function () {
    return Inertia::render('BusinessBoard');
});
