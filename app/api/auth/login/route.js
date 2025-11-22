import { User } from "/database/models";
import bcrypt from "bcrypt";
import { createResponse } from "/utils/responseHelper";

// --- in-memory rate limiter ---
const rateLimitStore = new Map();
function rateLimit(key, limit = 5, windowMs = 60_000) {
    const now = Date.now();
    const entry = rateLimitStore.get(key) || { count: 0, time: now };

    if (now - entry.time < windowMs) {
        if (entry.count >= limit) return false;
        entry.count++;
    } else {
        entry.count = 1;
        entry.time = now;
    }
    rateLimitStore.set(key, entry);
    return true;
}

// --- POST /api/auth/login ---
export async function POST(req) {
    try {
        const body = await req.json();
        const { email, password } = body || {};

        if (!email || !password) {
            return createResponse(
                { error_code: "user", message: "Email and password are required" },
                400
            );
        }

        const ip =
            req.headers.get("x-forwarded-for") ||
            req.headers.get("host") ||
            "unknown";
        const rateLimitKey = `login:${ip}:${email}`;
        if (!rateLimit(rateLimitKey)) {
            return createResponse(
                {
                    error_code: "rate_limit",
                    message: "Too many login attempts. Please try again later.",
                },
                429
            );
        }

        // lookup user
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return createResponse(
                { error_code: "user", message: "User not found" },
                404
            );
        }

        // check email verified
        if (!user.email_confirmed) {
            return createResponse(
                {
                    error_code: "email_unverified",
                    message: "Please verify your email before logging in.",
                },
                403
            );
        }

        // check role not disabled
        const roleValue = String(user.role || "").toLowerCase();
        if (roleValue === "disable" || roleValue === "disabled") {
            return createResponse(
                {
                    error_code: "role_disabled",
                    message: "Your account role is disabled. Contact admin.",
                },
                403
            );
        }

        // verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return createResponse(
                { error_code: "auth", message: "Invalid credentials" },
                401
            );
        }

        const { id, first_name, last_name, role } = user;
        return createResponse(
            {
                user: {
                    id,
                    name: `${first_name} ${last_name}`.trim(),
                    email,
                    role,
                },
            },
            200
        );
    } catch (error) {
        return createResponse(
            { error_code: "server_error", message: error.message },
            500
        );
    }
}
