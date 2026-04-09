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
        Schema::table('students', function (Blueprint $table) {
            $table->date('interview_date')->nullable();
            $table->string('interview_type')->nullable(); // Fizikal / Online
            $table->integer('hafazan_mark')->default(0);
            $table->integer('tajwid_mark')->default(0);
            $table->integer('akhlaq_mark')->default(0);
            $table->text('notes')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->dropColumn([
                'interview_date',
                'interview_type',
                'hafazan_mark',
                'tajwid_mark',
                'akhlaq_mark',
                'notes'
            ]);
        });
    }
};
