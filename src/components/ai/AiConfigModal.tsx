import React, { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, CheckCircle2, AlertCircle, Sparkles, ExternalLink, X, Cpu, ShieldCheck, Lock } from 'lucide-react';
import {
  hasApiKey,
  setApiKey,
  getSelectedModel,
  setSelectedModel,
  validateApiKey,
  isEnvKeyConfigured,
  isLocalStorageKeyConfigured,
  getMaskedApiKey,
} from '../../services/aiService';

interface AiConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved?: () => void;
}

export const AiConfigModal: React.FC<AiConfigModalProps> = ({ isOpen, onClose, onKeySaved }) => {
  const [keyInput, setKeyInput] = useState('');
  const [modelInput, setModelInput] = useState('gemini-3.6-flash');
  const [showKey, setShowKey] = useState(false);
  const [status, setStatus] = useState<'idle' | 'testing' | 'valid' | 'invalid'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [isKeyActive, setIsKeyActive] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // NEVER load the actual raw key into the input field to prevent screen/inspection exposure
      setKeyInput('');
      setShowKey(false);
      setModelInput(getSelectedModel());
      setIsKeyActive(hasApiKey());
      setStatus('idle');
      setStatusMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestKey = async () => {
    const keyToValidate = keyInput.trim() || (isKeyActive ? undefined : '');
    if (!keyToValidate && !isKeyActive) {
      setStatus('invalid');
      setStatusMessage('Please enter an API key to test.');
      return;
    }
    setStatus('testing');
    setStatusMessage('Testing secure connection to Gemini API...');
    setSelectedModel(modelInput);
    const result = await validateApiKey(keyInput.trim() || undefined);
    if (result.valid) {
      setStatus('valid');
      setStatusMessage(`Connection verified successfully with ${result.model || modelInput}!`);
    } else {
      setStatus('invalid');
      setStatusMessage(result.message);
    }
  };

  const handleSave = () => {
    if (keyInput.trim()) {
      setApiKey(keyInput.trim());
    }
    setSelectedModel(modelInput);
    if (onKeySaved) onKeySaved();
    onClose();
  };

  const handleClear = () => {
    setKeyInput('');
    setApiKey('');
    setIsKeyActive(false);
    setStatus('idle');
    setStatusMessage('Custom API key removed.');
    if (onKeySaved) onKeySaved();
  };

  const isEnv = isEnvKeyConfigured();
  const isStorage = isLocalStorageKeyConfigured();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-black/75 p-4 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl sm:p-7 text-slate-900 dark:text-slate-100 transition-colors">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
            <Sparkles size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">AI Intelligence Settings</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Secure configuration for Google Gemini AI integration</p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {/* Active Key Status Card (Always keeps key completely hidden) */}
          {isKeyActive && (
            <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/70 dark:bg-emerald-950/40 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 dark:text-emerald-300">
                  <ShieldCheck size={17} className="text-emerald-600 dark:text-emerald-400" />
                  <span>API Key Configured & Active</span>
                </div>
                <span className="rounded-full bg-emerald-200/80 dark:bg-emerald-900/70 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-950 dark:text-emerald-200 uppercase tracking-wider">
                  Protected
                </span>
              </div>
              <div className="mt-2.5 flex items-center gap-2 rounded-xl border border-emerald-300/40 dark:border-emerald-700/50 bg-white/70 dark:bg-slate-900/60 px-3 py-2 text-xs font-mono text-slate-600 dark:text-slate-300">
                <Lock size={13} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="tracking-widest">••••••••••••••••••••••••••••••••</span>
                <span className="text-[10px] font-sans font-semibold text-slate-400 dark:text-slate-500 ml-auto shrink-0">
                  (Hidden for security)
                </span>
              </div>
              <p className="mt-2 text-[11px] text-emerald-800/80 dark:text-emerald-300/80">
                {isEnv
                  ? 'Key is securely loaded from environment variables (.env). It is never exposed in the browser.'
                  : 'Key is securely stored in your browser session and masked.'}
              </p>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              {isKeyActive ? 'Change / Update API Key' : 'Gemini API Key'}
            </label>
            <div className="mt-1.5 relative flex items-center">
              <div className="pointer-events-none absolute left-3 text-slate-400 dark:text-slate-500">
                <Key size={17} />
              </div>
              <input
                type={showKey ? 'text' : 'password'}
                value={keyInput}
                onChange={e => {
                  setKeyInput(e.target.value);
                  setStatus('idle');
                }}
                placeholder={isKeyActive ? 'Enter new key only if you want to replace it...' : 'Paste your Gemini API key here...'}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 py-2.5 pl-9 pr-10 text-sm font-mono text-slate-900 dark:text-slate-100 outline-none transition focus:border-indigo-500 dark:focus:border-indigo-400 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
              {keyInput && (
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                  title={showKey ? 'Hide key' : 'Show key'}
                >
                  {showKey ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              )}
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>{isKeyActive && !keyInput ? 'Leave blank to keep current active key.' : 'API keys are never transmitted to third parties.'}</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Get API key from Google AI Studio <ExternalLink size={12} />
              </a>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Gemini AI Model
            </label>
            <div className="mt-1.5 relative flex items-center">
              <div className="pointer-events-none absolute left-3 text-slate-400 dark:text-slate-500">
                <Cpu size={17} />
              </div>
              <select
                value={modelInput}
                onChange={e => {
                  setModelInput(e.target.value);
                  setStatus('idle');
                }}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 py-2.5 pl-9 pr-3 text-sm text-slate-900 dark:text-slate-100 outline-none transition focus:border-indigo-500 dark:focus:border-indigo-400 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/40"
              >
                <option value="gemini-3.6-flash">Gemini 3.6 Flash (Recommended - Fast & Stable)</option>
                <option value="gemini-3.8-flash">Gemini 3.8 Flash (Latest)</option>
                <option value="gemini-flash-latest">Gemini Flash Latest</option>
                <option value="gemini-3.5-flash">Gemini 3.5 Flash</option>
              </select>
            </div>
          </div>

          {/* Test Status feedback */}
          {status !== 'idle' && (
            <div
              className={`flex items-start gap-2.5 rounded-xl border p-3 text-xs leading-5 ${
                status === 'valid'
                  ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
                  : status === 'invalid'
                  ? 'border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200'
                  : 'border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200'
              }`}
            >
              {status === 'valid' && <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" />}
              {status === 'invalid' && <AlertCircle size={16} className="mt-0.5 shrink-0 text-rose-600 dark:text-rose-400" />}
              {status === 'testing' && (
                <div className="mt-0.5 h-3.5 w-3.5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent shrink-0" />
              )}
              <div className="flex-1">{statusMessage}</div>
            </div>
          )}

          <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/60 bg-indigo-50/60 dark:bg-indigo-950/30 p-3.5 text-xs text-indigo-950 dark:text-indigo-200">
            <div className="font-bold flex items-center gap-1.5 text-indigo-800 dark:text-indigo-300">
              <Sparkles size={14} /> AI-Powered Features Enabled:
            </div>
            <ul className="mt-2 space-y-1 list-disc list-inside text-[11px] text-slate-600 dark:text-slate-400">
              <li><strong>Personalized Placement Diagnostic & 90-Day Roadmap</strong></li>
              <li><strong>Interactive 24/7 AI Placement Mentor & Interview Prep Chat</strong></li>
              <li><strong>Project Resume Bullet Optimizer (Google STAR Format)</strong></li>
            </ul>
          </div>
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800 pt-5">
          <div>
            {isStorage && (
              <button
                type="button"
                onClick={handleClear}
                className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-300"
              >
                Clear custom key
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleTestKey}
              disabled={status === 'testing' || (!keyInput.trim() && !isKeyActive)}
              className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 transition"
            >
              {status === 'testing' ? 'Testing...' : 'Test Connection'}
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 dark:bg-indigo-500 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 dark:hover:bg-indigo-600 transition"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
