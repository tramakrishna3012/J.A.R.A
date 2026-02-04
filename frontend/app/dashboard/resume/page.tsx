"use client";

import { Upload, FileText, Send, CheckCircle, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import api from "@/lib/api";

export default function ResumePage() {
    const [uploading, setUploading] = useState(false);
    const [resumeData, setResumeData] = useState<any>(null);
    const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
        { role: 'ai', text: 'Hi! Upload your resume and I can help you tailor it for any job description.' }
    ]);
    const [inputText, setInputText] = useState("");
    const [loadingChat, setLoadingChat] = useState(false);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;

        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("file", file);

        setUploading(true);
        try {
            const res = await api.post("/resume/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setResumeData(res.data);
            setMessages(prev => [...prev, { role: 'ai', text: `Great! I've analyzed your resume (${file.name}). You can now ask me to improve specific bullet points.` }]);
        } catch (err) {
            console.error(err);
            alert("Upload failed.");
        } finally {
            setUploading(false);
        }
    };

    const handleSendMessage = async () => {
        if (!inputText.trim()) return;

        const userMsg = inputText;
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setInputText("");
        setLoadingChat(true);

        try {
            // Assume the user wants to improve this text
            const res = await api.post("/resume/improve", {
                text: userMsg,
                target_role: "General"
            });
            setMessages(prev => [...prev, {
                role: 'ai',
                text: `Here is a more impactful version:\n\n"${res.data.improved}"`
            }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'ai', text: "Sorry, I encountered an error using the AI." }]);
        } finally {
            setLoadingChat(false);
        }
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex gap-6">
            {/* Left: Resume Preview / Upload */}
            <div className="flex-1 flex flex-col gap-6">
                <header>
                    <h2 className="text-2xl font-bold">Your Resume</h2>
                    <p className="text-gray-400">Upload your master resume to get started.</p>
                </header>

                <div className="flex-1 rounded-2xl border-2 border-dashed border-zinc-800 bg-zinc-900/30 flex flex-col items-center justify-center text-center p-8 hover:border-purple-500/50 hover:bg-zinc-900/50 transition relative overflow-hidden group">
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        disabled={uploading}
                    />

                    {resumeData ? (
                        <div className="text-green-400 flex flex-col items-center animate-in zoom-in">
                            <CheckCircle className="w-16 h-16 mb-4" />
                            <h3 className="text-lg font-medium text-white mb-1">Resume Uploaded</h3>
                            <p className="text-sm text-gray-500">{resumeData.version_name}</p>
                            <p className="text-xs text-gray-600 mt-4 max-w-sm overflow-hidden text-ellipsis">
                                {JSON.stringify(resumeData.content_json?.basics?.name || "Parsed Data")}
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-4 group-hover:bg-purple-600 transition">
                                {uploading ? <Loader2 className="w-8 h-8 text-white animate-spin" /> : <Upload className="w-8 h-8 text-white" />}
                            </div>
                            <h3 className="text-lg font-medium mb-1">{uploading ? "Parsing..." : "Click to upload PDF"}</h3>
                            <p className="text-sm text-gray-500">Max file size: 5MB</p>
                        </>
                    )}
                </div>
            </div>

            {/* Right: AI Chat */}
            <div className="w-[400px] flex flex-col rounded-2xl border border-white/10 bg-zinc-900 shadow-xl">
                <div className="p-4 border-b border-white/10 bg-zinc-900 rounded-t-2xl z-10">
                    <h3 className="font-bold flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        J.A.R.A Assistant
                    </h3>
                </div>

                <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-zinc-950/50">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`p-3 rounded-xl text-sm max-w-[85%] whitespace-pre-wrap ${msg.role === 'user'
                                    ? 'bg-purple-600 text-white rounded-tr-none'
                                    : 'bg-zinc-800 text-gray-200 rounded-tl-none border border-white/5'
                                }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {loadingChat && (
                        <div className="flex justify-start">
                            <div className="bg-zinc-800 p-3 rounded-xl rounded-tl-none border border-white/5">
                                <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-white/10 bg-zinc-900 rounded-b-2xl">
                    <div className="relative">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Paste a bullet point to improve..."
                            className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 pr-10 transition-colors"
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={!inputText.trim() || loadingChat}
                            className="absolute right-2 top-2 p-1.5 rounded-lg bg-zinc-800 hover:bg-purple-600 text-gray-400 hover:text-white transition disabled:opacity-50 disabled:hover:bg-zinc-800"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
