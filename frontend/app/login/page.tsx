"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
    const [step, setStep] = useState('login');
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [verifying, setVerifying] = useState(false);
    const router = useRouter();

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            alert(error.message);
            setLoading(false);
        } else {
            // Trigger animation sequence
            setStep('verify');
            setTimeout(() => {
                setVerifying(true);
                setTimeout(() => {
                    router.push("/dashboard");
                }, 4000);
            }, 500);
        }
    };

    const handleGoogleAuth = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/dashboard`,
            },
        });
    };

    return (
        <div className="min-h-screen flex flex-col bg-night text-slate-200 premium-gradient selection:bg-electric/30">
            <div className="noise"></div>

            {/* Simple Auth Nav */}
            <nav className="fixed top-0 w-full z-50 py-8 px-8">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-electric to-neon rounded-lg flex items-center justify-center">
                            <span className="font-bold text-night text-sm">J</span>
                        </div>
                        <span className="text-xl font-bold tracking-tighter uppercase">J.A.R.A</span>
                    </div>
                    <Link href="/" className="text-xs font-bold tracking-widest text-ash hover:text-white transition-colors uppercase">Back to Terminal</Link>
                </div>
            </nav>

            <main className="flex-grow flex items-center justify-center p-6 pt-24 relative z-10">
                
                {/* Login Card */}
                {step === 'login' && (
                    <div className="w-full max-w-[440px] glass-card shadow-2xl rounded-3xl p-10 relative overflow-hidden animate-fade-in-up">
                        <div className="mb-10 text-center">
                            <h1 className="text-3xl font-bold mb-3 tracking-tight">System Access</h1>
                            <p className="text-ash text-sm">Deploy your autonomous agent by authenticating your identity.</p>
                        </div>

                        {/* SSO Group */}
                        <div className="space-y-3 mb-8">
                            <button onClick={handleGoogleAuth} className="w-full py-3.5 px-4 rounded-xl flex items-center justify-center space-x-3 group border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20 hover:-translate-y-0.5 transition-all">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                </svg>
                                <span className="text-sm font-bold">Continue with Google</span>
                            </button>
                        </div>

                        <div className="relative flex items-center mb-8">
                            <div className="flex-grow border-t border-white/5"></div>
                            <span className="flex-shrink mx-4 text-[10px] font-bold tracking-[0.2em] text-ash uppercase">Secure Direct</span>
                            <div className="flex-grow border-t border-white/5"></div>
                        </div>

                        {/* Email Form */}
                        <form onSubmit={handleEmailAuth} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-ash uppercase tracking-widest mb-2 ml-1">Work Email</label>
                                <input 
                                    type="email" 
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@company.com" 
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-electric focus:bg-electric/5 focus:outline-none focus:shadow-[0_0_20px_rgba(99,102,241,0.1)] transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-ash uppercase tracking-widest mb-2 ml-1">Password</label>
                                <input 
                                    type="password" 
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••" 
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-electric focus:bg-electric/5 focus:outline-none focus:shadow-[0_0_20px_rgba(99,102,241,0.1)] transition-all"
                                />
                            </div>
                            <button 
                                type="submit"
                                disabled={loading || !email || !password} 
                                className="w-full bg-white text-night py-4 rounded-xl font-bold text-sm hover:bg-electric hover:text-white transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                            >
                                {!loading ? (
                                    <span>Initialize Agent Deployment</span>
                                ) : (
                                    <div className="w-5 h-5 border-2 border-night/20 border-t-night animate-spin rounded-full"></div>
                                )}
                            </button>
                        </form>

                        <p className="mt-8 text-center text-xs text-ash">
                            Need clearance? <Link href="/signup" className="text-electric hover:text-neon transition">Request Access Here</Link>
                        </p>
                    </div>
                )}

                {/* Verification Step */}
                {step === 'verify' && (
                    <div className="w-full max-w-[500px] text-center animate-fade-in-up">
                        
                        <div className="relative inline-block mb-12">
                            {/* Identity Frame */}
                            <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border-2 border-electric/30 p-2 relative">
                                <div className="w-full h-full rounded-full border border-neon/50 overflow-hidden relative">
                                    {/* Visual Scan Effect */}
                                    <div className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-neon to-transparent shadow-[0_0_15px_#00F5FF] z-20 animate-scan"></div>
                                    <Image src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400" fill className="object-cover grayscale opacity-60" alt="Identity Preview" />
                                </div>
                                {/* UI Elements surrounding portal */}
                                <div className="absolute -top-2 -right-2 w-10 h-10 bg-night border border-electric rounded-lg flex items-center justify-center animate-bounce">
                                    <svg className="w-5 h-5 text-neon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                </div>
                            </div>
                            {/* Outer pulse */}
                            <div className="absolute inset-0 rounded-full bg-electric/20 animate-ping -z-10"></div>
                        </div>

                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold italic tracking-tighter">Syncing Neural Identity...</h2>
                            
                            <div className="bg-electric/10 border border-electric/30 border-dashed p-6 rounded-2xl max-w-sm mx-auto font-mono text-left">
                                <div className="flex justify-between text-[10px] text-electric mb-2">
                                    <span>AGENT_HANDSHAKE</span>
                                    <span className="animate-pulse">ONLINE</span>
                                </div>
                                <div className="space-y-1 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-ash">SUBJECT:</span>
                                        <span>{email || 'USER_ALPHA_9'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-ash">AUTH_TYPE:</span>
                                        <span>SECURE_ENCRYPTED</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-ash">STATUS:</span>
                                        <span className="text-neon">VERIFYING BIOMETRICS</span>
                                    </div>
                                </div>
                            </div>

                            <div className="max-w-[200px] mx-auto h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className={`h-full bg-gradient-to-r from-electric to-neon transition-all duration-[4000ms] ease-out ${verifying ? 'w-full' : 'w-0'}`}></div>
                            </div>
                            
                            <p className="text-ash text-sm animate-pulse">Establishing secure handshake with J.A.R.A servers...</p>
                        </div>
                    </div>
                )}
            </main>

            {/* Footer Stats */}
            <footer className="p-8 border-t border-white/5">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-[10px] font-bold tracking-[0.3em] text-ash uppercase">
                    <div className="flex space-x-6 mb-4 md:mb-0">
                        <div className="flex items-center space-x-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                            <span>System Nominal</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-electric animate-pulse"></span>
                            <span>Encrypted Tunnel Active</span>
                        </div>
                    </div>
                    <div>
                        Node: JARA-AUTH-CORE-01 // Latency: 14ms
                    </div>
                </div>
            </footer>
        </div>
    );
}
