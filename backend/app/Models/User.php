<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'status',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
            'status'            => \App\Enums\UserStatusEnum::class,
        ];
    }

    // ─── Relationships ────────────────────────────────────────────────────────

    /**
     * Reports submitted by this user (non-anonymous reports).
     */
    public function reports(): HasMany
    {
        return $this->hasMany(Report::class, 'user_id');
    }

    /**
     * Cases assigned to this user as an investigating officer.
     */
    public function assignedCases(): HasMany
    {
        return $this->hasMany(CaseAssignment::class, 'officer_id');
    }

    /**
     * Assignments this user has made (as a supervisor/admin).
     */
    public function madeAssignments(): HasMany
    {
        return $this->hasMany(CaseAssignment::class, 'assigned_by');
    }

    /**
     * Status history records where this user made the change.
     */
    public function statusChanges(): HasMany
    {
        return $this->hasMany(CaseStatusHistory::class, 'changed_by');
    }

    /**
     * Notes written by this user on various cases.
     */
    public function caseNotes(): HasMany
    {
        return $this->hasMany(CaseNote::class, 'officer_id');
    }

    /**
     * Messages sent by this user.
     */
    public function sentMessages(): HasMany
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    /**
     * Messages received by this user.
     */
    public function receivedMessages(): HasMany
    {
        return $this->hasMany(Message::class, 'receiver_id');
    }

    /**
     * In-app notifications belonging to this user.
     */
    public function appNotifications(): HasMany
    {
        return $this->hasMany(Notification::class, 'user_id');
    }

    /**
     * Activity log records attributed to this user.
     */
    public function activityLogs(): HasMany
    {
        return $this->hasMany(ActivityLog::class, 'user_id');
    }
}
