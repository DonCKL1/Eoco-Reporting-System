<?php

namespace App\Exceptions;

use App\Enums\ReportStatusEnum;
use Exception;
use Illuminate\Http\JsonResponse;

/**
 * Thrown when an attempted status transition violates the transition matrix.
 */
class InvalidStatusTransitionException extends Exception
{
    public function __construct(
        private readonly ReportStatusEnum $from,
        private readonly ReportStatusEnum $to,
    ) {
        parent::__construct(
            "Cannot transition report status from '{$from->label()}' to '{$to->label()}'.",
            422
        );
    }

    public function render(): JsonResponse
    {
        return response()->json([
            'success'      => false,
            'message'      => $this->getMessage(),
            'current_status' => $this->from->value,
            'attempted_status' => $this->to->value,
            'allowed_transitions' => array_column($this->from->allowedTransitions(), 'value'),
        ], 422);
    }
}
