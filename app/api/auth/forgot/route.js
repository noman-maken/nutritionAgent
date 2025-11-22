import { NextResponse } from "next/server";
import { Op } from "sequelize";
import { User } from "/database/models";
import {generateSecureToken} from "../../../../utils/generateRandom";
import {ResetPasswordTemplate} from "../../../../utils/email/resetPasswordTemplate";
import {sendEmail} from "../../../../utils/emailSender";


export async function POST(request) {
    try {
        const { email } = await request.json();
        if (!email) {
            return NextResponse.json({ message: "Email is required" }, { status: 400 });
        }

        const user = await User.findOne({ where: { email: { [Op.eq]: email } } });
        // Return generic success regardless to avoid email enumeration
        if (!user) {
            return NextResponse.json({ message: "If an account exists, a reset email has been sent." }, { status: 200 });
        }

        const newToken = generateSecureToken({
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
        });

        await user.update({
            token: newToken,
        });

        const htmlMessage = ResetPasswordTemplate({ user, token:newToken })

        const subject = `Reset your password`;
        await sendEmail({ to: email, subject, html: htmlMessage });

        return NextResponse.json({ message: "If an account exists, a reset email has been sent." }, { status: 200 });
    } catch (e) {
        return NextResponse.json({ message: e.message || "Failed to process request." }, { status: 400 });
    }
}
