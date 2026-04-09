<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HafazanRecord extends Model
{
    protected $fillable = [
        'student_id', 'teacher_id', 'date',
        'sabaq_surah', 'sabaq_from', 'sabaq_to', 'sabaq_grade',
        'sabaqi_surah', 'sabaqi_from', 'sabaqi_to', 'sabaqi_grade',
        'manzil_surah', 'manzil_from', 'manzil_to', 'manzil_grade',
        'remarks', 'ayah_count'
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }
}
