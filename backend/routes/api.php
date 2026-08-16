<?php

use App\Http\Controllers\ActivityLog\ActivityLogController;
use App\Http\Controllers\Analytics\AnalyticsController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Case\CaseAssignmentController;
use App\Http\Controllers\Case\CaseStatusController;
use App\Http\Controllers\Category\CategoryController;
use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\Evidence\EvidenceController;
use App\Http\Controllers\Export\ExportController;
use App\Http\Controllers\File\FileController;
use App\Http\Controllers\Message\MessageController;
use App\Http\Controllers\Note\CaseNoteController;
use App\Http\Controllers\Notification\NotificationController;
use App\Http\Controllers\Report\AnonymousReportController;
use App\Http\Controllers\Report\ReportController;
use App\Http\Controllers\Role\PermissionController;
use App\Http\Controllers\Role\RoleController;
use App\Http\Controllers\Search\SearchController;
use App\Http\Controllers\User\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// ─── Public Endpoints (no auth required) ──────────────────────────────────────

Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:auth');
Route::post('/login',    [AuthController::class, 'login'])->middleware('throttle:auth');

// Module 2: Anonymous Reporting
Route::post('/anonymous-reports',  [AnonymousReportController::class, 'store'])->middleware('throttle:anonymous');
Route::get('/track/{token}',       [AnonymousReportController::class, 'track'])->middleware('throttle:anonymous');

// Public read categories
Route::get('/categories', [CategoryController::class, 'index']);

// Public read wanted persons
Route::get('/wanted-persons', [\App\Http\Controllers\WantedPersonController::class, 'index']);

// Secure temporary signed download (signature handles access control)
Route::get('/evidence/{evidence}/download', [FileController::class, 'download'])
    ->name('evidence.download')
    ->middleware('signed');

// ═════════════════════════════════════════════════════════════════════════════
//  Authenticated Endpoints (Sanctum + Active User verification)
// ═════════════════════════════════════════════════════════════════════════════

Route::middleware(['auth:sanctum', 'active.user', 'throttle:api'])->group(function () {

    // Auth profile actions
    Route::get('/me',              [AuthController::class, 'me']);
    Route::put('/me',              [AuthController::class, 'updateProfile']);
    Route::post('/logout',         [AuthController::class, 'logout']);
    Route::put('/change-password', [AuthController::class, 'changePassword']);

    // ── Categories (admin write) ──────────────────────────────────────────────
    Route::post('/categories', [CategoryController::class, 'store'])
        ->middleware('permission:create categories');
    Route::put('/categories/{category}', [CategoryController::class, 'update'])
        ->middleware('permission:edit categories');
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy'])
        ->middleware('permission:delete categories');

    // ── Exports (view all reports permission) ─────────────────────────────────
    Route::get('/reports/export/pdf',   [ExportController::class, 'exportPdf'])
        ->middleware('permission:view all reports');
    Route::get('/reports/export/excel', [ExportController::class, 'exportExcel'])
        ->middleware('permission:view all reports');

    // ── Reports (CRUD) ────────────────────────────────────────────────────────
    Route::get('/reports', [ReportController::class, 'index']);
    
    Route::post('/reports', [ReportController::class, 'store'])
        ->middleware('permission:create report');

    Route::middleware(['report.owner', 'officer.assigned'])->group(function () {
        Route::get('/reports/{report}',     [ReportController::class, 'show']);
        Route::put('/reports/{report}',     [ReportController::class, 'update']);
        Route::delete('/reports/{report}',  [ReportController::class, 'destroy'])
            ->middleware('permission:delete reports');

        // ── Evidence ──────────────────────────────────────────────────────────
        Route::post('/reports/{report}/evidence', [EvidenceController::class, 'store'])
            ->middleware(['permission:upload evidence', 'throttle:uploads']);
        Route::get('/reports/{report}/evidence',  [EvidenceController::class, 'index'])
            ->middleware('permission:view evidence');

        // ── Status Management ──────────────────────────────────────────────────
        Route::patch('/reports/{report}/status',  [CaseStatusController::class, 'update'])
            ->middleware('permission:update report status');
        Route::get('/reports/{report}/history',   [CaseStatusController::class, 'history']);

        // ── Case Notes ────────────────────────────────────────────────────────
        Route::get('/reports/{report}/notes',     [CaseNoteController::class, 'index']);
        Route::post('/reports/{report}/notes',    [CaseNoteController::class, 'store']);

        // ── Message details per Report ────────────────────────────────────────
        Route::get('/messages/{report}',          [MessageController::class, 'byReport'])
            ->middleware('permission:view messages');
    });

    // Generate signed download URL for evidence
    Route::get('/evidence/{evidence}/download-url', [EvidenceController::class, 'getDownloadUrl'])
        ->middleware('permission:view evidence');

    Route::delete('/evidence/{evidence}', [EvidenceController::class, 'destroy'])
        ->middleware('permission:delete evidence');

    // ── Case Assignment (Supervisors / Admins) ────────────────────────────────
    Route::post('/reports/{report}/assign', [CaseAssignmentController::class, 'assign'])
        ->middleware('permission:assign reports');
    Route::get('/assigned-reports',         [CaseAssignmentController::class, 'assignedReports']);

    // ── Case Notes Delete ─────────────────────────────────────────────────────
    Route::delete('/notes/{note}', [CaseNoteController::class, 'destroy']);

    // ── Messaging (General) ───────────────────────────────────────────────────
    Route::post('/messages', [MessageController::class, 'store'])
        ->middleware('permission:send messages');
    Route::get('/messages',  [MessageController::class, 'index'])
        ->middleware('permission:view messages');

    // ── Notifications ─────────────────────────────────────────────────────────
    Route::get('/notifications',                       [NotificationController::class, 'index'])
        ->middleware('permission:view notifications');
    Route::patch('/notifications/{notification}/read', [NotificationController::class, 'markRead'])
        ->middleware('permission:view notifications');

    // ── Activity Logs (Admin only) ────────────────────────────────────────────
    Route::get('/activity-logs', [ActivityLogController::class, 'index'])
        ->middleware('permission:view activity logs');

    // ── Analytics & Dashboard ─────────────────────────────────────────────────
    Route::prefix('dashboard')->middleware('permission:view analytics')->group(function () {
        Route::get('/stats',               [AnalyticsController::class, 'stats']);
        Route::get('/reports-by-category', [AnalyticsController::class, 'reportsByCategory']);
        Route::get('/status-summary',      [AnalyticsController::class, 'statusSummary']);
    });

    // ── User Management (Admin only) ──────────────────────────────────────────
    Route::get('/users',         [UserController::class, 'index'])
        ->middleware('permission:view users');
    Route::post('/users',        [UserController::class, 'store'])
        ->middleware('permission:create users');
    Route::put('/users/{user}',  [UserController::class, 'update'])
        ->middleware('permission:edit users');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])
        ->middleware('permission:delete users');

    // ── Wanted Persons (Admin only) ──────────────────────────────────────────
    Route::get('/admin/wanted-persons', [\App\Http\Controllers\WantedPersonController::class, 'adminIndex'])
        ->middleware('permission:view users');
    Route::post('/admin/wanted-persons', [\App\Http\Controllers\WantedPersonController::class, 'store'])
        ->middleware('permission:create users');
    Route::put('/admin/wanted-persons/{wantedPerson}', [\App\Http\Controllers\WantedPersonController::class, 'update'])
        ->middleware('permission:edit users');
    Route::delete('/admin/wanted-persons/{wantedPerson}', [\App\Http\Controllers\WantedPersonController::class, 'destroy'])
        ->middleware('permission:delete users');

    // ── Roles & Permissions (Admin only) ──────────────────────────────────────
    Route::get('/roles',         [RoleController::class, 'index'])
        ->middleware('permission:manage roles');
    Route::post('/roles',        [RoleController::class, 'store'])
        ->middleware('permission:manage roles');
    
    Route::get('/permissions',   [PermissionController::class, 'index'])
        ->middleware('permission:manage permissions');

    // ── Search ────────────────────────────────────────────────────────────────
    Route::get('/search/reports', [SearchController::class, 'reports']);

    // ── Admin Dashboard ───────────────────────────────────────────────────────
    Route::get('/dashboard', [DashboardController::class, 'index']);
});