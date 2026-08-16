<?php

namespace App\Events;

use App\Enums\ReportStatusEnum;
use App\Models\Report;
use App\Models\User;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ReportStatusChanged
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public readonly Report $report,
        public readonly ReportStatusEnum $oldStatus,
        public readonly ReportStatusEnum $newStatus,
        public readonly User $changedBy,
    ) {}
}
