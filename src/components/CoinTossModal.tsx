import React, { useState } from 'react';
import { Sparkles, X, RotateCcw, Heart, CheckCircle2 } from 'lucide-react';
import { OptionAnalysis } from '../types/decision';

interface CoinTossModalProps {
  isOpen: boolean;
  onClose: () => void;
  options: OptionAnalysis[];
  onPickOption: (optionId: string) => void;
}

export const CoinTossModal: React.FC<CoinTossModalProps> = ({
  isOpen,
  onClose,
  options,
  onPickOption,
}) => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<'heads' | 'tails' | null>(null);
  const [flipCount, setFlipCount] = useState(0);

  if (!isOpen) return null;

  const optA = options[0];
  const optB = options[1] || options[0];

  const handleFlip = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setResult(null);

    setTimeout(() => {
      const outcome = Math.random() < 0.5 ? 'heads' : 'tails';
      setResult(outcome);
      setIsFlipping(false);
      setFlipCount((prev) => prev + 1);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-indigo-500/30 p-6 sm:p-8 shadow-2xl shadow-indigo-950/50 text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Sudden Death Tiebreaker</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-white">
          The Intuition Coin Flip
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md mx-auto">
          "When you flip a coin, it's not to let the coin decide for you. It's because in the three seconds it's in the air, you suddenly know what you are hoping for."
        </p>

        {/* Options Assignment */}
        <div className="grid grid-cols-2 gap-3 my-6">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-indigo-500/20 text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block mb-0.5">
              Heads (Side 1)
            </span>
            <div className="text-xs sm:text-sm font-bold text-white line-clamp-2">
              {optA?.name}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-violet-500/20 text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400 block mb-0.5">
              Tails (Side 2)
            </span>
            <div className="text-xs sm:text-sm font-bold text-white line-clamp-2">
              {optB?.name}
            </div>
          </div>
        </div>

        {/* 3D Animated Coin */}
        <div className="my-8 flex justify-center items-center h-36">
          <div
            onClick={handleFlip}
            className={`cursor-pointer w-28 h-28 rounded-full border-4 border-amber-300 bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 shadow-2xl shadow-amber-500/40 flex items-center justify-center transition-transform select-none ${
              isFlipping
                ? 'animate-spin scale-110'
                : 'hover:scale-105 active:scale-95'
            }`}
            style={{
              animationDuration: isFlipping ? '0.25s' : '0s',
            }}
          >
            <div className="w-24 h-24 rounded-full border border-amber-500/60 flex flex-col items-center justify-center text-amber-950 font-black">
              {isFlipping ? (
                <span className="text-2xl animate-pulse">?</span>
              ) : result ? (
                <>
                  <span className="text-xl uppercase tracking-wider">
                    {result === 'heads' ? 'HEADS' : 'TAILS'}
                  </span>
                  <span className="text-[9px] font-bold opacity-80">
                    {result === 'heads' ? 'SIDE 1' : 'SIDE 2'}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-2xl">🪙</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider mt-1">
                    Tap to Flip
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div>
          <button
            onClick={handleFlip}
            disabled={isFlipping}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
          >
            {isFlipping ? 'Coin is in mid-air...' : result ? 'Flip Again' : 'Toss The Coin'}
          </button>
        </div>

        {/* Post-Flip Revelation Prompt */}
        {result && !isFlipping && (
          <div className="mt-6 p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-left space-y-3 animate-fade-in">
            <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase tracking-wider">
              <Heart className="w-4 h-4 text-rose-400" />
              <span>Gut Check Revelation</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              The coin landed on <strong className="text-amber-300 uppercase">{result}</strong> (
              {result === 'heads' ? optA?.name : optB?.name}). 
              Did you feel a micro-second of relief, or a micro-second of disappointment?
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => {
                  onPickOption(optA.id);
                  onClose();
                }}
                className="py-2 px-3 rounded-lg text-xs font-bold bg-slate-800 hover:bg-indigo-600 text-white border border-slate-700 hover:border-indigo-500 transition-colors"
              >
                My gut wanted {optA.name}
              </button>
              <button
                onClick={() => {
                  onPickOption(optB.id);
                  onClose();
                }}
                className="py-2 px-3 rounded-lg text-xs font-bold bg-slate-800 hover:bg-violet-600 text-white border border-slate-700 hover:border-violet-500 transition-colors"
              >
                My gut wanted {optB.name}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
