"use client";

import { Mail, PenTool, RefreshCw, Lock } from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { supabase } from "@/lib/supabase";

interface Email {
    id: string;
    category: string;
    subject: string;
    date: string;
    from: string;
    snippet: string;
    body: string;
}

interface UserSession {
    user?: {
        email?: string;
    };
    provider_token?: string;
}

export default function MailboxPage() {
    const [connected, setConnected] = useState(false);
    const [loading, setLoading] = useState(false);
    const [emails, setEmails] = useState<Email[]>([]);
    const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
    const [activeFolder, setActiveFolder] = useState("Inbox");
    const [viewMode, setViewMode] = useState<"list" | "detail" | "compose">("list");
    const [initializing, setInitializing] = useState(true);

    // Credentials
    const [, setCreds] = useState({ email: "", password: "" });

    // Filtered Emails
    const filteredEmails = emails.filter(email => {
        if (activeFolder === "Inbox") return true;
        if (activeFolder === "Applications") return email.category === "Application";
        if (activeFolder === "Interviews") return email.category === "Interview";
        return true;
    });

    // Persistent Session Check
    useEffect(() => {
        const initSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session) await processSession(session as UserSession);

                supabase.auth.onAuthStateChange((_event, session) => {
                    if (session) processSession(session as UserSession);
                });
            } catch (err) {
                console.error("Session check failed", err);
            } finally {
                setInitializing(false);
            }
        };
        initSession();
    }, []);

    const processSession = async (session: UserSession) => {
        if (session?.user?.email) {
            setCreds(prev => ({ ...prev, email: session.user?.email || "" }));

            const isAlreadyConnected = localStorage.getItem(`gmail_connected_${session.user.email}`) === 'true';

            if (isAlreadyConnected) {
                setConnected(true);
            }

            if (session.provider_token) {
                // If we got a provider_token from OAuth, save it as connected in local storage
                localStorage.setItem(`gmail_connected_${session.user.email}`, 'true');
                try {
                    setLoading(true);
                    // Mock API call to fetch
                    const res = await api.post("/inbox/fetch", {
                        email: session.user.email,
                        oauth_token: session.provider_token
                    });
                    if (res.data) setEmails(res.data);
                    setConnected(true);
                } catch (err) {
                    console.error("Auto-fetch error:", err);
                } finally {
                    setLoading(false);
                }
            } else if (isAlreadyConnected && emails.length === 0) {
                // If connected via local storage but no emails loaded, simulate loading empty/dummy data or leave empty
                setConnected(true);
            }
        }
    };


    return (
        <div className="flex flex-col md:flex-row h-[calc(100vh-10rem)] md:h-[calc(100vh-8rem)] gap-4 md:gap-6">
            {/* Sidebar (Folders) */}
            <div className="w-full md:w-64 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 shrink-0">
                <button
                    onClick={() => { setViewMode("compose"); setSelectedEmail(null); }}
                    className="flex md:hidden items-center justify-center gap-2 px-4 py-2 bg-electric rounded-xl font-medium shrink-0 text-white"
                >
                    <PenTool className="w-4 h-4" />
                    <span className="sr-only">Compose</span>
                </button>

                <button
                    onClick={() => { setViewMode("compose"); setSelectedEmail(null); }}
                    className="hidden md:flex items-center gap-3 px-4 py-3 bg-electric text-white rounded-xl font-medium hover:bg-electric/90 transition mb-4 shadow-lg shadow-electric/20"
                >
                    <PenTool className="w-4 h-4" />
                    Compose
                </button>
                {["Inbox", "Sent", "Applications", "Interviews"].map((folder) => (
                    <button
                        key={folder}
                        onClick={() => { setActiveFolder(folder); setViewMode("list"); setSelectedEmail(null); }}
                        className={`flex items-center gap-3 px-4 py-2 rounded-lg transition whitespace-nowrap ${activeFolder === folder ? "bg-white/10 text-white" : "text-gray-400 hover:text-white"}`}
                    >
                        <Mail className="w-4 h-4" />
                        {folder}
                    </button>
                ))}
            </div>

            {/* Main Interface */}
            <div className="flex-1 flex flex-col rounded-2xl border border-white/10 bg-obsidian overflow-hidden relative min-h-0">

                {/* Connection Overlay */}
                {!connected && (
                    <div className="absolute inset-0 z-10 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center">
                        <div className="max-w-md w-full p-8 rounded-2xl bg-obsidian border border-white/10 shadow-2xl">
                            {initializing || loading ? (
                                <div className="flex flex-col items-center justify-center py-10">
                                    <RefreshCw className="w-8 h-8 text-electric animate-spin mb-4" />
                                    <p className="text-gray-400">Syncing with Gmail...</p>
                                </div>
                            ) : (
                                <>
                                    <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
                                        <Lock className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <h2 className="text-xl font-bold mb-2">Connect Your Email</h2>
                                    <button
                                        onClick={async () => {
                                            await supabase.auth.signInWithOAuth({
                                                provider: 'google',
                                                options: {
                                                    scopes: 'https://mail.google.com/',
                                                    redirectTo: `${window.location.origin}/dashboard/mailbox`,
                                                    queryParams: { access_type: 'offline' }
                                                }
                                            });
                                        }}
                                        className="w-full py-3 bg-white text-black rounded-lg font-bold hover:bg-gray-200 transition flex items-center justify-center gap-2 mb-4 mt-6"
                                    >
                                        <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                                        Connect with Gmail
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* Toolbar */}
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-obsidian/50">
                    <h2 className="font-bold">{viewMode === "compose" ? "Compose Message" : viewMode === "detail" ? "Reading Message" : activeFolder}</h2>
                    <span className="text-sm text-gray-500">{filteredEmails.length} messages</span>
                </div>

                {/* VIEW MODES */}
                <div className="flex-1 overflow-y-auto bg-obsidian">

                    {/* LIST VIEW */}
                    {viewMode === "list" && (
                        <div className="divide-y divide-white/5">
                            {filteredEmails.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">No emails in {activeFolder}</div>
                            ) : filteredEmails.map((email: Email) => (
                                <div
                                    key={email.id}
                                    onClick={() => { setSelectedEmail(email); setViewMode("detail"); }}
                                    className="p-4 hover:bg-white/5 cursor-pointer transition flex gap-4"
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${email.category === "Application" ? "bg-green-500/20 text-green-500" : "bg-zinc-800 text-gray-400"}`}>
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-medium truncate pr-2 text-white">{email.subject}</h4>
                                            <span className="text-xs text-gray-500 shrink-0">{new Date(email.date).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-sm text-gray-400 truncate mb-1">{email.from}</p>
                                        <p className="text-xs text-gray-500 line-clamp-1">{email.snippet}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* DETAIL VIEW */}
                    {viewMode === "detail" && selectedEmail && (
                        <div className="p-6">
                            <button onClick={() => setViewMode("list")} className="mb-4 text-sm text-electric hover:underline">← Back to Inbox</button>
                            <h1 className="text-2xl font-bold mb-2">{selectedEmail.subject}</h1>
                            <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
                                <div className="text-sm text-gray-400">From: <span className="text-white">{selectedEmail.from}</span></div>
                                <div className="text-sm text-gray-500">{new Date(selectedEmail.date).toLocaleString()}</div>
                            </div>
                            <div
                                className="prose prose-invert max-w-none text-gray-300 font-sans overflow-hidden"
                                dangerouslySetInnerHTML={{ __html: selectedEmail.body }}
                            />
                        </div>
                    )}

                    {/* COMPOSE VIEW */}
                    {viewMode === "compose" && (
                        <div className="p-6">
                            <button onClick={() => setViewMode("list")} className="mb-4 text-sm text-electric hover:underline">← Cancel</button>
                            <form className="space-y-4 max-w-2xl">
                                <input type="email" placeholder="To" className="w-full bg-night border border-white/10 rounded-lg px-4 py-3 focus:border-electric outline-none" />
                                <input type="text" placeholder="Subject" className="w-full bg-night border border-white/10 rounded-lg px-4 py-3 focus:border-electric outline-none" />
                                <textarea placeholder="Write your message..." className="w-full h-64 bg-night border border-white/10 rounded-lg px-4 py-3 focus:border-electric outline-none resize-none"></textarea>
                                <button className="px-6 py-2 bg-electric text-white rounded-lg font-bold hover:bg-electric/90 transition shadow-lg shadow-electric/20">Send Message</button>
                            </form>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
