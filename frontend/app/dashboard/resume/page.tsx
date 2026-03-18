"use client";

import { useState, useRef } from "react";
import { Upload, CheckCircle, Loader2, Play } from "lucide-react";
import api from "@/lib/api";

interface ResumeData {
    content_json?: {
        basics?: {
            skills?: string[];
        }
    }
}

export default function ResumePage() {
    const [uploading, setUploading] = useState(false);
    const [resumeData, setResumeData] = useState<ResumeData | null>(null);
    const [step, setStep] = useState(1);
    const [isScanning, setIsScanning] = useState(false);
    const [progress, setProgress] = useState(0);
    const [scanText, setScanText] = useState("INITIALIZING NEURAL LINK...");
    const [vectorState, setVectorState] = useState([false, false, false, false]);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;
        
        const file = e.target.files[0];
        
        // Start animation sequence
        setStep(2);
        setIsScanning(true);
        setUploading(true);

        // Upload to backend concurrently with animations
        const formData = new FormData();
        formData.append("file", file);

        try {
            // Start the fake progress animation while waiting for the real upload
            const totalTime = 6000;
            const intervalTime = 50;
            const steps = totalTime / intervalTime;
            let currentStep = 0;
            
            const progressInterval = setInterval(() => {
                currentStep++;
                const newProgress = Math.min((currentStep / steps) * 100, 95); // hold at 95% until real upload is done
                setProgress(newProgress);
                
                if (newProgress > 20) setScanText("EXTRACTING TEXT DATA...");
                if (newProgress > 40) {
                    setScanText("IDENTIFYING ENTITIES...");
                    setVectorState(prev => [true, prev[1], prev[2], prev[3]]);
                }
                if (newProgress > 60) {
                    setScanText("GENERATING EMBEDDINGS...");
                    setVectorState(prev => [true, true, prev[2], prev[3]]);
                }
                if (newProgress > 80) {
                    setScanText("STORING IN VECTOR SPACE...");
                    setVectorState(prev => [true, true, true, prev[3]]);
                }
            }, intervalTime);

            // Real backend request
            const res = await api.post("/resume/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            
            clearInterval(progressInterval);
            
            // Finish animation
            setProgress(100);
            setScanText("BRAIN UPLOAD COMPLETE");
            setVectorState([true, true, true, true]);
            setResumeData(res.data);
            
            setTimeout(() => {
                setIsScanning(false);
                setStep(3); // Go to success step
            }, 1000);

        } catch (err) {
            console.error(err);
            alert("Upload failed.");
            setStep(1); // Revert on failure
        } finally {
            setUploading(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files?.[0] && fileInputRef.current && !uploading) {
            fileInputRef.current.files = e.dataTransfer.files;
            const event = new Event('change', { bubbles: true });
            fileInputRef.current.dispatchEvent(event);
        }
    };

    const skills = resumeData?.content_json?.basics?.skills || [
        "System Architecture", "React/Next.js", "Python/FastAPI", "PostgreSQL",
        "CI/CD Pipelines", "Docker/K8s", "AWS Infrastructure", "Team Leadership"
    ];

    return (
        <div className="min-h-screen bg-night text-slate-200 p-8 pt-12 overflow-x-hidden relative">
            <div className="noise"></div>
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-electric/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
            
            <div className="max-w-6xl mx-auto flex flex-col items-center">
                <header className="mb-12 relative z-10 w-full">
                    <div className="flex items-center justify-center space-x-3 mb-2">
                        <div className="w-8 h-8 rounded border border-electric/30 bg-electric/10 flex items-center justify-center">
                            <svg className="w-4 h-4 text-electric" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">Agent Configuration</h1>
                    </div>
                    <p className="text-ash text-center">Initialize your autonomous agent by uploading your career databank.</p>
                </header>

                <div className="w-full max-w-4xl relative z-10 flex flex-col md:flex-row gap-8">
                    
                    {/* Left Column: Flow Control */}
                    <div className="w-full md:w-1/3 space-y-6">
                        <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-electric to-neon"></div>
                            <h3 className="text-sm font-bold uppercase tracking-widest text-ash mb-6">Deployment Sequence</h3>
                            
                            <div className="space-y-6 relative">
                                {/* Connection Line */}
                                <div className="absolute left-[11px] top-2 bottom-6 w-[2px] bg-white/5"></div>
                                {/* Active progress line */}
                                <div className="absolute left-[11px] top-2 w-[2px] bg-electric transition-all duration-1000" style={{ height: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}></div>

                                {/* Step 1 */}
                                <div className="relative flex items-start space-x-4">
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 z-10 transition-colors bg-night ${step >= 1 ? 'border-electric text-electric shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'border-white/20 text-white/20'}`}>
                                        {step > 1 ? <CheckCircle className="w-3 h-3" /> : <span className="text-[10px] font-bold">1</span>}
                                    </div>
                                    <div className={step >= 1 ? 'opacity-100' : 'opacity-40'}>
                                        <h4 className="font-bold text-sm mb-1">Knowledge Injection</h4>
                                        <p className="text-xs text-ash">Upload master resume PDF</p>
                                    </div>
                                </div>

                                {/* Step 2 */}
                                <div className="relative flex items-start space-x-4">
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 z-10 transition-colors bg-night ${step >= 2 ? 'border-electric text-electric shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'border-white/20 text-white/20'}`}>
                                        {step > 2 ? <CheckCircle className="w-3 h-3" /> : (step === 2 ? <Loader2 className="w-3 h-3 animate-spin"/> : <span className="text-[10px] font-bold">2</span>)}
                                    </div>
                                    <div className={step >= 2 ? 'opacity-100' : 'opacity-40'}>
                                        <h4 className="font-bold text-sm mb-1">Data Vectorization</h4>
                                        <p className="text-xs text-ash">Parsing and embedding generation</p>
                                    </div>
                                </div>

                                {/* Step 3 */}
                                <div className="relative flex items-start space-x-4">
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 z-10 transition-colors bg-night ${step >= 3 ? 'border-electric text-electric shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'border-white/20 text-white/20'}`}>
                                        {step > 3 ? <CheckCircle className="w-3 h-3" /> : <span className="text-[10px] font-bold">3</span>}
                                    </div>
                                    <div className={step >= 3 ? 'opacity-100' : 'opacity-40'}>
                                        <h4 className="font-bold text-sm mb-1">Agent Activation</h4>
                                        <p className="text-xs text-ash">Ready for autonomous deployment</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Status Terminal */}
                        <div className="glass-card rounded-2xl p-4 font-mono text-[10px] uppercase text-ash h-48 overflow-y-auto flex flex-col justify-end space-y-1">
                            <p className="text-green-500">[{new Date().toISOString().split('T')[1].slice(0,8)}] SYS: J.A.R.A SERVER CONNECTION ESTABLISHED</p>
                            <p>[{new Date().toISOString().split('T')[1].slice(0,8)}] SYS: WAITING FOR USER DATABANK...</p>
                            {step >= 2 && <p className="text-electric">[{new Date().toISOString().split('T')[1].slice(0,8)}] ENG: UPLOAD IN PROGRESS...</p>}
                            {isScanning && <p className="animate-pulse text-neon">[{new Date().toISOString().split('T')[1].slice(0,8)}] ENG: {scanText}</p>}
                            {step === 3 && <p className="text-green-500">[{new Date().toISOString().split('T')[1].slice(0,8)}] SYS: ALL SYSTEMS GREEN. DATABANK LOADED.</p>}
                        </div>
                    </div>

                    {/* Right Column: Main Interactive Area */}
                    <div className="w-full md:w-2/3">
                        <div className="glass-card rounded-3xl p-8 min-h-[500px] flex flex-col items-center justify-center relative overflow-hidden">
                            
                            {/* State 1: Upload */}
                            {step === 1 && (
                                <div 
                                    className="w-full flex-1 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center hover:border-electric/50 transition-colors bg-white/5 cursor-pointer group p-12"
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <div className="w-20 h-20 rounded-2xl bg-night border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-electric/50 transition-all shadow-xl">
                                        <Upload className="w-8 h-8 text-electric group-hover:animate-bounce" />
                                    </div>
                                    <h2 className="text-2xl font-bold mb-2">Drop your resume here</h2>
                                    <p className="text-ash mb-6 text-center">Supports PDF (Max 5MB)</p>
                                    <button className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-bold text-sm transition-colors border border-white/5">
                                        Browse Files
                                    </button>
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        accept=".pdf" 
                                        ref={fileInputRef}
                                        onChange={handleFileUpload}
                                    />
                                </div>
                            )}

                            {/* State 2: Scanning / Vectorizing */}
                            {step === 2 && (
                                <div className="w-full flex-1 flex flex-col items-center justify-center animate-fade-in-up">
                                    <div className="relative w-64 h-80 border border-electric/30 rounded-lg p-4 bg-night mb-12 shadow-[0_0_50px_rgba(99,102,241,0.1)]">
                                        <div className="absolute top-2 left-2 text-[8px] font-mono text-electric">TARGET_DOCUMENT.PDF</div>
                                        <div className="w-full h-6 bg-white/5 rounded mb-3 mt-4"></div>
                                        <div className="w-3/4 h-4 bg-white/5 rounded mb-2"></div>
                                        <div className="w-5/6 h-4 bg-white/5 rounded mb-2"></div>
                                        <div className="w-full h-4 bg-white/5 rounded mb-6"></div>
                                        
                                        <div className="w-1/2 h-5 bg-white/5 rounded mb-3"></div>
                                        <div className="w-full h-3 bg-white/5 rounded mb-2"></div>
                                        <div className="w-5/6 h-3 bg-white/5 rounded mb-2"></div>
                                        <div className="w-4/6 h-3 bg-white/5 rounded mb-2"></div>

                                        {/* Scanner Line */}
                                        <div className="absolute left-0 w-full h-[2px] bg-neon shadow-[0_0_15px_#00F5FF] z-20 animate-scan"></div>
                                    </div>

                                    <div className="w-full max-w-md">
                                        <div className="flex justify-between text-xs font-mono font-bold mb-2 uppercase">
                                            <span className="text-electric">{scanText}</span>
                                            <span className="text-neon">{Math.round(progress)}%</span>
                                        </div>
                                        <div className="h-2 bg-night rounded-full overflow-hidden border border-white/10">
                                            <div 
                                                className="h-full bg-gradient-to-r from-electric to-neon transition-all duration-100 ease-linear relative"
                                                style={{ width: `${progress}%` }}
                                            >
                                                <div className="absolute top-0 right-0 w-10 h-full bg-white/50 blur-[2px]"></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Vector Visualization Nodes */}
                                    <div className="mt-12 flex space-x-8">
                                        {[...Array(4)].map((_, i) => (
                                            <div key={i} className="flex flex-col items-center">
                                                <div className={`w-3 h-3 rounded-full mb-2 transition-all duration-500 ${vectorState[i] ? 'bg-neon shadow-[0_0_10px_#00F5FF]' : 'bg-white/10'}`}></div>
                                                <div className={`text-[8px] font-mono transition-colors duration-500 ${vectorState[i] ? 'text-neon' : 'text-ash'}`}>NODE_0{i+1}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* State 3: Success / Review */}
                            {step === 3 && (
                                <div className="w-full flex-1 flex flex-col items-center justify-center animate-fade-in-up text-center">
                                    <div className="w-24 h-24 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mb-6 relative">
                                        <div className="absolute inset-0 rounded-full border-2 border-green-500 border-t-transparent animate-spin"></div>
                                        <CheckCircle className="w-12 h-12 text-green-400" />
                                    </div>
                                    <h2 className="text-3xl font-bold mb-2">Neural Link Established</h2>
                                    <p className="text-ash mb-12">Agent J.A.R.A has successfully assimilated your career parameters.</p>

                                    <div className="w-full max-w-lg glass-card border-white/10 p-6 rounded-2xl mb-8 border-l-2 border-l-electric text-left mx-auto">
                                        <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-4">Extracted Parameters</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {skills.map((skill: string, idx: number) => (
                                                <div 
                                                    key={idx} 
                                                    className="px-3 py-1 bg-white/5 border border-white/10 rounded font-mono text-xs text-electric"
                                                    style={{ animationDelay: `${idx * 100}ms` }}
                                                >
                                                    {skill}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <button 
                                        onClick={() => window.location.href='/dashboard'}
                                        className="px-8 py-4 bg-white text-night rounded-xl font-bold shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-105 transition-transform flex items-center space-x-2 mx-auto"
                                    >
                                        <Play className="w-5 h-5 fill-current" />
                                        <span>Deploy Agent to Dashboard</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
