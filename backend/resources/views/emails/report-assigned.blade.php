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
        .detail-row { display: flex; margin-bottom: 10px; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px; }
        .detail-label { width: 120px; font-weight: bold; color: #64748b; }
        .detail-value { flex: 1; color: #0f172a; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Economic and Organised Crime Office</h1>
        </div>
        <div class="content">
            <h2>Case Assignment Notification</h2>
            <p>A new report has been assigned for investigation details are as follows:</p>
            
            <div class="detail-row">
                <div class="detail-label">Reference No:</div>
                <div class="detail-value">{{ $assignment->report->reference_no }}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Title:</div>
                <div class="detail-value">{{ $assignment->report->title }}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Priority:</div>
                <div class="detail-value">{{ strtoupper($assignment->report->priority) }}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Assigned Officer:</div>
                <div class="detail-value">{{ $assignment->officer->name }}</div>
            </div>

            <p>Please log into the portal to review the full details and initiate the investigation process.</p>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} Economic and Organised Crime Office (EOCO). All rights reserved.
        </div>
    </div>
</body>
</html>
