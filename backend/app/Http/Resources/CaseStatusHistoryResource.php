<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CaseStatusHistoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'report_id'  => $this->report_id,
            'old_status' => $this->old_status,
            'new_status' => $this->new_status,
            'changed_by' => new UserResource($this->whenLoaded('changedBy')),
            'changed_at' => $this->changed_at?->toISOString(),
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
