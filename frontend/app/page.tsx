import Link from "next/link";
import { ArrowRight, Bot, FileText, Send } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-black text-white selection:bg-purple-500/30">
      {/* Navbar */}
      <nav className="w-full max-w-7xl flex items-center justify-between p-6">
        <div className="text-2xl font-bold tracking-tighter bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
          J.A.R.A
        </div>
        <div className="flex gap-4">
          <Link href="/login" className="px-4 py-2 rounded-full text-sm font-medium hover:bg-white/10 transition">
            Login
          </Link>
          <Link href="/signup" className="px-4 py-2 rounded-full bg-white text-black text-sm font-medium hover:bg-gray-200 transition">
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center text-center max-w-3xl mt-20 px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/5 text-xs font-medium mb-6">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          Running on Free Tier Infrastructure
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
          Job Application & <br />Referral Assistant
        </h1>
        <p className="text-lg text-gray-400 mb-8 max-w-xl">
          The ethical, AI-assisted platform to discover jobs, tailor resumes, and track applications.
          No spam, no fake data, just smart automation.
        </p>
        <Link href="/dashboard" className="group flex items-center gap-2 px-8 py-4 bg-purple-600 rounded-full font-bold text-lg hover:bg-purple-700 transition">
          Launch J.A.R.A
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl px-4 mt-24 mb-24">
        {[
          { icon: FileText, title: "Resume AI", desc: "Tailor your resume for every job with efficient, rule-based NLP." },
          { icon: Bot, title: "Action Engine", desc: "Semi-automated applying. You control the final click." },
          { icon: Send, title: "Smart Tracking", desc: "Visualize your progress with auto-updated dashboards." }
        ].map((f, i) => (
          <div key={i} className="p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition">
            <f.icon className="w-10 h-10 text-purple-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">{f.title}</h3>
            <p className="text-gray-400">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-white/10 py-8 text-center text-gray-500 text-sm">
        <p>Built with ❤️ by Antigravity. Open Source & Free Tier Optimized.</p>
      </footer>
    </main>
  );
}
