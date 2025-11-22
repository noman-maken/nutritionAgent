export function EmailVerification(user, password) {
    const currentYear = new Date().getFullYear();
    const verifyLink = `${process.env.NEXT_PUBLIC_SITE_URL}/verify-email?token=${user.token}`;

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
                background-color: #F9FAFB; /* Matches login page bg */
                margin: 0;
                padding: 0;
            }
            .container {
                width: 100%;
                max-width: 600px;
                margin: 20px auto;
                background: #ffffff;
                padding: 20px;
                border-radius: 12px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
                text-align: center;
            }
            .header {
                background: #2563EB; /* Blue 600 */
                color: white;
                padding: 18px;
                font-size: 22px;
                border-radius: 12px 12px 0 0;
                font-weight: bold;
            }
            .content {
                padding: 20px;
                font-size: 16px;
                color: #333;
            }
            .info-box {
                background: #F3F4F6; /* gray-100 */
                padding: 12px 16px;
                margin: 12px 0;
                border-radius: 8px;
                text-align: left;
                font-size: 15px;
                border: 1px solid #E5E7EB; /* gray-200 */
            }
            .verify-button {
                display: inline-block;
                background: #2563EB; /* Blue 600 */
                color: #ffffff !important;
                text-decoration: none !important;
                padding: 12px 28px;
                font-size: 16px;
                font-weight: bold;
                border-radius: 8px;
                margin: 20px 0;
                transition: background 0.3s ease;
            }
            .verify-button:hover {
                background: #1D4ED8; /* Blue 700 */
            }
            .footer {
                margin-top: 20px;
                font-size: 14px;
                color: #6B7280; /* gray-500 */
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">Verify Your Email</div>

            <div class="content">
                <p>Dear <strong>${user.first_name} ${user.last_name}</strong>,</p>
                <p>Welcome to <strong>${process.env.NEXT_PUBLIC_SITE_NAME}</strong> 🎉</p>

                <p>Please verify your email address by clicking the button below:</p>
                
                <a href="${verifyLink}" class="verify-button">Verify Email</a>

                <p>Your login details:</p>
                <div class="info-box">
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>Temporary Password:</strong> ${user.password}</p>
                </div>

                <p>Once verified, you can log in and change your password anytime.</p>
            </div>

            <div class="footer">
                <p>© ${currentYear} ${process.env.NEXT_PUBLIC_SITE_NAME}. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
}
