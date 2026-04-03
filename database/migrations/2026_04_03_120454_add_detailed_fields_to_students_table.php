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
            $table->string('ic_no')->nullable()->after('name');
            $table->enum('gender', ['M', 'F'])->default('M')->after('ic_no');
            $table->date('dob')->nullable()->after('gender');
            $table->text('address')->nullable()->after('age');
            $table->string('parent_name')->nullable()->after('parent_id');
            $table->string('parent_phone')->nullable()->after('parent_name');
            $table->text('medical_history')->nullable()->after('status');
            $table->integer('intake_juzuk')->default(0)->after('juzuk_completed');
            $table->string('admission_type')->default('tetap')->after('medical_history');
            $table->integer('ranking')->nullable()->after('admission_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->dropColumn([
                'ic_no', 'gender', 'dob', 'address', 'parent_name', 
                'parent_phone', 'medical_history', 'intake_juzuk', 
                'admission_type', 'ranking'
            ]);
        });
    }
};
