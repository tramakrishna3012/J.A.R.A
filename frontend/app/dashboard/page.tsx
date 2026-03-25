"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, Send, Eye, Calendar, MessageSquare, Check, Mail, FileEdit, Search, BarChart2, Bot } from "lucide-react";

const chartData = [
    { name: 'Mon', apps: 0 },
    { name: 'Tue', apps: 0 },
    { name: 'Wed', apps: 0 },
    { name: 'Thu', apps: 0 },
    { name: 'Fri', apps: 0 },
    { name: 'Sat', apps: 0 },
    { name: 'Sun', apps: 0 },
];

export default function DashboardPage() {
    const [userEmail, setUserEmail] = useState("User");

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user?.email) setUserEmail(user.email.split("@")[0]);
        };
        getUser();
    }, []);

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in-up">
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                <div>
                    <h1 className="font-heading text-3xl font-bold text-white mb-2 capitalize">Good morning, {userEmail}</h1>
                    <p className="text-gray-400">Here's what J.A.R.A has done for you today.</p>
                </div>
                <button className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center shadow-glow w-fit">
                    <Plus className="w-4 h-4 mr-2" /> New Search
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass-panel p-5 rounded-xl border border-white/5">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><Send className="w-5 h-5" /></div>
                        <span className="text-xs font-medium text-gray-500 flex items-center">0%</span>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">0</div>
                    <div className="text-sm text-gray-500">Applications Sent</div>
                </div>

                <div className="glass-panel p-5 rounded-xl border border-white/5">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400"><Eye className="w-5 h-5" /></div>
                        <span className="text-xs font-medium text-gray-500 flex items-center">0%</span>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">0</div>
                    <div className="text-sm text-gray-500">Profile Views</div>
                </div>

                <div className="glass-panel p-5 rounded-xl border border-white/5">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-green-500/10 rounded-lg text-green-400"><Calendar className="w-5 h-5" /></div>
                        <span className="text-xs font-medium text-gray-400">This week</span>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">0</div>
                    <div className="text-sm text-gray-500">Interviews Scheduled</div>
                </div>

                <div className="glass-panel p-5 rounded-xl border border-white/5">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-400"><MessageSquare className="w-5 h-5" /></div>
                        <span className="text-xs font-medium text-gray-400">Pending</span>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">0</div>
                    <div className="text-sm text-gray-500">Replies Waiting</div>
                </div>
            </div>

            {/* Charts & Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart Area */}
                <div className="lg:col-span-2 glass-panel p-6 rounded-xl border border-white/5 flex flex-col">
                    <h3 className="font-heading text-lg font-semibold text-white mb-6">Application Activity</h3>
                    <div className="flex-1 min-h-[250px] w-full flex items-center justify-center">
                        {/* Empty State for Chart */}
                        <div className="text-center text-gray-500 flex flex-col items-center">
                            <BarChart2 className="w-12 h-12 mb-3 text-gray-700" />
                            <p className="text-sm">No application data yet.</p>
                            <p className="text-xs mt-1">Start a job search to see activity.</p>
                        </div>
                    </div>
                </div>

                {/* Recent Activity Feed */}
                <div className="glass-panel p-6 rounded-xl border border-white/5">
                    <h3 className="font-heading text-lg font-semibold text-white mb-4">Live Agent Feed</h3>
                    <div className="space-y-6 flex flex-col items-center justify-center h-[250px] text-gray-500">
                        <Bot className="w-10 h-10 mb-3 text-gray-700" />
                        <p className="text-sm">Agent is standing by.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
