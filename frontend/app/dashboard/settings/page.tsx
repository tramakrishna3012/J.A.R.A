"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User, Mail, LogOut, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SettingsPage() {
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    return (
        <div className="space-y-6">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Settings</h1>
                    <p className="text-gray-400">Manage your account preferences</p>
                </div>
                <Link href="/" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Website
                </Link>
            </header>

            <div className="max-w-2xl space-y-6">
                {/* Profile Card */}
                <div className="p-6 rounded-2xl border border-white/10 bg-zinc-900/50">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <User className="w-5 h-5 text-purple-400" />
                        Profile
                    </h2>

                    <div className="space-y-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-400">Email Address</label>
                            <div className="flex items-center gap-3 px-4 py-3 bg-zinc-950 rounded-xl border border-white/5 text-gray-200">
                                <Mail className="w-4 h-4 text-gray-500" />
                                {user?.email || "Loading..."}
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-400">User ID</label>
                            <div className="px-4 py-3 bg-zinc-950 rounded-xl border border-white/5 text-gray-500 font-mono text-sm">
                                {user?.id || "Loading..."}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Account Actions */}
                <div className="p-6 rounded-2xl border border-white/10 bg-zinc-900/50">
                    <h2 className="text-xl font-bold mb-6 text-red-400">Danger Zone</h2>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-6 py-3 bg-red-500/10 text-red-500 rounded-xl font-medium hover:bg-red-500/20 transition border border-red-500/20 w-full justify-center sm:w-auto"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
}
