"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "ai",
      content: "Hello! I am J.A.R.A. I can help you find jobs, analyze your resume, optimize bullet points, or draft referral requests. How can I assist you today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      // Fetch session token
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token || ''}`
        },
        body: JSON.stringify({ message: userMsg.content }),
      });

      if (!response.ok) throw new Error("Failed to get response");
      
      const data = await response.json();
      
      setMessages((prev) => [
        ...prev, 
        { id: (Date.now() + 1).toString(), role: "ai", content: data.reply }
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev, 
        { id: (Date.now() + 1).toString(), role: "ai", content: "I'm having trouble connecting right now. Please try again later." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background-950 p-4 md:p-6 lg:max-w-4xl lg:mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white">J.A.R.A Brain</h1>
          <p className="text-gray-400 text-sm mt-1">Chat directly with your autonomous agent</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
          </span>
          <span className="text-xs font-medium text-primary-400">Online</span>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 glass-panel border border-white/5 rounded-2xl overflow-hidden flex flex-col mb-4 bg-background-900/40 relative">
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'ai' 
                  ? 'bg-gradient-to-br from-primary-500 to-accent-500 text-white' 
                  : 'bg-background-800 border border-white/10 text-gray-300'
              }`}>
                {msg.role === 'ai' ? <Bot size={20} /> : <User size={20} />}
              </div>
              <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-[80%]`}>
                 <span className="text-xs text-gray-500 mb-1 ml-1">{msg.role === 'ai' ? 'J.A.R.A' : 'You'}</span>
                 <div className={`px-4 py-3 rounded-2xl text-sm md:text-base ${
                   msg.role === 'user'
                    ? 'bg-primary-600 text-white rounded-tr-sm'
                    : 'bg-background-800 border border-white/5 text-gray-200 rounded-tl-sm'
                 }`}>
                     <p className="whitespace-pre-wrap">{msg.content}</p>
                 </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shrink-0 text-white">
                <Bot size={20} />
              </div>
              <div className="flex flex-col items-start max-w-[80%]">
                 <span className="text-xs text-gray-500 mb-1 ml-1">J.A.R.A</span>
                 <div className="px-5 py-4 rounded-2xl bg-background-800 border border-white/5 rounded-tl-sm flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                 </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-background-900 border-t border-white/5">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-end gap-2"
          >
            <div className="relative flex-1">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask me to review a job or optimize your resume..."
                className="w-full bg-background-950 border border-white/10 rounded-xl px-4 py-3 md:py-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 resize-none max-h-32 min-h-[52px]"
                rows={1}
              />
            </div>
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-3 md:p-4 bg-primary-600 hover:bg-primary-500 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0 h-[52px] md:h-14 flex items-center justify-center"
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            </button>
          </form>
          <div className="text-center mt-3">
             <p className="text-[10px] text-gray-500">J.A.R.A can make mistakes. Consider checking important information.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
