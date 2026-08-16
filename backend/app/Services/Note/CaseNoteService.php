<?php

namespace App\Services\Note;

use App\Models\CaseNote;
use App\Models\Report;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use RuntimeException;

class CaseNoteService
{
    public function getForReport(Report $report): Collection
    {
        return $report->caseNotes()->with('officer')->latest()->get();
    }

    public function addNote(Report $report, User $officer, string $note): CaseNote
    {
        return CaseNote::create([
            'report_id'  => $report->id,
            'officer_id' => $officer->id,
            'note'       => $note,
        ]);
    }

    public function deleteNote(CaseNote $note, User $user): void
    {
        if (!$user->hasAnyRole(['Admin']) && $note->officer_id !== $user->id) {
            throw new RuntimeException('You can only delete your own notes.', 403);
        }
        $note->delete();
    }
}
