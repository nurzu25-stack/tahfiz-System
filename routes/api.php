<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\HafazanRecordController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\ClassRoomController;
use App\Http\Controllers\AIAssessmentController;
use App\Http\Controllers\AIController;

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

// AI Assessments
Route::apiResource('ai-assessments', AIAssessmentController::class);

// AI Predictions
Route::get('/ai-predictions/student/{studentId}', [AIController::class, 'getPrediction']);
Route::get('/ai-predictions/class/{classId}', [AIController::class, 'getClassPredictions']);
