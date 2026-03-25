"use client";

import { Sidebar } from "@/components/layouts/Sidebar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2, Bell, CheckCircle2, MessageSquare, Briefcase } from "lucide-react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [notificationsOpen, setNotificationsOpen] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.replace("/login");
            } else {
                setLoading(false);
            }
        };
        checkAuth();
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
        );
    }

    const notifications = [
        { id: 1, type: 'success', title: 'Application Submitted', text: 'Successfully applied to Google (Senior Engineer)', time: '2m ago', icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-500/10' },
        { id: 2, type: 'message', title: 'New Message', text: 'Recruiter from Stripe viewed your profile', time: '1h ago', icon: MessageSquare, color: 'text-blue-400', bg: 'bg-blue-500/10' },
        { id: 3, type: 'job', title: 'New Matches', text: 'J.A.R.A found 5 new jobs matching your skills', time: '3h ago', icon: Briefcase, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    ];

    return (
        <div className="flex h-screen overflow-hidden bg-background-950 text-white selection:bg-primary-500/30">
            <Sidebar />
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
                {/* Top Header */}
                <header className="h-16 glass-panel border-b-0 border-white/5 flex items-center justify-between px-4 md:px-6 z-10 shrink-0">
                    <div className="flex items-center md:hidden">
                        <button className="text-gray-400 hover:text-white mr-4">
                            {/* Assuming some mobile menu toggle will be added later if needed */}
                        </button>
                        <span className="font-heading font-bold text-lg text-white">J.A.R.A</span>
                    </div>

                    <div className="hidden md:flex items-center text-sm text-gray-400">
                        <span className="mr-2">Status:</span>
                        <span className="flex items-center text-green-400 gap-1.5 px-2 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            Agent Active
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center px-3 py-1.5 bg-background-800 rounded-lg border border-white/10">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-zap text-yellow-400 mr-2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                            <span className="text-sm font-medium text-white">840</span>
                            <span className="text-xs text-gray-500 ml-1">credits</span>
                        </div>
                        
                        {/* Notification Bell */}
                        <div className="relative">
                            <button 
                                onClick={() => setNotificationsOpen(!notificationsOpen)}
                                className="p-2 text-gray-400 hover:text-white transition-colors relative focus:outline-none"
                            >
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-background-900"></span>
                            </button>

                            {/* Notifications Dropdown */}
                            {notificationsOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)}></div>
                                    <div className="absolute right-0 mt-2 w-80 glass-panel border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-fade-in-up origin-top-right">
                                        <div className="px-4 py-3 border-b border-white/5 bg-background-900/50 flex items-center justify-between">
                                            <h3 className="font-semibold text-white text-sm">Notifications</h3>
                                            <span className="text-xs text-primary-400 cursor-pointer hover:underline" onClick={() => setNotificationsOpen(false)}>Mark all as read</span>
                                        </div>
                                        <div className="max-h-[300px] overflow-y-auto">
                                            {notifications.map((notif) => (
                                                <div key={notif.id} className="px-4 py-3 hover:bg-white/5 transition-colors cursor-pointer flex gap-3 border-b border-white/5 last:border-0" onClick={() => setNotificationsOpen(false)}>
                                                    <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${notif.bg} ${notif.color}`}>
                                                        <notif.icon className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-white">{notif.title}</p>
                                                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{notif.text}</p>
                                                        <p className="text-[10px] text-gray-500 mt-1">{notif.time}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="px-4 py-2 border-t border-white/5 bg-background-900/50 text-center">
                                            <button className="text-xs text-gray-400 hover:text-white transition-colors">View All Activity</button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 relative">
                    {children}
                </div>
            </main>
        </div>
    );
}
