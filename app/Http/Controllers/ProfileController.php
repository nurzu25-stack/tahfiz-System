<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Teacher;
use App\Models\Student;

class ProfileController extends Controller
{
    /**
     * Get the current authenticated user's profile with role-specific data.
     */
    public function show()
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $data = $user->toArray();
        
        if ($user->role === 'teacher') {
            $teacher = Teacher::where('email', $user->email)->first();
            $data['teacher_data'] = $teacher;
        } elseif ($user->role === 'student') {
            $student = Student::where('parent_id', $user->id)->orWhere('id', $user->id)->first(); // Simple logic
            $data['student_data'] = $student;
        }

        return response()->json($data);
    }

    /**
     * Update the current authenticated user's profile.
     */
    public function update(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:users,email,' . $user->id,
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        // If teacher, update teacher record too
        if ($user->role === 'teacher') {
            $teacher = Teacher::where('email', $user->email)->first();
            if ($teacher) {
                $teacher->update([
                    'name' => $request->name ?? $teacher->name,
                    'phone' => $request->phone ?? $teacher->phone,
                    'ic_no' => $request->icNo ?? $teacher->ic_no,
                    'qualification' => $request->qualification ?? $teacher->qualification,
                    'experience' => $request->experience ?? $teacher->experience,
                    'medical_history' => $request->medicalHistory ?? $teacher->medical_history,
                    'emergency_contact_name' => $request->emergencyContactName ?? $teacher->emergency_contact_name,
                    'emergency_contact_phone' => $request->emergencyContactPhone ?? $teacher->emergency_contact_phone,
                    'residence' => $request->residence ?? $teacher->residence,
                ]);
            }
        }

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user
        ]);
    }
}
