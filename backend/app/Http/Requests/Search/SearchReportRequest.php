<?php

namespace App\Http\Requests\Search;

use Illuminate\Foundation\Http\FormRequest;

class SearchReportRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'q'            => ['nullable', 'string', 'max:255'],
            'reference_no' => ['nullable', 'string'],
            'category_id'  => ['nullable', 'integer', 'exists:report_categories,id'],
            'status'       => ['nullable', new \Illuminate\Validation\Rules\Enum(\App\Enums\ReportStatusEnum::class)],
            'priority'     => ['nullable', new \Illuminate\Validation\Rules\Enum(\App\Enums\PriorityEnum::class)],
            'date_from'    => ['nullable', 'date'],
            'date_to'      => ['nullable', 'date', 'after_or_equal:date_from'],
            'per_page'     => ['nullable', 'integer', 'min:5', 'max:100'],
        ];
    }
}
