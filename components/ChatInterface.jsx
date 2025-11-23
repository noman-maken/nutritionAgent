"use client";

import { useState, useEffect, useRef } from "react";
import { Send, PanelLeft, Check, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Sidebar from "/components/Sidebar";
import ReactMarkdown from "react-markdown";

// Themes
const HEADER_GRADIENT =
    "bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600";

const OUTGOING =
    "bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200";
const INCOMING =
    "bg-white border border-gray-200";

// Helpers
const isSameDay = (a, b) => {
    const da = new Date(a), db = new Date(b);
    return (
        da.getDate() === db.getDate() &&
        da.getMonth() === db.getMonth() &&
        da.getYear() === db.getYear()
    );
};

const dayLabel = (d) => {
    const date = new Date(d);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (isSameDay(date, today)) return "Today";
    if (isSameDay(date, yesterday)) return "Yesterday";
    return date.toLocaleDateString();
};

// Message Bubble
function MessageBubble({ message, isMine }) {
    const time = message.created_at || Date.now();
    const status = message.status || "sent";

    return (
        <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
            <div className="max-w-[78%]">
                <div
                    className={`rounded-2xl px-4 py-2 shadow-sm backdrop-blur-sm transition-all ${
                        isMine ? OUTGOING : INCOMING
                    }`}
                >
                    {/* Markdown-rendered message */}
                    {message.content && (
                        <ReactMarkdown
                            components={{
                                p: ({ children }) => (
                                    <p className="text-[15px] leading-relaxed text-slate-700 whitespace-pre-wrap">
                                        {children}
                                    </p>
                                ),
                                strong: ({ children }) => (
                                    <strong className="font-semibold">{children}</strong>
                                ),
                                em: ({ children }) => <em className="italic">{children}</em>,
                                ul: ({ children }) => (
                                    <ul className="list-disc ml-5 text-[15px] leading-relaxed text-slate-700">
                                        {children}
                                    </ul>
                                ),
                                li: ({ children }) => <li className="mb-1">{children}</li>,
                            }}
                        >
                            {message.content}
                        </ReactMarkdown>
                    )}

                    {/* Timestamp */}
                    <div className="mt-1 flex items-center gap-1 justify-end text-[11px] text-gray-500">
            <span>
              {new Date(time).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
              })}
            </span>

                        {/* Status checks */}
                        {isMine &&
                            (status === "read" ? (
                                <CheckCheck className="h-4 w-4 text-sky-500" />
                            ) : status === "delivered" ? (
                                <CheckCheck className="h-4 w-4" />
                            ) : (
                                <Check className="h-4 w-4" />
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Date Label
function DateSeparator({ label }) {
    return (
        <div className="flex justify-center my-3">
      <span className="text-xs text-gray-600 bg-white/70 px-3 py-1 rounded-full border border-gray-300 shadow-sm backdrop-blur-md">
        {label}
      </span>
        </div>
    );
}

// MAIN COMPONENT
export default function ChatInterface() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [chatSessions, setChatSessions] = useState([]);
    const [currentSessionId, setCurrentSessionId] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const messagesEndRef = useRef(null);

    // Load chat sessions
    useEffect(() => {
        loadChatSessions();
    }, []);

    // Load messages when session changes
    useEffect(() => {
        if (currentSessionId) loadMessages(currentSessionId);
    }, [currentSessionId]);

    // Auto scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Load sessions
    const loadChatSessions = async () => {
        const res = await fetch("/api/chat-sessions", { cache: "no-store" });
        if (!res.ok) return;

        const data = await res.json();
        setChatSessions(data);

        if (data.length > 0) setCurrentSessionId(data[0].id);
    };

    // Load messages
    const loadMessages = async (sessionId) => {
        const res = await fetch(`/api/messages?sessionId=${sessionId}`);
        if (!res.ok) return;
        setMessages(await res.json());
    };

    // CREATE NEW CHAT (needed for button)
    const createNewChat = async () => {
        const res = await fetch("/api/chat-sessions", { method: "POST" });
        if (!res.ok) return;

        const data = await res.json();
        setChatSessions((prev) => [data, ...prev]);
        setCurrentSessionId(data.id);
        setMessages([]);
        setInput("");
    };

    // Send message
    const sendMessage = async (content) => {
        if (!content.trim()) return;
        setIsLoading(true);

        const temp = {
            id: `temp-${Date.now()}`,
            role: "user",
            content,
            created_at: Date.now(),
        };

        setMessages((prev) => [...prev, temp]);

        await fetch("/api/messages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ session_id: currentSessionId, content }),
        });

        const resUpdated = await fetch(`/api/messages?sessionId=${currentSessionId}`);
        setMessages(await resUpdated.json());

        setInput("");
        setIsLoading(false);
        await loadChatSessions();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage(input);
    };

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">

            {/* SIDEBAR */}
            <Sidebar
                chatSessions={chatSessions}
                currentSessionId={currentSessionId}
                onSelectSession={setCurrentSessionId}
                onNewChat={createNewChat}  // FIXED
                isOpen={isSidebarOpen}
                onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            />

            {/* MAIN AREA */}
            <div className="flex flex-col flex-1 relative">

                {/* Header */}
                <header
                    className={`${HEADER_GRADIENT} px-4 py-3 text-white shadow-md flex items-center gap-3`}
                >
                    <Button
                        onClick={() => setIsSidebarOpen(true)}
                        size="icon"
                        variant="ghost"
                        className="lg:hidden text-white hover:bg-white/20"
                    >
                        <PanelLeft className="h-5 w-5" />
                    </Button>

                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center font-semibold">
                            NA
                        </div>
                        <div>
                            <p className="font-semibold text-sm">Nutrition Agent</p>
                            <p className="text-xs opacity-80">Online</p>
                        </div>
                    </div>
                </header>

                {/* Background */}
                <div className="absolute inset-0 bg-[url('/chat-pattern.svg')] bg-repeat opacity-5 -z-10" />

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-4">
                    <div className="max-w-3xl mx-auto space-y-2">

                        {messages.map((msg, i) => {
                            const prev = messages[i - 1];
                            const newDay =
                                !prev || !isSameDay(prev.created_at, msg.created_at);

                            return (
                                <div key={msg.id || i}>
                                    {newDay && <DateSeparator label={dayLabel(msg.created_at)} />}
                                    <MessageBubble message={msg} isMine={msg.role === "user"} />
                                </div>
                            );
                        })}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white rounded-2xl px-3 py-2 border border-gray-300 shadow-sm">
                                    <div className="flex gap-1">
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-300"></span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef}></div>
                    </div>
                </div>

                {/* Input */}
                <div className="px-4 py-3 bg-white/70 backdrop-blur-xl border-t border-gray-200">
                    <form
                        onSubmit={handleSubmit}
                        className="max-w-3xl mx-auto flex items-end gap-3"
                    >
                        <Textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 rounded-2xl border border-gray-300 bg-white shadow-sm focus:ring-2 focus:ring-sky-500 px-4 py-2 resize-none min-h-[45px]"
                        />

                        <Button
                            type="submit"
                            size="icon"
                            disabled={isLoading}
                            className="h-12 w-12 rounded-full bg-gradient-to-r from-sky-600 to-indigo-600 text-white hover:from-sky-700 hover:to-indigo-700 shadow-md"
                        >
                            <Send className="h-5 w-5" />
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
