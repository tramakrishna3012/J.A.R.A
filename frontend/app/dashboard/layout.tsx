"use client";

import { Sidebar } from "@/components/layouts/Sidebar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

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
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
        );
    }

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

                    <div className="flex items-center gap-4 hidden md:flex">
                        <div className="flex items-center px-3 py-1.5 bg-background-800 rounded-lg border border-white/10">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-zap text-yellow-400 mr-2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                            <span className="text-sm font-medium text-white">840</span>
                            <span className="text-xs text-gray-500 ml-1">credits</span>
                        </div>
                        <button className="p-2 text-gray-400 hover:text-white transition-colors relative">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-background-900"></span>
                        </button>
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
