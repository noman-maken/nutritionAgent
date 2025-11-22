import { NextResponse } from "next/server";
import { ChatSession } from "/database/models";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function PATCH(_req, { params }) {
    const { id } = params;
    const body = await _req.json();
    const { title } = body || {};

    if (!id) return NextResponse.json({ message: "id required" }, { status: 400 });

    await ChatSession.update(
        { title, updated_at: new Date() },
        { where: { id } }
    );

    const updated = await ChatSession.findOne({ where: { id } });
    return NextResponse.json(updated, { status: 200 });
}
