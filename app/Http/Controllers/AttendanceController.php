<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AttendanceController extends Controller
{
    /**
     * Store multiple attendance records.
     */
    public function bulkStore(Request $request)
    {
        $request->validate([
            'records' => 'required|array',
            'records.*.studentId' => 'required',
            'records.*.classId' => 'required',
            'records.*.date' => 'required|date',
            'records.*.status' => 'required|string|in:Hadir,Tidak Hadir,Lewat',
            'records.*.remarks' => 'nullable|string',
        ]);

        try {
            DB::beginTransaction();

            foreach ($request->records as $record) {
                // Update or create attendance for the student on that date
                Attendance::updateOrCreate(
                    [
                        'student_id' => $record['studentId'],
                        'date' => $record['date'],
                    ],
                    [
                        'class_id' => $record['classId'],
                        'teacher_id' => $request->teacherId ?? $record['teacherId'] ?? null,
                        'status' => $record['status'],
                        'remarks' => $record['remarks'] ?? null,
                    ]
                );
            }

            DB::commit();

            return response()->json(['message' => 'Attendance successfully recorded.'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to record attendance: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Get attendance for a class on a specific date.
     */
    public function index(Request $request)
    {
        $query = Attendance::query();

        if ($request->has('student_id')) {
            $query->where('student_id', $request->student_id);
        }

        if ($request->has('class_id')) {
            $query->where('class_id', $request->class_id);
        }

        if ($request->has('date')) {
            $query->where('date', $request->date);
        }

        $attendances = $query->latest('date')->get();

        return response()->json($attendances);
    }
}
