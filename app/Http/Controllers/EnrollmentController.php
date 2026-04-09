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
     * Generate a professional PDF offer letter for the applicant.
     */
    public function generateOfferLetter($id)
    {
        // For now, since we're using mock data in frontend, we'll simulate the data 
        // Or if it's in DB, we fetch it. Looking at the context, it seems they are using 
        // real Student records linked to parent users.
        
        $applicant = Student::find($id);
        
        // If not found in DB (e.g. mock data from frontend), we'll use a fallback or handle error
        // But let's assume it exists in DB if ID is passed.
        
        $data = [
            'applicantId' => $id,
            'applicantName' => $applicant ? $applicant->name : 'Calon Terpilih',
            'parentName' => $applicant ? $applicant->parent_name : 'Penjaga Calon',
        ];

        $pdf = Pdf::loadView('pdf.offer_letter', $data);
        
        return $pdf->download('Surat_Tawaran_' . ($applicant ? str_replace(' ', '_', $applicant->name) : 'Calon') . '.pdf');
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
                    'gender' => $validated['studentGender'],
                    'dob' => $validated['studentDob'],
                    'age' => $validated['studentAge'],
                    'parent_id' => $parent->id, // Link to User.id
                    'parent_name' => $validated['parentName'],
                    'parent_phone' => $validated['parentPhone'],
                    'admission_type' => 'interview',
                    'status' => 'Pending', // As per user requirements
                    'enrolled_date' => now()->format('Y-m-d'),
                    'intake_juzuk' => 0, // Guest students usually start at 0
                ]);

                // 3. Send Email berjaya didaftar, menunggu kelulusan mudir
                Mail::to($parent->email)->send(new EnrollmentSuccessMail($parent, $student));

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
