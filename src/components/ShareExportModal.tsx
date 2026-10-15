import React, { useState } from 'react';
import { X, Copy, Check, Printer, FileText, Share2 } from 'lucide-react';
import { AnalysisResult } from '../types/decision';

interface ShareExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  dilemma: string;
  analysis: AnalysisResult;
  onPrint: () => void;
}

export const ShareExportModal: React.FC<ShareExportModalProps> = ({
  isOpen,
  onClose,
  dilemma,
  analysis,
  onPrint,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generateMarkdown = () => {
    let md = `# The Tiebreaker - Decision Analysis Memo\n\n`;
    md += `**Dilemma**: ${dilemma}\n\n`;
    md += `**Summary**: ${analysis.dilemmaSummary}\n\n`;
    md += `## 🏆 Tiebreaker Recommendation\n`;
    md += `**Recommended Path**: ${analysis.tiebreakerVerdict.recommendationTitle}\n`;
    md += `**Confidence**: ${analysis.tiebreakerVerdict.confidenceLevel}\n\n`;
    md += `**Verdict Summary**: ${analysis.tiebreakerVerdict.verdictSummary}\n\n`;
    md += `**Key Tipping Factor**: ${analysis.tiebreakerVerdict.keyDifferentiator}\n\n`;

    md += `### ⏱️ 10/10/10 Rule Perspective\n`;
    md += `- In 10 Minutes: ${analysis.tiebreakerVerdict.tenTenTenRule.in10Minutes}\n`;
    md += `- In 10 Months: ${analysis.tiebreakerVerdict.tenTenTenRule.in10Months}\n`;
    md += `- In 10 Years: ${analysis.tiebreakerVerdict.tenTenTenRule.in10Years}\n\n`;

    md += `## ⚖️ Options Analysis (Pros & Cons)\n\n`;
    analysis.options.forEach((opt) => {
      md += `### Option: ${opt.name} ("${opt.tagline}")\n`;
      md += `**Advantages (Pros)**:\n`;
      opt.pros.forEach((p) => {
        md += `- [Impact ${p.impact}/5] **${p.point}**: ${p.detail}\n`;
      });
      md += `\n**Risks & Drawbacks (Cons)**:\n`;
      opt.cons.forEach((c) => {
        md += `- [Severity ${c.severity}/5] **${c.point}**: ${c.detail} (Mitigation: ${c.mitigation})\n`;
      });
      md += `\n`;
    });

    md += `## 🧭 SWOT Highlights\n\n`;
    analysis.options.forEach((opt) => {
      md += `### ${opt.name} Strategic Playbook:\n`;
      md += `${opt.swot.strategicPlaybook}\n\n`;
    });

    return md;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateMarkdown());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl flex flex-col text-left">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Share2 className="w-5 h-5 text-indigo-400" />
              <span>Export & Share Analysis</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Copy as clean markdown or trigger a printer-friendly PDF report.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleCopy}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 flex flex-col items-center justify-center gap-2 transition-all group"
            >
              {copied ? (
                <Check className="w-5 h-5 text-emerald-400" />
              ) : (
                <Copy className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
              )}
              <span className="text-xs font-bold text-white">
                {copied ? 'Copied to Clipboard!' : 'Copy Markdown'}
              </span>
              <span className="text-[10px] text-slate-400">
                Ready for Notion, Docs, or Slack
              </span>
            </button>

            <button
              onClick={() => {
                onClose();
                onPrint();
              }}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 flex flex-col items-center justify-center gap-2 transition-all group"
            >
              <Printer className="w-5 h-5 text-violet-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-white">
                Print or Save PDF
              </span>
              <span className="text-[10px] text-slate-400">
                Clean executive report layout
              </span>
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Preview Decision Memo Text
            </label>
            <pre className="max-h-56 overflow-y-auto text-[11px] font-mono p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 leading-relaxed">
              {generateMarkdown()}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
