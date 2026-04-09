<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use App\Mail\EnrollmentSuccessMail;
use Barryvdh\DomPDF\Facade\Pdf;

class EnrollmentController extends Controller
{
    /**
     * List all applicants for the Enrollment Hub.
     */
    public function index()
    {
        $applicants = Student::whereIn('status', [
            'PROSPECT', 'INTERVIEW', 'ACCEPTED', 'REJECTED', 'OFFERED', 'ENROLLED', 'Pending'
        ])
        ->orderBy('created_at', 'desc')
        ->get();

        return response()->json($applicants);
    }

    /**
     * Update applicant status.
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|string'
        ]);

        $student = Student::findOrFail($id);
        $student->update(['status' => $request->status]);

        return response()->json(['success' => true, 'student' => $student]);
    }

    /**
     * Save interview marks and update status to ACCEPTED or REJECTED.
     */
    public function updateInterview(Request $request, $id)
    {
        $request->validate([
            'hafazan_mark' => 'required|integer|min:0|max:500',
            'tajwid_mark' => 'required|integer|min:0|max:500',
            'akhlaq_mark' => 'required|integer|min:0|max:500',
            'interview_type' => 'nullable|string',
            'status' => 'required|string',
            'notes' => 'nullable|string'
        ]);

        $student = Student::findOrFail($id);
        $student->update([
            'hafazan_mark' => $request->hafazan_mark,
            'tajwid_mark' => $request->tajwid_mark,
            'akhlaq_mark' => $request->akhlaq_mark,
            'interview_type' => $request->interview_type,
            'status' => $request->status,
            'notes' => $request->notes
        ]);

        return response()->json(['success' => true, 'student' => $student]);
    }

    /**
     * Generate a professional PDF offer letter for the applicant.
     */
    public function generateOfferLetter($id)
    {
        $applicant = Student::findOrFail($id);
        
        $data = [
            'applicantId' => $applicant->id,
            'applicantName' => $applicant->name,
            'parentName' => $applicant->parent_name,
            'gender' => $applicant->gender,
            'icNo' => $applicant->ic_no,
            'dateApplied' => $applicant->created_at->format('d/m/Y'),
            'marks' => [
                'hafazan' => $applicant->hafazan_mark,
                'tajwid' => $applicant->tajwid_mark,
                'akhlaq' => $applicant->akhlaq_mark,
                'average' => round(($applicant->hafazan_mark + $applicant->tajwid_mark + $applicant->akhlaq_mark) / 3)
            ]
        ];

        $pdf = Pdf::loadView('pdf.offer_letter', $data);
        
        return $pdf->download('Surat_Tawaran_' . str_replace(' ', '_', $applicant->name) . '.pdf');
    }

    /**
     * Handle the guest student enrollment process.
     * Creates both a Parent User and a Student record.
     */
    public function publicRegister(Request $request)
    {
        $validated = $request->validate([
            // Parent Data
            'parentName' => 'required|string|max:255',
            'parentEmail' => 'required|email|unique:users,email',
            'parentPhone' => 'required|string|max:20',
            'parentJob' => 'required|string',
            'parentIncome' => 'required|numeric',
            'password' => 'required|string|min:8',
            // Student Data
            'studentName' => 'required|string|max:255',
            'studentGender' => 'required|in:M,F',
            'studentDob' => 'required|date',
            'studentAge' => 'required|integer',
            'tajwidLevel' => 'nullable|string',
            'hafazanLevel' => 'nullable|string',
        ]);

        try {
            return DB::transaction(function () use ($validated) {
                // 1. Create Parent User
                $parent = User::create([
                    'name' => $validated['parentName'],
                    'email' => $validated['parentEmail'],
                    'password' => Hash::make($validated['password']),
                    'role' => 'parent',
                    'status' => 'pending', // Requires Mudir approval
                    'phone' => $validated['parentPhone'],
                    'job' => $validated['parentJob'],
                    'wage' => $validated['parentIncome'],
                ]);

                // 2. Create Student Record (Interview Phase)
                $student = Student::create([
                    'name' => $validated['studentName'],
                    'gender' => $validated['studentGender'] == 'M' ? 'Lelaki' : 'Perempuan',
                    'dob' => $validated['studentDob'],
                    'age' => $validated['studentAge'],
                    'parent_id' => $parent->id, // Link to User.id
                    'parent_name' => $validated['parentName'],
                    'parent_phone' => $validated['parentPhone'],
                    'admission_type' => 'interview',
                    'status' => 'PROSPECT', // Start as Prospect
                    'enrolled_date' => now()->format('Y-m-d'),
                    'intake_juzuk' => 0, // Guest students usually start at 0
                ]);

                // 3. Send Email berjaya didaftar, menunggu kelulusan mudir
                Mail::to($parent->email)->queue(new EnrollmentSuccessMail($parent, $student));

                return response()->json([
                    'success' => true,
                    'message' => 'Permohonan pendaftaran telah dihantar.',
                    'parent' => $parent->id,
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
