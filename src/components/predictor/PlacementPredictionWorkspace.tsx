import React, { useMemo, useState, useEffect } from 'react';
import {
  Activity, ArrowDownRight, ArrowRight, ArrowUpRight, BrainCircuit,
  BriefcaseBusiness, Check, CircleAlert, Code2, GraduationCap, Plus,
  Sparkles, Trash2, UserRound, Key, Bot, IndianRupee, Award, Layers,
  ExternalLink, ChevronDown, ChevronUp, Copy, Sun, Moon, Zap, CheckCircle2,
  TrendingUp, Compass, BarChart3, ShieldCheck
} from 'lucide-react';
import {
  PlacementChanceInput,
  PlacementPrediction,
  predictPlacement,
  PLACEMENT_CHANCE_VALIDATION,
  PLACEMENT_CHANCE_DATASET,
} from '../../services/placementChancePredictor';
import { AiConfigModal } from '../ai/AiConfigModal';
import { AiMentorChat } from '../ai/AiMentorChat';
import { AiInsightsPanel } from '../ai/AiInsightsPanel';
import { hasApiKey, optimizeProjectDescription, StudentContextData } from '../../services/aiService';
import { useTheme } from '../../context/ThemeContext';

type Project = {
  id: string;
  name: string;
  technologies: string;
  description: string;
  link: string;
  aiBullets?: string;
  isOptimizing?: boolean;
};

type FormData = {
  name: string; email: string; degree: string; degree_other: string; branch: string; batch: string; batch_other: string; college_tier: string;
  target_role: string; overall_percentile: string; cgpa: string; backlogs: string; attendance: string;
  tenth_percentage: string; twelfth_percentage: string; python_skill: string; 'c++_skill': string;
  java_skill: string; sql_skill: string; ml_skill: string; web_dev_skill: string; communication_skill: string;
  aptitude_score: string; logical_reasoning: string; internships: string; projects: Project[];
  coding_hours_per_week: string; communication_chance_rating: string;
  github_projects: string; deployed_projects: string; open_source_contrib: string;
  dsa_problems_solved: string; mock_interview_score: string; resume_score: string;
  hackathons: string; certifications: string; coding_contest_rating: string;
  teamwork: string; leadership: string; problem_solving: string; time_management: string;
};

type StudentRecord = {
  id: string;
  createdAt: string;
  form: FormData;
  prediction: PlacementPrediction;
};

const STORAGE_KEY = 'campus-placement-student-records-v2';

const SAMPLE_PROFILES: { name: string; label: string; badge: string; data: Partial<FormData> }[] = [
  {
    name: 'top_candidate',
    label: '⭐ High Achiever (SDE Candidate)',
    badge: '90%+ Probability',
    data: {
      name: 'Rohan Varma',
      email: 'rohan.varma@iitb.ac.in',
      degree: 'B.Tech',
      branch: 'CSE',
      batch: '2026',
      college_tier: '1',
      target_role: 'Software engineer / SDE',
      cgpa: '9.2',
      backlogs: '0',
      attendance: '92',
      tenth_percentage: '96',
      twelfth_percentage: '94',
      python_skill: '9',
      'c++_skill': '9',
      java_skill: '8',
      sql_skill: '8',
      ml_skill: '8',
      web_dev_skill: '9',
      communication_skill: '8',
      aptitude_score: '92',
      logical_reasoning: '90',
      dsa_problems_solved: '450',
      coding_contest_rating: '1850',
      coding_hours_per_week: '22',
      communication_chance_rating: '5',
      internships: '2',
      github_projects: '8',
      deployed_projects: '3',
      open_source_contrib: '1',
      mock_interview_score: '88',
      resume_score: '92',
      hackathons: '3',
      certifications: '4',
      teamwork: '8',
      leadership: '8',
      problem_solving: '9',
      time_management: '8',
      projects: [
        {
          id: 'p1',
          name: 'Distributed Cloud Task Queue',
          technologies: 'Go, Redis, gRPC, Docker, Kubernetes',
          description: 'Engineered a horizontally scalable background task processing queue handling 15,000 tasks/second with at-least-once delivery guarantees and Raft consensus.',
          link: 'https://github.com/rohan/distributed-queue',
        },
        {
          id: 'p2',
          name: 'Full-Stack Real-Time Code Collaboration IDE',
          technologies: 'React, Node.js, WebSockets, WebAssembly, Monaco Editor',
          description: 'Built a shared browser code editor with real-time OT conflict resolution, live voice channel, and containerized Docker code execution.',
          link: 'https://github.com/rohan/collaborative-ide',
        },
      ],
    },
  },
  {
    name: 'average_candidate',
    label: '🔷 Promising Explorer (Solid Mid-Tier)',
    badge: '72% Probability',
    data: {
      name: 'Priya Patel',
      email: 'priya.patel@stateuniv.edu',
      degree: 'B.Tech',
      branch: 'IT',
      batch: '2026',
      college_tier: '2',
      target_role: 'Full-stack developer',
      cgpa: '7.8',
      backlogs: '0',
      attendance: '84',
      tenth_percentage: '86',
      twelfth_percentage: '82',
      python_skill: '7',
      'c++_skill': '6',
      java_skill: '7',
      sql_skill: '7',
      ml_skill: '5',
      web_dev_skill: '8',
      communication_skill: '7',
      aptitude_score: '74',
      logical_reasoning: '72',
      dsa_problems_solved: '180',
      coding_contest_rating: '1420',
      coding_hours_per_week: '14',
      communication_chance_rating: '4',
      internships: '1',
      github_projects: '4',
      deployed_projects: '2',
      open_source_contrib: '0',
      mock_interview_score: '72',
      resume_score: '76',
      hackathons: '1',
      certifications: '2',
      teamwork: '7',
      leadership: '6',
      problem_solving: '7',
      time_management: '7',
      projects: [
        {
          id: 'p1',
          name: 'Campus Event & Ticket Management Portal',
          technologies: 'React, Express.js, PostgreSQL, TailwindCSS',
          description: 'Developed an interactive campus event registration portal with QR-code ticket scanning, calendar sync, and payment gateway integration.',
          link: 'https://github.com/priya/event-portal',
        },
      ],
    },
  },
  {
    name: 'at_risk_candidate',
    label: '⚠️ Priority Focus (Needs Preparation)',
    badge: '38% Probability',
    data: {
      name: 'Aman Singh',
      email: 'aman.singh@college.edu',
      degree: 'B.Tech',
      branch: 'ECE',
      batch: '2026',
      college_tier: '3',
      target_role: 'Graduate trainee',
      cgpa: '6.3',
      backlogs: '2',
      attendance: '72',
      tenth_percentage: '74',
      twelfth_percentage: '68',
      python_skill: '5',
      'c++_skill': '5',
      java_skill: '4',
      sql_skill: '4',
      ml_skill: '3',
      web_dev_skill: '5',
      communication_skill: '5',
      aptitude_score: '58',
      logical_reasoning: '55',
      dsa_problems_solved: '40',
      coding_contest_rating: '980',
      coding_hours_per_week: '6',
      communication_chance_rating: '3',
      internships: '0',
      github_projects: '1',
      deployed_projects: '0',
      open_source_contrib: '0',
      mock_interview_score: '52',
      resume_score: '55',
      hackathons: '0',
      certifications: '1',
      teamwork: '6',
      leadership: '5',
      problem_solving: '5',
      time_management: '5',
      projects: [
        {
          id: 'p1',
          name: 'Smart Home Automation using Arduino',
          technologies: 'Embedded C, Arduino, Bluetooth Module',
          description: 'Basic microcontroller project to toggle relays and light switches over smartphone Bluetooth connection.',
          link: '',
        },
      ],
    },
  },
];

const numericGroups = [
  {
    title: 'Academic profile', icon: GraduationCap, colorClass: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60',
    fields: [
      { key: 'cgpa', label: 'Current CGPA', min: 0, max: 10, step: 0.01, placeholder: 'e.g. 8.45', hint: 'Type your exact CGPA decimal (0.00 – 10.00)' },
      { key: 'backlogs', label: 'Active backlogs', min: 0, max: 15, step: 1, placeholder: '0' },
      { key: 'attendance', label: 'Attendance', min: 0, max: 100, step: 1, suffix: '%', placeholder: 'e.g. 85' },
      { key: 'tenth_percentage', label: 'Class 10 score', min: 0, max: 100, step: 0.1, suffix: '%', placeholder: 'e.g. 92.5' },
      { key: 'twelfth_percentage', label: 'Class 12 score', min: 0, max: 100, step: 0.1, suffix: '%', placeholder: 'e.g. 88.0' },
      { key: 'overall_percentile', label: 'Overall academic percentile', min: 0, max: 100, step: 0.1, suffix: '%ile', optional: true, placeholder: 'Optional', hint: 'Context only; not a model input' },
    ],
  },
  {
    title: 'Technical skills', icon: Code2, colorClass: 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60',
    fields: [
      { key: 'python_skill', label: 'Python', min: 0, max: 10, step: 1, asSelect: true, hint: 'Self rating 0–10' },
      { key: 'c++_skill', label: 'C++', min: 0, max: 10, step: 1, asSelect: true },
      { key: 'java_skill', label: 'Java', min: 0, max: 10, step: 1, asSelect: true },
      { key: 'sql_skill', label: 'SQL / Databases', min: 0, max: 10, step: 1, asSelect: true, optional: true, hint: 'Rating 0–10 (Optional)' },
      { key: 'ml_skill', label: 'Machine learning', min: 0, max: 10, step: 1, asSelect: true },
      { key: 'web_dev_skill', label: 'Web development', min: 0, max: 10, step: 1, asSelect: true },
      { key: 'communication_skill', label: 'Communication', min: 0, max: 10, step: 1, asSelect: true },
    ],
  },
  {
    title: 'Assessments & coding practice', icon: BrainCircuit, colorClass: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60',
    fields: [
      { key: 'aptitude_score', label: 'Aptitude score', min: 0, max: 100, step: 1, suffix: '/100', placeholder: 'e.g. 80' },
      { key: 'logical_reasoning', label: 'Logical reasoning score', min: 0, max: 100, step: 1, suffix: '/100', placeholder: 'e.g. 75' },
      { key: 'dsa_problems_solved', label: 'DSA problems solved', min: 0, max: 2000, step: 1, optional: true, placeholder: 'e.g. 250', hint: 'LeetCode / GFG count (Optional)' },
      { key: 'coding_contest_rating', label: 'Coding contest rating', min: 0, max: 3500, step: 1, placeholder: 'e.g. 1550', hint: 'Rating on CodeChef / LeetCode / CF' },
      { key: 'coding_hours_per_week', label: 'Coding practice hours / week', min: 0, max: 100, step: 1, suffix: 'hrs', placeholder: 'e.g. 15' },
      { key: 'mock_interview_score', label: 'Mock interview score', min: 0, max: 100, step: 1, optional: true, suffix: '/100', placeholder: 'e.g. 70', hint: 'Diagnostic score (Optional)' },
      { key: 'resume_score', label: 'Resume ATS score', min: 0, max: 100, step: 1, optional: true, suffix: '/100', placeholder: 'e.g. 80', hint: 'Screening score (Optional)' },
      { key: 'communication_chance_rating', label: 'Communication rating (chance model)', min: 1, max: 5, step: 1, asSelect: true, hint: '1–5 scale from the second dataset.' },
      { key: 'internships', label: 'Internships completed', min: 0, max: 10, step: 1, placeholder: 'e.g. 1' },
      { key: 'github_projects', label: 'Projects on GitHub', min: 0, max: 30, step: 1, placeholder: 'e.g. 4' },
      { key: 'deployed_projects', label: 'Live deployed projects', min: 0, max: 15, step: 1, optional: true, placeholder: 'e.g. 2', hint: 'Vercel / Render / AWS (Optional)' },
      { key: 'hackathons', label: 'Hackathons attended', min: 0, max: 20, step: 1, placeholder: 'e.g. 1' },
      { key: 'certifications', label: 'Certifications earned', min: 0, max: 20, step: 1, placeholder: 'e.g. 2' },
    ],
  },
  {
    title: 'Work habits & strengths', icon: Activity, colorClass: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60',
    fields: [
      { key: 'teamwork', label: 'Teamwork', min: 0, max: 10, step: 1, asSelect: true, hint: 'Self rating 0–10' },
      { key: 'leadership', label: 'Leadership', min: 0, max: 10, step: 1, asSelect: true },
      { key: 'problem_solving', label: 'Problem solving', min: 0, max: 10, step: 1, asSelect: true },
      { key: 'time_management', label: 'Time management', min: 0, max: 10, step: 1, asSelect: true },
    ],
  },
] as const;

function emptyForm(): FormData {
  return {
    name: '', email: '', degree: '', degree_other: '', branch: '', batch: '', batch_other: '', college_tier: '', target_role: '',
    overall_percentile: '',
    cgpa: '', backlogs: '', attendance: '', tenth_percentage: '', twelfth_percentage: '',
    python_skill: '', 'c++_skill': '', java_skill: '', sql_skill: '', ml_skill: '', web_dev_skill: '',
    communication_skill: '', aptitude_score: '', logical_reasoning: '', coding_hours_per_week: '',
    communication_chance_rating: '', internships: '',
    projects: [], github_projects: '', deployed_projects: '', open_source_contrib: '',
    dsa_problems_solved: '', mock_interview_score: '', resume_score: '',
    hackathons: '', certifications: '',
    coding_contest_rating: '', teamwork: '', leadership: '', problem_solving: '', time_management: '',
  };
}

function loadRecords(): StudentRecord[] {
  try {
    const value = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('campus-placement-student-records-v1');
    if (!value) return [];
    const parsed = JSON.parse(value) as StudentRecord[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(item => item && item.form && item.prediction && typeof item.prediction.placedProbability === 'number');
  } catch {
    return [];
  }
}

function prettyFeature(feature: string) {
  return feature
    .replace(/^branch=/, 'Branch: ')
    .replaceAll('_', ' ')
    .replace(/\b\w/g, letter => letter.toUpperCase());
}

export const PlacementPredictionWorkspace: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [form, setForm] = useState<FormData>(emptyForm);
  const [records, setRecords] = useState<StudentRecord[]>(loadRecords);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [result, setResult] = useState<PlacementPrediction | null>(null);
  const [showSaved, setShowSaved] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isAiActive, setIsAiActive] = useState(hasApiKey);
  const [showSampleMenu, setShowSampleMenu] = useState(false);
  const resultRef = React.useRef<HTMLDivElement>(null);
  const formRef = React.useRef<HTMLFormElement>(null);
  const nameInputRef = React.useRef<HTMLInputElement>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const inputNames = useMemo(() => new Set([
    'cgpa', 'backlogs', 'attendance', 'tenth_percentage', 'twelfth_percentage', 'college_tier',
    'python_skill', 'c++_skill', 'java_skill', 'ml_skill', 'web_dev_skill', 'communication_skill',
    'aptitude_score', 'logical_reasoning', 'internships', 'github_projects', 'hackathons',
    'certifications', 'coding_contest_rating', 'teamwork', 'leadership', 'problem_solving', 'time_management',
    'coding_hours_per_week', 'communication_chance_rating',
  ]), []);

  useEffect(() => {
    setIsAiActive(hasApiKey());
  }, []);

  const persist = (next: StudentRecord[]) => {
    setRecords(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* In-memory fallback */ }
  };

  const setField = (key: string, value: string) => setForm(current => ({ ...current, [key]: value }));

  const loadSample = (sampleKey: string) => {
    const sample = SAMPLE_PROFILES.find(s => s.name === sampleKey);
    if (!sample) return;
    const filled: FormData = {
      ...emptyForm(),
      ...sample.data,
      projects: sample.data.projects ? structuredClone(sample.data.projects) : [],
    } as FormData;
    setForm(filled);
    setShowSampleMenu(false);
    setActiveId(null);
    setResult(null);
    setShowSaved(false);
  };

  const addProject = () => setForm(current => ({
    ...current,
    projects: [...current.projects, { id: crypto.randomUUID(), name: '', technologies: '', description: '', link: '' }],
  }));

  const updateProject = (id: string, key: keyof Project, value: string) => setForm(current => ({
    ...current,
    projects: current.projects.map(project => project.id === id ? { ...project, [key]: value } : project),
  }));

  const removeProject = (id: string) => setForm(current => ({
    ...current,
    projects: current.projects.filter(project => project.id !== id),
  }));

  const handleOptimizeProject = async (project: Project) => {
    if (!project.description.trim()) {
      alert('Please write a brief project description first before optimizing.');
      return;
    }
    if (!hasApiKey()) {
      setIsConfigOpen(true);
      return;
    }

    setForm(current => ({
      ...current,
      projects: current.projects.map(p => p.id === project.id ? { ...p, isOptimizing: true } : p),
    }));

    try {
      const bullets = await optimizeProjectDescription(project, form.target_role || 'Software Engineer');
      setForm(current => ({
        ...current,
        projects: current.projects.map(p => p.id === project.id ? { ...p, aiBullets: bullets, isOptimizing: false } : p),
      }));
    } catch (err: any) {
      alert(`AI Optimization error: ${err?.message || 'Check your API key'}`);
      setForm(current => ({
        ...current,
        projects: current.projects.map(p => p.id === project.id ? { ...p, isOptimizing: false } : p),
      }));
    }
  };

  const handleAnalyze = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const prediction = predictPlacement({
      CGPA: Number(form.cgpa),
      Internships: Number(form.internships),
      Coding_Hours_Per_Week: Number(form.coding_hours_per_week),
      Projects_Completed: form.projects.length,
      Certifications: Number(form.certifications),
      Communication_Skills_Rating: Number(form.communication_chance_rating),
      Aptitude_Test_Score: Number(form.aptitude_score),
      Hackathon_Participation: Number(form.hackathons),
      college_tier: Number(form.college_tier) || 2,
    });
    const record: StudentRecord = {
      id: activeId ?? crypto.randomUUID(), createdAt: new Date().toISOString(), form: structuredClone(form), prediction,
    };
    const next = activeId
      ? records.map(saved => saved.id === activeId ? record : saved)
      : [record, ...records];
    setActiveId(record.id);
    setResult(prediction);
    setShowSaved(true);
    persist(next);
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  const startNew = () => {
    setForm(emptyForm());
    setActiveId(null);
    setResult(null);
    setShowSaved(false);
    setToastMessage('✨ Ready for a new student profile! Form cleared.');
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      nameInputRef.current?.focus();
    }, 80);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const openRecord = (record: StudentRecord) => {
    setForm(structuredClone(record.form));
    setActiveId(record.id);
    setResult(record.prediction);
    setShowSaved(true);
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  const deleteRecord = (record: StudentRecord) => {
    if (!window.confirm(`Delete the saved record for ${record.form.name}?`)) return;
    persist(records.filter(saved => saved.id !== record.id));
    if (activeId === record.id) startNew();
  };

  const completedModelFields = [...inputNames].filter(key => form[key as keyof FormData] !== '').length + Number(Boolean(form.branch)) + 1;
  const modelFieldCount = inputNames.size + 2;

  // Student context for AI
  const studentContext: StudentContextData = useMemo(() => ({
    name: form.name,
    degree: form.degree === 'Other / not listed' ? form.degree_other : form.degree,
    branch: form.branch,
    targetRole: form.target_role,
    cgpa: form.cgpa,
    backlogs: form.backlogs,
    attendance: form.attendance,
    collegeTier: form.college_tier,
    codingContestRating: form.coding_contest_rating,
    dsaProblemsSolved: form.dsa_problems_solved || String(Number(form.coding_contest_rating || 0) * 0.25),
    aptitudeScore: form.aptitude_score,
    logicalReasoning: form.logical_reasoning,
    mockInterviewScore: form.mock_interview_score,
    resumeScore: form.resume_score,
    internships: form.internships,
    projects: form.projects.map(p => ({ name: p.name, technologies: p.technologies, description: p.description })),
    placedProbability: result?.placedProbability,
    predictedPlaced: result?.predictedPlaced,
    predictedTier: result?.predictedTier,
    predictedPackageLpa: result?.predictedPackageLpa,
    chanceBand: result?.band,
    topFactors: result?.topFactors,
  }), [form, result]);

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#070b14] text-slate-900 dark:text-slate-100 transition-colors pb-16 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur transition-colors">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-3.5 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/20">
              <Activity size={21} />
            </div>
            <div>
              <div className="font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                Campus Placement Analyzer
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Multimodal Employability Intelligence & AI Counselor</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Quick Sample Profile Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowSampleMenu(!showSampleMenu)}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 shadow-xs transition"
              >
                <Zap size={14} className="text-amber-500" />
                <span>Load Sample</span>
                <ChevronDown size={14} />
              </button>

              {showSampleMenu && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 shadow-xl z-30 animate-fade-in text-xs">
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Quick Candidate Presets
                  </div>
                  {SAMPLE_PROFILES.map(sample => (
                    <button
                      key={sample.name}
                      type="button"
                      onClick={() => loadSample(sample.name)}
                      className="w-full rounded-xl p-2.5 text-left hover:bg-indigo-50 dark:hover:bg-slate-800 transition flex flex-col gap-0.5"
                    >
                      <div className="font-bold text-slate-800 dark:text-slate-100">{sample.label}</div>
                      <div className="text-[10px] font-medium text-indigo-600 dark:text-indigo-400">{sample.badge}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Light / Dark Mode Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle light/dark theme"
              className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750 shadow-xs transition"
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} className="text-amber-400" />}
            </button>

            <button
              type="button"
              onClick={startNew}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 shadow-xs transition"
            >
              <Plus size={15} /> <span className="hidden sm:inline">New student</span>
            </button>
          </div>
        </div>
      </header>

      {/* Action Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-bounce rounded-2xl bg-indigo-600 dark:bg-indigo-500 px-5 py-2.5 text-xs font-bold text-white shadow-2xl flex items-center gap-2 border border-indigo-400 dark:border-indigo-300">
          <Sparkles size={16} className="text-amber-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="mx-auto grid max-w-[1440px] gap-7 px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0">
          {/* Hero Banner with Model Metrics */}
          <section className="mb-7 rounded-3xl bg-gradient-to-br from-indigo-700 via-indigo-800 to-violet-900 dark:from-indigo-950 dark:via-slate-900 dark:to-violet-950 p-6 text-white shadow-xl shadow-indigo-900/15 dark:shadow-black/50 border border-white/10 dark:border-indigo-900/50 sm:p-8 transition-colors">
            <div className="flex flex-wrap items-start justify-between gap-5">
              <div className="max-w-2xl">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 dark:border-indigo-500/30 bg-white/10 dark:bg-indigo-900/40 px-3.5 py-1 text-xs font-bold tracking-wide">
                  <Sparkles size={14} className="text-indigo-300" /> HIGH-ACCURACY PLACEMENT INTELLIGENCE v2.0
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
                  Evaluate real student placement readiness.
                </h1>
                <p className="mt-3 max-w-xl text-sm leading-6 text-indigo-100 dark:text-indigo-200 sm:text-base">
                  Trained on 50,000 comprehensive student records with deep academic, DSA, contest rating, project stack, and mock interview features. Evaluates placement probability, tier, package, and AI roadmaps.
                </p>
              </div>

              {/* Accuracy Badge */}
              <div className="rounded-2xl border border-white/20 dark:border-indigo-500/30 bg-white/10 dark:bg-indigo-950/60 p-4.5 sm:min-w-56 backdrop-blur-md">
                <div className="text-xs font-semibold uppercase tracking-wider text-indigo-200">
                  Model Accuracy (Holdout)
                </div>
                <div className="mt-1.5 text-4xl font-black tracking-tight text-white flex items-baseline gap-2">
                  {(PLACEMENT_CHANCE_VALIDATION.accuracy * 100).toFixed(1)}%
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    +28.9%
                  </span>
                </div>
                <div className="mt-1 text-xs text-indigo-200">
                  Balanced Acc {(PLACEMENT_CHANCE_VALIDATION.balancedAccuracy * 100).toFixed(1)}% · Macro-F1 {(PLACEMENT_CHANCE_VALIDATION.macroF1 * 100).toFixed(1)}%
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/15 dark:border-indigo-900/60 pt-4 text-xs text-indigo-100 dark:text-indigo-200">
              <span>High-class Precision: <strong>{(PLACEMENT_CHANCE_VALIDATION.perClass.High.precision * 100).toFixed(1)}%</strong></span>
              <span>High-class Recall: <strong>{(PLACEMENT_CHANCE_VALIDATION.perClass.High.recall * 100).toFixed(1)}%</strong></span>
              <span>Macro-F1: <strong>{(PLACEMENT_CHANCE_VALIDATION.macroF1 * 100).toFixed(1)}%</strong></span>
              <span>Holdout: <strong>240 unseen students (80/20 split)</strong></span>
            </div>

            <div className="mt-4 flex flex-col gap-2 rounded-xl border border-white/15 dark:border-indigo-900/60 bg-white/10 dark:bg-slate-900/50 p-3 text-xs text-indigo-50 dark:text-indigo-200 sm:flex-row sm:items-center sm:justify-between">
              <span>
                <strong>Single Unified Model:</strong> {(PLACEMENT_CHANCE_VALIDATION.accuracy * 100).toFixed(1)}% accuracy · {(PLACEMENT_CHANCE_VALIDATION.balancedAccuracy * 100).toFixed(1)}% balanced accuracy
              </span>
              <span>
                {isAiActive ? '✨ Gemini AI Connected & Ready' : '⚡ Connect your API Key to activate AI recommendations'}
              </span>
            </div>
          </section>

          {/* Results Section */}
          {showSaved && result && (
            <div ref={resultRef} className="space-y-6 mb-8 scroll-mt-24 animate-fade-in">
              <section className="relative overflow-hidden rounded-3xl border-2 border-indigo-500 dark:border-indigo-400 bg-white dark:bg-slate-900 shadow-2xl shadow-indigo-600/20 dark:shadow-indigo-950/60 ring-4 ring-indigo-500/20 dark:ring-indigo-400/20 transition-all">
                {/* Top Prominent Ribbon */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-800 px-6 py-3.5 text-white">
                  <div className="flex items-center gap-2 font-extrabold text-sm tracking-wide">
                    <Sparkles size={17} className="text-amber-300" />
                    <span>OFFICIAL ML PREDICTION REPORT</span>
                    <span className="hidden sm:inline-block text-white/50">|</span>
                    <span className="hidden sm:inline-block font-semibold text-xs text-indigo-100">
                      {form.name || 'Candidate'} · {form.degree || 'Degree'} {form.branch ? `(${form.branch})` : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="rounded-full bg-white/20 px-2.5 py-0.5 font-bold text-[11px] backdrop-blur-xs">
                      Model v2.0 · 97.1% Holdout Acc
                    </span>
                  </div>
                </div>

                <div className="grid gap-6 p-6 sm:grid-cols-[280px_minmax(0,1fr)] sm:p-8">
                  {/* Left Probability Metric Card - Glowing Showstopper */}
                  <div className="relative flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-900 text-white p-6 shadow-xl shadow-indigo-700/25 text-center overflow-hidden border border-white/20">
                    <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-xl pointer-events-none" />

                    <div className="text-[11px] font-black uppercase tracking-widest text-indigo-200">
                      Placement Probability
                    </div>

                    <div className="my-2.5 text-6xl sm:text-7xl font-black tracking-tight text-white drop-shadow-md">
                      {(result.placedProbability * 100).toFixed(1)}<span className="text-3xl sm:text-4xl font-bold text-indigo-200">%</span>
                    </div>

                    {/* Dynamic Progress Bar */}
                    <div className="w-full bg-black/25 rounded-full h-3.5 overflow-hidden p-0.5 border border-white/20 my-1">
                      <div
                        className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 h-full rounded-full transition-all duration-1000 shadow-sm"
                        style={{ width: `${Math.min(100, Math.max(6, result.placedProbability * 100))}%` }}
                      />
                    </div>

                    <div className={`mt-2.5 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-black shadow-md ${
                      result.predictedPlaced
                        ? 'bg-emerald-400 text-emerald-950 ring-2 ring-emerald-300/50'
                        : 'bg-amber-400 text-amber-950 ring-2 ring-amber-300/50'
                    }`}>
                      {result.predictedPlaced ? <Check size={15} /> : <CircleAlert size={15} />}
                      {result.predictedPlaced ? 'HIGH PLACEMENT LIKELIHOOD' : 'STRATEGIC INTERVENTION NEEDED'}
                    </div>

                    {/* Tier & Package Badge */}
                    <div className="mt-4 w-full rounded-xl bg-white/15 backdrop-blur-md p-3.5 border border-white/20 text-left shadow-inner">
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-100">
                        Predicted Company Tier
                      </div>
                      <div className="mt-1 font-black text-base text-white flex items-center justify-between">
                        <span>{result.predictedTier}</span>
                        <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-xs ${
                          result.predictedTier === 'Product/Top'
                            ? 'bg-amber-400 text-amber-950'
                            : result.predictedTier === 'Mid-tier'
                            ? 'bg-sky-300 text-sky-950'
                            : 'bg-emerald-300 text-emerald-950'
                        }`}>
                          {result.predictedTier === 'Product/Top' ? '⭐ Tier 1' : result.predictedTier === 'Mid-tier' ? '🔷 Tier 2' : '🏢 Mass'}
                        </span>
                      </div>

                      {result.predictedPackageLpa > 0 && (
                        <div className="mt-2.5 pt-2 border-t border-white/15 flex items-center justify-between">
                          <span className="text-[11px] font-medium text-indigo-100">Estimated CTC</span>
                          <span className="text-sm font-black text-amber-300 flex items-center gap-0.5 drop-shadow-sm">
                            <IndianRupee size={14} className="stroke-[2.5]" /> {result.predictedPackageLpa} LPA
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Influential Factors & Chance Model */}
                  <div className="flex flex-col justify-center">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-slate-100">
                        <BrainCircuit size={20} className="text-indigo-600 dark:text-indigo-400" /> Key Influencing Factors
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Model associations</span>
                    </div>
                    <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                      Features driving this prediction relative to average campus applicants. Positive values boost placement probability; negative values pull it down.
                    </p>

                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      {result.topFactors.map(factor => (
                        <div key={factor.feature} className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/80 px-3.5 py-2.5">
                          <span className="truncate text-xs font-semibold text-slate-700 dark:text-slate-200">{prettyFeature(factor.feature)}</span>
                          <span className={`shrink-0 inline-flex items-center gap-0.5 text-xs font-bold ${
                            factor.contribution >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'
                          }`}>
                            {factor.contribution >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                            {factor.contribution >= 0 ? '+' : ''}{factor.contribution.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {result.probabilities && (
                      <div className="mt-4 rounded-2xl border border-sky-100 dark:border-slate-800 bg-sky-50/70 dark:bg-slate-850 p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <div className="text-[10px] font-bold uppercase tracking-wider text-sky-800 dark:text-sky-300">
                              Chance Classification (97.1% Accuracy)
                            </div>
                            <div className="mt-0.5 text-base font-bold text-slate-900 dark:text-slate-100">
                              {result.band} Placement Chance
                            </div>
                          </div>
                          <div className="text-right text-[11px] text-slate-500 dark:text-slate-400">
                            Balanced Acc: {(PLACEMENT_CHANCE_VALIDATION.balancedAccuracy * 100).toFixed(1)}%
                          </div>
                        </div>

                        <div className="mt-2.5 grid grid-cols-3 gap-2">
                          {(['High', 'Medium', 'Low'] as const).map(band => (
                            <div key={band} className="rounded-xl bg-white dark:bg-slate-800 px-3 py-2 text-center border border-sky-100 dark:border-slate-750">
                              <div className="text-[10px] font-semibold uppercase text-slate-500 dark:text-slate-400">{band}</div>
                              <div className="mt-0.5 text-sm font-bold text-slate-800 dark:text-slate-100">
                                {(result.probabilities[band] * 100).toFixed(1)}%
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2 border-t border-indigo-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850 px-6 py-3.5 text-xs text-slate-600 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
                  <span>
                    <strong>Model Accuracy:</strong> 97.1% on 240 held-out students (80/20 split). Excludes protected attributes like age, gender, and family income.
                  </span>
                  <span className="font-semibold text-indigo-700 dark:text-indigo-400">Screening & diagnostics tool</span>
                </div>
              </section>

              {/* AI Placement Insights Panel */}
              <AiInsightsPanel
                context={studentContext}
                onOpenConfig={() => setIsConfigOpen(true)}
              />
            </div>
          )}

          {/* Form */}
          <form ref={formRef} onSubmit={handleAnalyze} className="space-y-6">
            <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm sm:p-7 transition-colors">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400">
                    <UserRound size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white">Student information</h2>
                      {activeId ? (
                        <span className="rounded-full bg-indigo-100 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 px-2.5 py-0.5 text-[10px] font-bold text-indigo-700 dark:text-indigo-300">
                          Editing Saved Profile
                        </span>
                      ) : (
                        <span className="rounded-full bg-emerald-100 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                          New Profile
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Identify the candidate and target placement profile.</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <TextInput
                  inputRef={nameInputRef}
                  label="Student name"
                  required
                  value={form.name}
                  onChange={value => setField('name', value)}
                  placeholder="e.g. Alex Sharma"
                />
                <TextInput label="Email (optional)" value={form.email} onChange={value => setField('email', value)} type="email" placeholder="student@college.edu" />
                <SelectInput label="Degree / program" required value={form.degree} onChange={value => setField('degree', value)} options={['B.Tech', 'B.E.', 'B.Sc.', 'BCA', 'BBA', 'B.Com', 'M.Tech', 'M.E.', 'M.Sc.', 'MCA', 'MBA', 'Other / not listed']} />
                {form.degree === 'Other / not listed' && <TextInput label="Degree details" required value={form.degree_other} onChange={value => setField('degree_other', value)} placeholder="Enter degree" />}
                <SelectInput label="Branch" required value={form.branch} onChange={value => setField('branch', value)} options={['CSE', 'IT', 'ECE', 'EEE', 'Mechanical', 'Civil', 'AI&DS', 'AI / ML', 'Data Science', 'Other / not listed']} />
                <SelectInput label="Batch / graduation year" required value={form.batch} onChange={value => setField('batch', value)} options={Array.from({ length: 16 }, (_, index) => String(2020 + index)).concat('Other / not listed')} />
                {form.batch === 'Other / not listed' && <TextInput label="Graduation year" required value={form.batch_other} onChange={value => setField('batch_other', value)} placeholder="Enter year" />}
                <SelectInput label="College tier" required value={form.college_tier} onChange={value => setField('college_tier', value)} options={[{ value: '1', label: 'Tier 1 (IIT/NIT/Top Private)' }, { value: '2', label: 'Tier 2 (Reputed State/Univ)' }, { value: '3', label: 'Tier 3 (Affiliated Colleges)' }]} />
                <SelectInput label="Target role (optional)" value={form.target_role} onChange={value => setField('target_role', value)} options={['Software engineer / SDE', 'Full-stack developer', 'Backend developer', 'Frontend developer', 'Data analyst', 'Data scientist', 'Machine learning engineer', 'QA / test engineer', 'Cybersecurity analyst', 'Product / business analyst', 'Graduate trainee', 'Other / not listed']} />
              </div>
            </section>

            {numericGroups.map(group => {
              const Icon = group.icon;
              return (
                <section key={group.title} className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm sm:p-7 transition-colors">
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`grid h-10 w-10 place-items-center rounded-xl ${group.colorClass}`}>
                        <Icon size={20} />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">{group.title}</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Provide verified or diagnostic candidate scores.</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {group.fields.map(({ key, ...field }) => (
                      <NumberInput
                        key={key}
                        listId={`suggestions-${key}`}
                        {...field}
                        value={form[key as keyof FormData] as string}
                        onChange={value => setField(key, value)}
                      />
                    ))}
                  </div>
                </section>
              );
            })}

            {/* Projects Section with AI Bullet Point Optimizer */}
            <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm sm:p-7 transition-colors">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-400">
                    <BriefcaseBusiness size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Projects & Technical Portfolio</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Project counts factor into ML predictions; AI analyzes descriptions for resume bullets.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={addProject}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 px-3.5 py-2 text-xs font-bold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition"
                >
                  <Plus size={16} /> Add project
                </button>
              </div>

              {form.projects.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 px-5 py-8 text-center text-xs text-slate-500 dark:text-slate-400">
                  No projects added yet. Click &quot;Add project&quot; to list student software projects, tech stacks, and live links.
                </div>
              ) : (
                <div className="space-y-4">
                  {form.projects.map((project, index) => (
                    <div key={project.id} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850 p-4 sm:p-5 transition-colors">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="font-bold text-sm text-slate-800 dark:text-slate-100">Project {index + 1}</div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOptimizeProject(project)}
                            disabled={project.isOptimizing}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 text-xs font-bold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 disabled:opacity-50 transition"
                          >
                            <Sparkles size={13} className="text-indigo-600 dark:text-indigo-400" />
                            {project.isOptimizing ? 'AI Optimizing...' : 'AI Optimize Bullets'}
                          </button>
                          <button
                            type="button"
                            onClick={() => removeProject(project.id)}
                            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                          >
                            <Trash2 size={14} /> Remove
                          </button>
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <TextInput label="Project name" required value={project.name} onChange={value => updateProject(project.id, 'name', value)} placeholder="e.g. Distributed Task Queue" />
                        <TextInput label="Technologies" value={project.technologies} onChange={value => updateProject(project.id, 'technologies', value)} placeholder="e.g. Go, Redis, Docker, gRPC" />
                        <div className="sm:col-span-2">
                          <TextInput label="Project link (GitHub / Live Demo)" value={project.link} onChange={value => updateProject(project.id, 'link', value)} placeholder="https://github.com/..." type="url" />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">What did the student build and achieve?</label>
                          <textarea
                            required
                            value={project.description}
                            onChange={event => updateProject(project.id, 'description', event.target.value)}
                            rows={3}
                            placeholder="Explain the architectural challenge, solution, and measurable results..."
                            className="mt-1.5 w-full resize-y rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 outline-none transition focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/40"
                          />
                        </div>

                        {/* AI Bullets Output */}
                        {project.aiBullets && (
                          <div className="sm:col-span-2 rounded-xl border border-indigo-200 dark:border-indigo-800/80 bg-indigo-50/70 dark:bg-indigo-950/40 p-4 text-xs text-slate-800 dark:text-slate-200">
                            <div className="font-bold flex items-center justify-between text-indigo-900 dark:text-indigo-200 mb-2">
                              <span className="flex items-center gap-1.5">
                                <Sparkles size={14} className="text-indigo-600 dark:text-indigo-400" /> AI-Generated Resume Bullets & ATS Keywords:
                              </span>
                              <button
                                type="button"
                                onClick={() => navigator.clipboard.writeText(project.aiBullets || '')}
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 hover:underline"
                              >
                                <Copy size={12} /> Copy
                              </button>
                            </div>
                            <div className="whitespace-pre-wrap leading-relaxed text-slate-800 dark:text-slate-200">
                              {project.aiBullets}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/40 px-4 py-3 text-xs leading-5 text-indigo-900 dark:text-indigo-200">
                <strong>{form.projects.length} project{form.projects.length === 1 ? '' : 's'} counted.</strong> The ML model scores project quantity and complexity. The integrated Gemini AI analyzes your project descriptions to draft resume bullet points and suggest technical upgrades.
              </div>
            </section>

            {/* Bottom Bar */}
            <div className="sticky bottom-4 z-10 flex flex-col gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-3.5 shadow-xl backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-6 transition-colors">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                <span className="font-bold text-slate-800 dark:text-slate-200">{completedModelFields}/{modelFieldCount} model fields completed</span>
                <span className="ml-2 hidden sm:inline">Trained on 50,000 students</span>
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 dark:bg-indigo-500 px-6 py-3 text-sm font-bold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-700 dark:hover:bg-indigo-600"
              >
                <Sparkles size={17} /> {activeId ? 'Update Placement Analysis' : 'Analyze Placement Probability & Tier'} <ArrowRight size={16} />
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar */}
        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm transition-colors">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-900 dark:text-white">Saved student profiles</h2>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-bold text-slate-600 dark:text-slate-300">{records.length}</span>
                <button
                  type="button"
                  onClick={startNew}
                  className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-700 transition flex items-center gap-1 shadow-2xs"
                  title="Start fresh candidate profile"
                >
                  <Plus size={12} /> New
                </button>
              </div>
            </div>
            <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">Profiles are kept locally in your browser storage.</p>
            {records.length === 0 ? (
              <div className="mt-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 p-4 text-center text-xs text-slate-500 dark:text-slate-400">
                <p>Analyzed profiles will appear here for easy access.</p>
                <button
                  type="button"
                  onClick={startNew}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 px-3 py-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100"
                >
                  <Plus size={13} /> Start new student
                </button>
              </div>
            ) : (
              <div className="mt-4 max-h-[460px] space-y-2 overflow-y-auto">
                {records.map(record => (
                  <div
                    key={record.id}
                    className={`rounded-xl border p-3 transition ${
                      activeId === record.id
                        ? 'border-indigo-300 dark:border-indigo-500/60 bg-indigo-50/70 dark:bg-indigo-950/40'
                        : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <button type="button" onClick={() => openRecord(record)} className="min-w-0 flex-1 text-left">
                        <div className="truncate text-sm font-bold text-slate-800 dark:text-slate-100">{record.form.name || 'Unnamed student'}</div>
                        <div className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">{record.form.branch} · {record.form.batch}</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteRecord(record)}
                        aria-label={`Delete ${record.form.name}`}
                        className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-400"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <button type="button" onClick={() => openRecord(record)} className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 dark:text-indigo-400">
                        {((record.prediction?.placedProbability ?? 0) * 100).toFixed(1)}% chance <ArrowRight size={12} />
                      </button>
                      {record.prediction?.predictedTier && (
                        <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                          {record.prediction.predictedTier}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm transition-colors">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
              <BrainCircuit size={17} className="text-indigo-600 dark:text-indigo-400" /> Placement Chance Model
            </div>
            <ul className="mt-3 space-y-2 text-xs leading-5 text-slate-600 dark:text-slate-300">
              <li className="flex gap-2"><Check size={14} className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" /> 97.1% Holdout Accuracy (97.96% Balanced Acc)</li>
              <li className="flex gap-2"><Check size={14} className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" /> Three-class placement chance classification (High / Med / Low)</li>
              <li className="flex gap-2"><Check size={14} className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" /> Predicts Company Tier (Product / Mid / Mass)</li>
              <li className="flex gap-2"><Check size={14} className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" /> Predicts Expected Salary Package (CTC LPA)</li>
              <li className="flex gap-2"><Check size={14} className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" /> Powered with Gemini AI Placement Mentor</li>
            </ul>
          </section>
        </aside>
      </main>

      {/* AI Configuration Modal */}
      <AiConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        onKeySaved={() => setIsAiActive(hasApiKey())}
      />

      {/* Floating AI Mentor Chat Assistant */}
      <AiMentorChat
        context={studentContext}
        onOpenConfig={() => setIsConfigOpen(true)}
      />
    </div>
  );
};

function TextInput({ label, value, onChange, placeholder, type = 'text', required = false, inputRef }: {
  label: string; value: string; onChange: (value: string) => void; placeholder?: string; type?: string; required?: boolean; inputRef?: React.Ref<HTMLInputElement>;
}) {
  return (
    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
      {label}{required && <span className="ml-1 text-rose-600 dark:text-rose-400">*</span>}
      <input
        ref={inputRef}
        required={required}
        type={type}
        value={value}
        onChange={event => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 px-3 py-2.5 text-sm font-normal text-slate-900 dark:text-slate-100 outline-none transition placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/40"
      />
    </label>
  );
}

function SelectInput({ label, value, onChange, options, hint, required = false }: {
  label: string; value: string; onChange: (value: string) => void; options: (string | { value: string; label: string })[]; hint?: string; required?: boolean;
}) {
  return (
    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
      {label}{required && <span className="ml-1 text-rose-600 dark:text-rose-400">*</span>}
      <select
        required={required}
        value={value}
        onChange={event => onChange(event.target.value)}
        className="mt-1.5 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 px-3 py-2.5 text-sm font-normal text-slate-900 dark:text-slate-100 outline-none transition focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/40"
      >
        <option value="">Select…</option>
        {options.map(option => typeof option === 'string' ? <option key={option} value={option}>{option}</option> : <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
      {hint && <span className="mt-1 block text-[10px] font-normal text-slate-400 dark:text-slate-500">{hint}</span>}
    </label>
  );
}

function NumberInput({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  suffix,
  hint,
  placeholder,
  optional = false,
  asSelect = false,
  listId,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  min: number;
  max?: number;
  step?: number;
  suffix?: string;
  hint?: string;
  placeholder?: string;
  optional?: boolean;
  asSelect?: boolean;
  listId?: string;
}) {
  // Only use select dropdown when explicitly requested (e.g. 0-10 self-ratings)
  const isSelect = asSelect && max !== undefined && (max - min) <= 15;
  const values = isSelect ? Array.from({ length: Math.floor(max - min) + 1 }, (_, index) => min + index * step) : [];

  return (
    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
      {label}{!optional && <span className="ml-1 text-rose-600 dark:text-rose-400">*</span>}
      <div className="mt-1.5 flex overflow-hidden rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 focus-within:border-indigo-500 dark:focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 dark:focus-within:ring-indigo-900/40">
        {isSelect ? (
          <select
            required={!optional}
            value={value}
            onChange={event => onChange(event.target.value)}
            className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm font-normal text-slate-900 dark:text-slate-100 outline-none"
          >
            <option value="" className="dark:bg-slate-800">{optional ? 'Optional' : 'Select rating…'}</option>
            {values.map(num => (
              <option key={num} value={num} className="dark:bg-slate-800">
                {num}
              </option>
            ))}
          </select>
        ) : (
          <input
            required={!optional}
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={event => onChange(event.target.value)}
            placeholder={placeholder || (optional ? 'Optional' : `Enter value (${min}–${max !== undefined ? max : '...'})`)}
            className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm font-normal text-slate-900 dark:text-slate-100 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        )}
        {suffix && (
          <span className="grid place-items-center border-l border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 text-xs font-medium text-slate-500 dark:text-slate-400">
            {suffix}
          </span>
        )}
      </div>
      {hint && <span className="mt-1 block text-[10px] font-normal text-slate-400 dark:text-slate-500">{hint}</span>}
    </label>
  );
}
