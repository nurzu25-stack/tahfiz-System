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
    Route::get('/ai-predictions/class/{classId}', [\App\Http\Controllers\AIPredictionController::class, 'getByClass']);
    Route::post('/ai-predictions/generate/class/{classId}', [\App\Http\Controllers\AIPredictionController::class, 'generateClass']);
    Route::get('/profile', [\App\Http\Controllers\ProfileController::class, 'show']);
    Route::post('/profile', [\App\Http\Controllers\ProfileController::class, 'update']);
    Route::get('/parent/children', [\App\Http\Controllers\ParentController::class, 'getChildren']);
    Route::get('/notifications', [\App\Http\Controllers\NotificationController::class, 'index']);
    Route::post('/notifications/mark-all-read', [\App\Http\Controllers\NotificationController::class, 'markAllAsRead']);
    Route::apiResource('notifications', \App\Http\Controllers\NotificationController::class)->only(['update', 'destroy']);
    Route::get('/ai-predictions/student/{studentId}', [\App\Http\Controllers\AIPredictionController::class, 'getByStudent']);
    
    // User management
    Route::get('/users/pending', [\App\Http\Controllers\UserController::class, 'pendingUsers']);
    Route::post('/users/{id}/approve', [\App\Http\Controllers\UserController::class, 'approveUser']);
    Route::post('/users/{id}/reject', [\App\Http\Controllers\UserController::class, 'rejectUser']);
    Route::get('/users/students-no-account', [\App\Http\Controllers\UserController::class, 'studentsWithoutAccounts']);
    Route::post('/users/student-account', [\App\Http\Controllers\UserController::class, 'createStudentAccount']);
    Route::get('/students/leaderboard/{classId}', [\App\Http\Controllers\StudentController::class, 'leaderboard']);
    Route::apiResource('achievements', \App\Http\Controllers\AchievementController::class);
    Route::get('/achievements/student/{studentId}', [\App\Http\Controllers\AchievementController::class, 'index']);
    Route::get('/students/dashboard/{id}', [\App\Http\Controllers\StudentController::class, 'dashboard']);
    Route::get('/students/targets/{studentId}', [\App\Http\Controllers\StudentReportController::class, 'getHafazanTargets']);
    Route::apiResource('ai-assessments', \App\Http\Controllers\AIAssessmentController::class);
    Route::apiResource('hostels', \App\Http\Controllers\HostelController::class);
    Route::post('/hostels/assign', [\App\Http\Controllers\HostelController::class, 'assignStudent']);
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
