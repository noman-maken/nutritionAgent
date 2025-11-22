import { getToken } from "next-auth/jwt";
import { createResponse } from "./responseHelper";

export async function authCheck(req) {
    try {
        const secret = process.env.AUTH_SECRET;

        if (!secret) {
            return createResponse(
                {
                    error_code: "config_error",
                    message: "AUTH_SECRET is not defined in environment variables",
                },
                500
            );
        }

        const session = await getToken({ req, secret });

        if (!session) {
            return createResponse(
                {
                    error_code: "unauthorized",
                    message: "Unauthorized User",
                },
                401
            );
        }

        return session;
    } catch (error) {
        console.error("Auth check failed:", error);

        return createResponse(
            {
                error_code: "auth_error",
                message: "An error occurred while checking authentication",
                details: error.message,
            },
            500
        );
    }
}
