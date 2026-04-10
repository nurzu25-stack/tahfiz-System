<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Achievement extends Model
{
    protected $fillable = ['student_id', 'name', 'type', 'earned_at', 'meta'];

    protected $casts = [
        'meta' => 'json',
        'earned_at' => 'datetime',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}
