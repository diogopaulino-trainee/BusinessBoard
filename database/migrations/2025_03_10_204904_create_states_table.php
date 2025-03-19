<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * This method creates the 'states' table in the database.
     */
    public function up(): void {
        schema::create('states', function (Blueprint $table) {
            $table->id(); // Primary key (auto-incrementing ID)
            $table->string('name'); // Column to store the state name
            $table->timestamps(); // Adds 'created_at' and 'updated_at' timestamps
        });
    }

    /**
     * Reverse the migrations.
     * This method drops the 'states' table if it exists.
     */
    public function down(): void {
        schema::dropIfExists('states'); // Deletes the table when rolling back the migration
    }
};
