import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Bot, User, RefreshCw, ChevronDown } from 'lucide-react';
import { ChatMessage, chatWithPlacementMentor, hasApiKey, StudentContextData } from '../../services/aiService';

interface AiMentorChatProps {
  context?: StudentContextData;
  onOpenConfig: () => void;
}

const DEFAULT_SUGGESTIONS = [
  'How can I raise my placement probability to 85%?',
  'Which tier companies should I target first?',
  'What DSA patterns should I focus on for my branch?',
  'How do I answer "tell me about your backlogs" positively?',
];

export const AiMentorChat: React.FC<AiMentorChatProps> = ({ context, onOpenConfig }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello ${context?.name ? context.name : 'there'}! I'm your **Placement AI Mentor**. I'm analyzing your academic scores, technical proficiencies, and ML model predictions.\n\nAsk me anything about interview preparation, company OA rounds, resume points, or strategies to maximize your placement chances!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    if (!hasApiKey()) {
      onOpenConfig();
      return;
    }

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await chatWithPlacementMentor(messages, text, context);
      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `⚠️ **AI Error:** ${err?.message || 'Failed to connect'}\n\nPlease check your Gemini API key in settings.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: 'reset',
        role: 'assistant',
        content: `Conversation reset. What would you like to prepare for next?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 py-3 px-5 text-sm font-bold text-white shadow-xl shadow-indigo-600/30 transition hover:scale-105 active:scale-95 border border-white/20"
        >
          <Sparkles size={18} />
          <span>Ask AI Placement Mentor</span>
          <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 flex h-[580px] w-[95vw] max-w-[440px] flex-col rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl animate-fade-in overflow-hidden transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-indigo-600 to-violet-700 px-5 py-4 text-white">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/20 text-white backdrop-blur">
            <Bot size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm">Placement AI Mentor</span>
              <span className="rounded-full bg-emerald-400/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-200">
                Gemini Active
              </span>
            </div>
            <div className="text-[11px] text-indigo-100">
              {context?.predictedPlaced ? `Profile ~${((context.placedProbability || 0.7) * 100).toFixed(0)}% chance` : 'Empowering student success'}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleClear}
            title="Reset Chat"
            className="rounded-lg p-1.5 text-white/80 hover:bg-white/10 hover:text-white"
          >
            <RefreshCw size={15} />
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            title="Minimize"
            className="rounded-lg p-1.5 text-white/80 hover:bg-white/10 hover:text-white"
          >
            <ChevronDown size={19} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-3.5 overflow-y-auto p-4 bg-[#f8fafc] dark:bg-slate-950/70 text-xs">
        {!hasApiKey() && (
          <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 p-3.5 text-amber-900 dark:text-amber-200">
            <div className="font-bold flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
              <Sparkles size={14} /> Gemini API Key Required
            </div>
            <p className="mt-1 text-[11px] leading-4 text-amber-800 dark:text-amber-300">
              To chat with your AI mentor and receive personalized placement advice, please configure your free Gemini API key.
            </p>
            <button
              type="button"
              onClick={onOpenConfig}
              className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-700 shadow-sm"
            >
              Configure API Key
            </button>
          </div>
        )}

        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg text-white ${
                msg.role === 'user' ? 'bg-indigo-600' : 'bg-violet-700 dark:bg-violet-600'
              }`}
            >
              {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
            </div>
            <div
              className={`max-w-[82%] rounded-2xl p-3 leading-5 shadow-xs ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-tl-none whitespace-pre-wrap'
              }`}
            >
              {msg.content}
              <div
                className={`mt-1 text-[9px] ${
                  msg.role === 'user' ? 'text-indigo-200 text-right' : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 italic text-[11px]">
            <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
            AI Mentor is generating advice...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested chips */}
      {messages.length <= 3 && (
        <div className="flex flex-wrap gap-1.5 px-3 py-2 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 max-h-24 overflow-y-auto">
          {DEFAULT_SUGGESTIONS.map((sug, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(sug)}
              className="rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1 text-[10px] font-semibold text-slate-600 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-700 dark:hover:text-indigo-300 transition"
            >
              {sug}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3"
      >
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={hasApiKey() ? 'Ask about preparation, projects, companies...' : 'Configure API key to chat...'}
          disabled={!hasApiKey() || isLoading}
          className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 outline-none transition focus:border-indigo-500 dark:focus:border-indigo-400 focus:bg-white dark:focus:bg-slate-800 focus:ring-1 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!hasApiKey() || !input.trim() || isLoading}
          className="grid h-8 w-8 place-items-center rounded-xl bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 disabled:opacity-40 transition"
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
};
