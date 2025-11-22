import { NextResponse } from "next/server";
import { ChatSession } from "/database/models";
import { authCheck } from "../../../utils/authCheck";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req) {
    const login_user = await authCheck(req);

    if (!login_user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rows = await ChatSession.findAll({
        where: { user_id: login_user.sub },
        order: [["updated_at", "DESC"]],
    });

    return NextResponse.json(rows, { status: 200 });
}

export async function POST(req) {
    const login_user = await authCheck(req);

    console.log(login_user);
console.log("api call");
    if (!login_user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const row = await ChatSession.create({
        title: "New Chat",
        user_id: login_user.sub,
    });

    return NextResponse.json(row, { status: 201 });
}
