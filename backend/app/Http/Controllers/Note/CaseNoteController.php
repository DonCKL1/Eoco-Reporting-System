<?php

namespace App\Http\Controllers\Note;

use App\Http\Controllers\Controller;
use App\Http\Requests\Note\StoreCaseNoteRequest;
use App\Http\Resources\CaseNoteResource;
use App\Models\CaseNote;
use App\Models\Report;
use App\Services\Note\CaseNoteService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;
use Throwable;

class CaseNoteController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly CaseNoteService $service) {}

    /** GET /api/reports/{report}/notes */
    public function index(Report $report): JsonResponse
    {
        Gate::authorize('view', $report);

        try {
            $notes = $this->service->getForReport($report);
            return $this->success(CaseNoteResource::collection($notes));
        } catch (Throwable $e) {
            return $this->error('Failed to load notes.', 500);
        }
    }

    /** POST /api/reports/{report}/notes */
    public function store(StoreCaseNoteRequest $request, Report $report): JsonResponse
    {
        Gate::authorize('view', $report);

        if (!auth()->user()->hasAnyRole(['Admin', 'Supervisor', 'Officer'])) {
            return $this->forbidden('Only officers can write case notes.');
        }

        try {
            $note = $this->service->addNote($report, auth()->user(), $request->note);
            return $this->created(new CaseNoteResource($note->load('officer')), 'Note added successfully.');
        } catch (Throwable $e) {
            return $this->error('Failed to add note.', 500);
        }
    }

    /** DELETE /api/notes/{note} */
    public function destroy(CaseNote $note): JsonResponse
    {
        $user = auth()->user();

        if (!$user->hasRole('Admin') && $note->officer_id !== $user->id) {
            return $this->forbidden('You can only delete your own notes.');
        }

        try {
            $this->service->deleteNote($note, $user);
            return $this->success(null, 'Note deleted successfully.');
        } catch (Throwable $e) {
            return $this->error('Failed to delete note.', 500);
        }
    }
}
