<?php

namespace App\Http\Controllers\Export;

use App\Http\Controllers\Controller;
use App\Services\Export\ExportService;
use App\Traits\ApiResponse;
use Throwable;

class ExportController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly ExportService $service) {}

    /** GET /api/reports/export/pdf */
    public function exportPdf()
    {
        try {
            return $this->service->exportPdf();
        } catch (Throwable $e) {
            return $this->error('PDF export failed: ' . $e->getMessage(), 500);
        }
    }

    /** GET /api/reports/export/excel */
    public function exportExcel()
    {
        try {
            return $this->service->exportCsv();
        } catch (Throwable $e) {
            return $this->error('Excel export failed.', 500);
        }
    }
}
