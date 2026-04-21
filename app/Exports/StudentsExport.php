<?php

namespace App\Exports;

use App\Models\Student;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class StudentsExport implements FromCollection, WithHeadings, WithMapping
{
    public function collection()
    {
        return Student::with(['classRoom', 'primaryTeacher', 'parent'])->get();
    }

    public function headings(): array
    {
        return [
            'ID',
            'Nama Penuh',
            'No IC',
            'No Matrik',
            'Kelas',
            'Murabbi',
            'Juzuk Hafal',
            'Status',
            'Tarikh Daftar',
            'Jantina',
            'No Telefon',
            'Latar Belakang Pendidikan',
            'Sejarah Kesihatan',
            'Nama Kecemasan',
            'No Tel Kecemasan',
            'Nama Ibu Bapa/Penjaga',
            'Pendapatan Keluarga',
        ];
    }

    public function map($student): array
    {
        return [
            $student->id,
            $student->name,
            $student->ic_no,
            $student->matric_no,
            $student->classRoom->name ?? 'Tiada Kelas',
            $student->primaryTeacher->name ?? 'Tiada Murabbi',
            $student->juzuk_completed,
            $student->status,
            $student->enrolled_date,
            $student->gender == 'M' ? 'Lelaki' : 'Perempuan',
            $student->phone,
            $student->education_background,
            $student->medical_history,
            $student->emergency_contact_name,
            $student->emergency_contact_phone,
            $student->parent->name ?? 'Tiada Data',
            $student->family_income,
        ];
    }
}
