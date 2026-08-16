<?php

namespace App\Http\Requests\Report;

use Illuminate\Foundation\Http\FormRequest;

class StoreReportRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'category_id'   => ['required', 'integer', 'exists:report_categories,id'],
            'title'         => ['required', 'string', 'max:255'],
            'description'   => ['required', 'string'],
            'incident_date' => ['nullable', 'date', 'before_or_equal:today'],
            'location'      => ['nullable', 'string', 'max:255'],
            'priority'      => ['nullable', new \Illuminate\Validation\Rules\Enum(\App\Enums\PriorityEnum::class)],
        ];
    }
}
