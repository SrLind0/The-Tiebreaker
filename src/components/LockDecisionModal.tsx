import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, X, Sparkles, HeartHandshake } from 'lucide-react';
import { OptionAnalysis } from '../types/decision';

interface LockDecisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  options: OptionAnalysis[];
  initialOptionId: string;
  onConfirm: (optionId: string, notes: string) => void;
}

export const LockDecisionModal: React.FC<LockDecisionModalProps> = ({
  isOpen,
  onClose,
  options,
  initialOptionId,
  onConfirm,
}) => {
  const [selectedId, setSelectedId] = useState(initialOptionId || options[0]?.id || '');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Trigger joyful celebration confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      if (initialOptionId) {
        setSelectedId(initialOptionId);
      }
    }
  }, [isOpen, initialOptionId]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(selectedId, notes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-emerald-500/30 p-6 sm:p-8 shadow-2xl shadow-emerald-950/40 text-left">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Commitment Ceremony</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-white">
          Lock In Your Choice
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          A good decision executed with commitment always beats an over-analyzed decision made with hesitation.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Option Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Confirm Which Path You Are Taking
            </label>
            <div className="space-y-2">
              {options.map((opt) => {
                const isSelected = selectedId === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedId(opt.id)}
                    className={`cursor-pointer p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-emerald-950/30 border-emerald-500 ring-1 ring-emerald-500/30'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <h4 className="text-sm font-bold text-white">{opt.name}</h4>
                      <p className="text-xs text-slate-400">{opt.tagline}</p>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Commitment Note */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Personal Commitment Note / Boundary (Optional)
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., I commit to this choice for at least 12 months. I will protect my family dinner time and focus on mastering the new stack."
              className="w-full text-xs sm:text-sm rounded-xl bg-slate-950 border border-slate-800 p-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-600/30 transition-all"
            >
              Confirm & Save Decision
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
