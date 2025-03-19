<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * This method creates the 'businesses' table in the database.
     */
    public function up(): void {
        schema::create('businesses', function (Blueprint $table) {
            $table->id(); // Primary key (auto-incrementing ID)
            $table->string('name'); // Business name
            $table->foreignId('business_type_id')->constrained('business_types')->onDelete('cascade'); // Foreign key to 'business_types' table
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // Foreign key to 'users' table (Sales Representative)
            $table->foreignId('state_id')->constrained('states')->onDelete('cascade'); // Foreign key to 'states' table
            $table->decimal('value', 10, 2); // Business monetary value with 2 decimal places
            $table->timestamps(); // Adds 'created_at' and 'updated_at' timestamps
        });
    }

    /**
     * Reverse the migrations.
     * This method drops the 'businesses' table if it exists.
     */
    public function down(): void {
        schema::dropIfExists('businesses'); // Deletes the table when rolling back the migration
    }
};
