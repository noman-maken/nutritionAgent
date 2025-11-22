"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Mic, Square, PanelLeft, Smile, Check, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Sidebar from "@/components/Sidebar";
import uploadFile from "@/utils/upload_file";

// ===== WhatsApp visual tokens =====
const WHATSAPP_GREEN = "#1f2937"; // header bg
const WHATSAPP_GREEN_DARK = "#075E54"; // mic bg
const OUTGOING_BG = "#DCF8C6"; // my messages
const INCOMING_BG = "#FFFFFF"; // other messages

// ===== Helpers =====
const formatTime = (ts) => {
    const d = ts ? new Date(ts) : new Date();
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const isSameDay = (a, b) => {
    const da = new Date(a), db = new Date(b);
    return (
        da.getFullYear() === db.getFullYear() &&
        da.getMonth() === db.getMonth() &&
        da.getDate() === db.getDate()
    );
};

const dayLabel = (date) => {
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (isSameDay(d, today)) return "Today";
    if (isSameDay(d, yesterday)) return "Yesterday";
    return d.toLocaleDateString();
};

// ===== Message Bubble =====
function MessageBubble({ message, isMine }) {
    const time = message.created_at || Date.now();
    const status = message.status || "sent";

    return (
        <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
            <div className="relative max-w-[82%]">
                {/* Bubble */}
                <div
                    className={`rounded-2xl px-3 py-2 shadow-sm text-[15px] leading-snug break-words ${
                        isMine ? "" : "border border-gray-200"
                    }`}
                    style={{ backgroundColor: isMine ? OUTGOING_BG : INCOMING_BG }}
                >
                    {message.content && <p className="whitespace-pre-wrap">{message.content}</p>}

                    {message.audio_url && (
                        <audio controls src={message.audio_url} className="mt-2 w-full max-w-xs" />
                    )}

                    <div className="mt-1 flex items-center gap-1 justify-end text-[11px] text-gray-500">
                        <span>{formatTime(time)}</span>
                        {isMine && (
                            status === "read" ? (
                                <CheckCheck className="h-4 w-4 text-sky-500" />
                            ) : status === "delivered" ? (
                                <CheckCheck className="h-4 w-4" />
                            ) : (
                                <Check className="h-4 w-4" />
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ===== Date Separator =====
function DateSeparator({ label }) {
    return (
        <div className="flex justify-center">
            <div className="text-xs text-gray-600 bg-white/80 border border-gray-200 rounded-full px-3 py-1 shadow-sm">
                {label}
            </div>
        </div>
    );
}

export default function ChatInterface() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [chatSessions, setChatSessions] = useState([]);
    const [currentSessionId, setCurrentSessionId] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showScrollBtn, setShowScrollBtn] = useState(false);
    const messagesEndRef = useRef(null);
    const scrollerRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    useEffect(() => {
        loadChatSessions();
    }, []);

    useEffect(() => {
        if (currentSessionId) loadMessages(currentSessionId);
    }, [currentSessionId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const loadChatSessions = async () => {
        const res = await fetch("/api/chat-sessions", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        setChatSessions(data);
        if (data.length > 0 && !currentSessionId) setCurrentSessionId(data[0].id);
    };

    const loadMessages = async (sessionId) => {
        const res = await fetch(`/api/messages?sessionId=${sessionId}`, { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        setMessages(data);
    };

    const createNewChat = async () => {
        const res = await fetch("/api/chat-sessions", { method: "POST" });
        if (!res.ok) return;
        const data = await res.json();
        setChatSessions((prev) => [data, ...prev]);
        setCurrentSessionId(data.id);
        setMessages([]);
        setInput("");
    };

    const updateSessionTitle = async (sessionId, firstMessage) => {
        const title = firstMessage.length > 50 ? firstMessage.substring(0, 50) + "..." : firstMessage;
        await fetch(`/api/chat-sessions/${sessionId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title }),
        });
        setChatSessions((prev) =>
            prev
                .map((s) => (s.id === sessionId ? { ...s, title, updated_at: new Date().toISOString() } : s))
                .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
        );
    };

    const sendMessage = async (content, audioUrl = null) => {
        if (!content.trim() && !audioUrl) return;

        let sessionId = currentSessionId;
        if (!sessionId) {
            const res = await fetch("/api/chat-sessions", { method: "POST" });
            const newSession = res.ok ? await res.json() : null;
            if (newSession) {
                sessionId = newSession.id;
                setCurrentSessionId(sessionId);
                setChatSessions((prev) => [newSession, ...prev]);
            }
        }

        setIsLoading(true);

        const tempUser = {
            id: `temp-${Date.now()}`,
            role: "user",
            content: content.trim() || (audioUrl ? "Audio message" : ""),
            audio_url: audioUrl,
            session_id: sessionId,
            created_at: Date.now(),
            status: "sent",
        };
        setMessages((prev) => [...prev, tempUser]);

        if (messages.length === 0) await updateSessionTitle(sessionId, tempUser.content);

        const res = await fetch("/api/messages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ session_id: sessionId, content: content.trim(), audio_url: audioUrl || null }),
        });

        if (res.ok) {
            const { user, assistant } = await res.json();
            setMessages((prev) => {
                const withoutTemp = prev.filter((m) => m.id !== tempUser.id);
                return [...withoutTemp, user, assistant];
            });
        }

        setInput("");
        setIsLoading(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage(input);
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorder.onstop = async () => {
                try {
                    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
                    const file = new File([audioBlob], `recording-${Date.now()}.webm`, { type: "audio/webm" });
                    const uploadRes = await uploadFile("chat_audio", file);
                    const audioUrl = Array.isArray(uploadRes)
                        ? uploadRes[0]?.url || uploadRes[0]
                        : uploadRes?.url || uploadRes;

                    await sendMessage(`Audio message (${new Date().toLocaleTimeString()})`, audioUrl);

                    stream.getTracks().forEach((t) => t.stop());
                } catch (err) {
                    console.error("Upload error:", err);
                    alert("Failed to upload or send audio.");
                }
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (error) {
            console.error("Mic error:", error);
            alert("Could not access microphone.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const Header = (
        <header
            className="px-4 py-2 flex items-center gap-3 shadow-sm"
            style={{ backgroundColor: WHATSAPP_GREEN, color: "white" }}
        >
            <Button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                size="icon"
                variant="ghost"
                className="lg:hidden text-white hover:opacity-90"
            >
                <PanelLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-white/20 grid place-items-center text-xs font-semibold">
                    NA
                </div>
                <div>
                    <div className="text-sm font-medium leading-tight">Nutrition Agent</div>
                    <div className="text-[11px] text-white/80 -mt-0.5">online</div>
                </div>
            </div>
        </header>
    );

    // @ts-ignore
    const wallpaper = (
        <div
            className="absolute inset-0 -z-10"
            style={{
                backgroundColor: "#ECE5DD",
            }}
        />
    );

    return (
        <div className="flex h-screen">
            <Sidebar
                chatSessions={chatSessions}
                currentSessionId={currentSessionId}
                onSelectSession={setCurrentSessionId}
                onNewChat={createNewChat}
                isOpen={isSidebarOpen}
                onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            />

            <div className="flex flex-col flex-1 h-screen relative">
                {Header}
                {wallpaper}

                <div ref={scrollerRef} className="flex-1 overflow-y-auto px-3 py-4">
                    <div className="max-w-3xl mx-auto space-y-2">
                        {messages.map((msg, idx) => {
                            const prev = messages[idx - 1];
                            const needDate = !prev || !isSameDay(prev.created_at || Date.now(), msg.created_at || Date.now());
                            const isMine = msg.role === "user";
                            return (
                                <div key={msg.id || `${msg.role}-${idx}-${Math.random()}`} className="space-y-2">
                                    {needDate && <DateSeparator label={dayLabel(msg.created_at || Date.now())} />}
                                    <MessageBubble message={msg} isMine={isMine} />
                                </div>
                            );
                        })}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-200 rounded-2xl px-3 py-2">
                                    <div className="flex items-end gap-1">
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:120ms]"></span>
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:240ms]"></span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>
                </div>

                <div className="px-3 py-2" style={{ backgroundColor: "#F0F2F5" }}>
                    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
                        <div className="flex items-end gap-2">
                            <div className="flex-1">
                                <Textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Type a message"
                                    className="resize-none min-h-[44px] max-h-[180px] rounded-2xl bg-white border border-gray-200 px-3 py-2"
                                    disabled={isLoading || isRecording}
                                />
                            </div>


                                <Button type="submit" size="icon" disabled={isLoading} className="h-11 w-11 rounded-full flex-shrink-0" style={{ backgroundColor: WHATSAPP_GREEN, color: "white" }}>
                                    <Send className="h-5 w-5" />
                                </Button>


                            {/*{isRecording ? (*/}
                            {/*    <Button type="button" onClick={stopRecording} size="icon" className="h-11 w-11 rounded-full bg-red-600 hover:bg-red-700 flex-shrink-0">*/}
                            {/*        <Square className="h-5 w-5" />*/}
                            {/*    </Button>*/}
                            {/*) : input.trim() ? (*/}
                            {/*    <Button type="submit" size="icon" disabled={isLoading} className="h-11 w-11 rounded-full flex-shrink-0" style={{ backgroundColor: WHATSAPP_GREEN, color: "white" }}>*/}
                            {/*        <Send className="h-5 w-5" />*/}
                            {/*    </Button>*/}
                            {/*) : (*/}
                            {/*    <Button type="button" onClick={startRecording} size="icon" disabled={isLoading} className="h-11 w-11 rounded-full flex-shrink-0 hover:opacity-90" style={{ backgroundColor: WHATSAPP_GREEN_DARK, color: "white" }}>*/}
                            {/*        <Mic className="h-5 w-5" />*/}
                            {/*    </Button>*/}
                            {/*)}*/}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}