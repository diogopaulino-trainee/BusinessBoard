<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes     <!-- Generates JavaScript routes for Laravel -->
        @viteReactRefresh       <!-- Enables React Fast Refresh for hot reloading -->
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])      <!-- Loads the main React scripts -->
        @inertiaHead    <!-- Adds Inertia.js metadata to the head -->
    </head>
    <body class="font-sans antialiased">
        @inertia    <!-- Inertia.js root component for handling frontend navigation -->
    </body>
</html>
