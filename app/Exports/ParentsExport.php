<?php

namespace App\Exports;

use App\Models\ParentProfile;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class ParentsExport implements FromCollection, WithHeadings, WithMapping
{
    public function collection()
    {
        return ParentProfile::all();
    }

    public function headings(): array
    {
        return [
            'ID',
            'Nama Penuh',
            'No IC',
            'No Telefon',
            'Pekerjaan',
            'Pendapatan (RM)',
            'Alamat',
            'Hubungan',
            'Bilangan Anak',
        ];
    }

    public function map($parent): array
    {
        return [
            $parent->id,
            $parent->user->full_name ?? $parent->user->name ?? 'N/A',
            $parent->ic_no,
            $parent->phone,
            $parent->occupation,
            $parent->income,
            $parent->address,
            $parent->relationship_type,
            $parent->students()->count(),
        ];
    }
}
