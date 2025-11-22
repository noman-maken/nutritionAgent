import { NextResponse } from "next/server";
import { ChatSession, Message } from "/database/models";
import { NUTRITION_CONTEXT } from "../../../utils/nutritionContext";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

// ---------- Gemini ----------
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-2.5-flash-lite";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`;

// ---------- Audio Normalizer ----------
function normalizeAudioUrl(input) {
    if (!input) return null;
    if (typeof input === "string") return input;

    if (typeof input === "object") {
        const r0 = Array.isArray(input.results) ? input.results[0] : null;
        if (r0?.url) return r0.url;

        const u0 = Array.isArray(input.urls) ? input.urls[0] : null;
        if (u0) return u0;

        if (input.url) return input.url;
    }
    return null;
}

// ---------- Fetch last N messages ----------
async function getHistory(session_id) {
    const rows = await Message.findAll({
        where: { session_id },
        order: [["created_at", "DESC"]],
        attributes: ["role", "content"],
    });

    return rows.reverse().map(r => ({
        role: r.role,
        text: r.content || "",
    }));
}

// ---------- Gemini Logic ----------
async function geminiReply(history, userText) {
    if (!GEMINI_API_KEY) return "AI is not configured right now.";

    const systemMessage = `
SYSTEM INSTRUCTIONS:
${NUTRITION_CONTEXT}

RECENT CONVERSATION (last 15 messages):
${history.map(h => `${h.role}: ${h.text}`).join("\n")}

USER NOW SAYS:
${userText}
`;

    const payload = {
        contents: [
            {
                role: "user",
                parts: [{ text: systemMessage }],
            },
        ],
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

    if (!r.ok || j.error) {
        console.error("Gemini error:", j.error || j);
        return "Sorry, I hit a glitch. Try again.";
    }

    return (
        j?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
        "Sorry, I’m not sure how to respond to that."
    );
}

// ---------- ROUTES ----------

// GET old messages
export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
        return NextResponse.json({ message: "sessionId required" }, { status: 400 });
    }

    const rows = await Message.findAll({
        where: { session_id: sessionId },
        order: [["created_at", "ASC"]],
    });

    return NextResponse.json(rows, { status: 200 });
}

// POST new message
export async function POST(req) {
    try {
        const body = await req.json();
        const { content, audio_url: audioInput, session_id } = body || {};

        if (!session_id) {
            return NextResponse.json({ message: "session_id is required" }, { status: 400 });
        }

        const session = await ChatSession.findOne({ where: { id: session_id } });
        if (!session) {
            return NextResponse.json({ message: "Session not found" }, { status: 404 });
        }

        const audioUrl = normalizeAudioUrl(audioInput);

        // ---------- Transcribe audio ----------
        let transcript = null;
        if (audioUrl) {
            const origin = new URL(req.url).origin;
            const resp = await fetch(`${origin}/api/transcribe`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ audioUrl }),
            });

            if (resp.ok) {
                const data = await resp.json();
                transcript = data?.text?.trim() || null;
            } else {
                console.error("Transcription error:", await resp.text());
            }
        }

        const finalContent = audioUrl
            ? transcript || "[Audio received — transcription unavailable]"
            : (content?.trim() || "");

        // Save user message
        const userMsg = await Message.create({
            session_id,
            role: "user",
            content: finalContent,
            audio_url: audioUrl || null,
            transcript: transcript || null,
        });

        // Update session timestamp
        await ChatSession.update(
            { updated_at: new Date() },
            { where: { id: session_id } }
        );

        // ---------- AI REPLY ----------
        const history = await getHistory(session_id);
        const aiText = await geminiReply(history, finalContent);

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
