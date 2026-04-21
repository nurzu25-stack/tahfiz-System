<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');
            $table->unsignedBigInteger('parent_id')->nullable();
            $table->decimal('amount', 10, 2);
            $table->string('payment_type')->default('monthly'); // monthly, registration, other
            $table->date('payment_date');
            $table->string('month_year')->nullable(); // e.g. "2024-04" for monthly fees
            $table->enum('status', ['paid', 'pending', 'overdue'])->default('pending');
            $table->string('receipt_no')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
