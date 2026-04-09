<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\HafazanRecordController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Student related
Route::get('/students', [StudentController::class, 'index']);
Route::get('/teacher/students', [StudentController::class, 'getTeacherStudents']);

// Hafazan Records
Route::get('/hafazan-records', [HafazanRecordController::class, 'index']);
Route::post('/hafazan-records', [HafazanRecordController::class, 'store']);
