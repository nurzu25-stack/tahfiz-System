<?php

namespace App\Imports;

use App\Models\AlumniRecord;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Carbon\Carbon;

class AlumniImport implements ToModel, WithHeadingRow
{
    public function model(array $row)
    {
        // Skip header or empty rows
        if (empty($row['no_mykad']) && empty($row['nama'])) {
            return null;
        }

        $startDate = $this->parseDate($row['tarikh_mula'] ?? null);
        $khatamDate = $this->parseDate($row['tarikh_khatam'] ?? null);
        
        $duration = 0;
        if ($startDate && $khatamDate) {
            $duration = $startDate->diffInDays($khatamDate);
        }

        return new AlumniRecord([
            'name'          => $row['nama'] ?? ($row['nama_pelajar'] ?? 'N/A'),
            'start_date'    => $startDate ? $startDate->format('Y-m-d') : null,
            'khatam_date'   => $khatamDate ? $khatamDate->format('Y-m-d') : null,
            'murabbi_name'  => $row['murabbi'] ?? null,
            'matric_no'     => $row['no_matrik'] ?? null,
            'ic_no'         => $row['no_mykad'] ?? null,
            'address'       => $row['alamat_surat_menyurat'] ?? null,
            'duration_days' => $duration,
        ]);
    }

    private function parseDate($value)
    {
        if (!$value) return null;
        try {
            if (is_numeric($value)) {
                return Carbon::instance(\PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject($value));
            }
            return Carbon::parse($value);
        } catch (\Exception $e) {
            return null;
        }
    }
}
