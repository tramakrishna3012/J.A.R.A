"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";
import { 
  ArrowRight, Menu, Play, Star, Bot, Search, FileEdit, Mail, 
  Send, BarChart2, CalendarCheck, Sparkles, UserCheck, 
  RefreshCw, Target, Settings, Terminal, Check, Zap
} from "lucide-react";

// Components and items initialized exactly as before
const feedItems = [
    { icon: Check, color: 'text-green-400 bg-green-500/20', textColor: 'text-green-400', text: <>Applied to <span className="text-white font-medium">Netflix</span> — Senior Frontend Engineer</> },
    { icon: FileEdit, color: 'text-blue-400 bg-blue-500/20', textColor: 'text-blue-400', text: <>Tailored resume for <span className="text-white font-medium">Stripe</span> — ATS 96%</> },
    { icon: Mail, color: 'text-purple-400 bg-purple-500/20', textColor: 'text-purple-400', text: <>Outreach sent to <span className="text-white font-medium">Vercel</span> recruiter</> },
    { icon: Search, color: 'text-yellow-400 bg-yellow-500/20', textColor: 'text-yellow-400', text: <>Found 8 new matches for <span className="text-white font-medium">Design Engineer</span></> },
    { icon: CalendarCheck, color: 'text-pink-400 bg-pink-500/20', textColor: 'text-pink-400', text: <>Interview scheduled with <span className="text-white font-medium">Figma</span></> },
    { icon: Check, color: 'text-green-400 bg-green-500/20', textColor: 'text-green-400', text: <>Applied to <span className="text-white font-medium">OpenAI</span> — Product Designer</> },
];

const logEntries = [
    { time: '10:42:01', type: 'SUCCESS', color: 'text-green-400', msg: <>Applied to <span className="text-white">Netflix</span> — Senior Frontend Engineer (ATS: 98%)</> },
    { time: '10:42:15', type: 'TAILOR', color: 'text-cyan-400', msg: <>Resume tailored for <span className="text-white">Figma</span> — Added "Design Systems" keyword cluster</> },
    { time: '10:42:28', type: 'OUTREACH', color: 'text-purple-400', msg: <>Email sent to <span className="text-white">Tom Chen</span> @ OpenAI — Open rate predicted: 72%</> },
    { time: '10:42:40', type: 'SCAN', color: 'text-blue-400', msg: <>Found <span className="text-white">8 new matches</span> — Product Designer, UX Engineer roles</> },
    { time: '10:42:52', type: 'SUCCESS', color: 'text-green-400', msg: <>Applied to <span className="text-white">Airbnb</span> — Design Engineer (ATS: 91%)</> },
    { time: '10:43:05', type: 'SCORE', color: 'text-yellow-400', msg: <>Scored 32 jobs — 8 above 80% threshold, queued for application</> },
    { time: '10:43:18', type: 'FOLLOWUP', color: 'text-pink-400', msg: <>Follow-up #2 sent to <span className="text-white">Stripe</span> recruiter — Day 3 sequence</> },
];

export default function Home() {
  const [session, setSession] = useState<Session | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  // States for live feed
  const [activeFeedItems, setActiveFeedItems] = useState(feedItems.slice(0, 3));
  
  // States for process logic
  const [activeStep, setActiveStep] = useState(1);
  const [activeLogs, setActiveLogs] = useState(logEntries.slice(0, 5));

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intervals for animations
  useEffect(() => {
    if (!mounted) return;
    const feedInterval = setInterval(() => {
      setActiveFeedItems(current => {
        const next = (feedItems.indexOf(current[current.length - 1] || feedItems[0]) + 1) % feedItems.length;
        const newItems = [...current, feedItems[next]];
        if (newItems.length > 3) return newItems.slice(1);
        return newItems;
      });
    }, 3000);

    const logInterval = setInterval(() => {
      setActiveLogs(current => {
        const next = (logEntries.indexOf(current[current.length - 1] || logEntries[0]) + 1) % logEntries.length;
        const newLogs = [...current, logEntries[next]];
        if (newLogs.length > 5) return newLogs.slice(1);
        return newLogs;
      });
    }, 2500);

    const stepInterval = setInterval(() => {
      setActiveStep(prev => (prev % 5) + 1);
    }, 1800);

    return () => {
      clearInterval(feedInterval);
      clearInterval(logInterval);
      clearInterval(stepInterval);
    };
  }, [mounted]);

  return (
    <div className="relative min-h-screen bg-background-950 text-slate-200 overflow-x-hidden pt-16">
      
      {/* NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center px-6 lg:px-12 transition-all duration-300 ${scrolled ? 'glass-nav backdrop-blur-md' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
                <div className="w-9 h-9 rounded-large bg-gradient-to-br from-primary-500 to-accent-400 flex items-center justify-center text-white font-bold font-heading text-lg shadow-glow group-hover:shadow-glow-strong transition-all duration-300">J</div>
                <span className="font-heading font-bold text-xl text-white tracking-tight">J.A.R.A</span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-medium">Beta</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
                <Link href="#home" className="px-4 py-2 text-sm text-white font-medium rounded-small hover:bg-white/5 transition-colors">Home</Link>
                <Link href="#features" className="px-4 py-2 text-sm text-gray-400 hover:text-white font-medium rounded-small hover:bg-white/5 transition-colors">Features</Link>
                <Link href="#how-it-works" className="px-4 py-2 text-sm text-gray-400 hover:text-white font-medium rounded-small hover:bg-white/5 transition-colors">How It Works</Link>
                {session && <Link href="/dashboard" className="px-4 py-2 text-sm text-gray-400 hover:text-white font-medium rounded-small hover:bg-white/5 transition-colors">Dashboard</Link>}
            </div>

            <div className="flex items-center gap-3">
                {!session ? (
                  <>
                    <Link href="/login" className="hidden sm:inline-flex items-center px-4 py-2 text-sm text-gray-300 hover:text-white border border-white/10 hover:border-white/20 rounded-small transition-all duration-200 hover:bg-white/5">
                        Sign In
                    </Link>
                    <Link href="/signup" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-500 rounded-small transition-all duration-200 shadow-glow hover:shadow-glow-strong">
                        Get Started
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </>
                ) : (
                  <Link href="/dashboard" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-500 rounded-small transition-all duration-200 shadow-glow hover:shadow-glow-strong hidden sm:inline-flex">
                      Terminal Access
                      <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
                <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-gray-400 hover:text-white transition-colors">
                    <Menu className="w-5 h-5" />
                </button>
            </div>
        </div>
        {/* Mobile menu dropdown */}
        {menuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-background-900 border-b border-white/10 p-4 flex flex-col gap-2 md:hidden">
            <Link onClick={() => setMenuOpen(false)} href="#home" className="p-2 text-sm text-gray-300 hover:text-white">Home</Link>
            <Link onClick={() => setMenuOpen(false)} href="#features" className="p-2 text-sm text-gray-300 hover:text-white">Features</Link>
            <Link onClick={() => setMenuOpen(false)} href="#how-it-works" className="p-2 text-sm text-gray-300 hover:text-white">How It Works</Link>
            {session && <Link onClick={() => setMenuOpen(false)} href="/dashboard" className="p-2 text-sm text-primary-400 font-bold">Terminal Access</Link>}
            {!session && <Link onClick={() => setMenuOpen(false)} href="/login" className="p-2 text-sm text-gray-300 hover:text-white">Sign In</Link>}
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <section id="home" className="relative overflow-hidden pt-16 lg:h-[900px]">
        <div className="absolute inset-0 hero-radial pointer-events-none"></div>
        <div className="absolute inset-0 hero-grid pointer-events-none"></div>
        <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full bg-primary-500/5 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-accent-400/5 blur-3xl pointer-events-none"></div>
        <div className="absolute top-40 right-10 w-64 h-64 rounded-full bg-accent-purple/5 blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 lg:py-20 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                
                {/* Text Content */}
                <div className="text-center lg:text-left z-20">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-medium mb-8 animate-fade-in-up">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                        </span>
                        AI-Powered Job Application Agent
                    </div>
                    <h1 className="font-heading text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-6 animate-fade-in-up delay-100">
                        Your AI Agent<br/>
                        for <span className="shimmer-text">Job Applications</span>
                    </h1>
                    <p className="text-gray-400 text-lg lg:text-xl leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0 animate-fade-in-up delay-200">
                        J.A.R.A autonomously searches, tailors resumes, drafts outreach emails, and tracks every application — so you can focus on what matters: landing the job.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12 animate-fade-in-up delay-300">
                        <Link href="/signup" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-semibold text-white bg-primary-600 hover:bg-primary-500 rounded-small transition-all duration-200 shadow-glow hover:shadow-glow-strong group">
                            Get Started Free
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <a href="#how-it-works" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-medium text-gray-300 hover:text-white border border-white/10 hover:border-white/20 rounded-small transition-all duration-200 hover:bg-white/5 group">
                            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-primary-500/20 transition-colors">
                                <Play className="w-3 h-3 text-white ml-0.5" />
                            </div>
                            See How It Works
                        </a>
                    </div>
                    
                    {/* Social Proof */}
                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 animate-fade-in-up delay-400">
                        <div className="flex -space-x-2">
                            {[1, 2, 3, 4].map(i => (
                                <img key={i} src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User profile" className="w-8 h-8 rounded-full border-2 border-background-950 object-cover" />
                            ))}
                            <div className="w-8 h-8 rounded-full border-2 border-background-950 bg-primary-600 flex items-center justify-center text-white text-xs font-bold">+</div>
                        </div>
                        <div>
                            <div className="flex items-center gap-1 mb-0.5">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />)}
                                <span className="text-white text-sm font-semibold ml-1">4.9</span>
                            </div>
                            <p className="text-gray-500 text-xs">Trusted by 12,000+ job seekers</p>
                        </div>
                    </div>
                </div>

                {/* Animated Visual */}
                <div className="relative flex items-center justify-center animate-fade-in-up delay-300 w-full max-w-lg mx-auto z-10 pt-10 lg:pt-0">
                    <div className="relative flex items-center justify-center w-full" style={{ height: 480 }}>
                        <div className="absolute w-48 h-48 rounded-full border border-primary-500/10 border-dashed hidden sm:block"></div>
                        <div className="absolute w-64 h-64 rounded-full border border-accent-400/8 border-dashed hidden sm:block" style={{ borderColor: 'rgba(34,211,238,0.08)' }}></div>
                        
                        {/* Core */}
                        <div className="relative z-20 animate-pulse-glow">
                            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-500 flex flex-col items-center justify-center shadow-glow-strong">
                                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-1">
                                    <Bot className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-white font-heading font-bold text-sm">J.A.R.A</span>
                            </div>
                            <div className="absolute inset-0 rounded-2xl bg-primary-500/20 animate-ping" style={{ animationDuration: '2s' }}></div>
                        </div>

                        {/* Nodes (Desktop Only for simpler view) */}
                        <div className="hidden sm:block">
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 animate-float" style={{ animationDelay: '0s' }}>
                                <div className="glass-panel rounded-large p-3 flex flex-col items-center gap-1.5 w-28 border border-primary-500/20 shadow-glow">
                                    <div className="w-8 h-8 rounded-small bg-blue-500/20 flex items-center justify-center"><Search className="w-4 h-4 text-blue-400" /></div>
                                    <span className="text-white text-xs font-medium font-heading">Job Search</span>
                                </div>
                                <div className="absolute left-1/2 -translate-x-1/2 top-full w-px h-12 bg-gradient-to-b from-blue-500/40 to-transparent"></div>
                            </div>
                            <div className="absolute top-16 right-4 z-10 animate-float" style={{ animationDelay: '0.8s' }}>
                                <div className="glass-panel rounded-large p-3 flex flex-col items-center gap-1.5 w-28 border border-accent-400/20">
                                    <div className="w-8 h-8 rounded-small bg-cyan-500/20 flex items-center justify-center"><FileEdit className="w-4 h-4 text-cyan-400" /></div>
                                    <span className="text-white text-xs font-medium font-heading">Resume AI</span>
                                </div>
                            </div>
                            <div className="absolute top-1/2 -translate-y-1/2 right-0 z-10 animate-float" style={{ animationDelay: '1.6s' }}>
                                <div className="glass-panel rounded-large p-3 flex flex-col items-center gap-1.5 w-28 border border-purple-500/20">
                                    <div className="w-8 h-8 rounded-small bg-purple-500/20 flex items-center justify-center"><Mail className="w-4 h-4 text-purple-400" /></div>
                                    <span className="text-white text-xs font-medium font-heading">Outreach</span>
                                </div>
                            </div>
                            <div className="absolute bottom-16 right-4 z-10 animate-float" style={{ animationDelay: '2.4s' }}>
                                <div className="glass-panel rounded-large p-3 flex flex-col items-center gap-1.5 w-28 border border-green-500/20">
                                    <div className="w-8 h-8 rounded-small bg-green-500/20 flex items-center justify-center"><Send className="w-4 h-4 text-green-400" /></div>
                                    <span className="text-white text-xs font-medium font-heading">Applied</span>
                                </div>
                            </div>
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 animate-float" style={{ animationDelay: '1.2s' }}>
                                <div className="glass-panel rounded-large p-3 flex flex-col items-center gap-1.5 w-28 border border-yellow-500/20">
                                    <div className="w-8 h-8 rounded-small bg-yellow-500/20 flex items-center justify-center"><BarChart2 className="w-4 h-4 text-yellow-400" /></div>
                                    <span className="text-white text-xs font-medium font-heading">Tracker</span>
                                </div>
                                <div className="absolute left-1/2 -translate-x-1/2 bottom-full w-px h-12 bg-gradient-to-t from-yellow-500/40 to-transparent"></div>
                            </div>
                            <div className="absolute top-1/2 -translate-y-1/2 left-0 z-10 animate-float" style={{ animationDelay: '2s' }}>
                                <div className="glass-panel rounded-large p-3 flex flex-col items-center gap-1.5 w-28 border border-pink-500/20">
                                    <div className="w-8 h-8 rounded-small bg-pink-500/20 flex items-center justify-center"><CalendarCheck className="w-4 h-4 text-pink-400" /></div>
                                    <span className="text-white text-xs font-medium font-heading">Interviews</span>
                                </div>
                            </div>

                            {/* SVG Connections */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 hidden sm:block">
                                <line x1="50%" y1="50%" x2="50%" y2="15%" stroke="rgba(99,102,241,0.2)" strokeWidth="1" strokeDasharray="4 4"/>
                                <line x1="50%" y1="50%" x2="50%" y2="85%" stroke="rgba(234,179,8,0.2)" strokeWidth="1" strokeDasharray="4 4"/>
                                <line x1="50%" y1="50%" x2="85%" y2="50%" stroke="rgba(168,85,247,0.2)" strokeWidth="1" strokeDasharray="4 4"/>
                                <line x1="50%" y1="50%" x2="15%" y2="50%" stroke="rgba(236,72,153,0.2)" strokeWidth="1" strokeDasharray="4 4"/>
                                <line x1="50%" y1="50%" x2="78%" y2="22%" stroke="rgba(34,211,238,0.2)" strokeWidth="1" strokeDasharray="4 4"/>
                                <line x1="50%" y1="50%" x2="78%" y2="78%" stroke="rgba(34,197,94,0.2)" strokeWidth="1" strokeDasharray="4 4"/>
                            </svg>
                        </div>

                        {/* Ticker box */}
                        <div className="glass-panel rounded-large p-4 border border-white/5 absolute -bottom-16 w-full max-w-sm left-1/2 -translate-x-1/2 z-30 shadow-2xl bg-background-900/95">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                <span className="text-xs text-gray-400 font-medium">Agent Live Feed</span>
                            </div>
                            <div className="space-y-2 relative overflow-hidden h-[84px] text-left">
                                {activeFeedItems.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-xs transition-opacity duration-300">
                                        <div className={`w-5 h-5 rounded-full ${item.color} flex items-center justify-center shrink-0`}>
                                            <item.icon className={`w-3 h-3 ${item.textColor}`} />
                                        </div>
                                        <span className="text-gray-300">{item.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background-950 to-transparent pointer-events-none z-20"></div>
      </section>

      {/* STATS BAR */}
      <section className="relative bg-background-950 border-t border-white/5 py-10 z-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                  <div className="font-heading text-3xl font-bold text-white mb-1">142K+</div>
                  <div className="text-gray-500 text-sm">Applications Sent</div>
              </div>
              <div className="text-center">
                  <div className="font-heading text-3xl font-bold text-white mb-1">98%</div>
                  <div className="text-gray-500 text-sm">ATS Match Rate</div>
              </div>
              <div className="text-center">
                  <div className="font-heading text-3xl font-bold text-white mb-1">12K+</div>
                  <div className="text-gray-500 text-sm">Active Users</div>
              </div>
              <div className="text-center">
                  <div className="font-heading text-3xl font-bold text-white mb-1">3.2x</div>
                  <div className="text-gray-500 text-sm">More Interviews</div>
              </div>
          </div>
      </section>

      {/* FEATURES HEADER */}
      <section id="features" className="relative overflow-hidden bg-background-950 pt-20 pb-4">
        <div className="absolute inset-0 hero-grid pointer-events-none"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-primary-500/5 blur-3xl pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-medium mb-6 animate-fade-in-up">
                <Sparkles className="w-3.5 h-3.5" /> Powered by GPT-4o + Custom AI Agents
            </div>
            <h2 className="font-heading text-4xl lg:text-5xl font-bold text-white mb-5 animate-fade-in-up delay-100">
                Everything You Need to<br/>
                <span className="shimmer-text">Land Your Dream Job</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto animate-fade-in-up delay-200">
                J.A.R.A combines 6 intelligent modules that work autonomously — from finding the right jobs to following up with recruiters.
            </p>
        </div>
      </section>

      {/* 6 FEATURE CARDS */}
      <section className="relative bg-background-950 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="glass-panel rounded-large p-6 border border-white/10 hover:border-blue-500/40 transition-all duration-300 animate-fade-in-up delay-100 group">
                <div className="flex items-start justify-between mb-5">
                    <div className="relative">
                        <div className="w-14 h-14 rounded-large bg-blue-500/10 border border-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                            <Search className="w-7 h-7 text-blue-400 drop-shadow-md" />
                        </div>
                    </div>
                </div>
                <h3 className="font-heading text-lg font-semibold text-white mb-2">AI Job Discovery</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">Scans 50+ job boards in real-time using semantic search. Finds roles that match your skills, not just keywords.</p>
            </div>

            <div className="glass-panel rounded-large p-6 border border-white/10 hover:border-cyan-500/40 transition-all duration-300 animate-fade-in-up delay-200 group">
                <div className="flex items-start justify-between mb-5">
                    <div className="relative">
                        <div className="w-14 h-14 rounded-large bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                            <FileEdit className="w-7 h-7 text-cyan-400 drop-shadow-md" />
                        </div>
                    </div>
                </div>
                <h3 className="font-heading text-lg font-semibold text-white mb-2">Resume Tailoring</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">Rewrites your resume for each job using GPT-4o. Highlights the exact skills recruiters are looking for.</p>
            </div>

            <div className="glass-panel rounded-large p-6 border border-white/10 hover:border-green-500/40 transition-all duration-300 animate-fade-in-up delay-300 group">
                <div className="flex items-start justify-between mb-5">
                    <div className="relative">
                        <div className="w-14 h-14 rounded-large bg-green-500/10 border border-green-500/20 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                            <Send className="w-7 h-7 text-green-400 drop-shadow-md" />
                        </div>
                    </div>
                </div>
                <h3 className="font-heading text-lg font-semibold text-white mb-2">Auto Apply</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">Fills out and submits applications automatically across LinkedIn, Greenhouse, Lever, and 40+ platforms.</p>
            </div>

            <div className="glass-panel rounded-large p-6 border border-white/10 hover:border-purple-500/40 transition-all duration-300 animate-fade-in-up delay-400 group">
                <div className="flex items-start justify-between mb-5">
                    <div className="relative">
                        <div className="w-14 h-14 rounded-large bg-purple-500/10 border border-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                            <UserCheck className="w-7 h-7 text-purple-400 drop-shadow-md" />
                        </div>
                    </div>
                </div>
                <h3 className="font-heading text-lg font-semibold text-white mb-2">HR Outreach</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">Finds hiring managers and crafts hyper-personalized cold emails referencing company news.</p>
            </div>

            <div className="glass-panel rounded-large p-6 border border-white/10 hover:border-yellow-500/40 transition-all duration-300 animate-fade-in-up delay-500 group">
                <div className="flex items-start justify-between mb-5">
                    <div className="relative">
                        <div className="w-14 h-14 rounded-large bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center group-hover:bg-yellow-500/20 transition-colors">
                            <RefreshCw className="w-7 h-7 text-yellow-400 drop-shadow-md" />
                        </div>
                    </div>
                </div>
                <h3 className="font-heading text-lg font-semibold text-white mb-2">Smart Follow-ups</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">Sends intelligent follow-up sequences at optimal times. Knows when to nudge and when to back off.</p>
            </div>

            <div className="glass-panel rounded-large p-6 border border-white/10 hover:border-pink-500/40 transition-all duration-300 animate-fade-in-up delay-600 group">
                <div className="flex items-start justify-between mb-5">
                    <div className="relative">
                        <div className="w-14 h-14 rounded-large bg-pink-500/10 border border-pink-500/20 flex items-center justify-center group-hover:bg-pink-500/20 transition-colors">
                            <Target className="w-7 h-7 text-pink-400 drop-shadow-md" />
                        </div>
                    </div>
                </div>
                <h3 className="font-heading text-lg font-semibold text-white mb-2">Job Match Scoring</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">Scores every job 0–100 based on your profile. Only applies to roles above your threshold.</p>
            </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="relative bg-background-950 py-20 overflow-hidden">
        <div className="absolute inset-0 hero-grid pointer-events-none opacity-50"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
            <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-500/10 border border-accent-500/20 text-accent-400 text-xs font-medium mb-5">
                    <Zap className="w-3.5 h-3.5" /> 5-Step Autonomous Process
                </div>
                <h2 className="font-heading text-4xl lg:text-5xl font-bold text-white mb-4">How <span className="shimmer-text">J.A.R.A</span> Works</h2>
                <p className="text-gray-400 text-lg max-w-xl mx-auto">Set your preferences once. J.A.R.A handles everything else — 24/7, without you lifting a finger.</p>
            </div>

            <div className="glass-panel rounded-large border border-white/10 overflow-hidden max-w-5xl mx-auto">
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-background-800/40">
                    <div className="flex items-center gap-3">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/60"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500/60"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500/60"></div>
                        </div>
                        <span className="text-gray-400 text-sm font-medium hidden sm:inline-block">J.A.R.A Agent — Live Process View</span>
                    </div>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                        {[
                          { id: 1, label: 'Profile', icon: Settings, color: 'primary' },
                          { id: 2, label: 'Scanning', icon: Search, color: 'blue' },
                          { id: 3, label: 'Tailoring', icon: FileEdit, color: 'cyan' },
                          { id: 4, label: 'Outreach', icon: Mail, color: 'purple' },
                          { id: 5, label: 'Interviews', icon: CalendarCheck, color: 'green' }
                        ].map(step => (
                           <div key={step.id} className={`glass-panel rounded-xl p-4 text-center transition-all duration-300 border ${activeStep === step.id ? 'border-primary-500/40 bg-white/10 scale-105' : 'border-white/5'}`}>
                              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-2">
                                <step.icon className="w-5 h-5 text-white" />
                              </div>
                              <div className="text-xs font-heading font-semibold text-white mb-1">{step.label}</div>
                           </div> 
                        ))}
                    </div>

                    <div className="mt-6 bg-background-900/80 rounded-large border border-white/5 p-4 font-mono text-xs hidden sm:block">
                        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/5">
                            <Terminal className="w-3.5 h-3.5 text-gray-500" />
                            <span className="text-gray-500">agent.log</span>
                        </div>
                        <div className="space-y-2 h-[120px] overflow-hidden">
                            {activeLogs.map((log, idx) => (
                                <div key={idx} className="flex items-start gap-3 transition-opacity animate-fade-in-up">
                                    <span className="text-gray-600 shrink-0">{log.time}</span>
                                    <span className={log.color}>[{log.type}]</span>
                                    <span className="text-gray-300">{log.msg}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-background-950 border-t border-white/5 py-8">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                  <span className="font-heading font-semibold text-white">J.A.R.A</span>
                  <span className="text-gray-600 text-sm">© {new Date().getFullYear()}</span>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-500">
                  <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy</Link>
                  <Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
              </div>
          </div>
      </footer>
    </div>
  );
}
