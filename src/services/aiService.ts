/**
 * AI Service for Campus Placement Analyzer.
 * Powers personalized placement diagnostics, career roadmaps, interactive AI mentorship,
 * and project resume enhancements using Google Gemini API.
 */

export interface AiModelConfig {
  apiKey: string;
  model: string;
}

export interface StudentContextData {
  name?: string;
  degree?: string;
  branch?: string;
  targetRole?: string;
  cgpa?: number | string;
  backlogs?: number | string;
  attendance?: number | string;
  collegeTier?: number | string;
  codingContestRating?: number | string;
  dsaProblemsSolved?: number | string;
  aptitudeScore?: number | string;
  logicalReasoning?: number | string;
  mockInterviewScore?: number | string;
  resumeScore?: number | string;
  internships?: number | string;
  projects?: { name: string; technologies: string; description: string }[];
  placedProbability?: number;
  predictedPlaced?: boolean;
  predictedTier?: string;
  predictedPackageLpa?: number;
  chanceBand?: string;
  topFactors?: { feature: string; contribution: number }[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const STORAGE_API_KEY = 'campus_placement_gemini_api_key';
const STORAGE_MODEL = 'campus_placement_gemini_model';
const DEFAULT_MODEL = 'gemini-3.6-flash';

const FALLBACK_MODELS = [
  'gemini-3.6-flash',
  'gemini-3.8-flash',
  'gemini-flash-latest',
  'gemini-3.5-flash',
];

export function getApiKey(): string {
  try {
    const saved = localStorage.getItem(STORAGE_API_KEY);
    if (saved && saved.trim()) return saved.trim();
  } catch {
    // LocalStorage unavailable
  }
  // Fallback to Vite env variable if provided
  const envKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
  if (typeof envKey === 'string' && envKey.trim() && !envKey.includes('MY_GEMINI_API_KEY')) {
    return envKey.trim();
  }
  return '';
}

export function setApiKey(key: string): void {
  try {
    if (key.trim()) {
      localStorage.setItem(STORAGE_API_KEY, key.trim());
    } else {
      localStorage.removeItem(STORAGE_API_KEY);
    }
  } catch {
    // LocalStorage error
  }
}

export function hasApiKey(): boolean {
  return Boolean(getApiKey());
}

export function isEnvKeyConfigured(): boolean {
  const envKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
  return typeof envKey === 'string' && Boolean(envKey.trim()) && !envKey.includes('MY_GEMINI_API_KEY');
}

export function isLocalStorageKeyConfigured(): boolean {
  try {
    const saved = localStorage.getItem(STORAGE_API_KEY);
    return Boolean(saved && saved.trim());
  } catch {
    return false;
  }
}

export function getMaskedApiKey(): string {
  const key = getApiKey();
  if (!key) return '';
  if (key.length <= 8) return '••••••••';
  return `${key.slice(0, 3)}••••••••••••${key.slice(-3)}`;
}

export function getSelectedModel(): string {
  try {
    const saved = localStorage.getItem(STORAGE_MODEL);
    // Automatically migrate away from deprecated models
    if (saved && saved !== 'gemini-2.5-flash' && saved !== 'gemini-1.5-flash' && saved !== 'gemini-2.0-flash') {
      return saved;
    }
  } catch {
    // Fallback
  }
  return DEFAULT_MODEL;
}

export function setSelectedModel(model: string): void {
  try {
    localStorage.setItem(STORAGE_MODEL, model);
  } catch {
    // LocalStorage error
  }
}

const sanitizeError = (msg: string) => {
  return msg
    .replace(/key=[^&\s]+/gi, 'key=[PROTECTED]')
    .replace(/AIza[0-9A-Za-z-_]{35}/g, '[PROTECTED_KEY]')
    .replace(/AQ\.[0-9A-Za-z-_]+/g, '[PROTECTED_KEY]');
};

/**
 * Executes a Gemini generateContent request with automatic fallback across reliable models.
 */
async function callGeminiApi(payload: {
  contents: any[];
  generationConfig?: {
    temperature?: number;
    maxOutputTokens?: number;
  };
}): Promise<string> {
  const key = getApiKey();
  if (!key) {
    throw new Error('Please configure your Gemini API Key in the AI Settings.');
  }

  const preferredModel = getSelectedModel();
  const modelsToTry = [
    preferredModel,
    ...FALLBACK_MODELS.filter(m => m !== preferredModel)
  ];

  let lastError: Error | null = null;

  for (const model of modelsToTry) {
    // Send API key via x-goog-api-key header so it NEVER appears in URLs, network logs, or browser history
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': key,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          if (model !== preferredModel) {
            setSelectedModel(model);
          }
          return text;
        }
      }

      const errData = await response.json().catch(() => null);
      const rawErrMsg = errData?.error?.message || `HTTP ${response.status}: ${response.statusText}`;
      const errMsg = sanitizeError(rawErrMsg);

      // If invalid API key, fail fast without useless retries
      if (response.status === 400 && (errMsg.includes('API key') || errMsg.includes('API_KEY_INVALID'))) {
        throw new Error(`Invalid Gemini API Key: ${errMsg}`);
      }

      // If model not found or temporarily unavailable, try next fallback
      lastError = new Error(errMsg);
    } catch (err: any) {
      if (err.message?.includes('Invalid Gemini API Key')) {
        throw err;
      }
      lastError = new Error(sanitizeError(err?.message || 'Gemini API call failed'));
    }
  }

  throw lastError || new Error('All Gemini AI model endpoints were temporarily unavailable. Please try again.');
}

/**
 * Validates the API key by sending a minimal test prompt to Gemini.
 */
export async function validateApiKey(keyToTest?: string): Promise<{ valid: boolean; message: string; model?: string }> {
  const key = keyToTest?.trim() || getApiKey();
  if (!key) {
    return { valid: false, message: 'No API key provided. Please enter your Gemini API key.' };
  }

  const modelsToTry = [getSelectedModel(), ...FALLBACK_MODELS];

  for (const model of modelsToTry) {
    // Pass API key in header, avoiding query parameter exposure
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': key,
        },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: 'OK' }] }],
          generationConfig: { maxOutputTokens: 5, temperature: 0.1 },
        }),
      });

      if (response.ok) {
        setSelectedModel(model);
        return { valid: true, message: `API key validated successfully with ${model}!`, model };
      }

      const errData = await response.json().catch(() => null);
      const rawErrMsg = errData?.error?.message || `HTTP ${response.status}`;
      const errMsg = sanitizeError(rawErrMsg);
      if (response.status === 400 && (errMsg.includes('API key') || errMsg.includes('API_KEY_INVALID'))) {
        return { valid: false, message: `Invalid or unauthorized API key: ${errMsg}` };
      }
    } catch (err: any) {
      // Continue to next model
    }
  }

  return { valid: false, message: 'Could not connect to Gemini models with this API key. Please verify your key.' };
}

/**
 * Generates an in-depth, structured AI Placement Diagnostic Report & Action Plan.
 */
export async function generateStudentInsights(context: StudentContextData): Promise<string> {
  const key = getApiKey();
  if (!key) {
    throw new Error('Please configure your Gemini API Key in the AI Settings to generate AI insights.');
  }

  const prompt = `You are an elite Senior Campus Placement Director and Technical Hiring Manager advising college engineering/computer science students.
Analyze this student's comprehensive profile and machine learning model predictions, and generate a strategic, highly actionable Placement Readiness Intelligence Report.

=== STUDENT PROFILE DATA ===
- Name: ${context.name || 'Candidate'}
- Degree & Branch: ${context.degree || 'B.Tech'} in ${context.branch || 'Engineering'}
- Target Role: ${context.targetRole || 'Software Development Engineer (SDE)'}
- Academic: CGPA ${context.cgpa || 'N/A'}, Active Backlogs: ${context.backlogs || 0}, Attendance: ${context.attendance || 85}%, College Tier: Tier ${context.collegeTier || 2}
- Coding Profile: Contest Rating ${context.codingContestRating || 0}, DSA Problems Solved: ${context.dsaProblemsSolved || 0}
- Assessments: Aptitude Score ${context.aptitudeScore || 'N/A'}/100, Logical Reasoning: ${context.logicalReasoning || 'N/A'}/100, Mock Interview Score: ${context.mockInterviewScore || 'N/A'}/100, Resume Score: ${context.resumeScore || 'N/A'}/100
- Practical Experience: Internships: ${context.internships || 0}, Projects Count: ${context.projects?.length || 0}
- Projects Details:
${(context.projects || []).map((p, i) => `  * Project ${i + 1}: ${p.name || 'Untitled'} | Stack: ${p.technologies || 'General'} | Description: ${p.description || 'None'}`).join('\n') || '  * None listed yet'}

=== TRAINED ML MODEL PREDICTIONS ===
- Model Placement Probability: ${context.placedProbability !== undefined ? (context.placedProbability * 100).toFixed(1) + '%' : 'N/A'}
- Classification Outcome: ${context.predictedPlaced ? 'Likely Placed' : 'High Risk / Unplaced without Intervention'}
- Estimated Company Tier: ${context.predictedTier || 'Not Placed / Mass Recruiter'}
- Estimated Package: ${context.predictedPackageLpa ? context.predictedPackageLpa.toFixed(1) + ' LPA' : 'N/A'}
- Benchmark Placement Chance Band: ${context.chanceBand || 'N/A'}
- Top Influencing Factors:
${(context.topFactors || []).map(f => `  * ${f.feature}: ${f.contribution >= 0 ? '+' : ''}${f.contribution.toFixed(2)}`).join('\n') || '  * Standard factors'}

=== INSTRUCTIONS FOR OUTPUT FORMAT ===
Generate a clean, beautifully formatted Markdown report with these sections:

## 1. 🎯 Executive Readiness Diagnostic
A concise 2-3 paragraph summary of where the student currently stands, their realistic hiring tier (${context.predictedTier || 'Target Tier'}), and what the ${context.placedProbability !== undefined ? (context.placedProbability * 100).toFixed(1) + '%' : ''} probability means in current campus hiring markets.

## 2. ⚡ Top 3 Standout Competitive Edges
Bullet points highlighting their best strengths that will impress technical interviewers and recruiters.

## 3. 🚨 Critical Red Flags & Score Penalties
Identify the top 2-3 vulnerabilities hurting their placement probability (e.g. backlogs, low mock scores, lack of deployed projects, DSA depth) and how much they are dragging down their chances.

## 4. 🗓️ 30-60-90 Day High-Impact Action Plan
- **Days 1–30 (Foundation & Immediate Fixes)**: Specific topics, problem counts, certifications or mock tests to tackle first.
- **Days 31–60 (Portfolio & Core Interview Prep)**: Project deployments, system design/core subjects (OS, DBMS, CN).
- **Days 61–90 (Mock Interviews & Company-Specific Prep)**: OA practice, behavioral/HR questions, live mock interview drills.

## 5. 🛠️ Project & Resume Optimization
Specific advice on how to upgrade their listed projects (${(context.projects || []).map(p => p.name).filter(Boolean).join(', ') || 'current projects'}), add measurable metrics, deploy them, and write impactful resume bullet points.

## 6. 🏢 Target Company Shortlist
Grouped into:
- **Dream / Stretch Companies** (Tier-1 Product / Fintech)
- **Target Companies** (Matched directly to their profile)
- **Safety Companies** (Mass / IT Services firms for guaranteed offers)

Keep the tone encouraging, direct, and rigorous. Use bolding and concise bullet points for readability.`;

  return await callGeminiApi({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 2500,
    },
  });
}

/**
 * Interactive Chat Assistant with student placement context.
 */
export async function chatWithPlacementMentor(
  history: ChatMessage[],
  newMessage: string,
  context?: StudentContextData
): Promise<string> {
  const key = getApiKey();
  if (!key) {
    throw new Error('Please configure your Gemini API Key in the AI Settings.');
  }

  const contextBrief = context ? `
STUDENT CONTEXT:
Name: ${context.name || 'Student'} | Branch: ${context.branch || 'CSE'} | CGPA: ${context.cgpa || 7.5}
Backlogs: ${context.backlogs || 0} | Target Role: ${context.targetRole || 'SDE'}
Placement Probability: ${context.placedProbability !== undefined ? (context.placedProbability * 100).toFixed(1) + '%' : 'Not evaluated yet'}
Predicted Tier: ${context.predictedTier || 'General'} | Estimated Package: ${context.predictedPackageLpa ? context.predictedPackageLpa + ' LPA' : 'N/A'}
DSA Problems Solved: ${context.dsaProblemsSolved || 0} | Coding Contest Rating: ${context.codingContestRating || 0}
Internships: ${context.internships || 0} | Projects: ${(context.projects || []).map(p => p.name).join(', ') || 'None'}
` : '';

  const systemInstruction = `You are 'PlacementAI', an intelligent, empathetic, and sharp career mentor specialized in college campus placements and tech hiring.
You give precise, realistic, and highly practical guidance on interview preparation, resume bullets, DSA problem strategies, system design, mock interview answers, and salary negotiation.
Always tailor your response to the student's background. Use markdown formatting, bullet points, and code snippets where appropriate.${contextBrief}`;

  // Format messages into Gemini contents format
  const formattedContents: any[] = [];

  // Add system instruction as initial context in first turn or system prompt
  formattedContents.push({
    role: 'user',
    parts: [{ text: `System Instruction: ${systemInstruction}\n\nLet's begin our conversation.` }],
  });
  formattedContents.push({
    role: 'model',
    parts: [{ text: `Hello! I'm your Placement AI Mentor. I have reviewed your profile and model diagnostics. How can I help you accelerate your campus placement preparation today?` }],
  });

  // Append history (up to last 10 turns)
  history.slice(-10).forEach(msg => {
    formattedContents.push({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    });
  });

  // Append new user message
  formattedContents.push({
    role: 'user',
    parts: [{ text: newMessage }],
  });

  return await callGeminiApi({
    contents: formattedContents,
    generationConfig: {
      temperature: 0.6,
      maxOutputTokens: 1500,
    },
  });
}

/**
 * Optimizes a student's project description into high-impact resume bullet points.
 */
export async function optimizeProjectDescription(
  project: { name: string; technologies: string; description: string; link?: string },
  targetRole: string = 'Software Engineer'
): Promise<string> {
  const key = getApiKey();
  if (!key) {
    throw new Error('Please enter a Gemini API Key to use the AI Project Optimizer.');
  }

  return await callGeminiApi({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 800,
    },
  });
}
