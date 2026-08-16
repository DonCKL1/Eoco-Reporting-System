<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;

/**
 * Thrown when a case assignment operation violates a business rule
 * (e.g. duplicate assignment, assigning to a non-Officer user).
 */
class AssignmentException extends Exception
{
    public function __construct(string $message = 'Assignment operation failed.', int $code = 422)
    {
        parent::__construct($message, $code);
    }

    public function render(): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $this->getMessage(),
        ], $this->getCode() ?: 422);
    }
}
