import {sendEmail} from "./emailSender";

export async function sendEmailAsync(sendEmailData) {
    try {
        // Send the email using the sendEmail function
        await sendEmail(sendEmailData);
    } catch (emailError) {
        // Log any error that occurs during the email sending process
        console.error('Error sending email:', emailError);
    }
}
