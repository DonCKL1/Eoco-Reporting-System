<?php

namespace App\Mail;

use App\Models\CaseAssignment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ReportAssignedMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(public readonly CaseAssignment $assignment) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "[EOCO] Case Assigned — {$this->assignment->report->reference_no}"
        );
    }

    public function content(): Content
    {
        return new Content(view: 'emails.report-assigned');
    }
}
