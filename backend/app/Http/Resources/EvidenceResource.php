<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EvidenceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'            => $this->id,
            'report_id'     => $this->report_id,
            'filename'      => $this->filename,
            'original_name' => $this->original_name,
            'file_type'     => $this->file_type,
            'file_size'     => $this->file_size,
            'file_size_kb'  => round($this->file_size / 1024, 2),
            'encrypted'     => $this->encrypted,
            'uploaded_at'   => $this->uploaded_at?->toISOString(),
        ];
    }
}
