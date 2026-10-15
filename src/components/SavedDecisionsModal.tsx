import React, { useState } from 'react';
import { X, Search, Trash2, ArrowRight, CheckCircle2, Clock, Calendar } from 'lucide-react';
import { SavedDecision } from '../types/decision';

interface SavedDecisionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedDecisions: SavedDecision[];
  onSelectDecision: (decision: SavedDecision) => void;
  onDeleteDecision: (id: string) => void;
}

export const SavedDecisionsModal: React.FC<SavedDecisionsModalProps> = ({
  isOpen,
  onClose,
  savedDecisions,
  onSelectDecision,
  onDeleteDecision,
}) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'decided' | 'pending'>('all');

  if (!isOpen) return null;

  const filtered = savedDecisions.filter((d) => {
    const matchesSearch =
      d.dilemma.toLowerCase().includes(search.toLowerCase()) ||
      d.options.some((o) => o.toLowerCase().includes(search.toLowerCase()));
    const matchesFilter = filter === 'all' || d.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl max-h-[85vh] rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-xl font-bold text-white">Your Decision Journal</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Review past analyses, reflect on outcomes, and track your decision quality.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="py-4 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search decisions by title or option..."
              className="w-full text-xs rounded-xl bg-slate-950 border border-slate-800 pl-9 pr-3 py-2 text-white placeholder-slate-500 outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1.5 self-end sm:self-auto flex-shrink-0">
            {(['all', 'decided', 'pending'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`text-xs px-3 py-1.5 rounded-lg capitalize font-medium transition-colors ${
                  filter === tab
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800/60 text-slate-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Decision List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No saved decisions found.</p>
              <p className="text-xs text-slate-600 mt-1">
                Analyze a dilemma and it will be saved here automatically.
              </p>
            </div>
          ) : (
            filtered.map((d) => (
              <div
                key={d.id}
                className="group p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-indigo-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1.5 flex-1 cursor-pointer" onClick={() => onSelectDecision(d)}>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        d.status === 'decided'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {d.status === 'decided' ? 'Decided ✓' : 'Under Consideration'}
                    </span>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(d.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2">
                    {d.dilemma}
                  </h4>

                  <div className="text-xs text-slate-400">
                    <span className="text-slate-500">Options:</span>{' '}
                    {d.options.slice(0, 3).join(' vs ')}
                    {d.options.length > 3 && ` (+${d.options.length - 3} more)`}
                  </div>

                  {d.chosenOptionName && (
                    <div className="text-xs text-emerald-400 font-semibold pt-0.5">
                      Chosen: {d.chosenOptionName}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => onSelectDecision(d)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white transition-colors"
                  >
                    <span>View Analysis</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteDecision(d.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
