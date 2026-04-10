<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Student;
use App\Models\ClassRoom;
use App\Models\Teacher;

class ParentController extends Controller
{
    /**
     * Get list of children linked to the authenticated parent.
     */
    public function getChildren()
    {
        $user = Auth::user();
        if (!$user || $user->role !== 'parent') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Parent is linked to students via parent_id
        $children = Student::where('parent_id', $user->id)->get();

        $data = $children->map(function ($student) {
            $class = ClassRoom::find($student->class_id);
            $teacher = Teacher::find($student->teacher_id);
            
            return [
                'id' => $student->id,
                'name' => $student->name,
                'age' => $student->age,
                'class_id' => $student->class_id,
                'class_name' => $class ? $class->name : 'N/A',
                'teacher_id' => $student->teacher_id,
                'teacher_name' => $teacher ? $teacher->name : 'N/A',
                'juzuk_completed' => $student->juzuk_completed,
                'status' => $student->status,
                'enrolled_date' => $student->enrolled_date,
            ];
        });

        return response()->json($data);
    }
}
