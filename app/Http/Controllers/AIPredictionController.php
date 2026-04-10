<?php

namespace App\Http\Controllers;

use App\Models\AIPrediction;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AIPredictionController extends Controller
{
    /**
     * Get predictions for students in a specific class.
     */
    public function getByClass($classId)
    {
        $studentIds = Student::where('class_id', $classId)->pluck('id');
        $predictions = AIPrediction::whereIn('student_id', $studentIds)->get();
        return response()->json($predictions);
    }

    /**
     * Generate or refresh predictions for a student.
     * (Normally this would call an AI service, but here we'll implement the logic to save to DB)
     */
    public function generate(Request $request)
    {
        $request->validate([
            'student_id' => 'required|exists:students,id',
        ]);

        $student = Student::find($request->student_id);
        
        // Mock AI Logic based on student data
        $juzuk = $student->juzuk_completed ?? 0;
        $trend = $juzuk > 15 ? 'Cemerlang' : ($juzuk > 5 ? 'Baik' : 'Perlu Perhatian');
        $confidence = rand(80, 98) . '%';
        $avgAyah = rand(3, 10);
        $completionDate = now()->addMonths(30 - $juzuk)->format('Y-m-d');
        
        $prediction = AIPrediction::updateOrCreate(
            ['student_id' => $student->id],
            [
                'current_progress' => $juzuk . ' Juzuk',
                'estimated_completion' => $completionDate,
                'performance_trend' => $trend,
                'confidence' => $confidence,
                'recommendation' => 'Teruskan usaha dalam hafazan. ' . ($juzuk < 10 ? 'Fokus pada tajwid.' : 'Tingkatkan kualiti murajaah.'),
                'attendance_rate' => rand(85, 100) . '%',
                'avg_ayah_per_day' => $avgAyah,
            ]
        );

        return response()->json($prediction);
    }

    /**
     * Generate bulk predictions for a class.
     */
    public function generateClass($classId)
    {
        $students = Student::where('class_id', $classId)->get();
        
        foreach ($students as $student) {
            // reuse logic above or similar
            $juzuk = $student->juzuk_completed ?? 0;
            $trend = $juzuk > 15 ? 'Cemerlang' : ($juzuk > 5 ? 'Baik' : 'Perlu Perhatian');
            $prediction = AIPrediction::updateOrCreate(
                ['student_id' => $student->id],
                [
                    'current_progress' => $juzuk . ' Juzuk',
                    'estimated_completion' => now()->addMonths(max(1, 30 - $juzuk))->format('Y-m-d'),
                    'performance_trend' => $trend,
                    'confidence' => rand(80, 98) . '%',
                    'recommendation' => 'Analisis AI mencadangkan fokus pada pengulangan juzuk yang telah dihafal.',
                    'attendance_rate' => '95%',
                    'avg_ayah_per_day' => rand(5, 12),
                ]
            );
        }

        return response()->json(['message' => 'AI Predictions generated for class students.']);
    }
}
