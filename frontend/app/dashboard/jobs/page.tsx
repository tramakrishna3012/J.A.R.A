"use client";

"use client";

import { Plus, Search, Filter, Upload, BarChart2, X } from "lucide-react";
import { useState } from "react";

const jobs = [
    { company: "Google", role: "Frontend Engineer", status: "Applied", date: "2 mins ago" },
    { company: "Microsoft", role: "AI Researcher", status: "Interview", date: "1 day ago" },
    { company: "Netflix", role: "Senior UI Dev", status: "Saved", date: "3 days ago" },
];

const statusColors: any = {
    Applied: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    Interview: "bg-green-500/10 text-green-400 border-green-500/20",
    Saved: "bg-zinc-500/10 text-gray-400 border-zinc-500/20",
};

export default function JobsPage() {
    const [showAnalysis, setShowAnalysis] = useState(false);
    const [analysisData, setAnalysisData] = useState<any>(null);

    const handleAnalyze = () => {
        // Simulated API call result
        setAnalysisData({
            match_score: 85,
            missing_keywords: ["Kubernetes", "GraphQL", "AWS"]
        });
        setShowAnalysis(true);
    };

    return (
        <div className="space-y-6 relative">
            {/* Analysis Modal */}
            {showAnalysis && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <BarChart2 className="w-5 h-5 text-purple-500" />
                                ATS Analysis
                            </h3>
                            <button onClick={() => setShowAnalysis(false)} className="text-gray-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-4 border-purple-500/20 text-3xl font-bold text-white mb-2 relative">
                                    {analysisData?.match_score}%
                                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="46" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-purple-600" strokeDasharray={`${analysisData?.match_score * 2.9} 289`} />
                                    </svg>
                                </div>
                                <p className="text-sm text-gray-400">Match Score</p>
                            </div>

                            <div className="bg-zinc-950/50 rounded-xl p-4 border border-white/5">
                                <h4 className="font-medium text-sm text-gray-300 mb-3">Missing Keywords</h4>
                                <div className="flex flex-wrap gap-2">
                                    {analysisData?.missing_keywords.map((kw: string) => (
                                        <span key={kw} className="px-2 py-1 rounded-md bg-red-500/10 text-red-400 text-xs border border-red-500/20">
                                            {kw}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <button onClick={() => setShowAnalysis(false)} className="w-full py-3 bg-purple-600 rounded-xl font-medium hover:bg-purple-700 transition">
                                Optimize Resume for This Job
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">My Applications</h1>
                    <p className="text-gray-400">Track and manage your job hunt.</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 rounded-lg font-medium hover:bg-purple-700 transition">
                        <Plus className="w-4 h-4" />
                        Add Job
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-zinc-800 rounded-lg font-medium hover:bg-zinc-700 transition border border-white/10">
                        <Upload className="w-4 h-4" />
                        Import CSV
                    </button>
                </div>
            </header>

            {/* Filters */}
            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search companies or roles..."
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-zinc-700"
                    />
                </div>
                <button className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm font-medium hover:bg-zinc-800 flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Filter
                </button>
            </div>

            {/* Table */}
            <div className="rounded-2xl border border-white/10 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-zinc-900 text-gray-400 font-medium">
                        <tr>
                            <th className="p-4">Company</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Date Added</th>
                            <th className="p-4">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {jobs.map((job, i) => (
                            <tr key={i} className="hover:bg-white/5 transition">
                                <td className="p-4 font-medium">{job.company}</td>
                                <td className="p-4">{job.role}</td>
                                <td className="p-4">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[job.status] || ""}`}>
                                        {job.status}
                                    </span>
                                </td>
                                <td className="p-4 text-gray-400">{job.date}</td>
                                <td className="p-4">
                                    <button onClick={handleAnalyze} className="text-purple-400 hover:text-purple-300 flex items-center gap-1 text-xs font-medium bg-purple-500/10 px-3 py-1.5 rounded-full border border-purple-500/20">
                                        <BarChart2 className="w-3 h-3" />
                                        Analyze
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
