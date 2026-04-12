<?php

namespace App\Http\Controllers;

use App\Models\Hostel;
use App\Models\Student;
use Illuminate\Http\Request;

class HostelController extends Controller
{
    public function index()
    {
        return Hostel::withCount('students')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'block' => 'nullable|string',
            'capacity' => 'required|integer',
            'gender' => 'required|in:Lelaki,Perempuan',
            'description' => 'nullable|string',
        ]);

        $hostel = Hostel::create($validated);
        return response()->json($hostel, 201);
    }

    public function show(string $id)
    {
        return Hostel::with('students')->findOrFail($id);
    }

    public function update(Request $request, string $id)
    {
        $hostel = Hostel::findOrFail($id);
        $validated = $request->validate([
            'name' => 'string',
            'block' => 'nullable|string',
            'capacity' => 'integer',
            'gender' => 'in:Lelaki,Perempuan',
            'description' => 'nullable|string',
        ]);

        $hostel->update($validated);
        return response()->json($hostel);
    }

    public function destroy(string $id)
    {
        $hostel = Hostel::findOrFail($id);
        $hostel->delete();
        return response()->json(null, 204);
    }

    public function assignStudent(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'hostel_id' => 'required|exists:hostels,id',
            'room_number' => 'nullable|string',
        ]);

        $student = Student::findOrFail($validated['student_id']);
        $student->update([
            'hostel_id' => $validated['hostel_id'],
            'room_number' => $validated['room_number'],
        ]);

        return response()->json($student);
    }
}
