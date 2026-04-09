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
        Schema::create('ai_predictions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->onDelete('cascade');
            $table->string('current_progress');
            $table->date('estimated_completion');
            $table->string('performance_trend'); // Cemerlang, Baik, Perlu Perhatian
            $table->string('confidence'); // percentage string
            $table->text('recommendation');
            $table->string('attendance_rate');
            $table->integer('avg_ayah_per_day');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ai_predictions');
    }
};
