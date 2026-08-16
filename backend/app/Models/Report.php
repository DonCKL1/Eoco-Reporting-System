<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Report extends Model
{
    use SoftDeletes, HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'reference_no',
        'user_id',
        'category_id',
        'title',
        'description',
        'incident_date',
        'location',
        'is_anonymous',
        'risk_score',
        'priority',
        'status',
    ];

    /**
     * Attribute casting.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'incident_date' => 'date',
            'is_anonymous'  => 'boolean',
            'risk_score'    => 'integer',
            'status'        => \App\Enums\ReportStatusEnum::class,
            'priority'      => \App\Enums\PriorityEnum::class,
        ];
    }

    // ─── Relationships ────────────────────────────────────────────────────────

    /**
     * The user who submitted this report (null for anonymous reports).
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * The category this report is classified under.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(ReportCategory::class, 'category_id');
    }

    /**
     * The anonymous token associated with this report (one-to-one).
     */
    public function anonymousToken(): HasOne
    {
        return $this->hasOne(AnonymousToken::class, 'report_id');
    }

    /**
     * Evidence files uploaded for this report.
     */
    public function evidenceFiles(): HasMany
    {
        return $this->hasMany(EvidenceFile::class, 'report_id');
    }

    /**
     * Officer assignments made for this report.
     */
    public function caseAssignments(): HasMany
    {
        return $this->hasMany(CaseAssignment::class, 'report_id');
    }

    /**
     * Audit trail of status changes for this report.
     */
    public function statusHistories(): HasMany
    {
        return $this->hasMany(CaseStatusHistory::class, 'report_id');
    }

    /**
     * Officer notes added to this report.
     */
    public function caseNotes(): HasMany
    {
        return $this->hasMany(CaseNote::class, 'report_id');
    }

    /**
     * Messages exchanged in the context of this report.
     */
    public function messages(): HasMany
    {
        return $this->hasMany(Message::class, 'report_id');
    }
}
