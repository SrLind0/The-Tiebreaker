import React from 'react';
import { Scale, Sparkles, Bookmark, RotateCcw, Share2, Printer, PlusCircle } from 'lucide-react';

interface HeaderProps {
  onNewDecision: () => void;
  onOpenSaved: () => void;
  onOpenPresets: () => void;
  savedCount: number;
  hasActiveAnalysis: boolean;
  onPrint: () => void;
  onShare: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNewDecision,
  onOpenSaved,
  onOpenPresets,
  savedCount,
  hasActiveAnalysis,
  onPrint,
  onShare,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={onNewDecision}
          className="flex items-center gap-3 cursor-pointer group transition-transform active:scale-95"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-fuchsia-500 shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-shadow">
            <Scale className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                The Tiebreaker
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                AI Decision Engine
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Turn cognitive overload into clear choices
            </p>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenPresets}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
            title="Explore sample dilemmas"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Examples</span>
          </button>

          <button
            onClick={onOpenSaved}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
          >
            <Bookmark className="w-3.5 h-3.5 text-slate-400" />
            <span>Saved</span>
            {savedCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[11px] font-semibold bg-indigo-600 text-white">
                {savedCount}
              </span>
            )}
          </button>

          {hasActiveAnalysis && (
            <>
              <button
                onClick={onPrint}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
                title="Print or Export PDF"
              >
                <Printer className="w-3.5 h-3.5 text-slate-400" />
                <span>Export / Print</span>
              </button>

              <button
                onClick={onShare}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
                title="Copy shareable link or markdown"
              >
                <Share2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Share</span>
              </button>
            </>
          )}

          <button
            onClick={onNewDecision}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/20 transition-all active:scale-95"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Dilemma</span>
          </button>
        </div>
      </div>
    </header>
  );
};
