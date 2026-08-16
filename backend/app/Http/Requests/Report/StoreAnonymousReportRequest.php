<?php

namespace App\Http\Requests\Report;

use Illuminate\Foundation\Http\FormRequest;

class StoreAnonymousReportRequest extends FormRequest
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
        ];
    }

    public function messages(): array
    {
        return [
            'category_id.required' => 'Please select a crime category.',
            'title.required'       => 'A brief title for the report is required.',
            'description.required' => 'Please describe the incident.',
        ];
    }
}
