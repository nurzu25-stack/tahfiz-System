<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AIAssessment extends Model
{
    protected $table = 'ai_assessments';

    protected $fillable = [
        'student_id',
        'teacher_id',
        'surah',
        'score',
        'date',
        'status',
        'audio_path',
        'feedback'
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
