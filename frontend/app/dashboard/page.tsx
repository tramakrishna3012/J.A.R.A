"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, Send, Eye, Calendar, MessageSquare, Check, Mail, FileEdit, Search } from "lucide-react";

const chartData = [
    { name: 'Mon', apps: 12 },
    { name: 'Tue', apps: 19 },
    { name: 'Wed', apps: 15 },
    { name: 'Thu', apps: 25 },
    { name: 'Fri', apps: 22 },
    { name: 'Sat', apps: 10 },
    { name: 'Sun', apps: 14 },
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
                        <span className="text-xs font-medium text-green-400 flex items-center">+12% <Plus className="w-3 h-3 ml-1" /></span>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">142</div>
                    <div className="text-sm text-gray-500">Applications Sent</div>
                </div>

                <div className="glass-panel p-5 rounded-xl border border-white/5">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400"><Eye className="w-5 h-5" /></div>
                        <span className="text-xs font-medium text-green-400 flex items-center">+5% <Plus className="w-3 h-3 ml-1" /></span>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">68</div>
                    <div className="text-sm text-gray-500">Profile Views</div>
                </div>

                <div className="glass-panel p-5 rounded-xl border border-white/5">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-green-500/10 rounded-lg text-green-400"><Calendar className="w-5 h-5" /></div>
                        <span className="text-xs font-medium text-gray-400">This week</span>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">8</div>
                    <div className="text-sm text-gray-500">Interviews Scheduled</div>
                </div>

                <div className="glass-panel p-5 rounded-xl border border-white/5">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-400"><MessageSquare className="w-5 h-5" /></div>
                        <span className="text-xs font-medium text-gray-400">Pending</span>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">12</div>
                    <div className="text-sm text-gray-500">Replies Waiting</div>
                </div>
            </div>

            {/* Charts & Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart Area */}
                <div className="lg:col-span-2 glass-panel p-6 rounded-xl border border-white/5 flex flex-col">
                    <h3 className="font-heading text-lg font-semibold text-white mb-6">Application Activity</h3>
                    <div className="flex-1 min-h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.5}/>
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0B0F19', borderColor: '#1F2937', borderRadius: '8px', color: '#E2E8F0' }}
                                    itemStyle={{ color: '#6366f1' }}
                                />
                                <Line type="monotone" dataKey="apps" stroke="#6366f1" strokeWidth={2} dot={{ r: 4, fill: '#fff', stroke: '#6366f1' }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Activity Feed */}
                <div className="glass-panel p-6 rounded-xl border border-white/5">
                    <h3 className="font-heading text-lg font-semibold text-white mb-4">Live Agent Feed</h3>
                    <div className="space-y-6">
                        <div className="flex gap-3 relative">
                            <div className="absolute left-[11px] top-8 bottom-[-24px] w-0.5 bg-white/5"></div>
                            <div className="w-6 h-6 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center shrink-0 z-10">
                                <Check className="w-3 h-3 text-green-400" />
                            </div>
                            <div>
                                <p className="text-sm text-white">Applied to <span className="font-semibold">Netflix</span></p>
                                <p className="text-xs text-gray-500 mt-0.5">Senior Frontend Engineer • 2m ago</p>
                            </div>
                        </div>
                        <div className="flex gap-3 relative">
                            <div className="absolute left-[11px] top-8 bottom-[-24px] w-0.5 bg-white/5"></div>
                            <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/50 flex items-center justify-center shrink-0 z-10">
                                <Mail className="w-3 h-3 text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm text-white">Emailed Recruiter at <span className="font-semibold">Stripe</span></p>
                                <p className="text-xs text-gray-500 mt-0.5">Outreach Sequence #1 • 15m ago</p>
                            </div>
                        </div>
                        <div className="flex gap-3 relative">
                            <div className="absolute left-[11px] top-8 bottom-[-24px] w-0.5 bg-white/5"></div>
                            <div className="w-6 h-6 rounded-full bg-purple-500/20 border border-purple-500/50 flex items-center justify-center shrink-0 z-10">
                                <FileEdit className="w-3 h-3 text-purple-400" />
                            </div>
                            <div>
                                <p className="text-sm text-white">Tailored Resume for <span className="font-semibold">Airbnb</span></p>
                                <p className="text-xs text-gray-500 mt-0.5">Added "Design Systems" skill • 42m ago</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="w-6 h-6 rounded-full bg-yellow-500/20 border border-yellow-500/50 flex items-center justify-center shrink-0 z-10">
                                <Search className="w-3 h-3 text-yellow-400" />
                            </div>
                            <div>
                                <p className="text-sm text-white">Found 15 new matches</p>
                                <p className="text-xs text-gray-500 mt-0.5">Daily Scan • 1h ago</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
