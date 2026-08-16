<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Safe tracking resource — exposes only non-sensitive data for anonymous reporters.
 */
class AnonymousTrackResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'reference_no' => $this->reference_no,
            'status'       => $this->status,
            'priority'     => $this->priority,
            'category'     => $this->whenLoaded('category', fn () => $this->category->name),
            'created_at'   => $this->created_at?->toISOString(),
        ];
    }
}
