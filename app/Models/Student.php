<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $fillable = [
        'name', 'phone', 'ic_no', 'gender', 'dob', 'age', 'address',
        'marital_status', 'blood_type', 'pob', 'citizenship', 'race', 'religion',
        'education_background', 'emergency_contact_name', 'emergency_contact_phone',
        'family_income', 'class_id', 'teacher_id', 'parent_id', 'parent_name', 
        'parent_phone', 'enrolled_date', 'juzuk_completed', 'intake_juzuk', 
        'status', 'medical_history', 'admission_type', 'ranking'
    ];

    /**
     * Get the class that the student belongs to.
     */
    public function classRoom()
    {
        return $this->belongsTo(ClassRoom::class, 'class_id');
    }

    /**
     * Get the teacher assigned to the student.
     */
    public function teacher()
    {
        return $this->belongsTo(Teacher::class, 'teacher_id');
    }
}
