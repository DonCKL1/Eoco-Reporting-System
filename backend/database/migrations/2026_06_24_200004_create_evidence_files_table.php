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
        Schema::create('evidence_files', function (Blueprint $table) {
            $table->id();

            $table->foreignId('report_id')
                ->constrained('reports')
                ->cascadeOnDelete();

            $table->index('report_id');

            $table->string('filename');
            $table->string('original_name');
            $table->string('file_type', 100);
            $table->unsignedBigInteger('file_size'); // bytes
            $table->string('path');
            $table->boolean('encrypted')->default(true);

            // Dedicated upload timestamp (separate from created_at for semantic clarity)
            $table->timestamp('uploaded_at')->useCurrent();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('evidence_files');
    }
};
