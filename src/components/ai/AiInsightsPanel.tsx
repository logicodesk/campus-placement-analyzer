import React, { useState } from 'react';
import { Sparkles, BrainCircuit, Check, Copy, RefreshCw, Key, ChevronDown, ChevronUp } from 'lucide-react';
import { generateStudentInsights, hasApiKey, StudentContextData } from '../../services/aiService';

interface AiInsightsPanelProps {
  context: StudentContextData;
  onOpenConfig: () => void;
}

export const AiInsightsPanel: React.FC<AiInsightsPanelProps> = ({ context, onOpenConfig }) => {
  const [report, setReport] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const handleGenerate = async () => {
    if (!hasApiKey()) {
      onOpenConfig();
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const generatedText = await generateStudentInsights(context);
      setReport(generatedText);
      setIsExpanded(true);
    } catch (err: any) {
      setError(err?.message || 'Failed to generate AI insights');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!report) return;
    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-indigo-200 dark:border-indigo-900/60 bg-white dark:bg-slate-900 shadow-md transition-colors">
      {/* Banner / Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-indigo-700 via-indigo-800 to-violet-900 dark:from-indigo-950 dark:via-indigo-900 dark:to-violet-950 p-5 text-white sm:px-7 border-b border-indigo-600/30 dark:border-indigo-800/40">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/20 text-white backdrop-blur">
            <Sparkles size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base sm:text-lg">AI Placement Counselor & Career Intelligence</h3>
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-100">
                Gemini Powered
              </span>
            </div>
            <p className="text-xs text-indigo-100 dark:text-indigo-200">
              Personalized diagnostics, risk mitigation, and 30-60-90 day preparation roadmaps
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!hasApiKey() ? (
            <button
              type="button"
              onClick={onOpenConfig}
              className="inline-flex items-center gap-1.5 rounded-xl bg-amber-400 dark:bg-amber-500 px-4 py-2 text-xs font-bold text-slate-900 hover:bg-amber-300 shadow-sm transition"
            >
              <Key size={14} /> Enter Gemini API Key
            </button>
          ) : (
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-xl bg-white dark:bg-slate-800 px-4 py-2 text-xs font-bold text-indigo-900 dark:text-indigo-200 hover:bg-indigo-50 dark:hover:bg-slate-700 shadow-sm disabled:opacity-50 transition border border-transparent dark:border-indigo-800/40"
            >
              {isLoading ? (
                <>
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                  Analyzing Profile...
                </>
              ) : report ? (
                <>
                  <RefreshCw size={14} /> Re-analyze with AI
                </>
              ) : (
                <>
                  <Sparkles size={14} className="text-indigo-600 dark:text-indigo-400" /> Generate AI Career Intelligence
                </>
              )}
            </button>
          )}

          {report && (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="rounded-xl bg-white/10 dark:bg-white/5 p-2 text-white hover:bg-white/20 transition"
              title={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      {error && (
        <div className="p-5 bg-rose-50 dark:bg-rose-950/40 border-b border-rose-200 dark:border-rose-900/50 text-xs text-rose-800 dark:text-rose-200 flex items-center justify-between">
          <span>⚠️ {error}</span>
          <button
            type="button"
            onClick={onOpenConfig}
            className="font-bold underline ml-2"
          >
            Update API Key
          </button>
        </div>
      )}

      {!report && !isLoading && !error && (
        <div className="p-6 text-center sm:p-8 bg-slate-50/60 dark:bg-slate-950/30">
          <BrainCircuit size={36} className="mx-auto text-indigo-500 dark:text-indigo-400 mb-3" />
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
            Take your ML predictions to the next level with Gemini AI
          </h4>
          <p className="mx-auto mt-1 max-w-lg text-xs leading-5 text-slate-500 dark:text-slate-400">
            The trained ML model predicts your placement likelihood ({context.placedProbability ? (context.placedProbability * 100).toFixed(1) + '%' : 'N/A'}) and tier ({context.predictedTier || 'Target Tier'}).
            Connect Gemini with your API key to generate a customized 30-60-90 day roadmap, identify specific interview vulnerabilities, and tailor resume projects.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            {!hasApiKey() ? (
              <button
                type="button"
                onClick={onOpenConfig}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 dark:bg-indigo-500 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 dark:hover:bg-indigo-600 transition"
              >
                <Key size={14} /> Set Up Free API Key
              </button>
            ) : (
              <button
                type="button"
                onClick={handleGenerate}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 dark:bg-indigo-500 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 dark:hover:bg-indigo-600 transition"
              >
                <Sparkles size={14} /> Generate Diagnostic Report
              </button>
            )}
          </div>
        </div>
      )}

      {isLoading && (
        <div className="p-10 text-center bg-slate-50/50 dark:bg-slate-950/30">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-3 border-indigo-600 dark:border-indigo-400 border-t-transparent mb-3" />
          <div className="text-sm font-bold text-slate-800 dark:text-slate-100">
            Gemini is synthesizing student profile and ML predictions...
          </div>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Formulating executive summary, competitive edges, score penalties, and roadmap
          </div>
        </div>
      )}

      {report && isExpanded && (
        <div className="p-6 sm:p-8 space-y-4 bg-white dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              AI Diagnostic Evaluation for <strong className="text-slate-800 dark:text-white">{context.name || 'Candidate'}</strong>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-xs transition"
            >
              {copied ? <Check size={13} className="text-emerald-600 dark:text-emerald-400" /> : <Copy size={13} />}
              {copied ? 'Copied' : 'Copy Report'}
            </button>
          </div>

          <div className="prose prose-sm max-w-none text-slate-800 dark:text-slate-200 leading-relaxed text-xs sm:text-sm whitespace-pre-wrap font-sans">
            {report}
          </div>
        </div>
      )}
    </div>
  );
};
