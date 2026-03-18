"use client";

import { FileText, Sparkles, Send, Mail } from "lucide-react";
import { useState } from "react";

export default function AgentWorkstationPage() {
    const [tailorProgress, setTailorProgress] = useState(100);

    return (
        <div className="max-w-7xl mx-auto space-y-6 animate-fade-in-up pb-20">
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="font-heading text-3xl font-bold text-white mb-2">Agent Workstation</h1>
                    <p className="text-gray-400">Watch J.A.R.A tailor resumes and draft emails in real-time.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Resume Tailoring Module */}
                <div className="glass-panel rounded-xl border border-white/5 overflow-hidden flex flex-col min-h-[600px]">
                    <div className="p-4 border-b border-white/5 bg-background-800/50 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-accent-400" />
                            <span className="font-semibold text-white text-sm">Resume Tailoring</span>
                        </div>
                        <span className="text-xs text-green-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Processing
                        </span>
                    </div>

                    <div className="flex-1 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-white/5 overflow-hidden">
                        {/* Original Side */}
                        <div className="flex-1 p-6 bg-background-900/50 overflow-y-auto">
                            <div className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-4">Original Profile</div>
                            <div className="space-y-4 opacity-60">
                                <div>
                                    <h4 className="text-white font-bold text-sm">Skills</h4>
                                    <p className="text-xs text-gray-400 mt-1">JavaScript, React, CSS, HTML, Teamwork, Communication</p>
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-sm">Experience</h4>
                                    <p className="text-xs text-gray-400 mt-1">Frontend Dev at Startup Inc. Built landing pages and maintained UI components.</p>
                                </div>
                            </div>
                        </div>

                        {/* Tailored Side */}
                        <div className="flex-1 p-6 bg-gradient-to-b from-primary-900/10 to-transparent overflow-y-auto relative">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-400 to-transparent animate-scan opacity-50"></div>
                            <div className="flex justify-between items-center mb-4">
                                <div className="text-xs uppercase tracking-wider text-accent-400 font-bold">Tailored for Netflix</div>
                                <span className="text-[10px] bg-accent-500/10 text-accent-400 px-2 py-0.5 rounded border border-accent-500/20">ATS Score: 98</span>
                            </div>

                            <div className="space-y-4">
                                <div className="p-3 rounded bg-accent-500/5 border border-accent-500/20">
                                    <h4 className="text-white font-bold text-sm flex items-center gap-2">
                                        Skills
                                        <Sparkles className="w-3 h-3 text-accent-400" />
                                    </h4>
                                    <p className="text-xs text-gray-300 mt-1">
                                        <span className="text-accent-300 font-medium">React.js Performance Optimization</span>,
                                        <span className="text-accent-300 font-medium"> Large Scale Systems</span>,
                                        JavaScript (ES6+), CSS Architecture
                                    </p>
                                </div>
                                <div className="p-3 rounded bg-accent-500/5 border border-accent-500/20">
                                    <h4 className="text-white font-bold text-sm flex items-center gap-2">
                                        Experience
                                        <Sparkles className="w-3 h-3 text-accent-400" />
                                    </h4>
                                    <p className="text-xs text-gray-300 mt-1">
                                        Frontend Engineer at Startup Inc.
                                        <span className="text-accent-300 bg-accent-500/10 px-1 rounded ml-1">Architected scalable UI library</span>
                                        used by 50k+ users. Improved load times by 40%.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Email Automation Module */}
                <div className="glass-panel rounded-xl border border-white/5 overflow-hidden flex flex-col min-h-[600px]">
                    <div className="p-4 border-b border-white/5 bg-background-800/50 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-purple-400" />
                            <span className="font-semibold text-white text-sm">Outreach Automation</span>
                        </div>
                        <button className="text-xs bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded transition-colors">Skip</button>
                    </div>

                    <div className="flex-1 p-6 flex flex-col">
                        {/* Email Header */}
                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-3 text-sm">
                                <span className="text-gray-500 w-12">To:</span>
                                <div className="flex items-center gap-2 bg-white/5 px-2 py-1 rounded-full border border-white/5">
                                    <div className="w-4 h-4 rounded-full bg-gray-600"></div>
                                    <span className="text-gray-300 text-xs font-medium">Sarah Miller (Head of Engineering)</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <span className="text-gray-500 w-12">Subject:</span>
                                <span className="text-white font-medium">Regarding the Senior Frontend Role - Alex Designer</span>
                            </div>
                        </div>

                        {/* Email Body */}
                        <div className="flex-1 bg-background-900/50 rounded-lg p-4 border border-white/5 font-mono text-sm text-gray-300 leading-relaxed relative overflow-hidden">
                            <p className="mb-4">Hi Sarah,</p>
                            <p className="mb-4">I've been following Netflix's engineering blog for years, specifically your recent work on <span className="text-purple-400 bg-purple-500/10 px-1 rounded">micro-frontends</span>.</p>
                            <p className="mb-4">My background in building scalable design systems at Startup Inc aligns perfectly with the challenges your team is solving. I recently refactored our core dashboard to reduce TTI by 40%.</p>
                            <p className="mb-4">I'd love to chat briefly about how I could contribute to the platform team.</p>
                            <p>Best,<br />Alex</p>

                            {/* Typing Cursor Effect */}
                            <span className="inline-block w-2 h-4 bg-purple-500 animate-pulse ml-1 align-middle"></span>
                        </div>

                        {/* Action Bar */}
                        <div className="mt-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                            <div className="text-xs text-gray-500">Drafted by GPT-4o • 96% Confidence</div>
                            <div className="flex gap-3">
                                <button className="flex-1 sm:flex-none px-4 py-2 rounded-lg border border-white/10 text-gray-300 hover:text-white transition-colors text-sm font-medium">Edit</button>
                                <button className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium shadow-glow flex items-center justify-center gap-2 transition-colors">
                                    <Send className="w-3 h-3" /> Send Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
