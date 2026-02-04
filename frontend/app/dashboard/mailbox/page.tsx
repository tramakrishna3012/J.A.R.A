"use client";

import { Mail, Send, PenTool } from "lucide-react";

export default function MailboxPage() {
    return (
        <div className="h-[calc(100vh-8rem)] flex gap-6">
            {/* Sidebar - Folders */}
            <div className="w-64 flex flex-col gap-2">
                <button className="flex items-center gap-3 px-4 py-3 bg-purple-600 rounded-xl font-medium hover:bg-purple-700 transition mb-4">
                    <PenTool className="w-4 h-4" />
                    Compose
                </button>

                {["Inbox", "Sent", "Drafts", "Trash"].map((folder) => (
                    <button key={folder} className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition text-left">
                        <Mail className="w-4 h-4" />
                        {folder}
                    </button>
                ))}
            </div>

            {/* Main Content - Email List & Preview */}
            <div className="flex-1 flex flex-col rounded-2xl border border-white/10 bg-zinc-900 overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-white/10 flex justify-between items-center">
                    <h2 className="font-bold">Inbox</h2>
                    <span className="text-sm text-gray-500">0 messages</span>
                </div>

                {/* Empty State */}
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                    <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
                        <Mail className="w-8 h-8 text-gray-500" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">Your inbox is empty</h3>
                    <p className="text-gray-500 max-w-sm">
                        Emails you send to HR or receive from referrals will appear here.
                    </p>
                    <button className="mt-6 px-6 py-2 rounded-full border border-white/20 hover:bg-white/5 transition text-sm">
                        Generate Referral Template
                    </button>
                </div>
            </div>
        </div>
    );
}
