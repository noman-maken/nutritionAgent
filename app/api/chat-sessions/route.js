import { NextResponse } from "next/server";
import { ChatSession } from "/database/models";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
    const rows = await ChatSession.findAll({
        order: [["updated_at", "DESC"]],
    });
    return NextResponse.json(rows, { status: 200 });
}

export async function POST() {
    const row = await ChatSession.create({ title: "New Chat" });
    return NextResponse.json(row, { status: 201 });
}
