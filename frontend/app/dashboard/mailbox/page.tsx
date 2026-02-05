"use client";

import { Mail, Send, PenTool, RefreshCw, Lock, Link as LinkIcon, AlertCircle } from "lucide-react";
import { useState } from "react";
import api from "@/lib/api";

export default function MailboxPage() {
    const [connected, setConnected] = useState(false);
    const [loading, setLoading] = useState(false);
    const [emails, setEmails] = useState<any[]>([]);

    // Credentials (In prod these should be stored in secure HTTP-only cookies or Vault)
    const [creds, setCreds] = useState({ email: "", password: "" });

    const handleConnect = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post("/inbox/fetch", creds);
            setEmails(res.data);
            setConnected(true);
        } catch (err: any) {
            alert(err.response?.data?.detail || "Connection failed. Check credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex gap-6">
            {/* Sidebar */}
            <div className="w-64 flex flex-col gap-2">
                <button className="flex items-center gap-3 px-4 py-3 bg-purple-600 rounded-xl font-medium hover:bg-purple-700 transition mb-4">
                    <PenTool className="w-4 h-4" />
                    Compose
                </button>
                {["Inbox", "Sent", "Applications", "Interviews"].map((folder) => (
                    <button key={folder} className={`flex items-center gap-3 px-4 py-2 rounded-lg transition text-left ${folder === "Inbox" ? "bg-white/10 text-white" : "text-gray-400 hover:text-white"}`}>
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
                            <p className="text-gray-400 text-sm mb-6">
                                Enter your email credentials to fetch real-time job updates.
                                <br /> For Gmail, you <strong>MUST</strong> use an <a href="https://myaccount.google.com/apppasswords" target="_blank" className="text-blue-400 hover:underline">App Password</a> (Not your login password).
                            </p>

                            <form onSubmit={handleConnect} className="space-y-4 text-left">
                                <div>
                                    <label className="text-xs font-medium text-gray-500">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:border-purple-500 outline-none"
                                        value={creds.email}
                                        onChange={e => setCreds({ ...creds, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-500">App Password</label>
                                    <input
                                        type="password"
                                        required
                                        className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:border-purple-500 outline-none"
                                        value={creds.password}
                                        onChange={e => setCreds({ ...creds, password: e.target.value })}
                                    />
                                </div>
                                <button disabled={loading} className="w-full py-2.5 bg-blue-600 rounded-lg font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2">
                                    {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Sync Inbox"}
                                </button>
                            </form>
                            <p className="mt-4 text-xs text-gray-600 flex items-center justify-center gap-1">
                                <AlertCircle className="w-3 h-3" /> Data fetched locally. Your password is not stored.
                            </p>
                        </div>
                    </div>
                )}

                {/* Toolbar */}
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-zinc-900/50">
                    <h2 className="font-bold">Inbox</h2>
                    <span className="text-sm text-gray-500">{emails.length} messages</span>
                </div>

                {/* Email List */}
                <div className="flex-1 overflow-y-auto">
                    {emails.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-zinc-600">
                            <Mail className="w-10 h-10 mb-2 opacity-50" />
                            <p>No emails found</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-white/5">
                            {emails.map((email: any) => (
                                <div key={email.id} className="p-4 hover:bg-white/5 cursor-pointer transition flex gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${email.category === "Application" ? "bg-green-500/20 text-green-500" :
                                        email.category === "Interview" ? "bg-purple-500/20 text-purple-500" :
                                            email.category === "Rejection" ? "bg-red-500/20 text-red-500" :
                                                "bg-zinc-800 text-gray-400"
                                        }`}>
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
                                    <div className="flex flex-col items-end justify-center w-24 gap-2">
                                        {email.category !== "Inbox" && (
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full border uppercase tracking-wide ${email.category === "Application" ? "border-green-500/30 text-green-400" :
                                                email.category === "Interview" ? "border-purple-500/30 text-purple-400" :
                                                    "border-red-500/30 text-red-400"
                                                }`}>
                                                {email.category}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
