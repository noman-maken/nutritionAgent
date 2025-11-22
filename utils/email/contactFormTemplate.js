export function ContactFormTemplate({ name, email, phone, subject, message }) {
    const currentYear = new Date().getFullYear();

    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>New Contact Message</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f5f5f5;
              margin: 0;
              padding: 0;
          }
          .container {
              max-width: 600px;
              margin: 30px auto;
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 4px 15px rgba(0,0,0,0.1);
              overflow: hidden;
          }
          .header {
              background-color: #f58220;
              color: #fff;
              padding: 18px;
              text-align: center;
              font-size: 20px;
              font-weight: bold;
          }
          .content {
              padding: 25px;
              color: #333;
              line-height: 1.6;
          }
          .content h2 {
              margin-top: 0;
              color: #f58220;
              font-size: 22px;
          }
          .info-box {
              background: #f8f8f8;
              border-radius: 6px;
              padding: 15px 20px;
              margin: 15px 0;
          }
          .info-box p {
              margin: 5px 0;
              font-size: 15px;
              color: #444;
          }
          .footer {
              background: #f9f9f9;
              text-align: center;
              padding: 15px;
              font-size: 14px;
              color: #777;
          }
          a {
              color: #f58220;
              text-decoration: none;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              New Contact Message
          </div>
          <div class="content">
              <p style="font-size:16px; margin-top:0; color:#333;">
                  A new contact inquiry has been submitted through 
                  <strong>${process.env.NEXT_PUBLIC_SITE_NAME}</strong>.
              </p>

              <h2>Contact Details</h2>
              <div class="info-box">
                  <p><strong>Name:</strong> ${name}</p>
                  <p><strong>Email:</strong> ${email}</p>
                  <p><strong>Phone:</strong> ${phone}</p>
                  <p><strong>Subject:</strong> ${subject}</p>
              </div>

              <h2>Message</h2>
              <p style="background:#f8f8f8;padding:15px;border-radius:6px;">
                  ${message}
              </p>

              <p style="margin-top: 25px;">
                  Regards,<br/>
                  <strong>${process.env.NEXT_PUBLIC_SITE_NAME} Support Team</strong><br/>
                  <a href="mailto:${process.env.NEXT_PUBLIC_SMTP_FROM_EMAIL}">
                    ${process.env.NEXT_PUBLIC_SMTP_FROM_EMAIL}
                  </a>
               </p>
          </div>
          <div class="footer">
              <p>© ${currentYear} ${process.env.NEXT_PUBLIC_SITE_NAME}. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
  `;
}
