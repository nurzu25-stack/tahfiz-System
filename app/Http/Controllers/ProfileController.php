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
        $data['name'] = $user->full_name ?: $user->name; // Prefer full_name for display
        $data['username'] = $user->name; // Keep IC as username
        
        if ($user->role === 'teacher') {
            $data['teacher_data'] = $user->teacher;
        } elseif ($user->role === 'parent') {
            $parentProfile = $user->parentProfile;
            $data['parent_data'] = $parentProfile;
            if ($parentProfile) {
                $children = $parentProfile->students;
                $data['children'] = $children->map(fn($c) => ['id' => $c->id, 'name' => $c->name]);
            }
        } elseif ($user->role === 'student') {
            $data['student_data'] = $user->student;
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
            'name' => 'sometimes|required|string|max:255|unique:users,name,' . $user->id,
            'full_name' => 'nullable|string|max:255',
            'email' => 'sometimes|required|email|unique:users,email,' . $user->id,
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
            'password' => 'nullable|string|min:8|confirmed',
            'current_password' => 'required_with:password|string',
        ]);

        if (!empty($validated['password'])) {
            if (!Hash::check($validated['current_password'], $user->password)) {
                return response()->json(['message' => 'Kata laluan semasa tidak sah.'], 422);
            }
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }
        unset($validated['current_password']);

        $user->update($validated);

        // If teacher, update teacher record too
        if ($user->role === 'teacher') {
            $teacher = $user->teacher;
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

        // If parent, update parent record too
        if ($user->role === 'parent') {
            $parent = $user->parentProfile;
            if ($parent) {
                $parent->update([
                    'occupation' => $request->job ?? $parent->occupation,
                    'income' => $request->wage ?? $parent->income,
                    'phone' => $request->phone ?? $parent->phone,
                    'address' => $request->address ?? $parent->address,
                    'relationship_type' => $request->relation ?? $parent->relationship_type,
                ]);
            }
        }

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user
        ]);
    }
}
