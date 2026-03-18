"use client";

import { Plus, Search, Filter, Upload, BarChart2, X, Loader2, Link as LinkIcon, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import api from "@/lib/api";

const jobs = [
    { company: "Netflix", role: "Senior Frontend Engineer", status: "Applied", date: "Today, 10:42 AM", score: 98, nextStep: "Waiting for review", color: "bg-white text-black" },
    { company: "Stripe", role: "Product Designer", status: "Outreach Sent", date: "Yesterday", score: 92, nextStep: "Follow-up in 2 days", color: "bg-[#635BFF] text-white" },
    { company: "Vercel", role: "Design Engineer", status: "Interview", date: "Oct 24, 2023", score: 85, nextStep: "Tech Round: Tomorrow 2pm", color: "bg-[#000000] border border-white/20 text-white" },
    { company: "Airbnb", role: "UX Researcher", status: "Rejected", date: "Oct 20, 2023", score: 45, nextStep: "-", color: "bg-[#FF5A5F] text-white" },
];

const statusStyles: Record<string, string> = {
    "Applied": "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    "Outreach Sent": "bg-purple-500/10 text-purple-400 border border-purple-500/20",
    "Interview": "bg-green-500/10 text-green-400 border border-green-500/20",
    "Rejected": "bg-red-500/10 text-red-400 border border-red-500/20",
    "Saved": "bg-zinc-500/10 text-gray-400 border border-zinc-500/20",
};

const scoreColors = (score: number) => {
    if (score >= 90) return "bg-green-500 text-green-400";
    if (score >= 70) return "bg-yellow-500 text-yellow-400";
    return "bg-red-500 text-red-400";
};

interface Job {
    company: string;
    role: string;
    status: string;
    date: string;
    score: number;
    nextStep: string;
    description?: string;
}

interface AnalysisData {
    match_score: number;
    missing_keywords: string[];
}

export default function JobsPage() {
    const [showAnalysis, setShowAnalysis] = useState(false);
    const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
    const [loading, setLoading] = useState(false);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);

    const handleAnalyze = async (job: Job) => {
        setLoading(true);
        setSelectedJob(job);
        try {
            const res = await api.post("/jobs/analyze", {
                job_description: job.description || "Looking for a Software Engineer with React and Python skills.",
                resume_text: null
            });
            setAnalysisData(res.data);
            setShowAnalysis(true);
        } catch (err) {
            console.error("Analysis failed", err);
            alert("Failed to analyze job. Ensure you have a master resume uploaded.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 relative animate-fade-in-up">
            {/* Analysis Modal */}
            {showAnalysis && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-obsidian border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl shadow-black/80 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold flex items-center gap-2 text-white">
                                <BarChart2 className="w-5 h-5 text-electric" />
                                ATS Analysis for {selectedJob?.company}
                            </h3>
                            <button onClick={() => setShowAnalysis(false)} className="text-gray-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-4 border-electric/20 text-3xl font-bold text-white mb-2 relative">
                                    {analysisData?.match_score || 0}%
                                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="46" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-electric" strokeDasharray={`${(analysisData?.match_score || 0) * 2.9} 289`} />
                                    </svg>
                                </div>
                                <p className="text-sm text-gray-400">Match Score</p>
                            </div>

                            <div className="bg-night/50 rounded-xl p-4 border border-white/5">
                                <h4 className="font-medium text-sm text-gray-300 mb-3">Missing Keywords</h4>
                                <div className="flex flex-wrap gap-2">
                                    {analysisData?.missing_keywords.map((kw: string) => (
                                        <span key={kw} className="px-2 py-1 rounded-md bg-red-500/10 text-red-400 text-xs border border-red-500/20">
                                            {kw}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <button onClick={() => setShowAnalysis(false)} className="w-full py-3 bg-electric text-white rounded-xl font-medium hover:bg-electric/90 transition shadow-glow">
                                Optimize Resume for This Job
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-heading text-3xl font-bold text-white mb-2">Job Tracker</h1>
                    <p className="text-gray-400">Manage and track your automated applications.</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input type="text" placeholder="Search jobs..." className="pl-10 pr-4 py-2 bg-background-800 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-primary-500 w-full md:w-64 transition-colors" />
                    </div>
                    <button className="px-3 py-2 bg-background-800 border border-white/10 rounded-lg text-gray-300 hover:text-white transition-colors">
                        <Filter className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Kanban/Table Toggle */}
            <div className="flex gap-1 mb-6 bg-background-800 p-1 rounded-lg w-fit border border-white/5">
                <button className="px-3 py-1.5 bg-white/10 rounded text-xs font-medium text-white shadow-sm transition">List View</button>
                <button className="px-3 py-1.5 text-gray-400 hover:text-white rounded text-xs font-medium transition-colors">Board View</button>
            </div>

            {/* Job Table */}
            <div className="glass-panel rounded-xl border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-background-800/50 text-gray-400 text-xs uppercase border-b border-white/5">
                            <tr>
                                <th className="px-6 py-4 font-medium">Company / Role</th>
                                <th className="px-6 py-4 font-medium">Date Applied</th>
                                <th className="px-6 py-4 font-medium">Match Score</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Next Step</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-gray-300">
                            {jobs.map((job, idx) => (
                                <tr key={idx} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg shrink-0 ${job.color}`}>
                                                {job.company[0]}
                                            </div>
                                            <div>
                                                <div className="font-medium text-white">{job.company}</div>
                                                <div className="text-xs text-gray-500">{job.role}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400">{job.date}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                                <div className={`h-full rounded-full ${scoreColors(job.score).split(' ')[0]}`} style={{ width: `${job.score}%` }}></div>
                                            </div>
                                            <span className={`font-mono text-xs ${scoreColors(job.score).split(' ')[1]}`}>{job.score}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[job.status]}`}>
                                            {job.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400">{job.nextStep}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => handleAnalyze(job as any)} className="text-electric hover:text-white transition-colors bg-electric/10 rounded p-1.5" title="Analyze">
                                                {loading && selectedJob === job ? <Loader2 className="w-4 h-4 animate-spin" /> : <BarChart2 className="w-4 h-4" />}
                                            </button>
                                            <button className="text-gray-500 hover:text-white transition-colors p-1.5">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Pagination */}
                <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-xs text-gray-500">Showing 1-4 of 142 applications</span>
                    <div className="flex gap-2">
                        <button className="p-1 rounded hover:bg-white/10 text-gray-400 disabled:opacity-50" disabled><ChevronLeft className="w-4 h-4" /></button>
                        <button className="p-1 rounded hover:bg-white/10 text-gray-400"><ChevronRight className="w-4 h-4" /></button>
                    </div>
                </div>
            </div>
        </div>
    );
}
