<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * Class RouteServiceProvider
     * 
     * Registers and manages the application's route definitions.
     */
    public function boot()
    {
        /**
         * Define the route groups for the application.
         * 
         * This method assigns middleware and groups API and web routes separately.
         */
        $this->routes(function () {
            // Define API routes with 'api' middleware and prefix
            Route::middleware('api')
                ->prefix('api')
                ->group(base_path('routes/api.php'));

            // Define Web routes with 'web' middleware (default)
            Route::middleware('web')
                ->group(base_path('routes/web.php'));
        });
    }
}
