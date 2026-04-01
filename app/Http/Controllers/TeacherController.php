<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Teacher;

class TeacherController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->query('search');

        $teachers = Teacher::query()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(8);

        return response()->json($teachers);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:teachers,email',
            'phone' => 'required|string|max:20',
            'specialization' => 'nullable|string|max:255',
            'status' => 'string|in:Aktif,Tidak Aktif',
            'joined_date' => 'date',
        ]);

        if (!isset($validated['joined_date'])) {
            $validated['joined_date'] = now()->format('Y-m-d');
        }

        $teacher = Teacher::create($validated);

        return response()->json($teacher, 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Teacher $teacher)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:teachers,email,' . $teacher->id,
            'phone' => 'sometimes|required|string|max:20',
            'specialization' => 'nullable|string|max:255',
            'status' => 'sometimes|string|in:Aktif,Tidak Aktif',
            'joined_date' => 'sometimes|date',
        ]);

        $teacher->update($validated);

        return response()->json($teacher);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Teacher $teacher)
    {
        $teacher->delete();

        return response()->json(null, 204);
    }
}
