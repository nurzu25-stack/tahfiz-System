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
            $table->string('phone')->nullable()->after('name');
            $table->string('marital_status')->nullable();
            $table->string('blood_type')->nullable();
            $table->string('pob')->nullable();
            $table->string('citizenship')->nullable();
            $table->string('race')->nullable();
            $table->string('religion')->nullable();
            $table->text('education_background')->nullable();
            $table->string('emergency_contact_name')->nullable();
            $table->string('emergency_contact_phone')->nullable();
            $table->string('family_income')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->dropColumn([
                'phone', 'marital_status', 'blood_type', 'pob', 
                'citizenship', 'race', 'religion', 'education_background',
                'emergency_contact_name', 'emergency_contact_phone', 'family_income'
            ]);
        });
    }
};
