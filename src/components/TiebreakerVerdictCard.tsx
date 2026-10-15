import React, { useState } from 'react';
import { Trophy, ShieldAlert, Clock, Sparkles, AlertTriangle, ArrowRight, CheckCircle2, Flame, Compass } from 'lucide-react';
import { TiebreakerVerdict, OptionAnalysis } from '../types/decision';

interface TiebreakerVerdictCardProps {
  verdict: TiebreakerVerdict;
  options: OptionAnalysis[];
  gutCheckQuestion: string;
  onLockInDecision: (optionId: string) => void;
  onCoinToss: () => void;
}

export const TiebreakerVerdictCard: React.FC<TiebreakerVerdictCardProps> = ({
  verdict,
  options,
  gutCheckQuestion,
  onLockInDecision,
  onCoinToss,
}) => {
  const [showDevilsAdvocate, setShowDevilsAdvocate] = useState(false);
  const winningOption = options.find((o) => o.id === verdict.recommendedOptionId) || options[0];

  const confidenceColor =
    verdict.confidenceLevel.toLowerCase().includes('high')
      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
      : verdict.confidenceLevel.toLowerCase().includes('moderate')
      ? 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20'
      : 'text-amber-400 bg-amber-500/10 border-amber-500/20';

  return (
    <div className="relative overflow-hidden rounded-2xl border border-indigo-500/30 bg-gradient-to-b from-indigo-950/40 via-slate-900/90 to-slate-950 p-6 sm:p-8 shadow-2xl shadow-indigo-950/30">
      {/* Decorative gradient glow */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />

      {/* Top Header Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>The Tiebreaker Recommendation</span>
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${confidenceColor}`}>
            Confidence: {verdict.confidenceLevel}
          </span>
          <button
            onClick={onCoinToss}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
            title="When you're 50/50, let the coin reveal your gut instinct"
          >
            <span>🪙 Sudden Death Flip</span>
          </button>
        </div>
      </div>

      {/* Main Champion Announcement */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-400 mb-1">
          <span>Decisive Path Forward</span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
          {verdict.recommendationTitle || winningOption?.name}
        </h2>
        {winningOption?.tagline && (
          <p className="text-sm font-medium text-indigo-300/90 mt-1 italic">
            "{winningOption.tagline}"
          </p>
        )}
        <p className="mt-3 text-slate-300 text-base leading-relaxed sm:text-lg">
          {verdict.verdictSummary}
        </p>
      </div>

      {/* Key Tipping Point */}
      <div className="mb-6 p-4 rounded-xl bg-slate-950/70 border border-indigo-500/20 flex items-start gap-3.5">
        <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 flex-shrink-0 mt-0.5">
          <Flame className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-1">
            The Decisive Factor (Why this breaks the tie)
          </h4>
          <p className="text-sm text-slate-200 leading-snug">
            {verdict.keyDifferentiator}
          </p>
        </div>
      </div>

      {/* 10/10/10 Rule Perspective Grid */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-slate-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            The 10/10/10 Rule (Temporal Clarity)
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 block mb-1">
              In 10 Minutes
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {verdict.tenTenTenRule.in10Minutes}
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80">
            <span className="text-[11px] font-bold uppercase tracking-wider text-violet-400 block mb-1">
              In 10 Months
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {verdict.tenTenTenRule.in10Months}
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80">
            <span className="text-[11px] font-bold uppercase tracking-wider text-fuchsia-400 block mb-1">
              In 10 Years
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {verdict.tenTenTenRule.in10Years}
            </p>
          </div>
        </div>
      </div>

      {/* Reversible Micro-Experiments */}
      {verdict.reversibleMicroExperiments && verdict.reversibleMicroExperiments.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Compass className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Low-Risk Micro-Experiments (Test before locking in)
            </h3>
          </div>
          <div className="space-y-2">
            {verdict.reversibleMicroExperiments.map((exp, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-slate-200">
                      {exp.experiment}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 ml-7">
                    <span className="text-slate-500 font-medium">Signal:</span> {exp.whatToWatchFor}
                  </p>
                </div>
                <span className="self-start sm:self-center ml-7 sm:ml-0 flex-shrink-0 text-[11px] font-medium px-2 py-0.5 rounded bg-slate-800 text-indigo-300">
                  {exp.timeframe}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Devil's Advocate Section */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => setShowDevilsAdvocate(!showDevilsAdvocate)}
          className="flex items-center justify-between w-full py-2.5 px-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 text-left transition-colors"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span className="text-xs sm:text-sm font-semibold text-slate-200">
              Stress Test: Play Devil's Advocate
            </span>
          </div>
          <span className="text-xs font-medium text-indigo-400">
            {showDevilsAdvocate ? 'Hide Counter-View' : 'Challenge Assumptions'}
          </span>
        </button>

        {showDevilsAdvocate && (
          <div className="mt-3 p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-3">
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
                The Strongest Counter-Argument
              </h5>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {verdict.devilsAdvocate.challengingArgument}
              </p>
            </div>

            {verdict.devilsAdvocate.assumptionsToTest && (
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
                  Assumptions You Are Making
                </h5>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
                  {verdict.devilsAdvocate.assumptionsToTest.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-2 border-t border-amber-500/20">
              <span className="text-xs font-semibold text-rose-300">
                ⚠️ When you should NOT follow this verdict:
              </span>
              <p className="text-xs text-slate-300 mt-0.5">
                {verdict.devilsAdvocate.dealbreakerCondition}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Intuitive Gut Check Box */}
      {gutCheckQuestion && (
        <div className="p-3.5 rounded-xl bg-violet-950/20 border border-violet-500/20 text-xs text-violet-200 mb-6 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-violet-300 uppercase tracking-wide text-[10px] block mb-0.5">
              Gut Check Inversion
            </span>
            <span>{gutCheckQuestion}</span>
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="text-xs text-slate-400">
          Ready to commit? Record your choice to keep yourself accountable.
        </span>
        <button
          onClick={() => onLockInDecision(winningOption?.id || '')}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Lock In This Decision</span>
        </button>
      </div>
    </div>
  );
};
