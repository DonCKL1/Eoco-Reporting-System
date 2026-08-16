<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('anonymous_tokens', function (Blueprint $table) {
            $table->id();

            // Unique because each report can have at most one anonymous token
            $table->foreignId('report_id')
                ->unique()
                ->constrained('reports')
                ->cascadeOnDelete();

            $table->string('token', 128)->unique();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('anonymous_tokens');
    }
};
