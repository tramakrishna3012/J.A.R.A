"use client";

import { Upload, FileText, Send } from "lucide-react";

export default function ResumePage() {
    return (
        <div className="h-[calc(100vh-8rem)] flex gap-6">
            {/* Left: Resume Preview / Upload */}
            <div className="flex-1 flex flex-col gap-6">
                <header>
                    <h2 className="text-2xl font-bold">Your Resume</h2>
                    <p className="text-gray-400">Upload your master resume to get started.</p>
                </header>

                <div className="flex-1 rounded-2xl border-2 border-dashed border-zinc-800 bg-zinc-900/30 flex flex-col items-center justify-center text-center p-8 hover:border-purple-500/50 hover:bg-zinc-900/50 transition cursor-pointer group">
                    <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-4 group-hover:bg-purple-600 transition">
                        <Upload className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">Click to upload PDF</h3>
                    <p className="text-sm text-gray-500">Max file size: 5MB</p>
                </div>
            </div>

            {/* Right: AI Chat (Placeholder) */}
            <div className="w-[400px] flex flex-col rounded-2xl border border-white/10 bg-zinc-900">
                <div className="p-4 border-b border-white/10">
                    <h3 className="font-bold flex items-center gap-2">
                        <FileText className="w-4 h-4 text-purple-400" />
                        J.A.R.A Assistant
                    </h3>
                </div>

                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    <div className="bg-zinc-800 p-3 rounded-lg rounded-tl-none self-start text-sm max-w-[85%]">
                        Hi! Upload your resume and I can help you tailor it for any job description.
                    </div>
                </div>

                <div className="p-4 border-t border-white/10">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Ask me to rewrite a bullet point..."
                            className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 pr-10"
                        />
                        <button className="absolute right-2 top-2 p-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-gray-400 hover:text-white transition">
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
