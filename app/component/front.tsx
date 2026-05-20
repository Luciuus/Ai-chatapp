// app/chat/page.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import {
    Send,
    Trash2,
    Sparkles,
    Loader2,
    Bot,
    User,
} from "lucide-react";

interface Message {
    role: "user" | "model";
    parts: Array<{ text: string }>;
}

export default function GeminiChat() {
    const [history, setHistory] = useState<Message[]>([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetch("/api/chat")
            .then((res) => {
                if (!res.ok) throw new Error("Failed to load history");
                return res.json();
            })
            .then((data) => {
                if (data.history) setHistory(data.history);
            })
            .catch((err) => {
                console.error(err);
                setError("Could not retrieve stored session logs.");
            });
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [history, loading]);

    const handleSendMessage = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        if (!message.trim() || loading) return;

        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message }),
            });

            if (!res.ok) throw new Error("Failed to send");

            const data = await res.json();

            if (data.history) setHistory(data.history);

            setMessage("");
        } catch (err) {
            console.error(err);
            setError("Lost connection to workspace API endpoints.");
        } finally {
            setLoading(false);
        }
    };

    const handleResetMemory = async () => {
        try {
            const res = await fetch("/api/reset", {
                method: "POST",
            });

            const data = await res.json();

            setHistory(data.history || []);
            setError("");
        } catch (err) {
            console.error(err);
            setError("Failed to wipe backend logs cleanly.");
        }
    };

    return (
        <div className="h-screen bg-black text-white overflow-hidden">
            {/* BACKGROUND */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.15),transparent_40%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.12),transparent_40%)]" />
                <div className="absolute inset-0 backdrop-blur-3xl" />
            </div>

            <div className="flex flex-col h-full max-w-5xl mx-auto border-x border-white/10 bg-white/[0.03] backdrop-blur-xl">
                {/* HEADER */}
                <header className="sticky top-0 z-20 border-b border-white/10 bg-black/30 backdrop-blur-2xl">
                    <div className="flex items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg shadow-blue-500/20">
                                <Sparkles size={20} />
                            </div>

                            <div>
                                <h1 className="text-lg font-semibold tracking-tight">
                                    Gemini Workspace
                                </h1>

                                <p className="text-xs text-white/50">
                                    Context-aware AI memory environment
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleResetMemory}
                            className="group flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-red-500/10 hover:border-red-500/30 transition-all"
                        >
                            <Trash2
                                size={16}
                                className="text-white/60 group-hover:text-red-400"
                            />

                            <span className="text-sm text-white/70 group-hover:text-red-300">
                                Reset
                            </span>
                        </button>
                    </div>
                </header>

                {/* CHAT */}
                <main className="flex-1 overflow-y-auto px-6 py-8 cutom-scrollbar">
                    <div className="space-y-6">
                        {error && (
                            <div className="border border-red-500/20 bg-red-500/10 text-red-200 text-sm rounded-2xl px-4 py-3 backdrop-blur-xl">
                                {error}
                            </div>
                        )}

                        {history.length === 0 && !loading && (
                            <div className="flex flex-col items-center justify-center h-[58vh] text-center">
                                <div className="flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 mb-6">
                                    <Sparkles
                                        size={32}
                                        className="text-blue-400"
                                    />
                                </div>

                                <h2 className="text-2xl font-semibold mb-2">
                                    Start a conversation
                                </h2>

                                <p className="max-w-md text-sm text-white/40 leading-relaxed">
                                    Your workspace memory is empty. Send a message to begin
                                    building conversational context.
                                </p>
                            </div>
                        )}

                        {history.map((msg, idx) => {
                            const isUser = msg.role === "user";

                            return (
                                <div
                                    key={idx}
                                    className={`flex ${isUser ? "justify-end" : "justify-start"
                                        }`}
                                >
                                    <div
                                        className={`group flex gap-3 max-w-[85%] ${isUser ? "flex-row-reverse" : ""
                                            }`}
                                    >
                                        {/* AVATAR */}
                                        <div
                                            className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center border ${isUser
                                                ? "bg-blue-500/20 border-blue-400/20"
                                                : "bg-white/5 border-white/10"
                                                }`}
                                        >
                                            {isUser ? (
                                                <User
                                                    size={18}
                                                    className="text-blue-300"
                                                />
                                            ) : (
                                                <Bot
                                                    size={18}
                                                    className="text-purple-300"
                                                />
                                            )}
                                        </div>

                                        {/* MESSAGE */}
                                        <div
                                            className={`relative px-5 py-4 rounded-3xl shadow-2xl backdrop-blur-xl border transition-all duration-300 group-hover:scale-[1.01] ${isUser
                                                ? "bg-blue-500 text-white border-blue-400/20 rounded-br-md"
                                                : "bg-white/[0.05] border-white/10 text-white rounded-bl-md"
                                                }`}
                                        >
                                            <div className="mb-2 text-[11px] uppercase tracking-[0.2em] font-semibold opacity-50">
                                                {isUser ? "You" : "Gemini"}
                                            </div>

                                            <div className="whitespace-pre-wrap text-sm leading-7 text-white/90">
                                                {msg.parts?.[0]?.text || ""}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* TYPING */}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="flex gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                                        <Bot
                                            size={18}
                                            className="text-purple-300"
                                        />
                                    </div>

                                    <div className="px-5 py-4 rounded-3xl rounded-bl-md bg-white/[0.05] border border-white/10 backdrop-blur-xl">
                                        <div className="flex items-center gap-2 text-white/60">
                                            <Loader2
                                                size={16}
                                                className="animate-spin"
                                            />
                                            <span className="text-sm">
                                                Gemini is thinking...
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={chatEndRef} />
                    </div>
                </main>

                {/* INPUT */}
                <footer className="sticky bottom-0 border-t border-white/10 bg-black/30 backdrop-blur-2xl">
                    <form
                        onSubmit={handleSendMessage}
                        className="p-5"
                    >
                        <div className="flex items-end gap-3 rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-3 shadow-2xl">
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage(e);
                                    }
                                }}
                                rows={1}
                                placeholder="Ask Gemini something..."
                                className="flex-1 bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/30 resize-none outline-none max-h-40"
                            />

                            <button
                                type="submit"
                                disabled={loading || !message.trim()}
                                className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 transition-all shadow-lg shadow-blue-500/25"
                            >
                                {loading ? (
                                    <Loader2
                                        size={18}
                                        className="animate-spin"
                                    />
                                ) : (
                                    <Send size={18} />
                                )}
                            </button>
                        </div>

                        <div className="mt-3 px-2 text-xs text-white/30">
                            Press Enter to send • Shift + Enter for newline
                        </div>
                    </form>
                </footer>
            </div>
        </div>
    );
}