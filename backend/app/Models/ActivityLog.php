<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActivityLog extends Model
{
    /**
     * The table associated with the model.
     * Explicitly set to avoid conflict with Spatie's 'activity_log' table.
     *
     * @var string
     */
    protected $table = 'activity_logs';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'action',
        'ip_address',
        'user_agent',
    ];

    // ─── Relationships ────────────────────────────────────────────────────────

    /**
     * The user who triggered this activity (null for system/guest actions).
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
