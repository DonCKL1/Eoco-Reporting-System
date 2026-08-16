<?php

namespace App\Http\Requests\Category;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * UpdateCategoryRequest
 *
 * Validates the incoming payload for updating an existing report category.
 * The unique rule ignores the category currently being updated so the
 * category can be saved with the same name without a false collision.
 */
class UpdateCategoryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     * Route-level middleware already enforces the permission.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Validation rules for updating a category.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        // Retrieve the {category} route parameter (resolved via model binding)
        $categoryId = $this->route('category')?->id;

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                // Ignore the current category's own name during uniqueness check
                Rule::unique('report_categories', 'name')->ignore($categoryId),
            ],
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
