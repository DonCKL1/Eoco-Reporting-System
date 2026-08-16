<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        $userId = $this->route('user')?->id;

        return [
            'name'     => ['sometimes', 'string', 'max:255'],
            'email'    => ['sometimes', 'email', Rule::unique('users', 'email')->ignore($userId)],
            'password' => ['nullable', 'confirmed', Password::min(8)->mixedCase()->numbers()],
            'phone'    => ['nullable', 'string', 'max:20'],
            'status'   => ['nullable', new \Illuminate\Validation\Rules\Enum(\App\Enums\UserStatusEnum::class)],
            'role'     => ['nullable', 'string', 'exists:roles,name'],
        ];
    }
}
