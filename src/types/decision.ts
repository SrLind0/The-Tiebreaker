export interface ProItem {
  point: string;
  detail: string;
  impact: number; // 1 to 5
  category: string;
}

export interface ConItem {
  point: string;
  detail: string;
  severity: number; // 1 to 5
  category: string;
  mitigation: string;
}

export interface SwotAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  strategicPlaybook: string;
}

export interface OptionAnalysis {
  id: string;
  name: string;
  tagline: string;
  pros: ProItem[];
  cons: ConItem[];
  swot: SwotAnalysis;
  hiddenRisk: string;
  silverLining: string;
}

export interface CriterionScore {
  optionId: string;
  score: number; // 1 to 10
  reason: string;
}

export interface ComparisonCriterion {
  id: string;
  name: string;
  description: string;
  defaultWeight: number; // 1 to 10
  scores: CriterionScore[];
  winnerOptionId: string;
}

export interface ComparisonMatrix {
  criteria: ComparisonCriterion[];
}

export interface DevilsAdvocate {
  challengingArgument: string;
  assumptionsToTest: string[];
  dealbreakerCondition: string;
}

export interface TenTenTenRule {
  in10Minutes: string;
  in10Months: string;
  in10Years: string;
}

export interface MicroExperiment {
  experiment: string;
  timeframe: string;
  whatToWatchFor: string;
}

export interface TiebreakerVerdict {
  recommendedOptionId: string;
  recommendationTitle: string;
  verdictSummary: string;
  confidenceLevel: string;
  keyDifferentiator: string;
  devilsAdvocate: DevilsAdvocate;
  tenTenTenRule: TenTenTenRule;
  reversibleMicroExperiments: MicroExperiment[];
}

export interface AnalysisResult {
  dilemmaSummary: string;
  options: OptionAnalysis[];
  comparisonMatrix: ComparisonMatrix;
  tiebreakerVerdict: TiebreakerVerdict;
  gutCheckQuestion: string;
}

export interface DecisionInput {
  dilemma: string;
  options: string[];
  context?: string;
  priorities?: string[];
  riskTolerance?: string;
}

export interface SavedDecision {
  id: string;
  createdAt: string;
  dilemma: string;
  options: string[];
  analysis: AnalysisResult;
  status: 'pending' | 'decided';
  chosenOptionId?: string;
  chosenOptionName?: string;
  decidedAt?: string;
  notes?: string;
}
