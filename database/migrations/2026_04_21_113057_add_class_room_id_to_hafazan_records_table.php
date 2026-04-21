<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('hafazan_records', function (Blueprint $table) {
            $table->unsignedBigInteger('class_room_id')->nullable()->after('teacher_id');
            $table->foreign('class_room_id')->references('id')->on('class_rooms')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('hafazan_records', function (Blueprint $table) {
            $table->dropForeign(['class_room_id']);
            $table->dropColumn('class_room_id');
        });
    }
};
