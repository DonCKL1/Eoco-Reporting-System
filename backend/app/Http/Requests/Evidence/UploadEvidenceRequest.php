<?php

namespace App\Http\Requests\Evidence;

use Illuminate\Foundation\Http\FormRequest;

class UploadEvidenceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'file' => [
                'required',
                'file',
                'max:51200', // 50MB
                'mimes:jpg,jpeg,png,pdf,docx,mp4',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'file.required' => 'Please select a file to upload.',
            'file.mimes'    => 'Allowed file types: JPG, PNG, PDF, DOCX, MP4.',
            'file.max'      => 'File size must not exceed 50MB.',
        ];
    }
}
