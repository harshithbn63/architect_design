import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout, Zap, AlertCircle } from 'lucide-react';
import { analyzeRequirements, RequirementInput, FinalResponse, ArchitectureResponse } from './api';
import { RequirementForm } from './components/RequirementForm';
import { ResultsDashboard } from './components/ResultsDashboard';

function App() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<FinalResponse | null>(null);
  const [requirements, setRequirements] = useState<RequirementInput | null>(null);

  const handleSubmit = async (data: RequirementInput) => {
    setLoading(true);
    setRequirements(data);
    const result = await analyzeRequirements(data);
    setResponse(result);
    setLoading(false);
  };

  const handleRefine = async (additionalContext: string) => {
    if (!requirements) return;
    setLoading(true);
    const updatedRequirements = {
      ...requirements,
      additional_context: (requirements.additional_context || '') + "\n\nUser Refinement: " + additionalContext
    };
    setRequirements(updatedRequirements);
    const result = await analyzeRequirements(updatedRequirements);
    setResponse(result);
    setLoading(false);
  };

  const handleReset = () => {
    setResponse(null);
    setRequirements(null);
  };

  return (
    <div className="min-h-screen bg-black text-slate-300 p-4 md:p-8 font-sans selection:bg-primary/30">
      {/* Background Decorative Elements - Subtle Red Glow */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10 bg-black">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-red-500/5 rounded-full blur-[160px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-red-500/5 rounded-full blur-[160px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      <header className="max-w-7xl mx-auto mb-16 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-black border border-red-500/20 rounded-2xl shadow-2xl shadow-red-500/10">
            <Layout className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">System Architect</h1>
            <p className="text-slate-500 text-sm font-medium tracking-wide border-t border-white/5 mt-1 pt-1 uppercase">Decision Intelligence Platform</p>
          </div>
        </div>

        {response?.status === 'success' && (
          <button
            onClick={handleReset}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border border-white/5 hover:border-primary/20 text-slate-300"
          >
            New Project
          </button>
        )}
      </header>

      <main className="max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {!response && !loading && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="max-w-2xl mx-auto"
            >
              <div className="mb-12 text-center space-y-3">
                <h2 className="text-4xl font-bold text-white tracking-tighter">Initialize System</h2>
                <p className="text-slate-500 max-w-lg mx-auto leading-relaxed">Define your technical constraints. Our engine will synthesize a high-fidelity, production-grade blueprint.</p>
              </div>
              <RequirementForm onSubmit={handleSubmit} />
            </motion.div>
          )}

          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-32"
            >
              <div className="relative w-32 h-32 mb-10">
                <div className="absolute inset-0 border border-primary/10 rounded-full"></div>
                <div className="absolute inset-0 border-t border-primary rounded-full animate-spin"></div>
                <div className="absolute inset-4 bg-slate-900/50 rounded-full flex items-center justify-center backdrop-blur-3xl shadow-2xl shadow-primary/20">
                  <Zap className="w-8 h-8 text-primary animate-pulse" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight mb-4 text-center">Synthesizing Architecture</h3>
              <div className="flex flex-col items-center gap-2 group">
                <div className="flex gap-4 text-slate-600 font-mono text-[10px] uppercase tracking-[0.2em]">
                  <span className="animate-pulse">Reasoning Pipeline</span>
                  <span>•</span>
                  <span className="text-primary/70">Multi-Pass Analysis</span>
                </div>
                <div className="w-48 h-0.5 bg-white/5 rounded-full overflow-hidden mt-4">
                  <motion.div
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className="w-full h-full bg-primary"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {response?.status === 'success' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full"
            >
              <ResultsDashboard
                data={response.data as ArchitectureResponse}
                onRefine={handleRefine}
                isRefining={loading}
              />
            </motion.div>
          )}

          {response?.status === 'error' && (
            <motion.div
              key="error"
              className="max-w-md mx-auto p-12 glass-card border-red-500/20 text-center rounded-[2rem] shadow-red-500/5 shadow-2xl"
            >
              <div className="w-20 h-20 bg-red-500/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-500/20 shadow-inner">
                <AlertCircle className="w-10 h-10 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Synthesis Failure</h3>
              <p className="text-slate-500 mb-10 leading-relaxed">The reasoning engine encountered an unrecoverable state. Please adjust your parameters and re-initialize.</p>
              <button
                onClick={handleReset}
                className="w-full py-4 bg-slate-900 hover:bg-slate-800 rounded-2xl font-bold text-slate-300 border border-white/5 transition-all active:scale-[0.98]"
              >
                Back to Dashboard
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="max-w-7xl mx-auto mt-32 pb-16 pt-8 border-t border-white/5 text-center">
        <p className="text-slate-600 text-[10px] uppercase tracking-[0.3em] font-bold">&copy; 2026 • Decision Intelligence for Engineers</p>
      </footer>
    </div>
  );
}

export default App;
