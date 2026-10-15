import React, { useState } from 'react';
import { Sparkles, Plus, Trash2, Wand2, SlidersHorizontal, ArrowRight, ShieldAlert, CheckCircle2, HelpCircle } from 'lucide-react';
import { PRESET_DECISIONS } from '../data/presets';

interface DecisionFormProps {
  onSubmit: (data: {
    dilemma: string;
    options: string[];
    context: string;
    priorities: string[];
    riskTolerance: string;
  }) => void;
  isLoading: boolean;
  onSelectPreset: (preset: typeof PRESET_DECISIONS[0]) => void;
}

const COMMON_PRIORITIES = [
  'Financial Growth',
  'Work-Life Balance',
  'Low Stress & Peace of Mind',
  'Career Acceleration',
  'Time Freedom & Flexibility',
  'Family & Relationships',
  'Learning Velocity',
  'Long-Term Security',
  'Health & Energy',
];

export const DecisionForm: React.FC<DecisionFormProps> = ({
  onSubmit,
  isLoading,
  onSelectPreset,
}) => {
  const [dilemma, setDilemma] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [context, setContext] = useState('');
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([
    'Financial Growth',
    'Work-Life Balance',
  ]);
  const [customPriorityInput, setCustomPriorityInput] = useState('');
  const [riskTolerance, setRiskTolerance] = useState('Moderate / Balanced');
  const [isSuggestingOptions, setIsSuggestingOptions] = useState(false);
  const [suggestionError, setSuggestionError] = useState<string | null>(null);

  const handleAddOption = () => {
    if (options.length < 5) {
      setOptions([...options, '']);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      const next = options.filter((_, i) => i !== index);
      setOptions(next);
    }
  };

  const handleOptionChange = (index: number, val: string) => {
    const next = [...options];
    next[index] = val;
    setOptions(next);
  };

  const togglePriority = (p: string) => {
    if (selectedPriorities.includes(p)) {
      setSelectedPriorities(selectedPriorities.filter(item => item !== p));
    } else {
      setSelectedPriorities([...selectedPriorities, p]);
    }
  };

  const handleAddCustomPriority = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && customPriorityInput.trim()) {
      e.preventDefault();
      const val = customPriorityInput.trim();
      if (!selectedPriorities.includes(val)) {
        setSelectedPriorities([...selectedPriorities, val]);
      }
      setCustomPriorityInput('');
    }
  };

  const handleSuggestOptions = async () => {
    if (!dilemma.trim()) {
      setSuggestionError('Please enter a dilemma first so AI can suggest alternatives.');
      return;
    }
    setSuggestionError(null);
    setIsSuggestingOptions(true);
    try {
      const res = await fetch('/api/decisions/suggest-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dilemma,
          existingOptions: options.filter(o => o.trim().length > 0),
          context,
        }),
      });
      const data = await res.json();
      if (data.suggestedOptions && Array.isArray(data.suggestedOptions)) {
        const newOptions = data.suggestedOptions.map((item: any) => item.name);
        setOptions(newOptions.slice(0, 4));
      }
    } catch (err: any) {
      setSuggestionError('Could not auto-generate options right now. Try typing them manually.');
    } finally {
      setIsSuggestingOptions(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanDilemma = dilemma.trim();
    const cleanOptions = options.map(o => o.trim()).filter(Boolean);

    if (!cleanDilemma) {
      return;
    }
    if (cleanOptions.length < 2) {
      return;
    }

    onSubmit({
      dilemma: cleanDilemma,
      options: cleanOptions,
      context: context.trim(),
      priorities: selectedPriorities,
      riskTolerance,
    });
  };

  const loadingMessages = [
    'Stress-testing trade-offs & hidden costs...',
    'Constructing side-by-side comparison matrix...',
    'Formulating comprehensive SWOT vectors...',
    'Consulting behavioral economics & risk heuristics...',
    'Writing the definitive Tiebreaker Verdict...',
  ];
  const [loadingMsgIndex, setLoadingMsgIndex] = React.useState(0);

  React.useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setLoadingMsgIndex(prev => (prev + 1) % loadingMessages.length);
    }, 2400);
    return () => clearInterval(interval);
  }, [isLoading]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Intro Hero */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          The Science of Clear Decisions
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-3">
          Stop overthinking.{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-fuchsia-400 bg-clip-text text-transparent">
            Let's break the tie.
          </span>
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
          Input your hardest dilemma. We’ll generate an objective Pros & Cons breakdown, 
          a weighted Comparison Matrix, a deep SWOT quadrant, and an unequivocal tiebreaker recommendation.
        </p>

        {/* Quick Presets Pills */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs font-medium text-slate-500 mr-1">Quick inspiration:</span>
          {PRESET_DECISIONS.map((preset) => (
            <button
              key={preset.title}
              type="button"
              onClick={() => onSelectPreset(preset)}
              className="text-xs px-2.5 py-1 rounded-full bg-slate-900 hover:bg-indigo-950/60 border border-slate-800 hover:border-indigo-500/40 text-slate-300 hover:text-indigo-300 transition-colors"
            >
              {preset.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Input Form Card */}
      <div className="relative rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl p-6 sm:p-8 shadow-2xl shadow-indigo-950/20">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dilemma Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="dilemma" className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <span>1. What decision are you trying to make?</span>
              </label>
              <span className="text-xs text-slate-400">Be as specific as you like</span>
            </div>
            <textarea
              id="dilemma"
              rows={3}
              value={dilemma}
              onChange={(e) => setDilemma(e.target.value)}
              placeholder="e.g., Should I accept the senior staff offer at a Fortune 500 company or join an early-stage AI startup as Lead Engineer?"
              className="w-full rounded-xl bg-slate-950/80 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 p-4 text-sm sm:text-base text-slate-100 placeholder-slate-500 resize-none outline-none transition-all"
              required
            />
          </div>

          {/* Options Section */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <span>2. What are the options on the table?</span>
                <span className="text-xs text-slate-400 font-normal">(Min 2, max 5)</span>
              </label>

              <button
                type="button"
                onClick={handleSuggestOptions}
                disabled={isSuggestingOptions || !dilemma.trim()}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 px-2.5 py-1 rounded-lg border border-indigo-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                title="Let AI frame creative options and compromises for you"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>{isSuggestingOptions ? 'Suggesting...' : 'AI Suggest Alternatives'}</span>
              </button>
            </div>

            {suggestionError && (
              <p className="text-xs text-rose-400 mb-2">{suggestionError}</p>
            )}

            <div className="space-y-2.5">
              {options.map((option, index) => (
                <div key={index} className="flex items-center gap-2.5 group">
                  <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-xs font-bold text-indigo-300">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={
                      index === 0
                        ? 'e.g. Join the Series-A AI Startup'
                        : index === 1
                        ? 'e.g. Accept the Fortune 500 Senior Staff offer'
                        : `Option ${String.fromCharCode(65 + index)}`
                    }
                    className="flex-1 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
                    required
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(index)}
                      className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                      title="Remove option"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {options.length < 5 && (
              <button
                type="button"
                onClick={handleAddOption}
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-indigo-400" />
                <span>Add Another Option</span>
              </button>
            )}
          </div>

          {/* Context & Priorities Accordion */}
          <div className="pt-2 border-t border-slate-800/80">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full flex items-center justify-between text-left py-2 group"
            >
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">
                  Personal Priorities, Constraints & Risk Tolerance
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                  Optional
                </span>
              </div>
              <span className="text-xs font-medium text-indigo-400 group-hover:underline">
                {showAdvanced ? 'Collapse' : 'Customize Context'}
              </span>
            </button>

            {showAdvanced && (
              <div className="mt-4 space-y-5 rounded-xl bg-slate-950/50 p-4 border border-slate-800/80">
                {/* Priorities tags */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    What matters most to you right now? (Select all that apply)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {COMMON_PRIORITIES.map((p) => {
                      const active = selectedPriorities.includes(p);
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => togglePriority(p)}
                          className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                            active
                              ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                          }`}
                        >
                          {p} {active && '✓'}
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-2.5 flex items-center gap-2">
                    <input
                      type="text"
                      value={customPriorityInput}
                      onChange={(e) => setCustomPriorityInput(e.target.value)}
                      onKeyDown={handleAddCustomPriority}
                      placeholder="Add custom value/priority (press Enter)..."
                      className="w-full max-w-xs text-xs rounded-lg bg-slate-900 border border-slate-800 px-3 py-1.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Freeform Context & Constraints */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Constraints & Situation Context
                  </label>
                  <textarea
                    rows={2}
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="e.g., I have 6 months of emergency savings, need to decide by Friday, partner is supportive, commute must be under 40 mins."
                    className="w-full text-xs rounded-lg bg-slate-900 border border-slate-800 p-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
                  />
                </div>

                {/* Risk Tolerance */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Your Current Risk Appetite
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {[
                      { label: 'Conservative', desc: 'Prioritize security, minimize downside' },
                      { label: 'Moderate / Balanced', desc: 'Balanced risk for healthy upside' },
                      { label: 'Bold / High Upside', desc: 'Maximize high-reward potential' },
                    ].map((rt) => {
                      const isSelected = riskTolerance === rt.label;
                      return (
                        <button
                          key={rt.label}
                          type="button"
                          onClick={() => setRiskTolerance(rt.label)}
                          className={`text-left p-3 rounded-xl border transition-all ${
                            isSelected
                              ? 'bg-indigo-600/15 border-indigo-500 ring-1 ring-indigo-500/30'
                              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="text-xs font-semibold text-slate-200">{rt.label}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">{rt.desc}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || !dilemma.trim() || options.filter(o => o.trim()).length < 2}
              className="w-full relative group overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 hover:from-indigo-500 hover:via-violet-500 hover:to-fuchsia-500 p-4 font-semibold text-white shadow-xl shadow-indigo-600/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
            >
              <div className="flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span className="text-sm sm:text-base font-medium">
                      {loadingMessages[loadingMsgIndex]}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-sm sm:text-base">Break The Tie with AI</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
