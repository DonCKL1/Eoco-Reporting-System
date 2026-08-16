<?php

namespace App\Http\Requests\Case;

use Illuminate\Foundation\Http\FormRequest;

class UpdateStatusRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'status' => [
                'required',
                new \Illuminate\Validation\Rules\Enum(\App\AppStatusEnum::class ?? \App\Enums\ReportStatusEnum::class),
            ],
            'note' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'status.in' => 'Invalid status value provided.',
        ];
    }
}
