<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f7f6; color: #333333; margin: 0; padding: 20px; }
        .container { max-width: 600px; background-color: #ffffff; margin: 0 auto; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); }
        .header { background-color: #1a3c5e; padding: 30px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 0.5px; }
        .content { padding: 30px; line-height: 1.6; }
        .footer { background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
        .status-badge { display: inline-block; padding: 6px 12px; background-color: #1e293b; color: #ffffff; border-radius: 20px; font-weight: bold; font-size: 14px; margin-top: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Economic and Organised Crime Office</h1>
        </div>
        <div class="content">
            <h2>Report Status Update</h2>
            <p>The status of your submitted report has been updated by the investigating officer.</p>
            
            <p><strong>Reference No:</strong> {{ $report->reference_no }}</p>
            <p><strong>Title:</strong> {{ $report->title }}</p>
            
            <p>New Status:</p>
            <div class="status-badge">{{ $newStatus->label() }}</div>

            <p>Please log in to the portal to track the progress or view any messages/requests from the officer.</p>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} Economic and Organised Crime Office (EOCO). All rights reserved.
        </div>
    </div>
</body>
</html>
