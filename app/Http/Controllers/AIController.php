<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\HafazanRecord;
use App\Models\Attendance;
use App\Models\Payment;
use App\Models\AIPrediction;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AIController extends Controller
{
    public function getPrediction(string $studentId)
    {
        $student = Student::findOrFail($studentId);
        
        // 1. Fetch data
        $records = HafazanRecord::where('student_id', $studentId)->get();
        $attendances = Attendance::where('student_id', $studentId)->get();
        $payments = Payment::where('student_id', $studentId)->get();

        // 2. Logic Ported from Frontend
        
        // Hafazan Progress & Performance
        $totalSabaqAyah = 0;
        $gradeScoreTotal = 0;
        $gradeCount = 0;

        foreach ($records as $r) {
            $totalSabaqAyah += max(0, ($r->sabaq_to ?? 0) - ($r->sabaq_from ?? 0));
            
            $grades = [$r->sabaq_grade, $r->sabaqi_grade, $r->manzil_grade];
            foreach ($grades as $g) {
                $val = $this->getGradeValue($g);
                if ($val !== null) {
                    $gradeScoreTotal += $val;
                    $gradeCount++;
                }
            }
        }

        $avgSabaqPerDay = count($records) ? $totalSabaqAyah / count($records) : 5;
        $qualityMultiplier = $gradeCount > 0 ? $gradeScoreTotal / $gradeCount : 1.0;

        // Attendance Pattern
        $attendanceRate = 0.8; // Default
        if (count($attendances)) {
            $present = $attendances->whereIn('status', ['Hadir', 'Lewat'])->count();
            $attendanceRate = $present / count($attendances);
        }

        // Payment Consistency
        $paymentScore = 0.8; // Default
        if (count($payments)) {
            $paid = $payments->where('status', 'Dibayar')->count();
            $paymentScore = $paid / count($payments);
        }

        // AI Engine Computation
        $effectiveRate = $avgSabaqPerDay * $qualityMultiplier * (0.6 + ($attendanceRate * 0.3) + ($paymentScore * 0.1));
        
        $remainingJuzuk = 30 - $student->juzuk_completed;
        $remainingAyat = $remainingJuzuk * 208; // Rough estimate: 208 ayat per juzuk
        $validEffectiveRate = max($effectiveRate, 0.5);
        $daysLeft = ceil($remainingAyat / $validEffectiveRate);

        $completionDate = Carbon::now()->addDays($daysLeft);

        // Confidence Level
        $dataVolumeScore = min(1, count($records) / 30);
        $confidence = min(99, round(60 + ($dataVolumeScore * 15) + ($attendanceRate * 15) + ($paymentScore * 5) + (($qualityMultiplier - 1) * 10)));

        // Trend
        $trend = ($attendanceRate >= 0.9 && $qualityMultiplier >= 1.0) ? 'Cemerlang' :
                 ($attendanceRate >= 0.75 && $qualityMultiplier >= 0.8) ? 'Baik' : 'Perlu Perhatian';

        // Recommendation
        $recommendation = 'Progres konsisten dikekalkan. Dijangka tamat lebih awal.';
        if ($qualityMultiplier < 0.85) $recommendation = 'Tumpukan kepada ulang kaji Sabaqi/Manzil untuk meningkatkan kualiti ingatan.';
        elseif ($attendanceRate < 0.85) $recommendation = 'Kehadiran yang lebih konsisten diperlukan untuk ramalan yang stabil.';
        elseif ($paymentScore < 1.0) $recommendation = 'Yuran yang belum dijelaskan mungkin mempengaruhi trend kestabilan.';

        // Avg ayah per day
        $avgTotalAyahPerDay = count($records)
            ? $records->avg('ayah_count')
            : $avgSabaqPerDay;

        $predictionData = [
            'student_id' => $student->id,
            'current_progress' => "{$student->juzuk_completed} Juzuk (" . round(($student->juzuk_completed / 30) * 100) . "%)",
            'estimated_completion' => $completionDate->format('Y-m-d'),
            'performance_trend' => $trend,
            'confidence' => "{$confidence}%",
            'recommendation' => $recommendation,
            'attendance_rate' => round($attendanceRate * 100) . "%",
            'avg_ayah_per_day' => round($avgTotalAyahPerDay),
        ];

        // 3. Store in DB (Cache)
        $prediction = AIPrediction::updateOrCreate(
            ['student_id' => $student->id],
            $predictionData
        );

        return response()->json($prediction);
    }

    public function getClassPredictions(string $classId)
    {
        $students = Student::where('class_id', $classId)->get();
        $predictions = $students->map(function ($s) {
            return $this->getPrediction($s->id)->original;
        });

        return response()->json($predictions);
    }

    private function getGradeValue($g)
    {
        switch ($g) {
            case 'Mumtaz': return 1.15;
            case 'Jayyid': return 1.0;
            case 'Maqbul': return 0.8;
            case 'Perlu Penambahbaikan': return 0.5;
            default: return null;
        }
    }
}
