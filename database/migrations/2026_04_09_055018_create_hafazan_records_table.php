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
        Schema::create('hafazan_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id');
            $table->foreignId('teacher_id');
            $table->date('date');
            
            // Sabaq (Hafazan Baharu)
            $table->string('sabaq_surah')->nullable();
            $table->integer('sabaq_from')->nullable();
            $table->integer('sabaq_to')->nullable();
            $table->string('sabaq_grade')->nullable();

            // Sabaqi (Ulang Kaji Terkini)
            $table->string('sabaqi_surah')->nullable();
            $table->integer('sabaqi_from')->nullable();
            $table->integer('sabaqi_to')->nullable();
            $table->string('sabaqi_grade')->nullable();

            // Manzil (Ulang Kaji Jangka Panjang)
            $table->string('manzil_surah')->nullable();
            $table->integer('manzil_from')->nullable();
            $table->integer('manzil_to')->nullable();
            $table->string('manzil_grade')->nullable();

            $table->text('remarks')->nullable();
            $table->integer('ayah_count')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hafazan_records');
    }
};
