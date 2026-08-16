<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        \App\Models\Report::observe(\App\Observers\ReportObserver::class);
        \App\Models\User::observe(\App\Observers\UserObserver::class);

        // Register policies manually since naming conventions differ from model names
        \Illuminate\Support\Facades\Gate::policy(\App\Models\EvidenceFile::class, \App\Policies\EvidencePolicy::class);
        \Illuminate\Support\Facades\Gate::policy(\App\Models\CaseAssignment::class, \App\Policies\AssignmentPolicy::class);

        // Domain Event Listener Registrations
        \Illuminate\Support\Facades\Event::listen(
            \App\Events\ReportCreated::class,
            \App\Listeners\CreateInitialStatusHistory::class
        );
        \Illuminate\Support\Facades\Event::listen(
            \App\Events\ReportCreated::class,
            \App\Listeners\LogReportCreation::class
        );
        \Illuminate\Support\Facades\Event::listen(
            \App\Events\ReportAssigned::class,
            \App\Listeners\SendAssignmentNotifications::class
        );
        \Illuminate\Support\Facades\Event::listen(
            \App\Events\ReportStatusChanged::class,
            \App\Listeners\HandleStatusChange::class
        );
        \Illuminate\Support\Facades\Event::listen(
            \App\Events\EvidenceUploaded::class,
            \App\Listeners\LogEvidenceUpload::class
        );
        \Illuminate\Support\Facades\Event::listen(
            \App\Events\MessageSent::class,
            \App\Listeners\SendMessageNotification::class
        );
        // Rate Limiters Configuration
        \Illuminate\Support\Facades\RateLimiter::for('api', function (\Illuminate\Http\Request $request) {
            return \Illuminate\Cache\RateLimiting\Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });
        \Illuminate\Support\Facades\RateLimiter::for('auth', function (\Illuminate\Http\Request $request) {
            return \Illuminate\Cache\RateLimiting\Limit::perMinute(5)->by($request->ip());
        });
        \Illuminate\Support\Facades\RateLimiter::for('uploads', function (\Illuminate\Http\Request $request) {
            return \Illuminate\Cache\RateLimiting\Limit::perMinute(10)->by($request->user()?->id ?: $request->ip());
        });
        \Illuminate\Support\Facades\RateLimiter::for('anonymous', function (\Illuminate\Http\Request $request) {
            return \Illuminate\Cache\RateLimiting\Limit::perMinute(5)->by($request->ip());
        });
    }
}
