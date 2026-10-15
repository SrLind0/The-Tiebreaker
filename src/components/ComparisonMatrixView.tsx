import React, { useState, useMemo } from 'react';
import { Award, Sliders, RefreshCw, Info, ChevronRight, Check } from 'lucide-react';
import { ComparisonMatrix, OptionAnalysis } from '../types/decision';

interface ComparisonMatrixViewProps {
  matrix: ComparisonMatrix;
  options: OptionAnalysis[];
}

export const ComparisonMatrixView: React.FC<ComparisonMatrixViewProps> = ({ matrix, options }) => {
  // Store user-adjusted weights for each criterion
  const [weights, setWeights] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    matrix.criteria.forEach((c) => {
      initial[c.id] = c.defaultWeight || 5;
    });
    return initial;
  });

  const [expandedReason, setExpandedReason] = useState<string | null>(null);

  const handleWeightChange = (criterionId: string, val: number) => {
    setWeights((prev) => ({ ...prev, [criterionId]: val }));
  };

  const handleResetWeights = () => {
    const initial: Record<string, number> = {};
    matrix.criteria.forEach((c) => {
      initial[c.id] = c.defaultWeight || 5;
    });
    setWeights(initial);
  };

  // Calculate dynamic weighted scores for all options
  const calculatedRankings = useMemo(() => {
    let totalWeightSum = 0;
    const optionRawSums: Record<string, number> = {};

    options.forEach((opt) => {
      optionRawSums[opt.id] = 0;
    });

    matrix.criteria.forEach((criterion) => {
      const w = weights[criterion.id] ?? criterion.defaultWeight ?? 5;
      totalWeightSum += w;

      criterion.scores.forEach((s) => {
        if (optionRawSums[s.optionId] !== undefined) {
          optionRawSums[s.optionId] += s.score * w;
        }
      });
    });

    if (totalWeightSum === 0) totalWeightSum = 1;

    const results = options.map((opt) => {
      const raw = optionRawSums[opt.id] || 0;
      // Score out of 100
      const normalizedScore = Math.round((raw / (totalWeightSum * 10)) * 100);
      return {
        optionId: opt.id,
        name: opt.name,
        tagline: opt.tagline,
        score: normalizedScore,
      };
    });

    results.sort((a, b) => b.score - a.score);
    return results;
  }, [matrix, options, weights]);

  const topOption = calculatedRankings[0];

  const getScoreBadgeColor = (score: number) => {
    if (score >= 8) return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    if (score >= 6) return 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30';
    if (score >= 4) return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
    return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
  };

  return (
    <div className="space-y-6">
      {/* Weighted Score Leaderboard Card */}
      <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <h3 className="text-base sm:text-lg font-bold text-white">
                Dynamic Weighted Matrix Leaderboard
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Adjust the weight sliders below to customize what matters most to you. 
              The mathematical scores recalculate in real-time.
            </p>
          </div>

          <button
            type="button"
            onClick={handleResetWeights}
            className="self-start sm:self-center flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
            <span>Reset Weights to Defaults</span>
          </button>
        </div>

        {/* Score Progress Bars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {calculatedRankings.map((rank, idx) => {
            const isWinner = idx === 0;
            return (
              <div
                key={rank.optionId}
                className={`p-4 rounded-xl border transition-all ${
                  isWinner
                    ? 'bg-indigo-900/25 border-indigo-500 ring-1 ring-indigo-500/40 shadow-lg shadow-indigo-950/50'
                    : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      {isWinner && (
                        <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Leader
                        </span>
                      )}
                      <span className="text-xs font-bold text-slate-200">
                        Rank #{idx + 1}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white mt-0.5 line-clamp-1">
                      {rank.name}
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-extrabold text-white">
                      {rank.score}
                    </span>
                    <span className="text-[10px] text-slate-400 block">/100 pts</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isWinner
                        ? 'bg-gradient-to-r from-indigo-500 to-fuchsia-500'
                        : 'bg-slate-600'
                    }`}
                    style={{ width: `${rank.score}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Comparison Matrix Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80 text-xs font-bold uppercase tracking-wider text-slate-400">
                <th className="p-4 sm:p-5 w-1/3">
                  Evaluation Criterion & Weight
                </th>
                {options.map((opt) => (
                  <th key={opt.id} className="p-4 sm:p-5 text-center">
                    <div className="text-slate-200 font-bold text-xs sm:text-sm">
                      {opt.name}
                    </div>
                    <div className="text-[10px] font-normal text-slate-400 mt-0.5 line-clamp-1">
                      {opt.tagline}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-xs">
              {matrix.criteria.map((criterion) => {
                const currentWeight = weights[criterion.id] ?? criterion.defaultWeight ?? 5;

                return (
                  <tr key={criterion.id} className="hover:bg-slate-800/30 transition-colors">
                    {/* Criterion Name & Weight Slider */}
                    <td className="p-4 sm:p-5 align-top">
                      <div className="space-y-2">
                        <div>
                          <span className="font-bold text-sm text-slate-100 block">
                            {criterion.name}
                          </span>
                          <span className="text-xs text-slate-400 block mt-0.5">
                            {criterion.description}
                          </span>
                        </div>

                        {/* Weight Slider */}
                        <div className="pt-1.5 flex items-center gap-3">
                          <span className="text-[11px] font-semibold text-indigo-400 whitespace-nowrap">
                            Weight: {currentWeight}/10
                          </span>
                          <input
                            type="range"
                            min="1"
                            max="10"
                            value={currentWeight}
                            onChange={(e) => handleWeightChange(criterion.id, parseInt(e.target.value))}
                            className="w-28 sm:w-36 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                            title={`Adjust weight of ${criterion.name}`}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Scores for Each Option */}
                    {options.map((opt) => {
                      const scoreObj = criterion.scores.find((s) => s.optionId === opt.id);
                      const scoreVal = scoreObj ? scoreObj.score : 5;
                      const reason = scoreObj ? scoreObj.reason : '';
                      const isCriterionWinner = criterion.winnerOptionId === opt.id;
                      const reasonKey = `${criterion.id}-${opt.id}`;
                      const isReasonOpen = expandedReason === reasonKey;

                      return (
                        <td key={opt.id} className="p-4 sm:p-5 align-top text-center">
                          <div className="flex flex-col items-center gap-2">
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`inline-flex items-center justify-center font-extrabold text-sm w-9 h-9 rounded-xl border ${getScoreBadgeColor(
                                  scoreVal
                                )}`}
                              >
                                {scoreVal}
                              </span>
                              {isCriterionWinner && (
                                <span title="Category Winner">
                                  <Award className="w-4 h-4 text-amber-400" />
                                </span>
                              )}
                            </div>

                            {/* Reason popover/collapsible */}
                            {reason && (
                              <div className="w-full max-w-[200px]">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setExpandedReason(isReasonOpen ? null : reasonKey)
                                  }
                                  className="text-[11px] text-slate-400 hover:text-indigo-300 underline underline-offset-2 flex items-center justify-center gap-1 mx-auto"
                                >
                                  <span>{isReasonOpen ? 'Hide' : 'Why'}</span>
                                  <Info className="w-3 h-3" />
                                </button>
                                {isReasonOpen && (
                                  <div className="mt-1.5 p-2 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300 text-left leading-relaxed shadow-lg">
                                    {reason}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
