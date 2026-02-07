"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, FileText, Briefcase, Settings, LogOut, Mail, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
    { href: "/dashboard/jobs", icon: Briefcase, label: "My Jobs" },
    { href: "/dashboard/mailbox", icon: Mail, label: "Mailbox" },
    { href: "/dashboard/resume", icon: FileText, label: "Resume AI" },
    { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/login"); // Redirect to login
        router.refresh(); // Clear client cache
    };

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-64 bg-zinc-900 border-r border-white/10 flex-col h-screen fixed left-0 top-0 z-50">
                <div className="p-6 flex items-center gap-3">
                    <div className="relative w-8 h-8 shrink-0">
                        <img src="/logo.png" alt="J.A.R.A" className="object-contain w-full h-full" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent truncate">J.A.R.A</span>
                </div>

                <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium",
                                    isActive ? "bg-purple-600 text-white shadow-lg shadow-purple-900/20" : "text-gray-400 hover:bg-white/5 hover:text-white"
                                )}
                            >
                                <item.icon className="w-5 h-5 shrink-0" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="px-4 pb-2">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white border border-white/5"
                    >
                        <Home className="w-5 h-5 shrink-0" />
                        Back to Website
                    </Link>
                </div>

                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-500/10 transition text-sm font-medium"
                    >
                        <LogOut className="w-5 h-5 shrink-0" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-white/10 z-50 flex justify-between px-6 py-3 safe-area-bottom">
                {navItems.slice(0, 4).map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center gap-1",
                                isActive ? "text-purple-500" : "text-gray-500"
                            )}
                        >
                            <item.icon className="w-6 h-6" />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    );
                })}
                <Link
                    href="/dashboard/settings"
                    className={cn(
                        "flex flex-col items-center gap-1",
                        pathname === "/dashboard/settings" ? "text-purple-500" : "text-gray-500"
                    )}
                >
                    <Settings className="w-6 h-6" />
                    <span className="text-[10px] font-medium">Settings</span>
                </Link>
            </div>
        </>
    );
}
