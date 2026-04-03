<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class EnrollmentController extends Controller
{
    /**
     * Handle the guest student enrollment process.
     * Creates both a Parent User and a Student record.
     */
    public function publicRegister(Request $request)
    {
        $validated = $request->validate([
            // Parent Data
            'parentName'  => 'required|string|max:255',
            'parentEmail' => 'required|email|unique:users,email',
            'parentPhone' => 'required|string|max:20',
            'parentJob'   => 'required|string',
            'parentIncome'=> 'required|numeric',
            'password'    => 'required|string|min:8',
            // Student Data
            'studentName' => 'required|string|max:255',
            'studentGender'=> 'required|in:M,F',
            'studentDob'  => 'required|date',
            'studentAge'  => 'required|integer',
            'tajwidLevel' => 'nullable|string',
            'hafazanLevel'=> 'nullable|string',
        ]);

        try {
            return DB::transaction(function () use ($validated) {
                // 1. Create Parent User
                $parent = User::create([
                    'name'     => $validated['parentName'],
                    'email'    => $validated['parentEmail'],
                    'password' => Hash::make($validated['password']),
                    'role'     => 'parent',
                    'status'   => 'pending', // Requires Mudir approval
                    'phone'    => $validated['parentPhone'],
                    'job'      => $validated['parentJob'],
                    'wage'     => $validated['parentIncome'],
                ]);

                // 2. Create Student Record (Interview Phase)
                $student = Student::create([
                    'name'           => $validated['studentName'],
                    'gender'         => $validated['studentGender'],
                    'dob'            => $validated['studentDob'],
                    'age'            => $validated['studentAge'],
                    'parent_id'      => $parent->id, // Link to User.id
                    'parent_name'    => $validated['parentName'],
                    'parent_phone'   => $validated['parentPhone'],
                    'admission_type' => 'interview',
                    'status'         => 'Pending', // As per user requirements
                    'enrolled_date'  => now()->format('Y-m-d'),
                    'intake_juzuk'   => 0, // Guest students usually start at 0
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Permohonan pendaftaran telah dihantar.',
                    'parent'  => $parent->id,
                    'student' => $student->id
                ], 201);
            });
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memproses permohonan: ' . $e->getMessage()
            ], 500);
        }
    }
}
