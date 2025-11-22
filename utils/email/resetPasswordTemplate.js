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
      body { font-family: Arial, sans-serif; background:#f5f5f5; margin:0; padding:30px; }
      .card { max-width:600px; margin:0 auto; background:#fff; border-radius:8px; box-shadow:0 6px 20px rgba(0,0,0,.08); overflow:hidden; }
      .header { background:#f58220; color:#fff; padding:18px; font-size:20px; font-weight:bold; text-align:center; }
      .content { padding:24px; color:#333; line-height:1.6; }
      .btn { display:inline-block; background:#f58220; color:#fff !important; text-decoration:none !important; padding:12px 22px; border-radius:6px; font-weight:700; }
      .muted { color:#777; font-size:14px; }
      .footer { padding:16px 24px; background:#fafafa; text-align:center; color:#777; font-size:13px; }
      a { color:#f58220; text-decoration:none; }
      .break { word-break: break-word; }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="header">Reset your password</div>
      <div class="content">
        <p>Dear ${user?.first_name ? `<strong>${user.first_name}</strong>` : "there"},</p>
        <p>We received a request to reset your password for <strong>${site}</strong>.</p>
        <p>Click the button below to set a new password.</p>

        <p style="margin:20px 0;">
          <a class="btn" href="${resetLink}">Set New Password</a>
        </p>
        
        <p class="muted">If you didn’t request this, you can safely ignore this email.</p>

        <p style="margin-top:24px;">
          Regards,<br/>
          <strong>${site} Support Team</strong><br/>
          <a href="mailto:${process.env.NEXT_PUBLIC_SMTP_FROM_EMAIL}">${process.env.NEXT_PUBLIC_SMTP_FROM_EMAIL}</a>
        </p>
      </div>
      <div class="footer">© ${currentYear} ${site}. All rights reserved.</div>
    </div>
  </body>
  </html>
  `;
}
