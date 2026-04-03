<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $fillable = [
        'name', 'age', 'class_id', 'teacher_id', 'parent_id', 
        'enrolled_date', 'juzuk_completed', 'status'
    ];
}
