"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Mon', apps: 4 },
    { name: 'Tue', apps: 3 },
    { name: 'Wed', apps: 7 },
    { name: 'Thu', apps: 2 },
    { name: 'Fri', apps: 6 },
    { name: 'Sat', apps: 1 },
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
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold tracking-tight text-slate-100">Dashboard</h1>
                <p className="text-slate-400">Welcome back, <span className="text-neon font-medium capitalize">{userEmail}</span>.</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Total Applications", val: "124" },
                    { label: "Interviews", val: "3", color: "text-green-400" },
                    { label: "Pending", val: "45", color: "text-yellow-400" },
                    { label: "Success Rate", val: "2.4%", color: "text-blue-400" },
                ].map((stat, i) => (
                    <div key={i} className="p-6 rounded-2xl border border-white/10 bg-obsidian/50 hover:bg-obsidian/80 backdrop-blur-sm shadow-xl shadow-black/50 transition">
                        <h3 className="text-sm font-medium text-slate-400 mb-2">{stat.label}</h3>
                        <p className={`text-4xl font-bold ${stat.color || "text-slate-100"}`}>{stat.val}</p>
                    </div>
                ))}
            </div>

            {/* Charts Area */}
            <div className="h-96 rounded-2xl border border-white/10 bg-obsidian/50 backdrop-blur-sm shadow-xl p-6 flex flex-col">
                <h3 className="text-lg font-bold mb-6 text-slate-100">Application Activity</h3>
                <div className="flex-1 w-full min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                            <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0B0F19', borderColor: '#333', borderRadius: '8px', color: '#E2E8F0' }}
                                itemStyle={{ color: '#00F5FF' }}
                                cursor={{ fill: '#ffffff05' }}
                            />
                            <Bar dataKey="apps" fill="#6366F1" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
