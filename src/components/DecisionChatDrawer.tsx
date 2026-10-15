import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User, Sparkles } from 'lucide-react';
import { OptionAnalysis, TiebreakerVerdict } from '../types/decision';

interface DecisionChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  dilemma: string;
  options: OptionAnalysis[];
  verdict: TiebreakerVerdict;
}

interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

const SAMPLE_QUESTIONS = [
  'What if the compensation is 20% higher?',
  'How do I gracefully decline the other option?',
  'What is the worst-case scenario and how do I survive it?',
  'Can you help me craft a counter-proposal?',
];

export const DecisionChatDrawer: React.FC<DecisionChatDrawerProps> = ({
  isOpen,
  onClose,
  dilemma,
  options,
  verdict,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      content: `I have thoroughly reviewed your dilemma: "${dilemma}". My primary recommendation is **${verdict.recommendationTitle}**. What questions, "what-if" scenarios, or reservations can I help you work through?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', content: text.trim() };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/decisions/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dilemma,
          options,
          verdict,
          messages: nextMessages,
        }),
      });

      const data = await res.json();
      if (data.reply) {
        setMessages([...nextMessages, { role: 'model', content: data.reply }]);
      } else {
        setMessages([
          ...nextMessages,
          { role: 'model', content: 'Apologies, I encountered an issue. Please ask again.' },
        ]);
      }
    } catch (err: any) {
      setMessages([
        ...nextMessages,
        { role: 'model', content: 'Network error. Please try asking again.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
      {/* Drawer Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
              <span>Decision Advisory Chat</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                Online
              </span>
            </h3>
            <p className="text-xs text-slate-400 truncate max-w-[280px]">
              {dilemma}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Suggested Quick Questions */}
      <div className="p-3 border-b border-slate-800/80 bg-slate-950/40 overflow-x-auto flex items-center gap-2 no-scrollbar">
        {SAMPLE_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            disabled={isLoading}
            className="text-[11px] px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-indigo-900/40 text-slate-300 hover:text-indigo-200 border border-slate-700/60 whitespace-nowrap transition-colors flex-shrink-0"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-start gap-2.5 ${
              msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-indigo-400 border border-slate-700'
              }`}
            >
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-slate-950/80 border border-slate-800 text-slate-200 rounded-tl-none whitespace-pre-line'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <div className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
            </div>
            <span>Evaluating your scenario...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Field */}
      <div className="p-3.5 border-t border-slate-800 bg-slate-950/90">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask follow-up, test a what-if, or request negotiation advice..."
            className="flex-1 rounded-xl bg-slate-900 border border-slate-800 focus:border-indigo-500 px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 outline-none"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
