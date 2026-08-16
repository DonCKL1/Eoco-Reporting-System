<?php

namespace App\Http\Requests\Case;

use Illuminate\Foundation\Http\FormRequest;

class AssignCaseRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'officer_id' => ['required', 'integer', 'exists:users,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'officer_id.required' => 'Please select an officer to assign.',
            'officer_id.exists'   => 'The selected officer does not exist.',
        ];
    }
}
