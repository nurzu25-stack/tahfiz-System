<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\HafazanRecordController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\ClassRoomController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Student related
Route::apiResource('students', StudentController::class);
Route::get('/teacher/students', [StudentController::class, 'getTeacherStudents']);

// Classes
Route::apiResource('classes', ClassRoomController::class);

// Hafazan Records
Route::get('/hafazan-records', [HafazanRecordController::class, 'index']);
Route::post('/hafazan-records', [HafazanRecordController::class, 'store']);

// Teachers
Route::apiResource('teachers', TeacherController::class);
