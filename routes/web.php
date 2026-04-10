<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\TeacherController;
use Illuminate\Support\Facades\Route;

// ─── Landing page ─────────────────────────────────────────────────────────────
Route::get('/', function () {
    return view('landing');
});

// ─── Legacy blade auth (kept for fallback) ────────────────────────────────────
Route::get('/login',    [AuthController::class, 'showLogin'])->name('login');
Route::post('/login',   [AuthController::class, 'login']);
Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
Route::post('/register',[AuthController::class, 'register']);
Route::post('/logout',  [AuthController::class, 'logout'])->name('logout');

// ─── JSON API routes for React SPA ───────────────────────────────────────────
Route::prefix('api')->group(function () {
    // CSRF cookie (call this before any POST from React)
    Route::get('/csrf-cookie', function () {
        return response()->json(['token' => csrf_token()]);
    });

    Route::post('/login',    [AuthController::class, 'apiLogin']);
    Route::post('/register', [AuthController::class, 'apiRegister']);
    Route::post('/logout',   [AuthController::class, 'apiLogout']);
    Route::get('/me',        [AuthController::class, 'me']);

    // Public Enrollment Flow
    Route::post('/public/register-enrollment', [\App\Http\Controllers\EnrollmentController::class, 'publicRegister']);
    Route::get('/enrollment/applicants', [\App\Http\Controllers\EnrollmentController::class, 'index']);
    Route::get('/enrollment/schedules', [\App\Http\Controllers\EnrollmentController::class, 'getInterviewSchedules']);
    Route::patch('/enrollment/status/{id}', [\App\Http\Controllers\EnrollmentController::class, 'updateStatus']);
    Route::post('/enrollment/schedule-interview/{id}', [\App\Http\Controllers\EnrollmentController::class, 'scheduleInterview']);
    Route::post('/enrollment/update-interview/{id}', [\App\Http\Controllers\EnrollmentController::class, 'updateInterview']);
    Route::post('/enrollment/parent-decide/{id}', [\App\Http\Controllers\EnrollmentController::class, 'parentDecide']);
    Route::get('/enrollment/offer-letter/{id}', [\App\Http\Controllers\EnrollmentController::class, 'generateOfferLetter']);
    Route::post('/enrollment/send-offer-email/{id}', [\App\Http\Controllers\EnrollmentController::class, 'sendOfferEmail']);

    Route::apiResource('teachers', TeacherController::class);
    Route::apiResource('classes', \App\Http\Controllers\ClassRoomController::class);
    Route::apiResource('students', \App\Http\Controllers\StudentController::class);
    Route::apiResource('payments', \App\Http\Controllers\PaymentController::class);
    Route::post('/attendance/bulk', [\App\Http\Controllers\AttendanceController::class, 'bulkStore']);
    Route::get('/attendance', [\App\Http\Controllers\AttendanceController::class, 'index']);
    Route::apiResource('hafazan-records', \App\Http\Controllers\HafazanRecordController::class);
});

// ─── Authenticated dashboard (blade fallback redirect) ────────────────────────
Route::get('/dashboard', function () {
    $user = auth()->user();
    if (!$user) return redirect('/');
    // Redirect to React SPA at the correct role path
    return redirect('/app/' . $user->role . '/dashboard');
})->middleware('auth')->name('dashboard');

// ─── React SPA — handles all /app/** routes ──────────────────────────────────
Route::get('/app/{any?}', function () {
    return view('app');
})->where('any', '.*')->name('spa');
