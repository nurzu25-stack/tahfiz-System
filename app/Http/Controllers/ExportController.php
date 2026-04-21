<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Exports\StudentsExport;
use App\Exports\TeachersExport;
use App\Exports\ParentsExport;
use Maatwebsite\Excel\Facades\Excel;

class ExportController extends Controller
{
    public function exportStudents()
    {
        return Excel::download(new StudentsExport, 'senarai_pelajar_' . now()->format('Ymd_His') . '.xlsx');
    }

    public function exportTeachers()
    {
        return Excel::download(new TeachersExport, 'senarai_murabbi_' . now()->format('Ymd_His') . '.xlsx');
    }

    public function exportParents()
    {
        return Excel::download(new ParentsExport, 'senarai_ibu_bapa_' . now()->format('Ymd_His') . '.xlsx');
    }
}
