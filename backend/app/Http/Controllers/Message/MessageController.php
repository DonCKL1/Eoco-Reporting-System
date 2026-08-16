<?php

namespace App\Http\Controllers\Message;

use App\Http\Controllers\Controller;
use App\Http\Requests\Message\StoreMessageRequest;
use App\Http\Resources\MessageResource;
use App\Models\Report;
use App\Services\Message\MessageService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Throwable;

class MessageController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly MessageService $service) {}

    /** GET /api/messages */
    public function index(): JsonResponse
    {
        $this->authorize('create', \App\Models\Message::class);

        try {
            $messages = $this->service->getForUser(auth()->user());
            return $this->paginated(MessageResource::collection($messages));
        } catch (Throwable $e) {
            return $this->error('Failed to load messages.', 500);
        }
    }

    /** GET /api/messages/{report} */
    public function byReport(Report $report): JsonResponse
    {
        // Must have access to view report to view messages about it
        $this->authorize('view', $report);

        try {
            $messages = $this->service->getForReport($report, auth()->user());
            return $this->paginated(MessageResource::collection($messages));
        } catch (Throwable $e) {
            return $this->error('Failed to load messages.', 500);
        }
    }

    /** POST /api/messages */
    public function store(StoreMessageRequest $request): JsonResponse
    {
        $this->authorize('create', \App\Models\Message::class);

        try {
            $message = $this->service->send(auth()->user(), $request->validated());
            return $this->created(new MessageResource($message), 'Message sent successfully.');
        } catch (Throwable $e) {
            return $this->error('Failed to send message.', 500);
        }
    }
}
