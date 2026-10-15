import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, ShieldCheck, AlertCircle, Sparkles, Plus, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { OptionAnalysis, ProItem, ConItem } from '../types/decision';

interface ProsConsViewProps {
  options: OptionAnalysis[];
  onAddUserProCon?: (optionId: string, type: 'pro' | 'con', item: { point: string; detail: string; score: number }) => void;
}

export const ProsConsView: React.FC<ProsConsViewProps> = ({ options, onAddUserProCon }) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string>('all');
  const [expandedMitigation, setExpandedMitigation] = useState<Record<string, boolean>>({});

  // Local additions per option
  const [userItems, setUserItems] = useState<Record<string, { pros: ProItem[]; cons: ConItem[] }>>({});
  const [activeAddModal, setActiveAddModal] = useState<{ optionId: string; type: 'pro' | 'con' } | null>(null);
  const [newPoint, setNewPoint] = useState('');
  const [newDetail, setNewDetail] = useState('');
  const [newScore, setNewScore] = useState(3);

  const toggleMitigation = (key: string) => {
    setExpandedMitigation(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAddModal || !newPoint.trim()) return;

    const { optionId, type } = activeAddModal;
    const current = userItems[optionId] || { pros: [], cons: [] };

    if (type === 'pro') {
      const newPro: ProItem = {
        point: newPoint.trim(),
        detail: newDetail.trim() || 'Custom pro added by you',
        impact: newScore,
        category: 'Personal Consideration',
      };
      setUserItems({
        ...userItems,
        [optionId]: { ...current, pros: [...current.pros, newPro] },
      });
    } else {
      const newCon: ConItem = {
        point: newPoint.trim(),
        detail: newDetail.trim() || 'Custom con added by you',
        severity: newScore,
        category: 'Personal Consideration',
        mitigation: 'Monitor closely and set boundaries.',
      };
      setUserItems({
        ...userItems,
        [optionId]: { ...current, cons: [...current.cons, newCon] },
      });
    }

    setNewPoint('');
    setNewDetail('');
    setNewScore(3);
    setActiveAddModal(null);
  };

  const displayedOptions = selectedOptionId === 'all' 
    ? options 
    : options.filter(o => o.id === selectedOptionId);

  return (
    <div className="space-y-6">
      {/* Option Filter Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedOptionId('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedOptionId === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800/60 text-slate-400 hover:text-white'
            }`}
          >
            All Options Comparison ({options.length})
          </button>
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelectedOptionId(opt.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedOptionId === opt.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white'
              }`}
            >
              {opt.name}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-400 hidden md:inline">
          💡 Click "Mitigation" on any con to see how to neutralize it.
        </span>
      </div>

      {/* Grid of Options */}
      <div className={`grid gap-6 ${displayedOptions.length > 1 ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        {displayedOptions.map((opt) => {
          const allPros = [...opt.pros, ...(userItems[opt.id]?.pros || [])];
          const allCons = [...opt.cons, ...(userItems[opt.id]?.cons || [])];

          return (
            <div
              key={opt.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6 flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="mb-5 pb-4 border-b border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                      Option {opt.id.toUpperCase()}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      {allPros.length} Pros · {allCons.length} Cons
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mt-1">
                    {opt.name}
                  </h3>
                  <p className="text-xs text-indigo-300/80 italic mt-0.5">
                    {opt.tagline}
                  </p>
                </div>

                {/* Pros Section */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>Advantages & Upsides</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveAddModal({ optionId: opt.id, type: 'pro' })}
                      className="text-[11px] font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add Pro
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {allPros.map((pro, pIdx) => (
                      <div
                        key={pIdx}
                        className="rounded-xl bg-emerald-950/15 border border-emerald-500/20 p-3.5 transition-all hover:border-emerald-500/40"
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="text-xs sm:text-sm font-semibold text-emerald-200">
                            {pro.point}
                          </h4>
                          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded flex-shrink-0">
                            <span>+{pro.impact}</span>
                            <span className="text-[9px] text-emerald-500 font-normal">/5</span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {pro.detail}
                        </p>
                        {pro.category && (
                          <span className="inline-block mt-2 text-[10px] font-medium px-2 py-0.5 rounded bg-slate-900/60 text-slate-400 border border-slate-800">
                            {pro.category}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cons Section */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-400">
                      <ThumbsDown className="w-3.5 h-3.5" />
                      <span>Risks & Drawbacks</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveAddModal({ optionId: opt.id, type: 'con' })}
                      className="text-[11px] font-medium text-rose-400 hover:text-rose-300 flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add Con
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {allCons.map((con, cIdx) => {
                      const mitigationKey = `${opt.id}-con-${cIdx}`;
                      const isExpanded = !!expandedMitigation[mitigationKey];

                      return (
                        <div
                          key={cIdx}
                          className="rounded-xl bg-rose-950/15 border border-rose-500/20 p-3.5 transition-all hover:border-rose-500/40"
                        >
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="text-xs sm:text-sm font-semibold text-rose-200">
                              {con.point}
                            </h4>
                            <div className="flex items-center gap-1 text-[11px] font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded flex-shrink-0">
                              <span>-{con.severity}</span>
                              <span className="text-[9px] text-rose-500 font-normal">/5</span>
                            </div>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed mb-2">
                            {con.detail}
                          </p>

                          {/* Mitigation Accordion */}
                          {con.mitigation && (
                            <div className="mt-2 pt-2 border-t border-rose-500/15">
                              <button
                                type="button"
                                onClick={() => toggleMitigation(mitigationKey)}
                                className="flex items-center justify-between w-full text-left text-[11px] font-medium text-indigo-300 hover:text-indigo-200"
                              >
                                <span className="flex items-center gap-1">
                                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>Actionable Mitigation Strategy</span>
                                </span>
                                {isExpanded ? (
                                  <ChevronUp className="w-3 h-3 text-slate-400" />
                                ) : (
                                  <ChevronDown className="w-3 h-3 text-slate-400" />
                                )}
                              </button>
                              {isExpanded && (
                                <p className="mt-1.5 text-xs text-slate-200 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 leading-relaxed">
                                  {con.mitigation}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Overlooked Nuances: Hidden Risk & Silver Lining */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3 border-t border-slate-800/80 text-xs">
                  <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/20">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1 mb-1">
                      <AlertCircle className="w-3 h-3" /> Blindspot Risk
                    </span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {opt.hiddenRisk}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/20">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1 mb-1">
                      <Sparkles className="w-3 h-3" /> Hidden Silver Lining
                    </span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {opt.silverLining}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal to add custom pro or con */}
      {activeAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">
              Add Your Own {activeAddModal.type === 'pro' ? 'Advantage (Pro)' : 'Risk (Con)'}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Add a personal consideration that is important to you.
            </p>

            <form onSubmit={handleSaveCustomItem} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Headline
                </label>
                <input
                  type="text"
                  value={newPoint}
                  onChange={(e) => setNewPoint(e.target.value)}
                  placeholder="e.g., Shorter commute gives me 1 hour back daily"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Why it matters (Detail)
                </label>
                <textarea
                  rows={2}
                  value={newDetail}
                  onChange={(e) => setNewDetail(e.target.value)}
                  placeholder="More detail on the impact..."
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-white outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Impact Rating (1 to 5)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setNewScore(num)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                        newScore === num
                          ? activeAddModal.type === 'pro'
                            ? 'bg-emerald-600 border-emerald-500 text-white'
                            : 'bg-rose-600 border-rose-500 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveAddModal(null)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
