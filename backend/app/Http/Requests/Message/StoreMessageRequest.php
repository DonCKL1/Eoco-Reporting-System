<?php

namespace App\Http\Requests\Message;

use Illuminate\Foundation\Http\FormRequest;

class StoreMessageRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    protected function prepareForValidation(): void
    {
        if ($this->has('body') && !$this->has('message')) {
            $this->merge(['message' => $this->input('body')]);
        }
    }

    public function rules(): array
    {
        return [
            'report_id'   => ['required', 'integer', 'exists:reports,id'],
            'receiver_id' => ['required', 'integer', 'exists:users,id'],
            'message'     => ['required', 'string', 'min:1', 'max:5000'],
        ];
    }
}
