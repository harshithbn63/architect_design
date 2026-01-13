import React from 'react';
import { RequirementInput } from '../api';
import { Send, Terminal } from 'lucide-react';

interface Props {
    onSubmit: (data: RequirementInput) => void;
}

export const RequirementForm: React.FC<Props> = ({ onSubmit }) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const data = Object.fromEntries(formData.entries()) as unknown as RequirementInput;
        onSubmit(data);
    };

    const inputClasses = "w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-slate-200 placeholder:text-slate-700";
    const labelClasses = "block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1";

    const options = {
        user_count: ['1K - 10K', '10K - 100K', '100K - 1M', '1M - 10M+', 'Enterprise Global'],
        traffic: ['Steady State', 'Highly Bursty', 'Seasonal / Varied', 'Real-time / Interactive'],
        workload: ['CPU Bound (ML/Compute)', 'I/O Bound (Database/File)', 'Network Bound (Proxy/Socket)', 'Mixed Profile'],
        latency: ['Ultra Low (<50ms)', 'Low (<200ms)', 'Standard Responsive', 'Asynchronous / Background'],
        budget: ['Cost Optimized (Lean)', 'Balanced (Standard)', 'Performance Optimized', 'No-Limit Enterprise'],
        reliability: ['Standard (99.5%)', 'High Availability (99.9%)', 'Mission Critical (99.99%)', 'Multi-Region Fault Tolerant']
    };

    return (
        <form onSubmit={handleSubmit} className="glass-panel p-10 rounded-[2.5rem] space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div>
                        <label className={labelClasses}>Project Scale</label>
                        <select name="user_count" required className={inputClasses}>
                            {options.user_count.map(o => <option key={o} value={o} className="bg-slate-950">{o}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className={labelClasses}>Traffic Pattern</label>
                        <select name="traffic_pattern" required className={inputClasses}>
                            {options.traffic.map(o => <option key={o} value={o} className="bg-slate-950">{o}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className={labelClasses}>Workload Nature</label>
                        <select name="workload_type" required className={inputClasses}>
                            {options.workload.map(o => <option key={o} value={o} className="bg-slate-950">{o}</option>)}
                        </select>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className={labelClasses}>Latency Target</label>
                        <select name="latency_sensitivity" required className={inputClasses}>
                            {options.latency.map(o => <option key={o} value={o} className="bg-slate-950">{o}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className={labelClasses}>Budget Profile</label>
                        <select name="budget_constraint" required className={inputClasses}>
                            {options.budget.map(o => <option key={o} value={o} className="bg-slate-950">{o}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className={labelClasses}>Resilience Needs</label>
                        <select name="reliability_needs" required className={inputClasses}>
                            {options.reliability.map(o => <option key={o} value={o} className="bg-slate-950">{o}</option>)}
                        </select>
                    </div>
                </div>

                <div className="md:col-span-2 space-y-3">
                    <label className={labelClasses}>Functional Requirements & Business Logic</label>
                    <div className="relative group">
                        <Terminal className="absolute top-4 left-4 w-4 h-4 text-slate-600 group-focus-within:text-primary transition-colors" />
                        <textarea
                            name="additional_context"
                            placeholder="e.g. Video streaming platform with live chat, GDPR compliance, and elastic sharding required..."
                            className={`${inputClasses} h-40 pl-12 resize-none bg-slate-950/80 font-mono text-xs leading-relaxed`}
                        />
                    </div>
                </div>
            </div>

            <button
                type="submit"
                className="w-full py-5 bg-primary hover:bg-primary-light text-white font-bold rounded-2xl shadow-2xl shadow-primary/30 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs active:scale-[0.99] group overflow-hidden relative"
            >
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10">Synthesize Production Architecture</span>
                <Send className="w-4 h-4 relative z-10 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </button>
        </form>
    );
};
