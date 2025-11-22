import nodemailer from 'nodemailer';

/**
 * Sends an email using the provided SMTP configuration.
 * @param {Object} emailData - The email data.
 * @param {string} emailData.to - Recipient email address.
 * @param {string} [emailData.cc] - CC email address (optional).
 * @param {string} [emailData.bcc] - BCC email address (optional).
 * @param {string} emailData.subject - Email subject.
 * @param {string} emailData.html - Email content in HTML format.
 * @param {string} [emailData.replyTo] - Reply-to email address (optional).
 * @returns {Promise<Object>} - The result of the email sending operation.
 */
export async function sendEmail({ to, cc=false, bcc=false, subject, html, replyTo, attachments = [], }) {
    if (!to || !subject || !html) {
        throw new Error('To, subject, and html are required.');
    }

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.NEXT_PUBLIC_SMTP_HOST,
            port: parseInt(process.env.NEXT_PUBLIC_SMTP_PORT, 10),
            secure: process.env.NEXT_PUBLIC_SMTP_SECURE === 'true',
            auth: {
                user: process.env.NEXT_PUBLIC_SMTP_USER,
                pass: process.env.NEXT_PUBLIC_SMTP_PASS,
            },
        });

        const mailOptions = {
            from: `"${process.env.NEXT_PUBLIC_SITE_NAME}" <${process.env.NEXT_PUBLIC_SMTP_FROM_EMAIL}>`,
            to,
            ...(cc ? { cc } : {}),
            ...(bcc ? { bcc } : {}),
            subject,
            html,
            ...(replyTo ? { replyTo } : {}),
            ...(attachments?.length ? { attachments } : {}),
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: %s', info.messageId);
        return { success: true, message: 'Email sent successfully', info };

    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, message: 'Failed to send email', error: error.message, fullError: error };
    }
}