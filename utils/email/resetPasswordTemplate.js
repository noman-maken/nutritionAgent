import baseUrl from "../baseUrl";

export function ResetPasswordTemplate({ user, token }) {
    const site = process.env.NEXT_PUBLIC_SITE_NAME;
    const siteUrl = baseUrl;
    const currentYear = new Date().getFullYear();
    const resetLink = `${siteUrl}/reset-password/${encodeURIComponent(token)}`;

    return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>Reset your password</title>
    <style>
      body { 
        font-family: Arial, sans-serif; 
        background:#F9FAFB; /* matches UI bg-gray-50 */
        margin:0; 
        padding:30px; 
      }
      .card { 
        max-width:600px; 
        margin:0 auto; 
        background:#fff; 
        border-radius:12px; 
        box-shadow:0 6px 20px rgba(0,0,0,.05); 
        overflow:hidden; 
      }
      .header { 
        background:#2563EB; /* blue-600 */
        color:#fff; 
        padding:18px; 
        font-size:22px; 
        font-weight:bold; 
        text-align:center; 
      }
      .content { 
        padding:26px; 
        color:#333; 
        line-height:1.6; 
        font-size:16px;
      }
      .btn { 
        display:inline-block; 
        background:#2563EB; /* blue-600 */
        color:#fff !important; 
        text-decoration:none !important; 
        padding:12px 26px; 
        border-radius:8px; 
        font-weight:700; 
        font-size:16px;
        transition: background 0.3s ease;
      }
      .btn:hover {
        background:#1D4ED8; /* blue-700 */
      }
      .muted { 
        color:#6B7280; /* gray-500 */
        font-size:14px; 
      }
      .footer { 
        padding:16px 24px; 
        background:#F3F4F6; /* gray-100 */
        text-align:center; 
        color:#6B7280; 
        font-size:13px; 
      }
      a { color:#2563EB; text-decoration:none; }
      .break { word-break: break-word; }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="header">Reset your password</div>
      <div class="content">
        <p>Dear ${user?.first_name ? `<strong>${user.first_name}</strong>` : "there"},</p>

        <p>We received a request to reset your password for <strong>${site}</strong>.</p>
        <p>Please click the button below to set a new password:</p>

        <p style="margin:24px 0; text-align:center;">
          <a class="btn" href="${resetLink}">Set New Password</a>
        </p>
        
        <p class="muted">If you didn’t request this, no worries — you can safely ignore this email.</p>

        <p style="margin-top:26px;">
          Regards,<br/>
          <strong>${site} Support Team</strong><br/>
          <a href="mailto:${process.env.NEXT_PUBLIC_SMTP_FROM_EMAIL}">
            ${process.env.NEXT_PUBLIC_SMTP_FROM_EMAIL}
          </a>
        </p>
      </div>

      <div class="footer">
        © ${currentYear} ${site}. All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `;
}
