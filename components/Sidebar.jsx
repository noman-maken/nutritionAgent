"use client";

import {
    MessageSquare,
    PanelLeftClose,
    Plus,
    LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { signOut } from "next-auth/react";

export default function Sidebar({
                                    chatSessions,
                                    currentSessionId,
                                    onSelectSession,
                                    onNewChat,
                                    isOpen,
                                    onToggle,
                                }) {
    // 🟦 Format date into Today / Yesterday / Date
    const formatDateLabel = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        const isSameDay = (a, b) =>
            a.getFullYear() === b.getFullYear() &&
            a.getMonth() === b.getMonth() &&
            a.getDate() === b.getDate();

        if (isSameDay(date, today)) return "Today";
        if (isSameDay(date, yesterday)) return "Yesterday";

        return date.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    // 🟩 Group chat sessions by date
    const grouped = chatSessions.reduce((groups, session) => {
        const label = formatDateLabel(session.updated_at);
        if (!groups[label]) groups[label] = [];
        groups[label].push(session);
        return groups;
    }, {});

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onToggle}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed lg:relative top-0 left-0 h-screen
                    w-[260px] flex flex-col z-50
                    bg-gradient-to-b from-slate-900 via-slate-850 to-slate-800
                    border-r border-white/10 shadow-xl text-white
                    transition-transform duration-300 ease-out
                    ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                `}
            >
                {/* New Chat */}
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                    <Button
                        onClick={onNewChat}
                        className="flex-1 bg-white/10 hover:bg-white/20 text-white gap-2 rounded-xl"
                    >
                        <Plus className="h-4 w-4" />
                        New Chat
                    </Button>

                    <Button
                        onClick={onToggle}
                        size="icon"
                        variant="ghost"
                        className="ml-2 lg:hidden text-white hover:bg-white/10 rounded-lg"
                    >
                        <PanelLeftClose className="h-5 w-5" />
                    </Button>
                </div>

                {/* Chat List */}
                <ScrollArea className="flex-1">
                    <div className="p-3 space-y-4">

                        {/* If no chats */}
                        {chatSessions.length === 0 && (
                            <div className="text-center text-white/40 text-sm py-6">
                                No chats yet
                            </div>
                        )}

                        {/* 🟩 RENDER GROUPED CHATS */}
                        {Object.keys(grouped).map((dateLabel) => (
                            <div key={dateLabel} className="space-y-2">
                                {/* Heading (Today / Yesterday / Date) */}
                                <h3 className="text-xs uppercase tracking-wide text-white/40 px-1">
                                    {dateLabel}
                                </h3>

                                {/* Chat Buttons */}
                                {grouped[dateLabel].map((session) => (
                                    <button
                                        key={session.id}
                                        onClick={() => {
                                            onSelectSession(session.id);
                                            if (window.innerWidth < 1024) onToggle();
                                        }}
                                        className={`w-full text-left px-3 py-2 rounded-xl flex items-center gap-3 transition-all border border-white/5 
                                            ${
                                            currentSessionId === session.id
                                                ? "bg-white/10 text-white shadow-sm"
                                                : "text-white/70 hover:bg-white/10 hover:text-white"
                                        }
                                        `}
                                    >
                                        <MessageSquare className="h-4 w-4 opacity-90" />
                                        <span className="truncate">{session.title}</span>
                                    </button>
                                ))}
                            </div>
                        ))}

                    </div>
                </ScrollArea>

                {/* Sign Out */}
                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="w-full flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-red-300 hover:text-red-200 transition-all"
                    >
                        <LogOut className="h-5 w-5" />
                        <span className="text-sm">Sign Out</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
