<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;

/**
 * Thrown when a user attempts to access a report they are not permitted to view or modify.
 */
class ReportNotAccessibleException extends Exception
{
    public function __construct(string $message = 'You do not have access to this report.')
    {
        parent::__construct($message, 403);
    }

    public function render(): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $this->getMessage(),
        ], 403);
    }
}
