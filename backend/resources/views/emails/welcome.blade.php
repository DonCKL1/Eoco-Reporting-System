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
        .btn { display: inline-block; padding: 12px 24px; margin-top: 20px; background-color: #1a3c5e; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Economic and Organised Crime Office</h1>
        </div>
        <div class="content">
            <h2>Welcome, {{ $user->name }}</h2>
            <p>Your account on the EOCO Citizen Crime Reporting Portal has been successfully registered.</p>
            <p>You can now log in to submit and track reports securely and confidentially.</p>
            <p>If you did not register for this account, please contact EOCO support immediately.</p>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} Economic and Organised Crime Office (EOCO). All rights reserved.
        </div>
    </div>
</body>
</html>
