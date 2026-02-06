"use client";

import { Mail, Send, PenTool, RefreshCw, Lock, Link as LinkIcon, AlertCircle } from "lucide-react";
import { useState } from "react";
import api from "@/lib/api";
import { supabase } from "@/lib/supabase";

export default function MailboxPage() {
    const [connected, setConnected] = useState(false);
    const [loading, setLoading] = useState(false);
    const [emails, setEmails] = useState<any[]>([]);
    const [selectedEmail, setSelectedEmail] = useState<any | null>(null);
    const [activeFolder, setActiveFolder] = useState("Inbox");
    const [viewMode, setViewMode] = useState<"list" | "detail" | "compose">("list");

    // Credentials
    const [creds, setCreds] = useState({ email: "", password: "" });

    // Filtered Emails
    const filteredEmails = emails.filter(email => {
        if (activeFolder === "Inbox") return true; // Show all for now, or filter by !Sent
        if (activeFolder === "Applications") return email.category === "Application";
        if (activeFolder === "Interviews") return email.category === "Interview";
        return true;
    });

    const handleConnect = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post("/inbox/fetch", creds);
            setEmails(res.data);
            setConnected(true);
        } catch (err: any) {
            console.error("Connection Error", err);
            alert("Connection failed. Check console.");
        } finally {
            setLoading(false);
        }
    };

    // Auto-fill and OAuth Check
    useState(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user?.email) {
                const userEmail = session.user.email;
                setCreds(prev => ({ ...prev, email: userEmail }));
                if (session.provider_token) {
                    setLoading(true);
                    api.post("/inbox/fetch", {
                        email: userEmail,
                        oauth_token: session.provider_token
                    })
                        .then(res => {
                            setEmails(res.data);
                            setConnected(true);
                        })
                        .catch(err => console.error("OAuth Fetch Error:", err))
                        .finally(() => setLoading(false));
                }
            }
        });
    });

    return (
        <div className="h-[calc(100vh-8rem)] flex gap-6">
            {/* Sidebar */}
            <div className="w-64 flex flex-col gap-2">
                <button
                    onClick={() => { setViewMode("compose"); setSelectedEmail(null); }}
                    className="flex items-center gap-3 px-4 py-3 bg-purple-600 rounded-xl font-medium hover:bg-purple-700 transition mb-4"
                >
                    <PenTool className="w-4 h-4" />
                    Compose
                </button>
                {["Inbox", "Sent", "Applications", "Interviews"].map((folder) => (
                    <button
                        key={folder}
                        onClick={() => { setActiveFolder(folder); setViewMode("list"); setSelectedEmail(null); }}
                        className={`flex items-center gap-3 px-4 py-2 rounded-lg transition text-left ${activeFolder === folder ? "bg-white/10 text-white" : "text-gray-400 hover:text-white"}`}
                    >
                        <Mail className="w-4 h-4" />
                        {folder}
                    </button>
                ))}
            </div>

            {/* Main Interface */}
            <div className="flex-1 flex flex-col rounded-2xl border border-white/10 bg-zinc-900 overflow-hidden relative">

                {/* Connection Overlay */}
                {!connected && (
                    <div className="absolute inset-0 z-10 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center">
                        <div className="max-w-md w-full p-8 rounded-2xl bg-zinc-900 border border-white/10 shadow-2xl">
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
                                            queryParams: { access_type: 'offline', prompt: 'consent' }
                                        }
                                    });
                                }}
                                className="w-full py-3 bg-white text-black rounded-lg font-bold hover:bg-gray-200 transition flex items-center justify-center gap-2 mb-4 mt-6"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                                Connect with Gmail
                            </button>
                        </div>
                    </div>
                )}

                {/* Toolbar */}
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-zinc-900/50">
                    <h2 className="font-bold">{viewMode === "compose" ? "Compose Message" : viewMode === "detail" ? "Reading Message" : activeFolder}</h2>
                    <span className="text-sm text-gray-500">{filteredEmails.length} messages</span>
                </div>

                {/* VIEW MODES */}
                <div className="flex-1 overflow-y-auto bg-zinc-900">

                    {/* LIST VIEW */}
                    {viewMode === "list" && (
                        <div className="divide-y divide-white/5">
                            {filteredEmails.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">No emails in {activeFolder}</div>
                            ) : filteredEmails.map((email: any) => (
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
                            <button onClick={() => setViewMode("list")} className="mb-4 text-sm text-purple-400 hover:underline">← Back to Inbox</button>
                            <h1 className="text-2xl font-bold mb-2">{selectedEmail.subject}</h1>
                            <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
                                <div className="text-sm text-gray-400">From: <span className="text-white">{selectedEmail.from}</span></div>
                                <div className="text-sm text-gray-500">{new Date(selectedEmail.date).toLocaleString()}</div>
                            </div>
                            <div className="prose prose-invert max-w-none text-gray-300 whitespace-pre-wrap font-sans">
                                {selectedEmail.body}
                            </div>
                        </div>
                    )}

                    {/* COMPOSE VIEW */}
                    {viewMode === "compose" && (
                        <div className="p-6">
                            <button onClick={() => setViewMode("list")} className="mb-4 text-sm text-purple-400 hover:underline">← Cancel</button>
                            <form className="space-y-4 max-w-2xl">
                                <input type="email" placeholder="To" className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-3 focus:border-purple-500 outline-none" />
                                <input type="text" placeholder="Subject" className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-3 focus:border-purple-500 outline-none" />
                                <textarea placeholder="Write your message..." className="w-full h-64 bg-black border border-zinc-700 rounded-lg px-4 py-3 focus:border-purple-500 outline-none resize-none"></textarea>
                                <button className="px-6 py-2 bg-purple-600 rounded-lg font-bold hover:bg-purple-700 transition">Send Message</button>
                            </form>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
