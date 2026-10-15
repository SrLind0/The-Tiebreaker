import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize shared Gemini client
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const PRIMARY_MODEL = 'gemini-3.8-flash';
const FALLBACK_MODELS = ['gemini-flash-latest', 'gemini-3.1-flash-lite'];

async function generateContentWithRetry(params: any): Promise<any> {
  const modelsToTry = [params.model || PRIMARY_MODEL, ...FALLBACK_MODELS];
  let lastError: any = null;

  for (const model of modelsToTry) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          ...params,
          model,
        });
        return response;
      } catch (err: any) {
        lastError = err;
        const errMsg = err?.message || JSON.stringify(err);
        const isTemporary = errMsg.includes('503') || errMsg.includes('high demand') || errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED');
        if (isTemporary) {
          // Wait briefly before retry
          await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
          continue;
        }
        // Non-retryable error for this model, move to next model
        break;
      }
    }
  }

  throw lastError;
}

// 1. Analyze Decision Endpoint
app.post('/api/decisions/analyze', async (req, res) => {
  try {
    const { dilemma, options, context, priorities, riskTolerance } = req.body;

    if (!dilemma || !options || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ error: 'Please provide a decision dilemma and at least two options to compare.' });
    }

    const optionsListStr = options
      .map((opt: string | { name: string; details?: string }, idx: number) => {
        if (typeof opt === 'string') {
          return `Option ${idx + 1}: "${opt}"`;
        }
        return `Option ${idx + 1}: "${opt.name}" ${opt.details ? `(${opt.details})` : ''}`;
      })
      .join('\n');

    const prompt = `You are "The Tiebreaker", an elite decision strategist, behavioral economist, and executive coach.
Your job is to thoroughly analyze the user's decision dilemma, dismantle false dilemmas, compare alternatives deeply, and provide an unambiguous, thoughtful tiebreaking verdict.

DECISION DILEMMA:
"${dilemma}"

OPTIONS TO EVALUATE:
${optionsListStr}

USER CONTEXT & CONSTRAINTS:
${context ? context : 'None provided; consider typical real-world personal & professional tradeoffs.'}

USER PRIORITIES / VALUES:
${priorities && priorities.length > 0 ? priorities.join(', ') : 'Balanced overall balance, sustainability, fulfillment, and risk mitigation'}

USER RISK TOLERANCE:
${riskTolerance || 'Moderate / Balanced'}

REQUIREMENTS:
1. Conduct an in-depth Pros & Cons analysis for every option. For every pro, rate impact (1 to 5). For every con, rate severity (1 to 5) AND provide an actionable mitigation strategy. Include a hidden blindspot/risk and an unexpected silver lining.
2. Conduct a side-by-side SWOT analysis (Strengths, Weaknesses, Opportunities, Threats) for each option with a strategic takeaway.
3. Build a Comparison Matrix comparing all options across 5 to 7 key criteria (e.g., Financial Impact, Time Investment, Emotional Stress / Peace of Mind, Career / Long-term Growth, Reversibility & Agility, Execution Difficulty). Score each option from 1 to 10 for each criterion, explain the score, and declare the winner of that criterion.
4. Deliver "The Tiebreaker Verdict":
   - Pick the single strongest recommendation based on the user's situation.
   - Give an incisive rationale and key differentiator.
   - Play Devil's Advocate: challenge assumptions and highlight the biggest blind spot.
   - Apply Suzy Welch's 10/10/10 Rule (perspective in 10 minutes, 10 months, 10 years).
   - Provide 2-3 reversible micro-experiments: low-risk actions the user can take this week to test their choice without irreversible risk.
   - Provide 3-4 probing reflective questions for the decision checklist.`;

    const response = await generateContentWithRetry({
      model: PRIMARY_MODEL,
      contents: prompt,
      config: {
        systemInstruction: 'You are The Tiebreaker, an expert decision-making engine. Provide objective, high-clarity, empathetic yet rigorous analysis. Always respond strictly using the provided JSON schema.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            dilemmaSummary: {
              type: Type.STRING,
              description: 'A crisp 1-2 sentence distillation of the core tension behind this decision.',
            },
            options: {
              type: Type.ARRAY,
              description: 'Detailed analysis for each option.',
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING, description: 'Slug or identifier e.g. opt-1' },
                  name: { type: Type.STRING, description: 'Option title' },
                  tagline: { type: Type.STRING, description: 'A sharp 3-6 word identity descriptor for this path' },
                  pros: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        point: { type: Type.STRING, description: 'Concise pro headline' },
                        detail: { type: Type.STRING, description: 'Why this advantage matters' },
                        impact: { type: Type.INTEGER, description: 'Impact score from 1 to 5' },
                        category: { type: Type.STRING, description: 'e.g. Financial, Lifestyle, Career, Psychological' },
                      },
                      required: ['point', 'detail', 'impact', 'category'],
                    },
                  },
                  cons: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        point: { type: Type.STRING, description: 'Concise con headline' },
                        detail: { type: Type.STRING, description: 'Why this downside hurts' },
                        severity: { type: Type.INTEGER, description: 'Severity score from 1 to 5' },
                        category: { type: Type.STRING, description: 'e.g. Financial, Lifestyle, Career, Psychological' },
                        mitigation: { type: Type.STRING, description: 'Concrete action to reduce or avoid this downside' },
                      },
                      required: ['point', 'detail', 'severity', 'category', 'mitigation'],
                    },
                  },
                  swot: {
                    type: Type.OBJECT,
                    properties: {
                      strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                      weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                      opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
                      threats: { type: Type.ARRAY, items: { type: Type.STRING } },
                      strategicPlaybook: { type: Type.STRING, description: 'How to maximize upsides and defend against downsides for this option' },
                    },
                    required: ['strengths', 'weaknesses', 'opportunities', 'threats', 'strategicPlaybook'],
                  },
                  hiddenRisk: { type: Type.STRING, description: 'An overlooked downside most people miss' },
                  silverLining: { type: Type.STRING, description: 'An unexpected secondary benefit' },
                },
                required: ['id', 'name', 'tagline', 'pros', 'cons', 'swot', 'hiddenRisk', 'silverLining'],
              },
            },
            comparisonMatrix: {
              type: Type.OBJECT,
              properties: {
                criteria: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      name: { type: Type.STRING, description: 'Criterion name (e.g. Financial Upside, Peace of Mind)' },
                      description: { type: Type.STRING },
                      defaultWeight: { type: Type.INTEGER, description: 'Recommended default weight from 1 to 10' },
                      scores: {
                        type: Type.ARRAY,
                        description: 'Score for each option on this criterion',
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            optionId: { type: Type.STRING },
                            score: { type: Type.INTEGER, description: 'Rating 1 to 10' },
                            reason: { type: Type.STRING, description: 'Brief rationale' },
                          },
                          required: ['optionId', 'score', 'reason'],
                        },
                      },
                      winnerOptionId: { type: Type.STRING, description: 'ID of the option that wins this criterion' },
                    },
                    required: ['id', 'name', 'description', 'defaultWeight', 'scores', 'winnerOptionId'],
                  },
                },
              },
              required: ['criteria'],
            },
            tiebreakerVerdict: {
              type: Type.OBJECT,
              properties: {
                recommendedOptionId: { type: Type.STRING },
                recommendationTitle: { type: Type.STRING },
                verdictSummary: { type: Type.STRING, description: 'Compelling executive summary of why this option breaks the tie' },
                confidenceLevel: { type: Type.STRING, description: 'High, Moderate, or Slight Edge' },
                keyDifferentiator: { type: Type.STRING, description: 'The single tipping-point factor that seals the verdict' },
                devilsAdvocate: {
                  type: Type.OBJECT,
                  properties: {
                    challengingArgument: { type: Type.STRING, description: 'The strongest counter-argument to the recommended choice' },
                    assumptionsToTest: { type: Type.ARRAY, items: { type: Type.STRING } },
                    dealbreakerCondition: { type: Type.STRING, description: 'When should the user NOT follow this recommendation?' },
                  },
                  required: ['challengingArgument', 'assumptionsToTest', 'dealbreakerCondition'],
                },
                tenTenTenRule: {
                  type: Type.OBJECT,
                  properties: {
                    in10Minutes: { type: Type.STRING, description: 'Immediate emotional aftermath' },
                    in10Months: { type: Type.STRING, description: 'Medium-term reality and routine' },
                    in10Years: { type: Type.STRING, description: 'Long-term life trajectory and regrets' },
                  },
                  required: ['in10Minutes', 'in10Months', 'in10Years'],
                },
                reversibleMicroExperiments: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      experiment: { type: Type.STRING, description: 'Actionable test step' },
                      timeframe: { type: Type.STRING, description: 'e.g. Next 48 hours, Over this weekend' },
                      whatToWatchFor: { type: Type.STRING, description: 'Signal that confirms or rejects this choice' },
                    },
                    required: ['experiment', 'timeframe', 'whatToWatchFor'],
                  },
                },
              },
              required: ['recommendedOptionId', 'recommendationTitle', 'verdictSummary', 'confidenceLevel', 'keyDifferentiator', 'devilsAdvocate', 'tenTenTenRule', 'reversibleMicroExperiments'],
            },
            gutCheckQuestion: {
              type: Type.STRING,
              description: 'A psychological prompt to cut through over-rationalization and tap into intuitive clarity.',
            },
          },
          required: ['dilemmaSummary', 'options', 'comparisonMatrix', 'tiebreakerVerdict', 'gutCheckQuestion'],
        },
      },
    });

    const rawText = response.text || '{}';
    const parsedData = JSON.parse(rawText);
    return res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error('Error analyzing decision:', error);
    return res.status(500).json({
      error: error.message || 'Failed to analyze decision. Please try again.',
    });
  }
});

// 2. Suggest Alternatives / Options Endpoint
app.post('/api/decisions/suggest-options', async (req, res) => {
  try {
    const { dilemma, existingOptions, context } = req.body;
    if (!dilemma) {
      return res.status(400).json({ error: 'Please provide a dilemma.' });
    }

    const prompt = `The user is facing this decision dilemma: "${dilemma}".
${existingOptions && existingOptions.length > 0 ? `Current options considered: ${existingOptions.join(', ')}.` : ''}
${context ? `Additional context: "${context}".` : ''}

Generate 3 to 4 distinct, smart, well-framed options. Include creative middle paths, phased approaches, or non-obvious alternatives (avoid false dichotomies).`;

    const response = await generateContentWithRetry({
      model: PRIMARY_MODEL,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestedOptions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  type: { type: Type.STRING, description: 'e.g. Bold, Conservative, Hybrid / Middle Path, Creative' },
                },
                required: ['name', 'description', 'type'],
              },
            },
          },
          required: ['suggestedOptions'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error generating option suggestions:', error);
    return res.status(500).json({ error: error.message || 'Failed to suggest options.' });
  }
});

// 3. Decision Consultant Chat Endpoint (Follow-up & what-ifs)
app.post('/api/decisions/chat', async (req, res) => {
  try {
    const { dilemma, options, verdict, messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages are required.' });
    }

    const conversationContext = `You are The Tiebreaker's Decision Advisory Copilot.
The user is deliberating:
Dilemma: "${dilemma}"
Options: ${JSON.stringify(options?.map((o: any) => o.name || o))}
Tiebreaker Verdict: "${verdict?.recommendationTitle || ''} - ${verdict?.verdictSummary || ''}"

Help the user explore what-ifs, negotiate terms, test emotional convictions, or refine specific risks.
Provide sharp, structured, empathetic, and actionable counsel. Format responses cleanly with concise paragraphs and bullet points where helpful.`;

    const contents = [
      { role: 'user', parts: [{ text: conversationContext }] },
      { role: 'model', parts: [{ text: 'I am ready to help you stress-test this decision, explore alternatives, or work through tricky edge cases.' }] },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      })),
    ];

    const response = await generateContentWithRetry({
      model: PRIMARY_MODEL,
      contents,
    });

    return res.json({ reply: response.text });
  } catch (error: any) {
    console.error('Error in decision chat:', error);
    return res.status(500).json({ error: error.message || 'Chat consultation failed.' });
  }
});

// Vite middleware in development vs static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
} else {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`The Tiebreaker server running on port ${PORT}`);
});
