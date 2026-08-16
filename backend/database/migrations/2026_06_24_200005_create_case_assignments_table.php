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
        Schema::create('case_assignments', function (Blueprint $table) {
            $table->id();

            $table->foreignId('report_id')
                ->constrained('reports')
                ->cascadeOnDelete();

            $table->index('report_id');

            // Officer who is assigned to the case
            $table->foreignId('officer_id')
                ->constrained('users')
                ->restrictOnDelete();

            // Admin/supervisor who made the assignment
            $table->foreignId('assigned_by')
                ->constrained('users')
                ->restrictOnDelete();

            $table->timestamp('assigned_at')->useCurrent();

            $table->timestamps();

            // A report should not be assigned to the same officer more than once
            $table->unique(['report_id', 'officer_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('case_assignments');
    }
};
