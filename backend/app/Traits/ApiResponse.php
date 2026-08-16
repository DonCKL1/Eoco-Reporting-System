<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * ApiResponse
 *
 * Standardises all JSON responses across the application.
 * Every controller should use this trait instead of calling
 * response()->json() directly.
 */
trait ApiResponse
{
    /**
     * Successful response — single resource or scalar data.
     */
    protected function success(
        mixed $data = null,
        string $message = '',
        int $status = 200
    ): JsonResponse {
        $payload = ['success' => true];

        if ($message !== '') {
            $payload['message'] = $message;
        }

        if ($data !== null) {
            $payload['data'] = $data instanceof JsonResource
                ? $data->response()->getData(true)['data']
                : $data;
        }

        return response()->json($payload, $status);
    }

    /**
     * Successful response — paginated collection.
     */
    protected function paginated(
        ResourceCollection $collection,
        string $message = ''
    ): JsonResponse {
        $payload = ['success' => true];

        if ($message !== '') {
            $payload['message'] = $message;
        }

        // Merge data + pagination meta in a flat structure
        $payload = array_merge($payload, $collection->response()->getData(true));

        return response()->json($payload);
    }

    /**
     * Error response.
     */
    protected function error(
        string $message,
        int $status = 400,
        mixed $errors = null
    ): JsonResponse {
        $payload = ['success' => false, 'message' => $message];

        if ($errors !== null) {
            $payload['errors'] = $errors;
        }

        return response()->json($payload, $status);
    }

    /**
     * 201 Created response.
     */
    protected function created(mixed $data, string $message = 'Created successfully.'): JsonResponse
    {
        return $this->success($data, $message, 201);
    }

    /**
     * 403 Forbidden response.
     */
    protected function forbidden(string $message = 'Forbidden.'): JsonResponse
    {
        return $this->error($message, 403);
    }

    /**
     * 404 Not Found response.
     */
    protected function notFound(string $message = 'Resource not found.'): JsonResponse
    {
        return $this->error($message, 404);
    }
}
