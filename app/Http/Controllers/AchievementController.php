<?php

namespace App\Http\Controllers;

use App\Models\Achievement;
use App\Models\Student;
use App\Models\HafazanRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AchievementController extends Controller
{
    public function index($studentId)
    {
        $this->sync($studentId);
        return Achievement::where('student_id', $studentId)->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'name' => 'required|string',
            'type' => 'required|string',
        ]);

        $achievement = Achievement::firstOrCreate([
            'student_id' => $validated['student_id'],
            'name' => $validated['name'],
            'type' => $validated['type']
        ], [
            'earned_at' => now(),
        ]);

        return response()->json($achievement, 201);
    }

    public function destroy($id)
    {
        $achievement = Achievement::findOrFail($id);
        $achievement->delete();
        return response()->json(null, 204);
    }

    public function sync($studentId)
    {
        $student = Student::findOrFail($studentId);
        $records = HafazanRecord::where('student_id', $studentId)->get();
        
        $achievements = [];

        // 1. Juzuk Badges
        if ($student->juzuk_completed >= 1) $achievements[] = ['name' => 'Warrior', 'type' => 'badge'];
        if ($student->juzuk_completed >= 5) $achievements[] = ['name' => 'Elite', 'type' => 'badge'];
        if ($student->juzuk_completed >= 30) $achievements[] = ['name' => 'Legend Al-Hafiz', 'type' => 'badge'];

        // 2. Consistency / Streak
        $streak = $this->calculateStreak($studentId);
        if ($streak >= 30) $achievements[] = ['name' => 'Kehadiran Terbaik', 'type' => 'achievement'];
        
        // 3. Quick Learner
        $maxAyah = $records->max('ayah_count');
        if ($maxAyah >= 50) $achievements[] = ['name' => 'Pelajar Pantas', 'type' => 'achievement'];

        // 4. Consistency King (100 days)
        $uniqueDays = $records->pluck('date')->unique()->count();
        if ($uniqueDays >= 100) $achievements[] = ['name' => 'Raja Konsistensi', 'type' => 'achievement'];

        // 5. Excellence (10 Mumtaz)
        // Note: grade is stored in sabaq column as json? or separate table?
        // Checking existing records...
        $mumtazCount = 0;
        foreach($records as $record) {
            $sabaq = is_string($record->sabaq) ? json_decode($record->sabaq, true) : $record->sabaq;
            if (isset($sabaq['grade']) && $sabaq['grade'] === 'Mumtaz') {
                $mumtazCount++;
            }
        }
        if ($mumtazCount >= 10) $achievements[] = ['name' => 'Anugerah Kecemerlangan', 'type' => 'achievement'];

        // Store new achievements
        foreach ($achievements as $a) {
            Achievement::firstOrCreate([
                'student_id' => $studentId,
                'name' => $a['name'],
                'type' => $a['type']
            ]);
        }
    }

    private function calculateStreak($studentId)
    {
        $dates = HafazanRecord::where('student_id', $studentId)
            ->orderBy('date', 'desc')
            ->pluck('date')
            ->unique()
            ->toArray();

        if (empty($dates)) return 0;

        $streak = 0;
        $currentDate = new \DateTime();
        
        // check if last record was today or yesterday
        $lastRecordDate = new \DateTime($dates[0]);
        $diff = $currentDate->diff($lastRecordDate)->days;
        
        if ($diff > 1) return 0; // Streak broken

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

        return $streak;
    }
}
