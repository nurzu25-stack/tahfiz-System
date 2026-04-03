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

    Route::apiResource('teachers', TeacherController::class);
    Route::apiResource('classes', \App\Http\Controllers\ClassRoomController::class);
    Route::apiResource('students', \App\Http\Controllers\StudentController::class);
    Route::apiResource('payments', \App\Http\Controllers\PaymentController::class);
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
