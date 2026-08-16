<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReportResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'            => $this->id,
            'reference_no'  => $this->reference_no,
            'title'         => $this->title,
            'description'   => $this->description,
            'incident_date' => $this->incident_date?->toDateString(),
            'location'      => $this->location,
            'is_anonymous'  => $this->is_anonymous,
            'risk_score'    => $this->risk_score,
            'priority'      => $this->priority,
            'status'        => $this->status,
            // Only expose submitter when not anonymous
            'submitted_by'  => $this->when(
                !$this->is_anonymous,
                new UserResource($this->whenLoaded('user'))
            ),
            'category'        => new CategoryResource($this->whenLoaded('category')),
            'evidence_count'  => $this->whenLoaded('evidenceFiles', fn () => $this->evidenceFiles->count()),
            'evidence_files'  => EvidenceResource::collection($this->whenLoaded('evidenceFiles')),
            'assignments'     => CaseAssignmentResource::collection($this->whenLoaded('caseAssignments')),
            'created_at'      => $this->created_at?->toISOString(),
            'updated_at'      => $this->updated_at?->toISOString(),
        ];
    }
}
