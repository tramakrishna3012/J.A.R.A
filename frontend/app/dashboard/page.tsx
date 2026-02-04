export default function DashboardPage() {
    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-gray-400">Welcome back, User.</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Total Applications", val: "124" },
                    { label: "Interviews", val: "3", color: "text-green-400" },
                    { label: "Pending", val: "45", color: "text-yellow-400" },
                    { label: "Success Rate", val: "2.4%", color: "text-blue-400" },
                ].map((stat, i) => (
                    <div key={i} className="p-6 rounded-2xl border border-white/10 bg-zinc-900/50">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">{stat.label}</h3>
                        <p className={`text-4xl font-bold ${stat.color || "text-white"}`}>{stat.val}</p>
                    </div>
                ))}
            </div>

            {/* Placeholder Charts Area */}
            <div className="h-96 rounded-2xl border border-white/10 bg-zinc-900/50 flex items-center justify-center text-gray-500">
                Application Activity Chart Coming Soon
            </div>
        </div>
    );
}
