<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{
    protected $fillable = [
        'name', 'email', 'phone', 'ic_no', 'specialization', 
        'status', 'joined_date', 'qualification', 'experience',
        'medical_history', 'emergency_contact_name', 'emergency_contact_phone',
        'dependents_count', 'residence', 'service_start_date'
    ];

    /**
     * Get the classes assigned to the teacher.
     */
    public function classes()
    {
        return $this->hasMany(ClassRoom::class);
    }
}
