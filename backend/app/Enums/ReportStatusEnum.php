<?php

namespace App\Enums;

enum ReportStatusEnum: string
{
    case Submitted        = 'submitted';
    case UnderReview      = 'under_review';
    case Assigned         = 'assigned';
    case Investigating    = 'investigating';
    case AwaitingEvidence = 'awaiting_evidence';
    case Resolved         = 'resolved';
    case Closed           = 'closed';

    /** Human-readable label. */
    public function label(): string
    {
        return match($this) {
            self::Submitted        => 'Submitted',
            self::UnderReview      => 'Under Review',
            self::Assigned         => 'Assigned',
            self::Investigating    => 'Investigating',
            self::AwaitingEvidence => 'Awaiting Evidence',
            self::Resolved         => 'Resolved',
            self::Closed           => 'Closed',
        };
    }

    /**
     * Valid next states from this status.
     *
     * @return self[]
     */
    public function allowedTransitions(): array
    {
        return match($this) {
            self::Submitted        => [self::UnderReview, self::Closed],
            self::UnderReview      => [self::Assigned, self::AwaitingEvidence, self::Closed],
            self::Assigned         => [self::Investigating, self::AwaitingEvidence, self::Closed],
            self::Investigating    => [self::AwaitingEvidence, self::Resolved, self::Closed],
            self::AwaitingEvidence => [self::Investigating, self::Resolved, self::Closed],
            self::Resolved         => [self::Closed],
            self::Closed           => [],
        };
    }

    /** Whether transitioning to $target is permitted. */
    public function canTransitionTo(self $target): bool
    {
        return in_array($target, $this->allowedTransitions(), true);
    }

    /** Is this a terminal state? */
    public function isTerminal(): bool
    {
        return $this === self::Closed;
    }

    /** All possible values as a plain array (for validation rules). */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
