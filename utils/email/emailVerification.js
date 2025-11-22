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
                background: #f58220;
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
            .info-box {
                background: #f8f8f8;
                padding: 10px 15px;
                margin: 10px 0;
                border-radius: 6px;
                display: inline-block;
                text-align: left;
                font-size: 15px;
            }
            .verify-button {
                    display: inline-block;
                    background: #f58220;
                    color: #ffffff !important;
                    text-decoration: none !important;
                    padding: 12px 25px;
                    font-size: 16px;
                    font-weight: bold;
                    border-radius: 6px;
                    margin: 20px 0;
                    transition: background 0.3s ease;
               }
            .verify-button:hover {
                background: #f58220;
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
                Verify Your Email
            </div>
            <div class="content">
                <p>Dear <strong>${user.first_name} ${user.last_name}</strong>,</p>
                <p>Welcome to <strong>${process.env.NEXT_PUBLIC_SITE_NAME}</strong> 🎉</p>
                <p>Please verify your email address by clicking the button below:</p>
                
                <a href="${verifyLink}" class="verify-button">Verify Email</a>

                <p>Here are your login details for reference:</p>
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
