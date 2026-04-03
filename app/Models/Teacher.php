<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'email',
        'phone',
        'specialization',
        'status',
        'joined_date',
    ];

    public function classes()
    {
        return $this->hasMany(ClassRoom::class, 'teacher_id');
    }
}
