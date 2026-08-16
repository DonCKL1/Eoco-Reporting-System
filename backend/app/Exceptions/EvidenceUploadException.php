<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;

/**
 * Thrown when an evidence file upload fails validation or storage.
 */
class EvidenceUploadException extends Exception
{
    public function __construct(string $message = 'Evidence upload failed.', int $code = 422)
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
