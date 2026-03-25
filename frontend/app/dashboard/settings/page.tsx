"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User as UserIcon, Mail, LogOut, Loader2, Save, KeyRound } from "lucide-react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";

export default function SettingsPage() {
    const [user, setUser] = useState<User | null>(null);
    const [fullName, setFullName] = useState("");
    const [password, setPassword] = useState("");
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
                setFullName(user.user_metadata?.full_name || "");
            }
        };
        getUser();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    const handleUpdateProfile = async () => {
        if (!fullName.trim()) return;
        setIsUpdatingProfile(true);
        const { error } = await supabase.auth.updateUser({
            data: { full_name: fullName.trim() }
        });
        setIsUpdatingProfile(false);
        
        if (error) {
            alert(error.message);
        } else {
            alert("Profile updated successfully!");
            window.location.reload(); // Reload to refresh Sidebar
        }
    };

    const handleUpdatePassword = async () => {
        if (!password.trim() || password.length < 6) {
            alert("Password must be at least 6 characters.");
            return;
        }
        setIsUpdatingPassword(true);
        const { error } = await supabase.auth.updateUser({
            password: password
        });
        setIsUpdatingPassword(false);

        if (error) {
            alert(error.message);
        } else {
            alert("Password updated successfully!");
            setPassword("");
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 animate-fade-in-up">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="font-heading text-3xl font-bold text-white mb-2">Settings</h1>
                    <p className="text-gray-400">Manage your account preferences</p>
                </div>
            </header>

            <div className="max-w-3xl space-y-6">
                {/* Profile Card */}
                <div className="p-6 rounded-2xl border border-white/5 glass-panel shadow-lg">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                        <UserIcon className="w-5 h-5 text-primary-500" />
                        Profile
                    </h2>

                    <div className="space-y-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-400">Full Name</label>
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                <input 
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="flex-1 px-4 py-3 bg-background-900 rounded-xl border border-white/10 text-white focus:outline-none focus:border-primary-500 transition-colors"
                                    placeholder="Enter your name"
                                />
                                <button 
                                    onClick={handleUpdateProfile}
                                    disabled={isUpdatingProfile || !fullName.trim() || fullName.trim() === user?.user_metadata?.full_name}
                                    className="px-6 py-3 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white rounded-xl font-medium transition-colors shadow-glow flex items-center justify-center gap-2"
                                >
                                    {isUpdatingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    Save
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-400">Email Address</label>
                            <div className="flex items-center gap-3 px-4 py-3 bg-background-900/50 rounded-xl border border-white/5 text-gray-400 cursor-not-allowed">
                                <Mail className="w-4 h-4 text-gray-500" />
                                {user?.email || "Loading..."}
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-400">User ID</label>
                            <div className="px-4 py-3 bg-background-900/50 rounded-xl border border-white/5 text-gray-500 font-mono text-xs overflow-x-auto cursor-not-allowed">
                                {user?.id || "Loading..."}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Password Card */}
                <div className="p-6 rounded-2xl border border-white/5 glass-panel shadow-lg">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                        <KeyRound className="w-5 h-5 text-accent-500" />
                        Security
                    </h2>
                    
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-400">Change Password</label>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            <input 
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="flex-1 px-4 py-3 bg-background-900 rounded-xl border border-white/10 text-white focus:outline-none focus:border-accent-500 transition-colors"
                                placeholder="Enter new password"
                            />
                            <button 
                                onClick={handleUpdatePassword}
                                disabled={isUpdatingPassword || password.length < 6}
                                className="px-6 py-3 bg-accent-600 hover:bg-accent-500 disabled:opacity-50 text-white rounded-xl font-medium transition-colors shadow-glow flex items-center justify-center gap-2"
                            >
                                {isUpdatingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Update Password
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters long.</p>
                    </div>
                </div>

                {/* Account Actions */}
                <div className="p-6 rounded-2xl border border-red-500/10 bg-red-500/5 shadow-lg relative overflow-hidden glass-panel">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-[50px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
                    <h2 className="text-xl font-bold mb-6 text-red-500 relative z-10 flex items-center gap-2">
                        Danger Zone
                    </h2>
                    <button
                        onClick={handleLogout}
                        className="relative z-10 flex items-center justify-center gap-2 px-6 py-3 bg-red-500/10 text-red-500 rounded-xl font-medium hover:bg-red-500/20 transition-colors border border-red-500/20 w-full sm:w-auto shadow-[0_0_15px_rgba(239,68,68,0.1)]"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
}
