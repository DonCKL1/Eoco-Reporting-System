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
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->string('reference_no')->unique();

            // Nullable: anonymous reports have no linked user
            $table->foreignId('user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->foreignId('category_id')
                ->constrained('report_categories')
                ->restrictOnDelete();

            $table->string('title');
            $table->longText('description');
            $table->date('incident_date')->nullable();
            $table->string('location')->nullable()->index();

            $table->boolean('is_anonymous')->default(false)->index();
            $table->integer('risk_score')->default(0);

            $table->enum('priority', ['low', 'medium', 'high', 'critical'])
                ->default('low')
                ->index();

            $table->enum('status', [
                'submitted',
                'under_review',
                'assigned',
                'investigating',
                'awaiting_evidence',
                'resolved',
                'closed',
            ])->default('submitted')->index();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
