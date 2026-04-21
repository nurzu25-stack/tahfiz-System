<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AIPrediction extends Model
{
    protected $table = 'ai_predictions';

    protected $fillable = [
        'student_id',
        'current_progress',
        'estimated_completion',
        'performance_trend',
        'confidence',
        'recommendation',
        'attendance_rate',
        'avg_ayah_per_day'
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}
