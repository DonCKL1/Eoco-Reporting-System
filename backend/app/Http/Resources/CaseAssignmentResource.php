<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CaseAssignmentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'report_id'   => $this->report_id,
            'officer'     => new UserResource($this->whenLoaded('officer')),
            'assigned_by' => new UserResource($this->whenLoaded('assigner')),
            'assigned_at' => $this->assigned_at?->toISOString(),
        ];
    }
}
