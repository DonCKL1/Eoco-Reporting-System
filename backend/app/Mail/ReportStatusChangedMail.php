<?php

namespace App\Mail;

use App\Enums\ReportStatusEnum;
use App\Models\Report;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ReportStatusChangedMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly Report $report,
        public readonly ReportStatusEnum $newStatus,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "[EOCO] Report Update — {$this->report->reference_no}"
        );
    }

    public function content(): Content
    {
        return new Content(view: 'emails.report-status-changed');
    }
}
