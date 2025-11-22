export const dynamic = "force-dynamic";
export const revalidate = 0;
import { createResponse } from "/utils/responseHelper";
import User from "/database/models/user";
import { generateRandomString, generateSecureToken } from "/utils/generateRandom";
import { EmailVerification } from "/utils/email/emailVerification";
import bcrypt from "bcrypt";
import { sendEmail } from "/utils/emailSender";

export async function POST(req) {
    try {
        const { first_name, last_name, email } = await req.json();

        if (!first_name || !last_name || !email) {
            return createResponse({
                error_code: "validation_error",
                message: "All fields are required.",
            }, 400);
        }


        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return createResponse({
                error_code: "email_exists",
                message: "Email already registered.",
            }, 409);
        }

        const plainPassword = generateRandomString(10);
        const hashedPassword = await bcrypt.hash(plainPassword, 10);
       const token = generateSecureToken({
            first_name: first_name,
            last_name: last_name,
            email: email
        });
       await User.create({
            first_name,
            last_name,
            email,
            phone: null,
            role:'user',
            password: hashedPassword,
            email_confirmed: 0,
            status: 1,
            token,
        });

        const htmlMessage = EmailVerification({
            first_name,
            last_name,
            email,
            password: plainPassword, // send only in email
            token,
        });

        const subject = `Verify your ${process.env.NEXT_PUBLIC_SITE_NAME} account`;
        await sendEmail({ to: email, subject, html: htmlMessage });

        return createResponse({
            message: "User successfully registered. Verification email sent.",
        }, 201);

    } catch (error) {
        console.error("Register API Error:", error);
        return createResponse({
            error_code: "server_error",
            message: error.message,
        }, 500);
    }
}
