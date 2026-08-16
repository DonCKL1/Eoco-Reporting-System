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
        Schema::create('case_status_histories', function (Blueprint $table) {
            $table->id();

            $table->foreignId('report_id')
                ->constrained('reports')
                ->cascadeOnDelete();

            $table->index('report_id');

            // Immutable audit — do not cascade-delete if user deleted
            $table->foreignId('changed_by')
                ->constrained('users')
                ->restrictOnDelete();

            $table->string('old_status');
            $table->string('new_status');

            $table->timestamp('changed_at')->useCurrent();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('case_status_histories');
    }
};
