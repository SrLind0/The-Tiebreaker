import React, { useState } from 'react';
import { Shield, AlertTriangle, Zap, Skull, Compass, ArrowUpRight } from 'lucide-react';
import { OptionAnalysis } from '../types/decision';

interface SwotAnalysisViewProps {
  options: OptionAnalysis[];
}

export const SwotAnalysisView: React.FC<SwotAnalysisViewProps> = ({ options }) => {
  const [activeOptionId, setActiveOptionId] = useState(options[0]?.id || '');
  const activeOption = options.find((o) => o.id === activeOptionId) || options[0];

  if (!activeOption) return null;
  const swot = activeOption.swot;

  return (
    <div className="space-y-6">
      {/* Option Selector Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setActiveOptionId(opt.id)}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeOptionId === opt.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white'
              }`}
            >
              {opt.name}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-400">
          Showing 2x2 Strategic SWOT Grid
        </span>
      </div>

      {/* Selected Option Banner */}
      <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
            Strategic Evaluation
          </span>
          <h3 className="text-lg font-bold text-white">
            {activeOption.name}
          </h3>
          <p className="text-xs text-indigo-300 italic mt-0.5">
            "{activeOption.tagline}"
          </p>
        </div>
      </div>

      {/* 2x2 SWOT Quadrant Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* STRENGTHS */}
        <div className="rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-emerald-950/20 to-slate-900/60 p-5 shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Strengths (Internal Advantages)
              </h4>
              <p className="text-[11px] text-slate-400">Core capabilities and built-in edges</p>
            </div>
          </div>
          <ul className="space-y-2 text-xs text-slate-200">
            {swot.strengths.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* WEAKNESSES */}
        <div className="rounded-2xl border border-amber-500/25 bg-gradient-to-br from-amber-950/20 to-slate-900/60 p-5 shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Weaknesses (Internal Limitations)
              </h4>
              <p className="text-[11px] text-slate-400">Structural liabilities and bottlenecks</p>
            </div>
          </div>
          <ul className="space-y-2 text-xs text-slate-200">
            {swot.weaknesses.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* OPPORTUNITIES */}
        <div className="rounded-2xl border border-sky-500/25 bg-gradient-to-br from-sky-950/20 to-slate-900/60 p-5 shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400">
                Opportunities (External Upsides)
              </h4>
              <p className="text-[11px] text-slate-400">Favorable external catalysts and expansions</p>
            </div>
          </div>
          <ul className="space-y-2 text-xs text-slate-200">
            {swot.opportunities.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 flex-shrink-0" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* THREATS */}
        <div className="rounded-2xl border border-rose-500/25 bg-gradient-to-br from-rose-950/20 to-slate-900/60 p-5 shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
              <Skull className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400">
                Threats (External Risks)
              </h4>
              <p className="text-[11px] text-slate-400">Macro uncertainties and vulnerabilities</p>
            </div>
          </div>
          <ul className="space-y-2 text-xs text-slate-200">
            {swot.threats.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 flex-shrink-0" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Strategic Playbook Callout */}
      {swot.strategicPlaybook && (
        <div className="p-4 sm:p-5 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 flex items-start gap-3.5">
          <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 flex-shrink-0 mt-0.5">
            <Compass className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-1">
              Strategic Playbook for {activeOption.name}
            </h4>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {swot.strategicPlaybook}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
