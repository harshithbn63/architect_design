import { useState } from 'react';
import { motion } from 'framer-motion';
import { RequirementInput, ValidationResult } from '../api';
import { HelpCircle } from 'lucide-react';

interface Props {
    data: ValidationResult;
    initialValues: RequirementInput;
    onSubmit: (data: RequirementInput) => void;
}

export const ClarificationForm: React.FC<Props> = ({ data, initialValues, onSubmit }) => {
    const [formData, setFormData] = useState<RequirementInput>(initialValues);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 mb-8 flex gap-4">
                <HelpCircle className="w-8 h-8 text-amber-500 shrink-0" />
                <div>
                    <h3 className="text-xl font-semibold text-amber-500 mb-1">More Detail Needed</h3>
                    <p className="text-amber-200/70 text-sm">The AI Architect needs clarification on a few points to design a robust production system.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {data.clarifying_questions.map((q, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="glass-card p-6 rounded-2xl border-white/5"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <span className="text-xs font-mono px-2 py-1 bg-primary/20 text-primary-light rounded border border-primary/30 uppercase tracking-tighter">
                                {q.field}
                            </span>
                            <span className="text-[10px] text-slate-500 uppercase tracking-widest">Question {idx + 1}</span>
                        </div>

                        <h4 className="text-lg font-medium mb-2 text-slate-200">{q.question}</h4>
                        <p className="text-sm text-slate-400 mb-6 italic opacity-80">" {q.why} "</p>

                        <textarea
                            required
                            rows={3}
                            value={(formData as any)[q.field] || ''}
                            onChange={(e) => setFormData({ ...formData, [q.field]: e.target.value })}
                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-slate-200 placeholder:text-slate-600 resize-none"
                            placeholder="Provide more specific details here..."
                        />
                    </motion.div>
                ))}

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button
                        type="submit"
                        className="flex-1 py-4 primary-gradient rounded-xl font-bold text-white transition-all shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.99]"
                    >
                        Submit Clarifications
                    </button>
                </div>
            </form>
        </div>
    );
};

