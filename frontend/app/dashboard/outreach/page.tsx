"use client";

import { useState, useEffect } from "react";
import { Upload, Mail, Play, Loader2, AlertCircle, Users } from "lucide-react";
import api from "@/lib/api";

interface Contact {
    id: string;
    hr_name?: string;
    email: string;
    role?: string;
    company?: string;
    status: string;
    subject?: string;
    body?: string;
}

interface CampaignMetrics {
    total: number;
    pending: number;
    generated: number;
    sent: number;
    failed: number;
}

interface CampaignDetails {
    campaign: {
        id: string;
        name: string;
        created_at: string;
        status: string;
    };
    metrics: CampaignMetrics;
    contacts: Contact[];
}

interface CampaignList {
    id: string;
    name: string;
    created_at: string;
    status: string;
}

export default function OutreachPage() {
    const [campaigns, setCampaigns] = useState<CampaignList[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState<CampaignDetails | null>(null);

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
        } catch (error) {
            console.error("Upload failed", error);
            const err = error as { response?: { data?: { detail?: string } } };
            alert(err.response?.data?.detail || "Failed to upload file.");
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
            <div className="max-w-7xl mx-auto space-y-6 animate-fade-in-up">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <button onClick={() => setSelectedCampaign(null)} className="text-primary-500 hover:text-primary-400 hover:underline mb-2 block text-sm transition-colors">&larr; Back to Campaigns</button>
                        <h1 className="font-heading text-3xl font-bold text-white mb-2">{c.name}</h1>
                        <p className="text-gray-400 text-sm">Created: {new Date(c.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => handleGenerateEmails(c.id)}
                            disabled={m.pending === 0}
                            className="px-4 py-2 bg-background-800 border border-white/10 rounded-lg text-sm font-medium text-white hover:bg-background-700 transition disabled:opacity-50"
                        >
                            Generate AI Emails
                        </button>
                        <button 
                            onClick={() => handleSendEmails(c.id)}
                            disabled={m.generated === 0 || c.status === 'running'}
                            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-500 transition disabled:opacity-50 shadow-glow"
                        >
                            <Play className="w-4 h-4" />
                            Start Sending
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="glass-panel p-4 rounded-xl border border-white/5 text-center">
                        <p className="text-2xl font-bold text-white mb-1">{m.total}</p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Total</p>
                    </div>
                    <div className="glass-panel p-4 rounded-xl border border-white/5 text-center">
                        <p className="text-2xl font-bold text-yellow-400 mb-1">{m.pending}</p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Pending</p>
                    </div>
                    <div className="glass-panel p-4 rounded-xl border border-white/5 text-center">
                        <p className="text-2xl font-bold text-blue-400 mb-1">{m.generated}</p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Generated</p>
                    </div>
                    <div className="glass-panel p-4 rounded-xl border border-white/5 text-center">
                        <p className="text-2xl font-bold text-green-400 mb-1">{m.sent}</p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Sent</p>
                    </div>
                    <div className="glass-panel p-4 rounded-xl border border-white/5 text-center">
                        <p className="text-2xl font-bold text-red-400 mb-1">{m.failed}</p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Failed</p>
                    </div>
                </div>

                <div className="glass-panel rounded-xl border border-white/5 overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-background-800/50 text-gray-400 text-xs uppercase border-b border-white/5">
                            <tr>
                                <th className="px-6 py-4 font-medium">Contact</th>
                                <th className="px-6 py-4 font-medium">Role / Company</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium w-1/3">Preview</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-gray-300">
                            {selectedCampaign.contacts.map((contact: Contact) => (
                                <tr key={contact.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-white">{contact.hr_name || 'N/A'}</div>
                                        <div className="text-xs text-gray-500 mt-1">{contact.email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-gray-300">{contact.role || 'N/A'}</div>
                                        <div className="text-xs text-primary-400 mt-1">{contact.company || 'N/A'}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border
                                            ${contact.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : ''}
                                            ${contact.status === 'generated' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : ''}
                                            ${contact.status === 'sent' ? 'bg-green-500/10 text-green-400 border-green-500/20' : ''}
                                            ${contact.status === 'failed' ? 'bg-red-500/10 text-red-400 border-red-500/20' : ''}
                                        `}>
                                            {contact.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {contact.subject ? (
                                            <div className="text-xs border border-white/5 rounded-md p-3 bg-background-900/50 max-h-32 overflow-y-auto font-mono text-gray-400 leading-relaxed">
                                                <strong className="text-white block mb-2 font-sans">{contact.subject}</strong>
                                                <span className="whitespace-pre-wrap">{contact.body}</span>
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
        <div className="max-w-7xl mx-auto space-y-6 relative animate-fade-in-up">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="font-heading text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <Users className="w-8 h-8 text-primary-500" />
                        HR Outreach
                    </h1>
                    <p className="text-gray-400">Upload contact lists and send automated, personalized AI emails.</p>
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
                        className={`flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium transition cursor-pointer shadow-glow ${uploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-500'}`}
                    >
                        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                        {uploading ? 'Uploading...' : 'Upload CSV/Excel'}
                    </label>
                </div>
            </header>

            <div className="glass-panel p-4 rounded-xl border border-primary-500/20 flex gap-4 text-primary-400 items-start text-sm">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p>
                    <strong className="text-white">Important:</strong> Ensure your uploaded CSV has columns like <code className="bg-primary-500/20 px-1 rounded text-primary-300">Name</code>, <code className="bg-primary-500/20 px-1 rounded text-primary-300">Email</code>, <code className="bg-primary-500/20 px-1 rounded text-primary-300">Company</code>, and <code className="bg-primary-500/20 px-1 rounded text-primary-300">Role</code>. J.A.R.A will use your Master Resume to tailor the outreach emails based on your skills and the company's domain.
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 text-primary-500 animate-spin" /></div>
            ) : campaigns.length === 0 ? (
                <div className="text-center py-24 glass-panel rounded-2xl border border-white/5 border-dashed">
                    <Mail className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white">No Campaigns Yet</h3>
                    <p className="text-gray-500 max-w-sm mx-auto mt-2">Upload a CSV of recruiters and hiring managers to start reaching out automatically.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {campaigns.map(camp => (
                        <div key={camp.id} className="glass-panel rounded-2xl border border-white/5 p-6 hover:border-primary-500/30 transition-colors shadow-lg flex flex-col group">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-lg text-white group-hover:text-primary-400 transition-colors">{camp.name}</h3>
                                    <p className="text-xs text-gray-500 mt-1">{new Date(camp.created_at).toLocaleDateString()}</p>
                                </div>
                                <span className={`px-2 py-1 rounded border text-[10px] uppercase font-bold tracking-wider 
                                    ${camp.status === 'completed' ? 'bg-green-500/10 border-green-500/20 text-green-400' : ''}
                                    ${camp.status === 'running' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400 animate-pulse' : ''}
                                    ${camp.status === 'draft' ? 'bg-background-800 border-white/10 text-gray-400' : ''}
                                `}>
                                    {camp.status}
                                </span>
                            </div>
                            
                            <div className="mt-auto pt-4 border-t border-white/5">
                                <button 
                                    onClick={() => handleViewCampaign(camp.id)}
                                    className="w-full py-2 bg-background-800 hover:bg-background-700 text-sm font-medium text-white rounded-lg transition-colors border border-white/5"
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
