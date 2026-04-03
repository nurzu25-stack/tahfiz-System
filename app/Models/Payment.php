<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'student_id', 'month', 'year', 'amount', 'status', 
        'due_date', 'paid_date'
    ];
}
