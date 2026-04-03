<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $students = \App\Models\Student::all();
        // Map snake_case to camelCase for frontend
        return $students->map(function($s) {
            return [
                'id' => $s->id,
                'name' => $s->name,
                'age' => $s->age,
                'classId' => $s->class_id,
                'teacherId' => $s->teacher_id,
                'parentId' => $s->parent_id,
                'enrolledDate' => $s->enrolled_date,
                'juzukCompleted' => $s->juzuk_completed,
                'status' => $s->status,
            ];
        });
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'age' => 'required|integer',
            'classId' => 'nullable',
            'teacherId' => 'nullable',
            'parentId' => 'nullable',
            'enrolledDate' => 'required|date',
            'juzukCompleted' => 'integer',
            'status' => 'string'
        ]);

        $student = \App\Models\Student::create([
            'name' => $validated['name'],
            'age' => $validated['age'],
            'class_id' => $validated['classId'] ?? null,
            'teacher_id' => $validated['teacherId'] ?? null,
            'parent_id' => $validated['parentId'] ?? null,
            'enrolled_date' => $validated['enrolledDate'],
            'juzuk_completed' => $validated['juzukCompleted'] ?? 0,
            'status' => $validated['status'] ?? 'Aktif',
        ]);

        return response()->json([
            'id' => $student->id,
            'name' => $student->name,
            'age' => $student->age,
            'classId' => $student->class_id,
            'teacherId' => $student->teacher_id,
            'parentId' => $student->parent_id,
            'enrolledDate' => $student->enrolled_date,
            'juzukCompleted' => $student->juzuk_completed,
            'status' => $student->status,
        ]);
    }

    public function update(Request $request, string $id)
    {
        $student = \App\Models\Student::findOrFail($id);
        $data = $request->all();
        
        $student->update([
            'name' => $data['name'] ?? $student->name,
            'age' => $data['age'] ?? $student->age,
            'class_id' => $data['classId'] ?? $student->class_id,
            'teacher_id' => $data['teacherId'] ?? $student->teacher_id,
            'parent_id' => $data['parentId'] ?? $student->parent_id,
            'enrolled_date' => $data['enrolledDate'] ?? $student->enrolled_date,
            'juzuk_completed' => $data['juzukCompleted'] ?? $student->juzuk_completed,
            'status' => $data['status'] ?? $student->status,
        ]);

        return response()->json([
            'id' => $student->id,
            'name' => $student->name,
            'age' => $student->age,
            'classId' => $student->class_id,
            'teacherId' => $student->teacher_id,
            'parentId' => $student->parent_id,
            'enrolledDate' => $student->enrolled_date,
            'juzukCompleted' => $student->juzuk_completed,
            'status' => $student->status,
        ]);
    }

    public function destroy(string $id)
    {
        $student = \App\Models\Student::findOrFail($id);
        $student->delete();
        return response()->json(['success' => true]);
    }
}
