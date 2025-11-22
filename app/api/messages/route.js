import { NextResponse } from "next/server";
import { ChatSession, Message } from "/database/models";

export const runtime = "nodejs";       // Node, so Sequelize can use fs
export const dynamic = "force-dynamic";
export const revalidate = 0;

// ---------- Gemini (for replies) ----------
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-2.5-flash-lite";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`;

const CONTEXT = `You are  Assistant, a friendly and helpful chat buddy for the smart app.
Never reveal that you are AI, Gemini, or part of Google.
If asked who you are, say: "I'm Assistant here to chat with you!"
Be concise, friendly, and helpful.`;

// ---------- Helpers ----------
function normalizeAudioUrl(input) {
    if (!input) return null;
    if (typeof input === "string") return input;
    if (typeof input === "object") {
        const res0 = Array.isArray(input.results) ? input.results[0] : null;
        if (res0?.url) return res0.url;
        const url0 = Array.isArray(input.urls) ? input.urls[0] : null;
        if (url0) return url0;
        if (input.url) return input.url;
    }
    return null;
}

async function geminiReply(history, latestUserText) {
    if (!GEMINI_API_KEY) return "AI features are not configured right now.";

    const conversation = [];
    conversation.push({
        role: "user",
        parts: [{
            text:
                `SYSTEM CONTEXT:\n${CONTEXT}\n\nCONVERSATION STARTS:\n` +
                (history?.length
                    ? history.map(h => `${h.role.toUpperCase()}: ${h.text.replace(/\n/g, " ")}`).join("\n") + "\n"
                    : "") +
                `USER: ${latestUserText}`,
        }],
    });
    conversation.push({ role: "model", parts: [{ text: "Okay, understood. Let's chat!" }] });

    const payload = {
        contents: conversation,
        generationConfig: { maxOutputTokens: 200 },
        safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        ],
    };

    const r = await fetch(GEMINI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    const j = await r.json();

    if (!r.ok || j?.error) {
        console.error("Gemini reply error:", j?.error || j);
        return "Sorry, I hit a glitch. Could you try again?";
    }
    return j?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "Sorry, I’m not sure how to respond to that.";
}

async function getHistory(session_id, limit = 10) {
    const rows = await Message.findAll({
        where: { session_id },
        order: [["created_at", "DESC"]],
        limit,
        attributes: ["role", "content"],
    });
    return rows.reverse().map(r => ({ role: r.role, text: r.content || "" }));
}

// ---------- Routes ----------

// GET /api/messages?sessionId=...
export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");
    if (!sessionId) return NextResponse.json({ message: "sessionId required" }, { status: 400 });

    const rows = await Message.findAll({
        where: { session_id: sessionId },
        order: [["created_at", "ASC"]],
    });
    return NextResponse.json(rows, { status: 200 });
}

// POST /api/messages
// Body: { session_id: string, content?: string, audio_url?: string | {urls:[], results:[{url, mime}]}}
export async function POST(req) {
    try {
        const body = await req.json();
        const { content, audio_url: audioInput, session_id } = body || {};
        if (!session_id) {
            return NextResponse.json({ message: "session_id is required" }, { status: 400 });
        }

        // Ensure session exists
        const session = await ChatSession.findOne({ where: { id: session_id } });
        if (!session) return NextResponse.json({ message: "Session not found" }, { status: 404 });

        // Normalize upload response → plain URL
        const audioUrl = normalizeAudioUrl(audioInput); // string or null

        // ---- call Edge transcriber to keep Sequelize in Node ----
        let transcript = null;
        if (audioUrl) {
            // Compute base origin from current request
            const origin = new URL(req.url).origin; // e.g., http://localhost:3000
            const resp = await fetch(`${origin}/api/transcribe`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ audioUrl }),
            });
            if (resp.ok) {
                const data = await resp.json();
                transcript = (data?.text || "").trim() || null;
            } else {
                const errText = await resp.text();
                console.error("Transcribe route error:", resp.status, errText);
            }
        }

        // Final content policy:
        const finalContent = audioUrl
            ? (transcript?.trim() || "[Audio received — transcription unavailable]")
            : (content?.trim() || "");

        // Save user message
        const userMsg = await Message.create({
            session_id,
            role: "user",
            content: finalContent,
            audio_url: audioUrl || null,
            transcript: transcript || null,
        });

        // Touch session
        await ChatSession.update({ updated_at: new Date() }, { where: { id: session_id } });

        // Build history & get AI reply (from transcript if available)
        const history = await getHistory(session_id);
        const cueForAI = (transcript?.trim() || finalContent || "[audio message]");
        const aiText = await geminiReply(history, cueForAI);

        const aiMsg = await Message.create({
            session_id,
            role: "assistant",
            content: aiText,
        });

        return NextResponse.json({ user: userMsg, assistant: aiMsg }, { status: 201 });
    } catch (e) {
        console.error("POST /api/messages error:", e);
        return NextResponse.json({ message: e.message || "Server error" }, { status: 500 });
    }
}
