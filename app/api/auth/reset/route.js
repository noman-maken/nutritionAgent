import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { User } from "/database/models";
import {generateSecureToken} from "/utils/generateRandom";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    if (!token) return NextResponse.json({ valid: false, message: "Missing token" }, { status: 400 });

    try {
        const user = await User.findOne({
            where: {
                token: token,
            },
        });

        if (!user) {
            return NextResponse.json({ valid: false, message: "Invalid or expired token" }, { status: 400 });
        }

        return NextResponse.json({ valid: true }, { status: 200 });
    } catch (e) {
        return NextResponse.json({ valid: false, message: e.message }, { status: 400 });
    }
}

export async function POST(request) {
    try {
        const { token, password } = await request.json();
        if (!token || !password) {
            return NextResponse.json({ message: "Missing token or password" }, { status: 400 });
        }

        const user = await User.findOne({
            where: {
                token: token,
            },
        });

        if (!user) {
            return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newToken = generateSecureToken({
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
        });
        await user.update({
            password: hashedPassword,
            token: newToken,
        });

        return NextResponse.json({ message: "Password updated successfully" }, { status: 200 });
    } catch (e) {
        return NextResponse.json({ message: e.message }, { status: 400 });
    }
}
