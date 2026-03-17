"use client";

import { useState, useEffect } from "react";
import { Upload, Mail, Play, Loader2, AlertCircle, Users, CheckCircle } from "lucide-react";
import api from "@/lib/api";

export default function OutreachPage() {
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState<any>(null);

    const fetchCampaigns = async () => {
        try {
            const res = await api.get("/outreach/");
            setCampaigns(res.data.data);
        } catch (error) {
            console.error("Failed to fetch campaigns", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const name = prompt("Enter a name for this outreach campaign:");
        if (!name) return;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("campaign_name", name);

        setUploading(true);
        try {
            await api.post("/outreach/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            alert("Campaign created successfully!");
            fetchCampaigns();
        } catch (error: any) {
            console.error("Upload failed", error);
            alert(error.response?.data?.detail || "Failed to upload file.");
        } finally {
            setUploading(false);
            if (e.target) e.target.value = ''; // Reset input
        }
    };

    const handleViewCampaign = async (id: string) => {
        try {
            const res = await api.get(`/outreach/${id}`);
            setSelectedCampaign(res.data);
        } catch (error) {
            console.error("Failed to fetch campaign details", error);
            alert("Failed to load campaign details.");
        }
    };

    const handleGenerateEmails = async (id: string) => {
        if (!confirm("Start generating AI emails? This relies on your uploaded Master Resume.")) return;
        try {
            await api.post(`/outreach/${id}/generate`);
            alert("Emails generated successfully!");
            handleViewCampaign(id); // refresh details
        } catch (error) {
            console.error("Generation failed", error);
            alert("Failed to generate emails.");
        }
    };

    const handleSendEmails = async (id: string) => {
        if (!confirm("Start sending all generated emails? This action cannot be undone.")) return;
        try {
            await api.post(`/outreach/${id}/send`);
            alert("Campaign queued for sending! Emails will be sent every 30-60 seconds to avoid spam filters.");
            fetchCampaigns();
            handleViewCampaign(id);
        } catch (error) {
            console.error("Send failed", error);
            alert("Failed to start sending campaign.");
        }
    };

    if (selectedCampaign) {
        const c = selectedCampaign.campaign;
        const m = selectedCampaign.metrics;
        return (
            <div className="space-y-6">
                <header className="flex items-center justify-between">
                    <div>
                        <button onClick={() => setSelectedCampaign(null)} className="text-electric hover:underline mb-2 block text-sm">&larr; Back to Campaigns</button>
                        <h1 className="text-3xl font-bold">{c.name}</h1>
                        <p className="text-gray-400 text-sm">Created: {new Date(c.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => handleGenerateEmails(c.id)}
                            disabled={m.pending === 0}
                            className="px-4 py-2 bg-zinc-800 rounded-lg text-sm font-medium hover:bg-zinc-700 transition disabled:opacity-50"
                        >
                            Generate AI Emails
                        </button>
                        <button 
                            onClick={() => handleSendEmails(c.id)}
                            disabled={m.generated === 0 || c.status === 'running'}
                            className="flex items-center gap-2 px-4 py-2 bg-electric text-white rounded-lg text-sm font-medium hover:bg-electric/90 transition disabled:opacity-50 shadow-lg shadow-electric/20"
                        >
                            <Play className="w-4 h-4" />
                            Start Sending
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-5 gap-4">
                    <div className="bg-obsidian/50 p-4 rounded-xl border border-white/10 text-center shadow-xl shadow-black/50">
                        <p className="text-2xl font-bold">{m.total}</p>
                        <p className="text-xs text-gray-500 uppercase">Total</p>
                    </div>
                    <div className="bg-obsidian/50 p-4 rounded-xl border border-white/10 text-center shadow-xl shadow-black/50">
                        <p className="text-2xl font-bold text-yellow-500">{m.pending}</p>
                        <p className="text-xs text-gray-500 uppercase">Pending</p>
                    </div>
                    <div className="bg-obsidian/50 p-4 rounded-xl border border-white/10 text-center shadow-xl shadow-black/50">
                        <p className="text-2xl font-bold text-blue-500">{m.generated}</p>
                        <p className="text-xs text-gray-500 uppercase">Generated</p>
                    </div>
                    <div className="bg-obsidian/50 p-4 rounded-xl border border-white/10 text-center shadow-xl shadow-black/50">
                        <p className="text-2xl font-bold text-green-500">{m.sent}</p>
                        <p className="text-xs text-gray-500 uppercase">Sent</p>
                    </div>
                    <div className="bg-obsidian/50 p-4 rounded-xl border border-white/10 text-center shadow-xl shadow-black/50">
                        <p className="text-2xl font-bold text-red-500">{m.failed}</p>
                        <p className="text-xs text-gray-500 uppercase">Failed</p>
                    </div>
                </div>

                <div className="bg-obsidian/50 rounded-xl border border-white/10 overflow-hidden shadow-xl shadow-black/50">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-obsidian text-slate-400 border-b border-white/10">
                            <tr>
                                <th className="p-4">Contact</th>
                                <th className="p-4">Role / Company</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 w-1/3">Preview</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {selectedCampaign.contacts.map((contact: any) => (
                                <tr key={contact.id}>
                                    <td className="p-4">
                                        <div className="font-medium text-white">{contact.hr_name || 'N/A'}</div>
                                        <div className="text-xs text-gray-500">{contact.email}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-gray-300">{contact.role || 'N/A'}</div>
                                        <div className="text-xs text-electric">{contact.company || 'N/A'}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-md text-xs font-medium 
                                            ${contact.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : ''}
                                            ${contact.status === 'generated' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' : ''}
                                            ${contact.status === 'sent' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : ''}
                                            ${contact.status === 'failed' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : ''}
                                        `}>
                                            {contact.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {contact.subject ? (
                                            <div className="text-xs border border-white/10 rounded-md p-2 bg-black/20 max-h-24 overflow-y-auto">
                                                <strong className="text-gray-300 block mb-1">{contact.subject}</strong>
                                                <span className="text-gray-500 whitespace-pre-wrap">{contact.body}</span>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-600 italic">Not generated yet</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 relative">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Users className="w-8 h-8 text-electric" />
                        HR Outreach
                    </h1>
                    <p className="text-gray-400 mt-1">Upload contact lists and send automated, personalized AI emails.</p>
                </div>
                <div>
                    <input
                        type="file"
                        accept=".csv, .xlsx"
                        id="file-upload"
                        className="hidden"
                        onChange={handleFileUpload}
                        disabled={uploading}
                    />
                    <label
                        htmlFor="file-upload"
                        className={`flex items-center gap-2 px-4 py-2 bg-electric text-white rounded-lg font-medium transition cursor-pointer shadow-lg shadow-electric/20 ${uploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-electric/90'}`}
                    >
                        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                        {uploading ? 'Uploading...' : 'Upload CSV/Excel'}
                    </label>
                </div>
            </header>

            <div className="bg-obsidian/30 p-4 rounded-xl border border-blue-500/20 flex gap-4 text-blue-400 items-start text-sm">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p>
                    <strong>Important:</strong> Ensure your uploaded CSV has columns like <code>Name</code>, <code>Email</code>, <code>Company</code>, and <code>Role</code>. J.A.R.A will use your Master Resume to tailor the outreach emails based on your skills and the company's domain.
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 text-electric animate-spin" /></div>
            ) : campaigns.length === 0 ? (
                <div className="text-center py-24 bg-obsidian/30 rounded-2xl border border-white/5 border-dashed">
                    <Mail className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-300">No Campaigns Yet</h3>
                    <p className="text-gray-500 max-w-sm mx-auto mt-2">Upload a CSV of recruiters and hiring managers to start reaching out automatically.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {campaigns.map(camp => (
                        <div key={camp.id} className="bg-obsidian/80 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-electric/30 transition shadow-lg flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-lg text-white group-hover:text-electric transition">{camp.name}</h3>
                                    <p className="text-xs text-gray-500 mt-1">{new Date(camp.created_at).toLocaleDateString()}</p>
                                </div>
                                <span className={`px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider 
                                    ${camp.status === 'completed' ? 'bg-green-500/10 text-green-500' : ''}
                                    ${camp.status === 'running' ? 'bg-blue-500/10 text-blue-500 animate-pulse' : ''}
                                    ${camp.status === 'draft' ? 'bg-zinc-800 text-gray-400' : ''}
                                `}>
                                    {camp.status}
                                </span>
                            </div>
                            
                            <div className="mt-auto pt-4 border-t border-white/5">
                                <button 
                                    onClick={() => handleViewCampaign(camp.id)}
                                    className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-sm font-medium rounded-lg transition"
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
} 
