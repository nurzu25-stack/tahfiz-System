<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Student;
use App\Models\HafazanRecord;
use App\Models\Achievement;
use Illuminate\Support\Facades\Log;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $classId = $request->query('classId');
        $students = $classId 
            ? Student::where('class_id', $classId)->get() 
            : Student::all();
        // Map snake_case to camelCase for frontend
        return $students->map(function ($s) {
            return [
                'id' => $s->id,
                'name' => $s->name,
                'phone' => $s->phone,
                'icNo' => $s->ic_no,
                'gender' => $s->gender,
                'dob' => $s->dob,
                'age' => $s->age,
                'address' => $s->address,
                'maritalStatus' => $s->marital_status,
                'bloodType' => $s->blood_type,
                'pob' => $s->pob,
                'citizenship' => $s->citizenship,
                'race' => $s->race,
                'religion' => $s->religion,
                'educationBackground' => $s->education_background,
                'emergencyContactName' => $s->emergency_contact_name,
                'emergencyContactPhone' => $s->emergency_contact_phone,
                'familyIncome' => $s->family_income,
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
            'phone' => 'nullable|string',
            'icNo' => 'nullable|string',
            'gender' => 'required|string',
            'dob' => 'nullable|date',
            'age' => 'required|integer',
            'address' => 'nullable|string',
            'maritalStatus' => 'nullable|string',
            'bloodType' => 'nullable|string',
            'pob' => 'nullable|string',
            'citizenship' => 'nullable|string',
            'race' => 'nullable|string',
            'religion' => 'nullable|string',
            'educationBackground' => 'nullable|string',
            'emergencyContactName' => 'nullable|string',
            'emergencyContactPhone' => 'nullable|string',
            'familyIncome' => 'nullable|string',
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
            'phone' => $validated['phone'] ?? null,
            'ic_no' => $validated['icNo'] ?? null,
            'gender' => $validated['gender'] ?? 'M',
            'dob' => $validated['dob'] ?? null,
            'age' => $validated['age'],
            'address' => $validated['address'] ?? null,
            'marital_status' => $validated['maritalStatus'] ?? null,
            'blood_type' => $validated['bloodType'] ?? null,
            'pob' => $validated['pob'] ?? null,
            'citizenship' => $validated['citizenship'] ?? null,
            'race' => $validated['race'] ?? null,
            'religion' => $validated['religion'] ?? null,
            'education_background' => $validated['educationBackground'] ?? null,
            'emergency_contact_name' => $validated['emergencyContactName'] ?? null,
            'emergency_contact_phone' => $validated['emergencyContactPhone'] ?? null,
            'family_income' => $validated['familyIncome'] ?? null,
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
            'name' => $request->name ?? $student->name,
            'phone' => $request->phone ?? $student->phone,
            'ic_no' => $request->icNo ?? $request->ic_no ?? $student->ic_no,
            'gender' => $request->gender ?? $student->gender,
            'dob' => $request->dob ?? $student->dob,
            'age' => $request->age ?? $student->age,
            'address' => $request->address ?? $student->address,
            'marital_status' => $request->maritalStatus ?? $request->marital_status ?? $student->marital_status,
            'blood_type' => $request->bloodType ?? $request->blood_type ?? $student->blood_type,
            'pob' => $request->pob ?? $student->pob,
            'citizenship' => $request->citizenship ?? $student->citizenship,
            'race' => $request->race ?? $student->race,
            'religion' => $request->religion ?? $student->religion,
            'education_background' => $request->educationBackground ?? $request->education_background ?? $student->education_background,
            'emergency_contact_name' => $request->emergencyContactName ?? $request->emergency_contact_name ?? $student->emergency_contact_name,
            'emergency_contact_phone' => $request->emergencyContactPhone ?? $request->emergency_contact_phone ?? $student->emergency_contact_phone,
            'family_income' => $request->familyIncome ?? $request->family_income ?? $student->family_income,
            'class_id' => $request->classId ?? $request->class_id ?? $student->class_id,
            'teacher_id' => $request->teacherId ?? $request->teacher_id ?? $student->teacher_id,
            'parent_id' => $request->parentId ?? $request->parent_id ?? $student->parent_id,
            'parent_name' => $request->parentName ?? $request->parent_name ?? $student->parent_name,
            'parent_phone' => $request->parentPhone ?? $request->parent_phone ?? $student->parent_phone,
            'enrolled_date' => $request->enrolledDate ?? $request->enrolled_date ?? $student->enrolled_date,
            'juzuk_completed' => $request->juzukCompleted ?? $request->juzuk_completed ?? $student->juzuk_completed,
            'intake_juzuk' => $request->intakeJuzuk ?? $request->intake_juzuk ?? $student->intake_juzuk,
            'status' => $request->status ?? $student->status,
            'medical_history' => $request->medicalHistory ?? $request->medical_history ?? $student->medical_history,
            'admission_type' => $request->admissionType ?? $request->admission_type ?? $student->admission_type,
            'ranking' => $request->ranking ?? $student->ranking,
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

    public function getTeacherStudents(Request $request)
    {
        $teacherId = $request->query('teacherId');
        if (!$teacherId) {
            return response()->json(['error' => 'Teacher ID required'], 400);
        }

        $students = Student::where('teacher_id', $teacherId)
            ->orWhereHas('classRoom', function($query) use ($teacherId) {
                $query->where('teacher_id', $teacherId);
            })
            ->get();

        return $students->map(function($s) {
            return [
                'id' => $s->id,
                'name' => $s->name,
                'classId' => $s->class_id,
                'teacherId' => $s->teacher_id,
                'age' => $s->age,
                'enrolledDate' => $s->enrolled_date,
                'juzukCompleted' => $s->juzuk_completed,
                'status' => $s->status,
                'parentName' => $s->parent_name,
                'parentPhone' => $s->parent_phone,
            ];
        });
    }

    public function dashboard($id)
    {
        $student = Student::with(['classRoom.teacher', 'teacher'])->findOrFail($id);
        
        // Calculate streak
        $dates = HafazanRecord::where('student_id', $id)
            ->orderBy('date', 'desc')
            ->pluck('date')
            ->unique()
            ->toArray();

        $streak = 0;
        if (!empty($dates)) {
            $currentDate = new \DateTime();
            $lastRecordDate = new \DateTime($dates[0]);
            $diff = $currentDate->diff($lastRecordDate)->days;
            
            if ($diff <= 1) {
                $prevDate = null;
                foreach ($dates as $dateStr) {
                    $date = new \DateTime($dateStr);
                    if ($prevDate === null) {
                        $streak = 1;
                    } else {
                        $interval = $prevDate->diff($date);
                        if ($interval->days === 1) {
                            $streak++;
                        } else {
                            break;
                        }
                    }
                    $prevDate = $date;
                }
            }
        }

        // Rank name based on juzuk
        $juzuk = $student->juzuk_completed ?? 0;
        $rankName = 'Beginner';
        if ($juzuk >= 1) $rankName = 'Warrior';
        if ($juzuk >= 5) $rankName = 'Elite';
        if ($juzuk >= 15) $rankName = 'Master';
        if ($juzuk >= 30) $rankName = 'Al-Hafiz';

        return response()->json([
            'juzukCompleted' => $juzuk,
            'streak' => $streak,
            'rankName' => $rankName,
            'student' => [
                'id' => $student->id,
                'name' => $student->name,
                'className' => $student->classRoom->name ?? 'Falah',
                'teacherName' => $student->classRoom->teacher->name ?? $student->teacher->name ?? 'Ustaz Abdullah',
            ]
        ]);
    }
}
