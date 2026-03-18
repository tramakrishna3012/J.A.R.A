"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, FileText, Briefcase, Settings, LogOut, Mail, Home, Users, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
    { href: "/dashboard/jobs", icon: Briefcase, label: "My Jobs" },
    { href: "/dashboard/agent", icon: Bot, label: "Workstation" },
    { href: "/dashboard/mailbox", icon: Mail, label: "Mailbox" },
    { href: "/dashboard/outreach", icon: Users, label: "Outreach" },
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
            <aside className="w-64 h-screen glass-sidebar flex flex-col fixed md:relative z-20 hidden md:flex shrink-0">
                {/* Logo */}
                <div className="h-16 flex items-center px-6 border-b border-white/5 shrink-0">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold font-heading mr-3">J</div>
                    <span className="font-heading font-bold text-xl text-white tracking-tight">J.A.R.A</span>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-6 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "w-full flex items-center px-6 py-3 text-sm font-medium transition-colors hover:bg-white/5 hover:text-white",
                                    isActive ? "active-nav bg-white/5 text-white" : "text-gray-400"
                                )}
                            >
                                <item.icon className="w-5 h-5 mr-3 shrink-0" />
                                {item.label}
                                {item.label === 'Mailbox' && (
                                    <span className="ml-auto bg-primary-500/20 text-primary-400 py-0.5 px-2 rounded-full text-xs">4</span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Profile */}
                <div className="p-4 border-t border-white/5 shrink-0">
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors" onClick={handleSignOut}>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shrink-0"></div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">Alex Designer</p>
                            <p className="text-xs text-gray-500 truncate">Log out</p>
                        </div>
                        <LogOut className="w-4 h-4 text-gray-500 shrink-0" />
                    </div>
                </div>
            </aside>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 glass-panel border-t border-white/5 z-50 flex justify-around px-2 py-3 safe-area-bottom">
                {navItems.slice(0, 4).map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center gap-1 transition-colors px-3 py-1 rounded-lg",
                                isActive ? "text-primary-400 bg-white/5" : "text-gray-500 hover:text-gray-300"
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    );
                })}
                <Link
                    href="/dashboard/settings"
                    className={cn(
                        "flex flex-col items-center gap-1 transition-colors px-3 py-1 rounded-lg",
                        pathname === "/dashboard/settings" ? "text-primary-400 bg-white/5" : "text-gray-500 hover:text-gray-300"
                    )}
                >
                    <Settings className="w-5 h-5" />
                    <span className="text-[10px] font-medium">Settings</span>
                </Link>
            </div>
        </>
    );
}
