// app/api/transcribe/route.js
import { NextResponse } from "next/server";
import { env, pipeline } from "@xenova/transformers";

export const runtime = "edge";
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Use WASM backend (no native .node) and disable browser cache (Edge doesn't have it)
env.backends.onnx.wasm.wasmPaths = "https://cdn.jsdelivr.net/npm/@xenova/transformers/dist/";
env.allowRemoteModels = true;
env.useBrowserCache = false;     // <-- important: fix "Browser cache is not available" error

// Optional: if you want to reduce initial download size and you're English-only:
const MODEL_ID = "Xenova/whisper-tiny.en"; // or "Xenova/whisper-tiny", "whisper-base", etc.

let asrPipelinePromise;
async function getWhisper() {
    if (!asrPipelinePromise) {
        asrPipelinePromise = pipeline("automatic-speech-recognition", MODEL_ID);
    }
    return asrPipelinePromise;
}

export async function POST(req) {
    try {
        const { audioUrl } = await req.json();
        if (!audioUrl) {
            return NextResponse.json({ error: "audioUrl required" }, { status: 400 });
        }

        const asr = await getWhisper();

        // You can tune these if clips get longer:
        // const options = { chunk_length_s: 30, stride_length_s: 5 };
        const out = await asr(audioUrl /*, options */);

        const text = (out?.text || "").trim();
        return NextResponse.json({ text }, { status: 200 });
    } catch (e) {
        console.error("Transcribe error:", e);
        return NextResponse.json({ error: "Transcription failed" }, { status: 500 });
    }
}
