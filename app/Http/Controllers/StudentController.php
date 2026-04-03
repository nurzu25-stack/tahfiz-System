<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Student;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $students = Student::all();
        // Map snake_case to camelCase for frontend
        return $students->map(function($s) {
            return [
                'id' => $s->id,
                'name' => $s->name,
                'icNo' => $s->ic_no,
                'gender' => $s->gender,
                'dob' => $s->dob,
                'age' => $s->age,
                'address' => $s->address,
                'classId' => $s->class_id,
                'teacherId' => $s->teacher_id,
                'parentId' => $s->parent_id,
                'parentName' => $s->parent_name,
                'parentPhone' => $s->parent_phone,
                'enrolledDate' => $s->enrolled_date,
                'juzukCompleted' => $s->juzuk_completed,
                'intakeJuzuk' => $s->intake_juzuk,
                'status' => $s->status,
                'medicalHistory' => $s->medical_history,
                'admissionType' => $s->admission_type,
                'ranking' => $s->ranking,
            ];
        });
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'icNo' => 'nullable|string',
            'gender' => 'required|string',
            'dob' => 'nullable|date',
            'age' => 'required|integer',
            'address' => 'nullable|string',
            'classId' => 'nullable',
            'teacherId' => 'nullable',
            'parentId' => 'nullable',
            'parentName' => 'nullable|string',
            'parentPhone' => 'nullable|string',
            'enrolledDate' => 'required|date',
            'intakeJuzuk' => 'integer',
            'juzukCompleted' => 'integer',
            'status' => 'string',
            'medicalHistory' => 'nullable|string',
            'admissionType' => 'nullable|string',
            'ranking' => 'nullable|integer',
        ]);

        $student = Student::create([
            'name' => $validated['name'],
            'ic_no' => $validated['icNo'] ?? null,
            'gender' => $validated['gender'] ?? 'M',
            'dob' => $validated['dob'] ?? null,
            'age' => $validated['age'],
            'address' => $validated['address'] ?? null,
            'class_id' => $validated['classId'] ?? null,
            'teacher_id' => $validated['teacherId'] ?? null,
            'parent_id' => $validated['parentId'] ?? null,
            'parent_name' => $validated['parentName'] ?? null,
            'parent_phone' => $validated['parentPhone'] ?? null,
            'enrolled_date' => $validated['enrolledDate'],
            'intake_juzuk' => $validated['intakeJuzuk'] ?? 0,
            'juzuk_completed' => $validated['juzukCompleted'] ?? $validated['intakeJuzuk'] ?? 0,
            'status' => $validated['status'] ?? 'Aktif',
            'medical_history' => $validated['medicalHistory'] ?? null,
            'admission_type' => $validated['admissionType'] ?? 'tetap',
            'ranking' => $validated['ranking'] ?? null,
        ]);

        // Returns newly created student in camelCase
        return response()->json([
            'id' => $student->id,
            'name' => $student->name,
            'icNo' => $student->ic_no,
            'gender' => $student->gender,
            'dob' => $student->dob,
            'age' => $student->age,
            'address' => $student->address,
            'classId' => $student->class_id,
            'teacherId' => $student->teacher_id,
            'parentId' => $student->parent_id,
            'parentName' => $student->parent_name,
            'parentPhone' => $student->parent_phone,
            'enrolledDate' => $student->enrolled_date,
            'juzukCompleted' => $student->juzuk_completed,
            'intakeJuzuk' => $student->intake_juzuk,
            'status' => $student->status,
            'medicalHistory' => $student->medical_history,
            'admissionType' => $student->admission_type,
            'ranking' => $student->ranking,
        ]);
    }

    public function update(Request $request, string $id)
    {
        $student = Student::findOrFail($id);
        $data = $request->all();
        
        $student->update([
            'name' => $data['name'] ?? $student->name,
            'ic_no' => $data['icNo'] ?? $student->ic_no,
            'gender' => $data['gender'] ?? $student->gender,
            'dob' => $data['dob'] ?? $student->dob,
            'age' => $data['age'] ?? $student->age,
            'address' => $data['address'] ?? $student->address,
            'class_id' => $data['classId'] ?? $student->class_id,
            'teacher_id' => $data['teacherId'] ?? $student->teacher_id,
            'parent_id' => $data['parentId'] ?? $student->parent_id,
            'parent_name' => $data['parentName'] ?? $student->parent_name,
            'parent_phone' => $data['parentPhone'] ?? $student->parent_phone,
            'enrolled_date' => $data['enrolledDate'] ?? $student->enrolled_date,
            'juzuk_completed' => $data['juzukCompleted'] ?? $student->juzuk_completed,
            'intake_juzuk' => $data['intakeJuzuk'] ?? $student->intake_juzuk,
            'status' => $data['status'] ?? $student->status,
            'medical_history' => $data['medicalHistory'] ?? $student->medical_history,
            'admission_type' => $data['admissionType'] ?? $student->admission_type,
            'ranking' => $data['ranking'] ?? $student->ranking,
        ]);

        return response()->json([
            'id' => $student->id,
            'name' => $student->name,
            'icNo' => $student->ic_no,
            'gender' => $student->gender,
            'dob' => $student->dob,
            'age' => $student->age,
            'address' => $student->address,
            'classId' => $student->class_id,
            'teacherId' => $student->teacher_id,
            'parentId' => $student->parent_id,
            'parentName' => $student->parent_name,
            'parentPhone' => $student->parent_phone,
            'enrolledDate' => $student->enrolled_date,
            'juzukCompleted' => $student->juzuk_completed,
            'intakeJuzuk' => $student->intake_juzuk,
            'status' => $student->status,
            'medicalHistory' => $student->medical_history,
            'admissionType' => $student->admission_type,
            'ranking' => $student->ranking,
        ]);
    }

    public function destroy(string $id)
    {
        $student = Student::findOrFail($id);
        $student->delete();
        return response()->json(['success' => true]);
    }
}
