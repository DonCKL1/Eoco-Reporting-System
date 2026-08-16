<?php

namespace App\Events;

use App\Models\EvidenceFile;
use App\Models\User;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class EvidenceUploaded
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public readonly EvidenceFile $evidence,
        public readonly User $uploadedBy,
    ) {}
}
