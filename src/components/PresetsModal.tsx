import React, { useState } from 'react';
import { X, Sparkles, Briefcase, Home, Car, Cpu, ArrowRight } from 'lucide-react';
import { PRESET_DECISIONS, PresetDecision } from '../data/presets';

interface PresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (preset: PresetDecision) => void;
}

export const PresetsModal: React.FC<PresetsModalProps> = ({
  isOpen,
  onClose,
  onSelectPreset,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  if (!isOpen) return null;

  const categories = ['All', 'Career', 'Finance', 'Life', 'Tech'];

  const filtered = selectedCategory === 'All'
    ? PRESET_DECISIONS
    : PRESET_DECISIONS.filter(p => p.category === selectedCategory);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Briefcase': return <Briefcase className="w-4 h-4 text-indigo-400" />;
      case 'Home': return <Home className="w-4 h-4 text-emerald-400" />;
      case 'Car': return <Car className="w-4 h-4 text-amber-400" />;
      case 'Cpu': return <Cpu className="w-4 h-4 text-violet-400" />;
      default: return <Sparkles className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl max-h-[85vh] rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <span>Real-World Dilemma Presets</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Select any pre-configured scenario to see how The Tiebreaker dissects high-stakes decisions.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Pills */}
        <div className="py-4 flex items-center gap-2 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Preset Cards */}
        <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
          {filtered.map((preset) => (
            <div
              key={preset.title}
              onClick={() => {
                onSelectPreset(preset);
                onClose();
              }}
              className="group cursor-pointer p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-indigo-500/50 hover:bg-indigo-950/20 transition-all space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-slate-800">
                    {getIcon(preset.icon)}
                  </div>
                  <span className="text-xs font-bold text-indigo-300">
                    {preset.category} · {preset.title}
                  </span>
                </div>
                <span className="text-xs font-semibold text-indigo-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Load & Run <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>

              <h4 className="text-sm font-bold text-white group-hover:text-indigo-200 transition-colors">
                {preset.dilemma}
              </h4>

              <div className="flex flex-wrap gap-1.5">
                {preset.options.map((opt, i) => (
                  <span
                    key={i}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-slate-800"
                  >
                    {String.fromCharCode(65 + i)}: {opt}
                  </span>
                ))}
              </div>

              <p className="text-xs text-slate-400 italic">
                Context: {preset.context}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
