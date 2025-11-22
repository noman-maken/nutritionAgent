import jwt from "jsonwebtoken";
import User from "/database/models/user";
import { createResponse } from "/utils/responseHelper";
import {generateSecureToken} from "/utils/generateRandom";


export async function POST(req) {
    try {
        const { token } = await req.json();

        if (!token) {
            return createResponse({ message: "Missing token." }, 400);
        }

        // ✅ Decode token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.AUTH_SECRET);
        } catch (err) {
            return createResponse({ message: "Invalid or expired token." }, 400);
        }

        // ✅ Get email from decoded token
        const { email } = decoded;

        // ✅ Find user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return createResponse({ message: "User not found." }, 404);
        }

        if (user.email_confirmed) {
            return createResponse({ message: "Your email is already verified." }, 200);
        }

        // ✅ Verify user and refresh JWT token
        const newToken = generateSecureToken({
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
        });

        user.email_confirmed = 1;
        user.token = newToken;
        await user.save();

        return createResponse({
            message: "Your email has been successfully verified!",
        });
    } catch (error) {
        console.error("Email verification error:", error);
        return createResponse(
            {
                message: "Internal server error.",
            },
            500
        );
    }
}
