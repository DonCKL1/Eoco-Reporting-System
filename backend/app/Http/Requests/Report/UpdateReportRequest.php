<?php

namespace App\Http\Requests\Report;

use Illuminate\Foundation\Http\FormRequest;

class UpdateReportRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'category_id'   => ['sometimes', 'integer', 'exists:report_categories,id'],
            'title'         => ['sometimes', 'string', 'max:255'],
            'description'   => ['sometimes', 'string'],
            'incident_date' => ['nullable', 'date', 'before_or_equal:today'],
            'location'      => ['nullable', 'string', 'max:255'],
            'priority'      => ['nullable', new \Illuminate\Validation\Rules\Enum(\App\Enums\PriorityEnum::class)],
        ];
    }
}
