import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Scale, 
  TableProperties, 
  Compass, 
  Sparkles, 
  MessageSquare, 
  Coins, 
  CheckCircle2, 
  ArrowLeft, 
  Share2, 
  Printer, 
  SlidersHorizontal,
  RotateCcw,
  AlertCircle
} from 'lucide-react';
import { Header } from './components/Header';
import { DecisionForm } from './components/DecisionForm';
import { TiebreakerVerdictCard } from './components/TiebreakerVerdictCard';
import { ProsConsView } from './components/ProsConsView';
import { ComparisonMatrixView } from './components/ComparisonMatrixView';
import { SwotAnalysisView } from './components/SwotAnalysisView';
import { CoinTossModal } from './components/CoinTossModal';
import { DecisionChatDrawer } from './components/DecisionChatDrawer';
import { LockDecisionModal } from './components/LockDecisionModal';
import { SavedDecisionsModal } from './components/SavedDecisionsModal';
import { PresetsModal } from './components/PresetsModal';
import { ShareExportModal } from './components/ShareExportModal';
import { AnalysisResult, SavedDecision } from './types/decision';
import { PresetDecision, PRESET_DECISIONS } from './data/presets';

export default function App() {
  const [dilemma, setDilemma] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'verdict' | 'proscons' | 'matrix' | 'swot'>('verdict');

  // Modals & Drawers
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);
  const [isSavedOpen, setIsSavedOpen] = useState(false);
  const [isCoinTossOpen, setIsCoinTossOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLockModalOpen, setIsLockModalOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [selectedOptionToLock, setSelectedOptionToLock] = useState<string>('');

  // Saved Decisions in localStorage
  const [savedDecisions, setSavedDecisions] = useState<SavedDecision[]>(() => {
    try {
      const stored = localStorage.getItem('tiebreaker_decisions');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('tiebreaker_decisions', JSON.stringify(savedDecisions));
    } catch (e) {
      console.error('Failed to sync to localStorage:', e);
    }
  }, [savedDecisions]);

  const handleAnalyze = async (data: {
    dilemma: string;
    options: string[];
    context: string;
    priorities: string[];
    riskTolerance: string;
  }) => {
    setIsLoading(true);
    setError(null);
    setDilemma(data.dilemma);
    setOptions(data.options);

    try {
      const response = await fetch('/api/decisions/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const resJson = await response.json();
      if (!response.ok || !resJson.success) {
        throw new Error(resJson.error || 'Failed to analyze decision.');
      }

      const result: AnalysisResult = resJson.data;
      setAnalysis(result);
      setActiveTab('verdict');

      // Auto save to history as pending
      const newSaved: SavedDecision = {
        id: 'dec-' + Date.now(),
        createdAt: new Date().toISOString(),
        dilemma: data.dilemma,
        options: data.options,
        analysis: result,
        status: 'pending',
      };
      setSavedDecisions((prev) => [newSaved, ...prev.filter(d => d.dilemma !== data.dilemma)]);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(err.message || 'Something went wrong while analyzing your decision. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPreset = (preset: PresetDecision) => {
    handleAnalyze({
      dilemma: preset.dilemma,
      options: preset.options,
      context: preset.context,
      priorities: preset.priorities,
      riskTolerance: preset.riskTolerance,
    });
  };

  const handleNewDecision = () => {
    setAnalysis(null);
    setError(null);
    setActiveTab('verdict');
  };

  const handleLoadSavedDecision = (decision: SavedDecision) => {
    setDilemma(decision.dilemma);
    setOptions(decision.options);
    setAnalysis(decision.analysis);
    setActiveTab('verdict');
    setIsSavedOpen(false);
  };

  const handleDeleteSavedDecision = (id: string) => {
    setSavedDecisions((prev) => prev.filter((d) => d.id !== id));
  };

  const handleOpenLockModal = (optionId?: string) => {
    if (analysis) {
      setSelectedOptionToLock(optionId || analysis.tiebreakerVerdict.recommendedOptionId);
      setIsLockModalOpen(true);
    }
  };

  const handleConfirmLockDecision = (optionId: string, notes: string) => {
    if (!analysis) return;
    const optObj = analysis.options.find(o => o.id === optionId);
    setSavedDecisions((prev) =>
      prev.map((d) => {
        if (d.dilemma === dilemma) {
          return {
            ...d,
            status: 'decided',
            chosenOptionId: optionId,
            chosenOptionName: optObj?.name || optionId,
            decidedAt: new Date().toISOString(),
            notes,
          };
        }
        return d;
      })
    );
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header
        onNewDecision={handleNewDecision}
        onOpenSaved={() => setIsSavedOpen(true)}
        onOpenPresets={() => setIsPresetsOpen(true)}
        savedCount={savedDecisions.length}
        hasActiveAnalysis={!!analysis}
        onPrint={handlePrint}
        onShare={() => setIsShareOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs sm:text-sm flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-xs underline text-rose-300 hover:text-white"
            >
              Dismiss
            </button>
          </div>
        )}

        {!analysis ? (
          <DecisionForm
            onSubmit={handleAnalyze}
            isLoading={isLoading}
            onSelectPreset={handleSelectPreset}
          />
        ) : (
          <div className="space-y-6">
            {/* Top Navigation & Dilemma Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleNewDecision}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Edit Dilemma</span>
                  </button>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {dilemma}
                </h1>
                <p className="text-xs text-indigo-300/90 leading-relaxed">
                  {analysis.dilemmaSummary}
                </p>
              </div>

              {/* Action buttons on banner */}
              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                <button
                  onClick={() => setIsCoinTossOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition-all"
                  title="Test your subconscious gut reaction"
                >
                  <Coins className="w-4 h-4 text-amber-400" />
                  <span>Coin Toss</span>
                </button>

                <button
                  onClick={() => setIsChatOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/25 transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Consult AI</span>
                </button>
              </div>
            </div>

            {/* Analysis Tabs */}
            <div className="flex items-center border-b border-slate-800/80 overflow-x-auto no-scrollbar gap-2 sm:gap-4 text-xs sm:text-sm font-bold">
              {[
                { id: 'verdict', label: 'Tiebreaker Verdict', icon: Trophy, count: null },
                { id: 'proscons', label: 'Pros & Cons', icon: Scale, count: analysis.options.reduce((acc, o) => acc + o.pros.length + o.cons.length, 0) },
                { id: 'matrix', label: 'Comparison Matrix', icon: TableProperties, count: analysis.comparisonMatrix.criteria.length },
                { id: 'swot', label: 'SWOT Analysis', icon: Compass, count: null },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 py-3 px-3 sm:px-4 border-b-2 whitespace-nowrap transition-all ${
                      isActive
                        ? 'border-indigo-500 text-indigo-400'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                    <span>{tab.label}</span>
                    {tab.count !== null && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isActive ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Tab Contents */}
            <div className="pt-2">
              {activeTab === 'verdict' && (
                <TiebreakerVerdictCard
                  verdict={analysis.tiebreakerVerdict}
                  options={analysis.options}
                  gutCheckQuestion={analysis.gutCheckQuestion}
                  onLockInDecision={handleOpenLockModal}
                  onCoinToss={() => setIsCoinTossOpen(true)}
                />
              )}

              {activeTab === 'proscons' && (
                <ProsConsView options={analysis.options} />
              )}

              {activeTab === 'matrix' && (
                <ComparisonMatrixView
                  matrix={analysis.comparisonMatrix}
                  options={analysis.options}
                />
              )}

              {activeTab === 'swot' && (
                <SwotAnalysisView options={analysis.options} />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Floating Chat / Consultation Trigger when analysis is loaded */}
      {analysis && !isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-30 flex items-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-xs sm:text-sm shadow-xl shadow-indigo-600/40 hover:scale-105 active:scale-95 transition-all"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Ask The Tiebreaker</span>
        </button>
      )}

      {/* Modals & Overlays */}
      <PresetsModal
        isOpen={isPresetsOpen}
        onClose={() => setIsPresetsOpen(false)}
        onSelectPreset={handleSelectPreset}
      />

      <SavedDecisionsModal
        isOpen={isSavedOpen}
        onClose={() => setIsSavedOpen(false)}
        savedDecisions={savedDecisions}
        onSelectDecision={handleLoadSavedDecision}
        onDeleteDecision={handleDeleteSavedDecision}
      />

      {analysis && (
        <>
          <CoinTossModal
            isOpen={isCoinTossOpen}
            onClose={() => setIsCoinTossOpen(false)}
            options={analysis.options}
            onPickOption={(optId) => handleOpenLockModal(optId)}
          />

          <DecisionChatDrawer
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
            dilemma={dilemma}
            options={analysis.options}
            verdict={analysis.tiebreakerVerdict}
          />

          <LockDecisionModal
            isOpen={isLockModalOpen}
            onClose={() => setIsLockModalOpen(false)}
            options={analysis.options}
            initialOptionId={selectedOptionToLock}
            onConfirm={handleConfirmLockDecision}
          />

          <ShareExportModal
            isOpen={isShareOpen}
            onClose={() => setIsShareOpen(false)}
            dilemma={dilemma}
            analysis={analysis}
            onPrint={handlePrint}
          />
        </>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500 no-print">
        <p>The Tiebreaker · Objective AI Decision Engine & Strategic Heuristics</p>
      </footer>
    </div>
  );
}
