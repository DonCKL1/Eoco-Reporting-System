<?php

namespace App\Services\Export;

use App\Models\Report;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ExportService
{
    /**
     * Export all visible reports as a PDF download.
     */
    public function exportPdf(): Response
    {
        $reports = Report::with(['category', 'user'])->latest()->get();
        $date    = now()->format('Y-m-d');

        $html = view('exports.reports-pdf', compact('reports', 'date'))->render();

        return Pdf::loadHTML($html)
            ->setPaper('a4', 'landscape')
            ->download("eoco-reports-{$date}.pdf");
    }

    /**
     * Export all visible reports as a CSV download (Excel-compatible).
     */
    public function exportCsv(): StreamedResponse
    {
        $filename = 'eoco-reports-' . now()->format('Y-m-d') . '.csv';
        $headers  = [
            'Content-Type'        => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        return response()->stream(function () {
            $handle = fopen('php://output', 'w');

            // CSV header row
            fputcsv($handle, [
                'Reference No', 'Title', 'Category', 'Status',
                'Priority', 'Location', 'Incident Date',
                'Is Anonymous', 'Submitted By', 'Created At',
            ]);

            Report::with(['category', 'user'])
                ->latest()
                ->chunk(200, function ($reports) use ($handle) {
                    foreach ($reports as $r) {
                        fputcsv($handle, [
                            $r->reference_no,
                            $r->title,
                            $r->category?->name,
                            $r->status,
                            $r->priority,
                            $r->location,
                            $r->incident_date?->toDateString(),
                            $r->is_anonymous ? 'Yes' : 'No',
                            $r->is_anonymous ? 'Anonymous' : ($r->user?->name ?? 'N/A'),
                            $r->created_at?->toDateTimeString(),
                        ]);
                    }
                });

            fclose($handle);
        }, 200, $headers);
    }
}
