export function ForgotPassword(user) {
    const currentYear = new Date().getFullYear();
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                width: 100%;
                max-width: 600px;
                margin: 20px auto;
                background: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                text-align: center;
            }
            .header {
                background: #007bff;
                color: white;
                padding: 15px;
                font-size: 20px;
                border-radius: 8px 8px 0 0;
            }
            .content {
                padding: 20px;
                font-size: 16px;
                color: #333;
            }
            .code {
                font-size: 24px;
                font-weight: bold;
                color: #007bff;
                background: #f8f8f8;
                display: inline-block;
                padding: 10px 20px;
                border-radius: 5px;
                margin: 20px 0;
            }
            .footer {
                margin-top: 20px;
                font-size: 14px;
                color: #777;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                Forgot Password Request
            </div>
            <div class="content">
                <p>Hi <strong>${user.first_name}</strong>,</p>
                <p>We received a request to reset your password! Please use the following verification code to create the new password:</p>
                <div class="code">${user.code}</div>
                <p>If you didn’t request this, please ignore this email.</p>
            </div>
            <div class="footer">
                <p>© ${currentYear} ${process.env.NEXT_PUBLIC_SITE_NAME}. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
}
