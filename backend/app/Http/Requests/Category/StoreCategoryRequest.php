<?php

namespace App\Http\Requests\Category;

use Illuminate\Foundation\Http\FormRequest;

/**
 * StoreCategoryRequest
 *
 * Validates the incoming payload for creating a new report category.
 * Only authenticated users with the 'create categories' permission
 * may reach this form request — authorisation is handled at the route level.
 */
class StoreCategoryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     * Route-level middleware already enforces the permission, so we
     * simply return true here to keep authorisation in one place.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Validation rules for creating a category.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name'        => ['required', 'string', 'max:255', 'unique:report_categories,name'],
            'description' => ['nullable', 'string', 'max:1000'],
        ];
    }

    /**
     * Custom human-readable error messages.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'A category name is required.',
            'name.unique'   => 'A category with this name already exists.',
            'name.max'      => 'The category name must not exceed 255 characters.',
        ];
    }
}
