import Link from "next/link";
import { ArrowRight, Bot, FileText, Send, Sparkles, Shield, Zap } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-black text-white selection:bg-purple-500/30 overflow-hidden relative">

      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-purple-600/30 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-blue-600/20 rounded-full blur-[100px] -z-10 pointer-events-none" />

      {/* Navbar */}
      <nav className="w-full max-w-7xl mx-auto flex items-center justify-between p-6 z-50">
        <div className="text-2xl font-bold tracking-tighter flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          J.A.R.A
        </div>
        <div className="flex gap-4 items-center">
          <Link href="/login" className="px-5 py-2.5 rounded-full text-sm font-medium text-gray-300 hover:text-white transition">
            Login
          </Link>
          <Link href="/signup" className="px-5 py-2.5 rounded-full bg-white text-black text-sm font-bold hover:bg-gray-200 transition shadow-lg shadow-white/10">
            Sign Up Free
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center max-w-5xl mx-auto mt-20 px-4 z-10">

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm font-medium mb-8 animate-fade-in-up">
          <Sparkles className="w-4 h-4" />
          <span>The Future of Job Hunting is Here</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight mb-8 leading-tight bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-gray-400">
          Land Your Dream Job <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">On Autopilot</span>
        </h1>

        <p className="text-xl text-gray-400 mb-10 max-w-2xl leading-relaxed">
          Stop manually applying. J.A.R.A optimizes your resume, finds relevant roles, and helps you apply faster—all while keeping your data private.
        </p>

        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <Link href="/dashboard" className="group flex items-center justify-center gap-3 px-8 py-4 bg-purple-600 rounded-full font-bold text-lg hover:bg-purple-700 transition shadow-xl shadow-purple-600/20">
            Get Started Verification
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="#features" className="px-8 py-4 rounded-full font-bold text-lg border border-white/10 hover:bg-white/5 transition flex items-center justify-center gap-2">
            <Shield className="w-5 h-5 text-gray-400" />
            Privacy Focused
          </Link>
        </div>

        {/* Floating UI Mockup */}
        <div className="mt-20 relative w-full max-w-4xl mx-auto rounded-xl border border-white/10 bg-zinc-900/50 backdrop-blur-xl shadow-2xl p-4 transform rotate-x-12 perspective-1000">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-20" />
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-zinc-900/80 rounded-t-lg">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <div className="ml-4 h-6 w-64 bg-zinc-800 rounded-md" />
          </div>
          <div className="p-8 grid grid-cols-3 gap-6 opacity-80">
            <div className="col-span-1 space-y-4">
              <div className="h-32 bg-zinc-800 rounded-xl w-full" />
              <div className="h-12 bg-zinc-800 rounded-xl w-full" />
              <div className="h-12 bg-zinc-800 rounded-xl w-full" />
            </div>
            <div className="col-span-2 space-y-4">
              <div className="h-64 bg-zinc-800 rounded-xl w-full" />
            </div>
          </div>
        </div>

      </section>

      {/* Features Grid */}
      <section id="features" className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4 mt-32 mb-24 relative z-10">
        {[
          { icon: FileText, title: "AI Resume Tailoring", desc: "Our engine rewrites your bullet points to match every JD perfectly." },
          { icon: Zap, title: "Instant Analysis", desc: "Get an ATS score and missing keywords analysis in seconds." },
          { icon: Send, title: "One-Click Apply Assistant", desc: "We autofill forms and draft cover letters for you." }
        ].map((f, i) => (
          <div key={i} className="group p-8 rounded-3xl border border-white/10 bg-zinc-900/30 hover:bg-zinc-800/50 transition hover:-translate-y-1 duration-300">
            <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <f.icon className="w-7 h-7 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3">{f.title}</h3>
            <p className="text-gray-400 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-white/10 py-12 text-center text-gray-500 text-sm bg-zinc-950">
        <p className="mb-2">Built with ❤️ by T Rama Krishna.</p>
        <p className="opacity-50">Running on 100% Free Tier Infrastructure.</p>
      </footer>
    </main>
  );
}
