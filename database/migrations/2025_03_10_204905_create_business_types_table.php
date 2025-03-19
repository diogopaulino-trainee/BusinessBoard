<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * This method creates the 'business_types' table in the database.
     */
    public function up(): void {
        schema::create('business_types', function (Blueprint $table) {
            $table->id(); // Primary key (auto-incrementing ID)
            $table->string('name')->unique(); // Business type name (must be unique)
            $table->timestamps(); // Adds 'created_at' and 'updated_at' timestamps
        });
    }

    /**
     * Reverse the migrations.
     * This method drops the 'business_types' table if it exists.
     */
    public function down(): void {
        schema::dropIfExists('business_types'); // Deletes the table when rolling back the migration
    }
};
