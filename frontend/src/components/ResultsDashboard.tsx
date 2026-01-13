import React, { useState } from 'react';
import { ArchitectureResponse, DecisionStep, TechOption, WhatIfScenario, ClarifyingQuestion } from '../api';
import { MermaidVisualizer } from './MermaidVisualizer';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Activity, Layout, MessageSquare, Send, CheckCircle2, Info, Server, Shield, XCircle, ArrowRight } from 'lucide-react';

interface Props {
    data: ArchitectureResponse;
    onRefine: (additionalContext: string) => void;
    isRefining?: boolean;
}

export const ResultsDashboard: React.FC<Props> = ({ data, onRefine, isRefining }) => {
    const [activeTab, setActiveTab] = useState<'exec' | 'tech'>('exec');
    const [chatInput, setChatInput] = useState('');

    const handleChatSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim() || isRefining) return;
        onRefine(chatInput);
        setChatInput('');
    };

    return (
        <div className="max-w-screen-2xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20 px-4 md:px-8">
            {/* Analysis & Diagram Layer */}
            <div className="space-y-8">
                {/* Compressed Executive Summary */}
                <div className="glass-panel p-6 rounded-2xl bg-slate-900/40 border-white/5 shadow-2xl">
                    <div className="flex gap-4 mb-4 border-b border-white/5 pb-3">
                        <button
                            onClick={() => setActiveTab('exec')}
                            className={`px-1 py-1 text-[9px] font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === 'exec' ? 'text-primary' : 'text-slate-600 hover:text-slate-400'}`}
                        >
                            Executive Summary
                            {activeTab === 'exec' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                        </button>
                        <button
                            onClick={() => setActiveTab('tech')}
                            className={`px-1 py-1 text-[9px] font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === 'tech' ? 'text-primary' : 'text-slate-600 hover:text-slate-400'}`}
                        >
                            Technical Ledger
                            {activeTab === 'tech' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 3 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-slate-400 leading-relaxed text-sm font-medium"
                        >
                            {activeTab === 'exec' ? data.executive_summary : data.technical_summary}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* High-Density Rationalization Grid */}
                <section className="space-y-4">
                    <div className="flex items-center gap-3 border-b border-white/5 pb-2">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">System Rationalization</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {data.patterns.map((item: DecisionStep, i: number) => (
                            <div key={i} className="p-5 rounded-xl bg-slate-900/20 border border-white/5 group hover:bg-slate-900/40 transition-all flex flex-col gap-3">
                                <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/70">{item.title}</h4>
                                <p className="text-base font-bold text-white tracking-tight">{item.decision}</p>
                                <p className="text-[11px] text-slate-500 leading-relaxed font-medium line-clamp-3 group-hover:line-clamp-none transition-all">
                                    {item.justification}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Optimized Logic Visualization */}
                <section className="space-y-4">
                    <div className="flex items-center gap-3 border-b border-white/5 pb-2">
                        <Layout className="w-4 h-4 text-primary" />
                        <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Logic Visualization</h3>
                    </div>
                    <div className="rounded-2xl border border-white/5 overflow-hidden bg-slate-950/20 p-4">
                        <MermaidVisualizer chart={data.diagram_mermaid} />
                    </div>
                </section>

                {/* High-Density Stack Mapping */}
                <section className="space-y-4">
                    <div className="flex items-center gap-3 border-b border-white/5 pb-2">
                        <Zap className="w-4 h-4 text-primary" />
                        <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Stack Differentiation</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {data.technology_mapping.map((tech: TechOption, i: number) => (
                            <motion.div
                                key={i}
                                className="p-5 rounded-xl border border-white/5 bg-slate-900/30 flex flex-col gap-4 hover:bg-slate-900/50 transition-all border-l-2 border-l-primary/50 relative overflow-hidden"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Server className="w-3.5 h-3.5 text-primary" />
                                        <h4 className="text-lg font-bold text-white tracking-tight">{tech.name}</h4>
                                    </div>
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500/80" />
                                </div>

                                <div className="space-y-3">
                                    <p className="text-[10px] text-slate-300 leading-tight font-bold italic-none border-l border-primary/30 pl-3">
                                        {tech.trade_off_summary}
                                    </p>

                                    <div className="p-3 bg-slate-950/60 rounded-lg border border-white/5 space-y-2">
                                        <span className="text-[8px] font-black uppercase text-primary tracking-widest block">Comparative Rigor: Why instead of others?</span>
                                        <p className="text-[10px] text-slate-200 leading-normal font-medium">
                                            {tech.comparative_analysis}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap gap-2 pt-1 border-t border-white/5 pt-3">
                                        {tech.pros.slice(0, 3).map((p, j) => (
                                            <span key={j} className="text-[8px] font-bold text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10 whitespace-nowrap">
                                                + {p}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Compact Deployment & Resilience */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Deployment - Left Side */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-3 border-b border-white/5 pb-2">
                            <Server className="w-4 h-4 text-primary" />
                            <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Deployment Strategy</h3>
                        </div>
                        <div className="space-y-3">
                            {data.deployment_strategy?.map((item: DecisionStep, i: number) => (
                                <div key={i} className="p-4 rounded-xl bg-slate-900/20 border border-white/5">
                                    <h4 className="text-[9px] font-black uppercase text-primary/70 mb-1">{item.title}</h4>
                                    <p className="text-base font-bold text-white mb-2">{item.decision}</p>
                                    <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{item.justification}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Resilience - Right Side */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-3 border-b border-white/5 pb-2">
                            <Activity className="w-4 h-4 text-primary" />
                            <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Resilience Synthesis</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {data.what_if_analysis?.map((scenario: WhatIfScenario, i: number) => (
                                <div key={i} className="p-4 rounded-xl bg-slate-950/20 border border-white/5 space-y-3">
                                    <h4 className="font-bold text-sm text-white tracking-tight">{scenario.scenario}</h4>
                                    <div className="p-2.5 bg-primary/5 rounded-lg border border-primary/10">
                                        <p className="text-[9px] text-primary font-bold flex items-center gap-2">
                                            <CheckCircle2 className="w-3 h-3" /> {scenario.recommendation}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>

            {/* Extreme Density Chatbot */}
            <motion.section className="border-t border-white/5 pt-8">
                <div className="glass-panel p-6 rounded-2xl border-primary/10 bg-slate-900/50">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary flex items-center gap-2">
                            <MessageSquare className="w-3.5 h-3.5" /> Architect Consultation
                        </h3>
                        {isRefining && <Activity className="w-3 h-3 text-primary animate-pulse" />}
                    </div>

                    {data.clarifying_questions && data.clarifying_questions.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                            {data.clarifying_questions.map((q, i) => (
                                <div key={i} className="bg-primary/5 border border-primary/10 px-4 py-2 rounded-lg text-[10px] text-slate-300 italic">
                                    "{q.question}"
                                </div>
                            ))}
                        </div>
                    )}

                    <form onSubmit={handleChatSubmit} className="relative">
                        <textarea
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            placeholder="Refine requirements..."
                            className="w-full bg-slate-950 border border-white/5 rounded-xl px-6 py-4 text-xs focus:outline-none focus:border-primary/40 h-20 resize-none transition-all text-slate-200"
                        />
                        <button
                            type="submit"
                            disabled={isRefining || !chatInput.trim()}
                            className="absolute bottom-3 right-3 p-2 bg-primary rounded-lg hover:bg-primary-light disabled:opacity-20 text-white"
                        >
                            <Send className="w-3.5 h-3.5" />
                        </button>
                    </form>
                </div>
            </motion.section>
        </div>
    );
};
