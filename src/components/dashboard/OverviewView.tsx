import React, { useState } from 'react';
import { ViewMode, StudentProfile } from '../../types';

interface OverviewViewProps {
  student: StudentProfile;
  onNavigate: (view: ViewMode) => void;
  onRecalculateScore: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  student,
  onNavigate,
  onRecalculateScore,
}) => {
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [activeTimeRange, setActiveTimeRange] = useState<'30D' | '60D' | 'All'>('60D');
  const [hoveredPoint, setHoveredPoint] = useState<{ week: string; score: number } | null>(null);

  // Quick interactive tasks in the preview section
  const [tasks, setTasks] = useState([
    {
      id: 't-quick-1',
      title: 'Solve 5 Medium Graph & BFS problems on LeetCode',
      subtitle: 'Topics: Topological Sort, Cycle Detection, Shortest Path in binary matrix · Recommended time: 90 mins',
      tag: 'DSA Sprint',
      completed: false,
    },
    {
      id: 't-quick-2',
      title: 'Review ACID Properties & Indexing B-Trees for SQL Mock',
      subtitle: 'Core DB diagnostic review with focus on write amplification and isolation levels · Recommended time: 45 mins',
      tag: 'DB & System',
      completed: false,
    },
    {
      id: 't-quick-3',
      title: 'Self-record 2-minute elevator pitch for HR round',
      subtitle: 'Use AI Video simulator to calibrate pacing, tone clarity, and project narrative · Recommended time: 20 mins',
      tag: 'Behavioral',
      completed: false,
    },
  ]);

  const handleRecalculate = () => {
    setIsRecalculating(true);
    setTimeout(() => {
      onRecalculateScore();
      setIsRecalculating(false);
    }, 700);
  };

  const toggleTask = (taskId: string) => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  // Trajectory points mapping
  const trajectoryData = [
    { week: 'W1', score: 42, cx: 50, cy: 185 },
    { week: 'W2', score: 45, cx: 130, cy: 175 },
    { week: 'W3', score: 49, cx: 210, cy: 160 },
    { week: 'W4', score: 54, cx: 290, cy: 140 },
    { week: 'W5', score: 58, cx: 370, cy: 125 },
    { week: 'W6', score: 62, cx: 450, cy: 105 },
    { week: 'W7', score: 64, cx: 530, cy: 95 },
    { week: 'Current', score: student.readinessScore, cx: 620, cy: 70 },
  ];

  return (
    <div className="px-6 sm:px-10 py-8 max-w-[1440px] mx-auto w-full flex flex-col gap-8">
      {/* Welcome Header & Quick Action Hub */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#e7eeff] text-[11px] text-[#3525cd] font-semibold tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3525cd] animate-pulse"></span>
              Sample illustrative data · SDE-1 Profile Baseline
            </span>
            <span className="text-[12px] text-[#464555]">Batch 2025</span>
          </div>
          <h1 className="text-[32px] sm:text-[36px] font-bold text-[#121c2b] tracking-tight">
            Good morning, {student.name}
          </h1>
          <p className="text-[14px] text-[#464555] max-w-2xl">
            Here is your current placement-readiness overview. Last evaluated {student.lastEvaluated} against Tier-1 SDE hiring criteria.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <button
            onClick={handleRecalculate}
            disabled={isRecalculating}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-[#121c2b] hover:bg-[#dee8fe] transition-all shadow-sm text-[13px] font-medium border border-[#e7eeff] disabled:opacity-50"
          >
            <span className={`material-symbols-outlined text-[18px] text-[#464555] ${isRecalculating ? 'animate-spin' : ''}`}>
              refresh
            </span>
            <span>{isRecalculating ? 'Evaluating...' : 'Recalculate Score'}</span>
          </button>

          <button
            onClick={() => onNavigate('what-if-simulator')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-[#121c2b] hover:bg-[#dee8fe] transition-all shadow-sm text-[13px] font-medium border border-[#e7eeff]"
          >
            <span className="material-symbols-outlined text-[18px] text-[#006a61]">tune</span>
            <span>Simulate Changes</span>
          </button>

          <button
            onClick={() => onNavigate('preparation-roadmap')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#4f46e5] text-white hover:bg-[#3525cd] transition-all shadow-md text-[13px] font-semibold active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">alt_route</span>
            <span>View My Roadmap</span>
          </button>
        </div>
      </header>

      {/* Row 1: KPI Metric Cards (4 cards) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Overall Readiness */}
        <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow border border-[#e7eeff]">
          <div className="flex items-start justify-between">
            <span className="text-[12px] font-semibold text-[#464555] uppercase tracking-wider">
              Overall Readiness Score
            </span>
            <span className="w-8 h-8 rounded-full bg-[#4f46e5]/10 flex items-center justify-center text-[#4f46e5]">
              <span className="material-symbols-outlined text-[18px]">speed</span>
            </span>
          </div>
          <div className="my-3 flex items-baseline gap-2">
            <span className="text-[36px] font-bold text-[#121c2b] leading-none">
              {student.readinessScore}
            </span>
            <span className="text-[14px] text-[#464555]">/ 100</span>
            <span className="ml-auto inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#86f2e4]/40 text-[#006f66] text-[11px] font-semibold">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span> +6 pts
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-[#464555]">Batch 75th Percentile: 72</span>
              <span className="text-[#3525cd] font-semibold">94% Target</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#e7eeff] overflow-hidden relative">
              <div
                className="h-full bg-[#4f46e5] rounded-full transition-all duration-700"
                style={{ width: `${student.readinessScore}%` }}
              ></div>
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-[#121c2b]"
                style={{ left: '72%' }}
                title="Campus 75th %ile"
              ></div>
            </div>
          </div>
        </div>

        {/* Card 2: Assessment Coverage */}
        <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow border border-[#e7eeff]">
          <div className="flex items-start justify-between">
            <span className="text-[12px] font-semibold text-[#464555] uppercase tracking-wider">
              Assessment Coverage
            </span>
            <span className="w-8 h-8 rounded-full bg-[#86f2e4]/30 flex items-center justify-center text-[#006a61]">
              <span className="material-symbols-outlined text-[18px]">verified</span>
            </span>
          </div>
          <div className="my-3 flex items-baseline gap-2">
            <span className="text-[36px] font-bold text-[#121c2b] leading-none">
              {student.assessmentCoverage}%
            </span>
            <span className="text-[11px] text-[#006a61] font-semibold ml-2">High Validity</span>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="w-full h-1.5 rounded-full bg-[#e7eeff] overflow-hidden">
              <div
                className="h-full bg-[#006a61] rounded-full transition-all duration-700"
                style={{ width: `${student.assessmentCoverage}%` }}
              ></div>
            </div>
            <p className="text-[12px] text-[#464555] truncate">
              {student.verifiedModulesCount} of {student.totalModulesCount} core modules verified. System design pending.
            </p>
          </div>
        </div>

        {/* Card 3: Strongest Competency */}
        <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow border border-[#e7eeff]">
          <div className="flex items-start justify-between">
            <span className="text-[12px] font-semibold text-[#464555] uppercase tracking-wider">
              Strongest Competency
            </span>
            <span className="w-8 h-8 rounded-full bg-[#e7eeff] flex items-center justify-center text-[#464555]">
              <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
            </span>
          </div>
          <div className="my-3 flex flex-col">
            <span className="text-[16px] font-semibold text-[#121c2b] truncate">
              {student.strongestCompetency}
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-[24px] font-semibold text-[#006a61]">
                {student.strongestScore}
              </span>
              <span className="text-[12px] text-[#464555]">/ 100 benchmark</span>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#86f2e4]/30 text-[#006f66] text-[11px] font-semibold w-fit">
            <span className="material-symbols-outlined text-[14px]">military_tech</span> Top 10% in Batch
          </div>
        </div>

        {/* Card 4: Priority Skill Gap */}
        <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow border border-[#e7eeff]">
          <div className="flex items-start justify-between">
            <span className="text-[12px] font-semibold text-[#ba1a1a] uppercase tracking-wider">
              Priority Skill Gap
            </span>
            <span className="w-8 h-8 rounded-full bg-[#ffdad6]/40 flex items-center justify-center text-[#ba1a1a]">
              <span className="material-symbols-outlined text-[18px]">warning</span>
            </span>
          </div>
          <div className="my-3 flex flex-col">
            <span className="text-[16px] font-semibold text-[#121c2b] truncate">
              {student.priorityGap}
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-[24px] font-semibold text-[#ba1a1a]">
                {student.priorityGapScore}
              </span>
              <span className="text-[12px] text-[#464555]">/ 100 (Threshold: {student.targetGapThreshold})</span>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ffdad6] text-[#93000a] text-[11px] font-medium w-fit">
            <span className="material-symbols-outlined text-[14px]">flag</span> Impacts {student.impactedCompaniesCount} Target Companies
          </div>
        </div>
      </section>

      {/* Row 2: Main Analytics (60/40 Split) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Readiness Trend Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-xl shadow-sm flex flex-col justify-between border border-[#e7eeff]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div className="flex flex-col">
              <span className="text-[16px] font-semibold text-[#121c2b]">Readiness Trajectory</span>
              <span className="text-[12px] text-[#464555]">Performance evolution across mocks & weekly sprints</span>
            </div>
            <div className="flex items-center bg-[#e7eeff] p-0.5 rounded-lg text-[11px]">
              <button
                onClick={() => setActiveTimeRange('30D')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  activeTimeRange === '30D' ? 'bg-white text-[#3525cd] font-semibold shadow-sm' : 'text-[#464555] hover:text-[#121c2b]'
                }`}
              >
                30D
              </button>
              <button
                onClick={() => setActiveTimeRange('60D')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  activeTimeRange === '60D' ? 'bg-white text-[#3525cd] font-semibold shadow-sm' : 'text-[#464555] hover:text-[#121c2b]'
                }`}
              >
                60D (8 Wks)
              </button>
              <button
                onClick={() => setActiveTimeRange('All')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  activeTimeRange === 'All' ? 'bg-white text-[#3525cd] font-semibold shadow-sm' : 'text-[#464555] hover:text-[#121c2b]'
                }`}
              >
                All Time
              </button>
            </div>
          </div>

          {/* SVG Line Chart with Dynamic Points */}
          <div className="relative w-full aspect-[16/8] flex flex-col justify-end">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 700 240">
              <defs>
                <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid Guidelines */}
              <line stroke="#E5E7EF" strokeDasharray="3 3" x1="40" x2="680" y1="30" y2="30" />
              <text fill="#777587" fontSize="11" textAnchor="end" x="30" y="34">80</text>
              <line stroke="#E5E7EF" strokeDasharray="3 3" x1="40" x2="680" y1="90" y2="90" />
              <text fill="#777587" fontSize="11" textAnchor="end" x="30" y="94">65</text>
              <line stroke="#E5E7EF" strokeDasharray="3 3" x1="40" x2="680" y1="150" y2="150" />
              <text fill="#777587" fontSize="11" textAnchor="end" x="30" y="154">50</text>
              <line stroke="#E5E7EF" x1="40" x2="680" y1="210" y2="210" />
              <text fill="#777587" fontSize="11" textAnchor="end" x="30" y="214">35</text>

              {/* Target Baseline Line (75 Tier-1 mark) */}
              <line opacity="0.7" stroke="#006A61" strokeDasharray="4 4" strokeWidth="1.5" x1="40" x2="680" y1="50" y2="50" />
              <text fill="#006A61" fontSize="10" fontWeight="600" textAnchor="end" x="675" y="44">
                Target Threshold (75)
              </text>

              {/* Area Fill */}
              <polygon
                fill="url(#chartGradient)"
                points="50,185 130,175 210,160 290,140 370,125 450,105 530,95 620,70 620,210 50,210"
              />

              {/* Trend Polyline */}
              <polyline
                fill="none"
                points="50,185 130,175 210,160 290,140 370,125 450,105 530,95 620,70"
                stroke="#4F46E5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
              />

              {/* Data Points */}
              {trajectoryData.map((pt, index) => (
                <g
                  key={index}
                  className="cursor-pointer group"
                  onMouseEnter={() => setHoveredPoint({ week: pt.week, score: pt.score })}
                  onMouseLeave={() => setHoveredPoint(null)}
                >
                  <circle
                    cx={pt.cx}
                    cy={pt.cy}
                    fill={pt.week === 'Current' ? '#4F46E5' : '#ffffff'}
                    r={pt.week === 'Current' ? 6 : 4}
                    stroke="#4F46E5"
                    strokeWidth={pt.week === 'Current' ? 2.5 : 2}
                    className={pt.week === 'Current' ? 'animate-pulse' : ''}
                  />
                  <text
                    fill={pt.week === 'Current' ? '#121C2B' : '#777587'}
                    fontSize="11"
                    fontWeight={pt.week === 'Current' ? '600' : 'normal'}
                    textAnchor="middle"
                    x={pt.cx}
                    y={228}
                  >
                    {pt.week}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <div className="mt-4 pt-3 border-t border-[#e7eeff] flex flex-wrap items-center justify-between text-[#464555] text-[12px]">
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-[#4f46e5]"></span> Readiness Score (42 → {student.readinessScore})
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-[#006a61] border-dashed"></span> Tier-1 Cutoff (75)
              </span>
            </div>
            <span className="text-[#006a61] font-semibold">
              {hoveredPoint ? `${hoveredPoint.week}: ${hoveredPoint.score} pts` : '+26 pts overall momentum'}
            </span>
          </div>
        </div>

        {/* Right: Skill Radar Spider Map (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-xl shadow-sm flex flex-col justify-between border border-[#e7eeff]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex flex-col">
              <span className="text-[16px] font-semibold text-[#121c2b]">6-D Competency Radar</span>
              <span className="text-[12px] text-[#464555]">Profile balance across critical domains</span>
            </div>
            <span className="material-symbols-outlined text-[#464555] text-[20px]" title="Visual distribution of your evaluation scores">
              radar
            </span>
          </div>

          {/* Radar Visualization SVG */}
          <div className="relative w-full aspect-square max-h-[290px] mx-auto flex items-center justify-center my-2">
            <svg className="w-full h-full" viewBox="0 0 360 360">
              {/* Concentric Grid Polygons */}
              <polygon fill="none" points="180,60 284,120 284,240 180,300 76,240 76,120" stroke="#E5E7EF" strokeWidth="1" />
              <polygon fill="none" points="180,90 258,135 258,225 180,270 102,225 102,135" stroke="#E5E7EF" strokeWidth="1" />
              <polygon fill="none" points="180,120 232,150 232,210 180,240 128,210 128,150" stroke="#E5E7EF" strokeWidth="1" />
              <polygon fill="none" points="180,150 206,165 206,195 180,210 154,195 154,165" stroke="#E5E7EF" strokeWidth="1" />

              {/* Axis Lines */}
              <line stroke="#E5E7EF" x1="180" x2="180" y1="180" y2="60" />
              <line stroke="#E5E7EF" x1="180" x2="284" y1="180" y2="120" />
              <line stroke="#E5E7EF" x1="180" x2="284" y1="180" y2="240" />
              <line stroke="#E5E7EF" x1="180" x2="180" y1="180" y2="300" />
              <line stroke="#E5E7EF" x1="180" x2="76" y1="180" y2="240" />
              <line stroke="#E5E7EF" x1="180" x2="76" y1="180" y2="120" />

              {/* Benchmark Target Polygon (~75%) */}
              <polygon
                fill="none"
                opacity="0.8"
                points="180,90 258,135 258,225 180,270 102,225 102,135"
                stroke="#86F2E4"
                strokeDasharray="3 2"
                strokeWidth="1.5"
              />

              {/* User Polygon */}
              <polygon
                fill="#4F46E5"
                fillOpacity="0.25"
                points="180,122 259,134 267,230 180,257 99,227 107,138"
                stroke="#4F46E5"
                strokeWidth="2"
              />

              {/* Vertices */}
              <circle cx="180" cy="122" fill="#BA1A1A" r="3.5" />
              <circle cx="259" cy="134" fill="#4F46E5" r="3.5" />
              <circle cx="267" cy="230" fill="#006A61" r="3.5" />
              <circle cx="180" cy="257" fill="#4F46E5" r="3.5" />
              <circle cx="99" cy="227" fill="#4F46E5" r="3.5" />
              <circle cx="107" cy="138" fill="#4F46E5" r="3.5" />

              {/* Axis Labels */}
              <text fill="#BA1A1A" fontSize="10" fontWeight="600" textAnchor="middle" x="180" y="48">
                DSA (48)
              </text>
              <text fill="#464555" fontSize="10" fontWeight="500" textAnchor="start" x="296" y="115">
                Core CS (76)
              </text>
              <text fill="#006A61" fontSize="10" fontWeight="600" textAnchor="start" x="296" y="248">
                SQL/DB (84)
              </text>
              <text fill="#464555" fontSize="10" fontWeight="500" textAnchor="middle" x="180" y="318">
                System Design (64)
              </text>
              <text fill="#464555" fontSize="10" fontWeight="500" textAnchor="end" x="64" y="248">
                Aptitude (78)
              </text>
              <text fill="#464555" fontSize="10" fontWeight="500" textAnchor="end" x="64" y="115">
                Verbal/HR (70)
              </text>
            </svg>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center pt-2 text-[11px]">
            <div className="p-2 rounded-lg bg-[#e7eeff]">
              <span className="text-[#464555] block">Balance Quotient</span>
              <span className="text-[16px] font-semibold text-[#121c2b]">{student.balanceQuotient} / 10</span>
            </div>
            <div className="p-2 rounded-lg bg-[#e7eeff]">
              <span className="text-[#464555] block">Asymmetry Risk</span>
              <span className="text-[16px] font-semibold text-[#ba1a1a]">{student.asymmetryRisk}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Row 3: Category-wise Skill Analysis Breakdown */}
      <section className="bg-white p-6 rounded-xl shadow-sm flex flex-col gap-4 border border-[#e7eeff]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-[20px] font-semibold text-[#121c2b]">Skill Category Diagnostics</h2>
            <p className="text-[12px] text-[#464555]">Benchmark threshold vs tested competence across the 6 core hiring tracks</p>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#006a61]"></span> Ready (≥75)</span>
            <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#4f46e5]"></span> Needs Focus (60–74)</span>
            <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a]"></span> At Risk (&lt;60)</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[680px] flex flex-col gap-3">
            {/* Item 1: DSA */}
            <div className="p-3.5 rounded-lg bg-[#f0f3ff]/60 flex items-center justify-between gap-4 hover:bg-[#e7eeff]/60 transition-colors">
              <div className="w-52 flex flex-col">
                <span className="text-[15px] font-semibold text-[#121c2b]">Programming & DSA</span>
                <span className="text-[12px] text-[#464555]">Trees, Graphs, DP, Arrays</span>
              </div>
              <div className="flex-1 flex flex-col gap-1 max-w-md">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#ba1a1a] font-semibold">48 / 100</span>
                  <span className="text-[#464555]">Required: 75</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#e7eeff] overflow-hidden relative">
                  <div className="h-full bg-[#ba1a1a] rounded-full" style={{ width: '48%' }}></div>
                  <div className="absolute top-0 bottom-0 w-0.5 bg-[#464555]" style={{ left: '75%' }}></div>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#ffdad6] text-[#93000a] text-[11px] font-semibold text-center w-28">
                At Risk
              </span>
              <button
                onClick={() => onNavigate('my-assessment')}
                className="px-3.5 py-1.5 rounded-lg bg-[#4f46e5] text-white hover:bg-[#3525cd] text-[12px] font-medium transition-all"
              >
                Practice Trees
              </button>
            </div>

            {/* Item 2: Core CS & OS */}
            <div className="p-3.5 rounded-lg bg-[#f0f3ff]/60 flex items-center justify-between gap-4 hover:bg-[#e7eeff]/60 transition-colors">
              <div className="w-52 flex flex-col">
                <span className="text-[15px] font-semibold text-[#121c2b]">Core CS & OS</span>
                <span className="text-[12px] text-[#464555]">Concurrency, Memory, Schedulers</span>
              </div>
              <div className="flex-1 flex flex-col gap-1 max-w-md">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#006a61] font-semibold">76 / 100</span>
                  <span className="text-[#464555]">Required: 70</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#e7eeff] overflow-hidden relative">
                  <div className="h-full bg-[#006a61] rounded-full" style={{ width: '76%' }}></div>
                  <div className="absolute top-0 bottom-0 w-0.5 bg-[#464555]" style={{ left: '70%' }}></div>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#86f2e4]/40 text-[#006f66] text-[11px] font-semibold text-center w-28">
                Ready
              </span>
              <button
                onClick={() => onNavigate('preparation-roadmap')}
                className="px-3.5 py-1.5 rounded-lg bg-white text-[#121c2b] hover:bg-[#dee8fe] text-[12px] font-medium transition-all shadow-sm border border-[#e7eeff]"
              >
                Review OS Locks
              </button>
            </div>

            {/* Item 3: SQL & DB */}
            <div className="p-3.5 rounded-lg bg-[#f0f3ff]/60 flex items-center justify-between gap-4 hover:bg-[#e7eeff]/60 transition-colors">
              <div className="w-52 flex flex-col">
                <span className="text-[15px] font-semibold text-[#121c2b]">SQL & DB Schema</span>
                <span className="text-[12px] text-[#464555]">Indexes, Sharding, Joins</span>
              </div>
              <div className="flex-1 flex flex-col gap-1 max-w-md">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#006a61] font-semibold">84 / 100</span>
                  <span className="text-[#464555]">Required: 70</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#e7eeff] overflow-hidden relative">
                  <div className="h-full bg-[#006a61] rounded-full" style={{ width: '84%' }}></div>
                  <div className="absolute top-0 bottom-0 w-0.5 bg-[#464555]" style={{ left: '70%' }}></div>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#86f2e4]/40 text-[#006f66] text-[11px] font-semibold text-center w-28">
                Ready
              </span>
              <button
                onClick={() => onNavigate('career-company-matches')}
                className="px-3.5 py-1.5 rounded-lg bg-white text-[#121c2b] hover:bg-[#dee8fe] text-[12px] font-medium transition-all shadow-sm border border-[#e7eeff]"
              >
                Explore Sharding
              </button>
            </div>

            {/* Item 4: System Design & Projects */}
            <div className="p-3.5 rounded-lg bg-[#f0f3ff]/60 flex items-center justify-between gap-4 hover:bg-[#e7eeff]/60 transition-colors">
              <div className="w-52 flex flex-col">
                <span className="text-[15px] font-semibold text-[#121c2b]">System Design & Projects</span>
                <span className="text-[12px] text-[#464555]">Load Balancers, Microservices</span>
              </div>
              <div className="flex-1 flex flex-col gap-1 max-w-md">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#4f46e5] font-semibold">64 / 100</span>
                  <span className="text-[#464555]">Required: 68</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#e7eeff] overflow-hidden relative">
                  <div className="h-full bg-[#4f46e5] rounded-full" style={{ width: '64%' }}></div>
                  <div className="absolute top-0 bottom-0 w-0.5 bg-[#464555]" style={{ left: '68%' }}></div>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#e2dfff] text-[#3323cc] text-[11px] font-semibold text-center w-28">
                Needs Focus
              </span>
              <button
                onClick={() => onNavigate('my-assessment')}
                className="px-3.5 py-1.5 rounded-lg bg-white text-[#121c2b] hover:bg-[#dee8fe] text-[12px] font-medium transition-all shadow-sm border border-[#e7eeff]"
              >
                Take Mock Test
              </button>
            </div>

            {/* Item 5: Aptitude & Reasoning */}
            <div className="p-3.5 rounded-lg bg-[#f0f3ff]/60 flex items-center justify-between gap-4 hover:bg-[#e7eeff]/60 transition-colors">
              <div className="w-52 flex flex-col">
                <span className="text-[15px] font-semibold text-[#121c2b]">Aptitude & Reasoning</span>
                <span className="text-[12px] text-[#464555]">Quants, Logical, Data Interp</span>
              </div>
              <div className="flex-1 flex flex-col gap-1 max-w-md">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#006a61] font-semibold">78 / 100</span>
                  <span className="text-[#464555]">Required: 70</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#e7eeff] overflow-hidden relative">
                  <div className="h-full bg-[#006a61] rounded-full" style={{ width: '78%' }}></div>
                  <div className="absolute top-0 bottom-0 w-0.5 bg-[#464555]" style={{ left: '70%' }}></div>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#86f2e4]/40 text-[#006f66] text-[11px] font-semibold text-center w-28">
                Ready
              </span>
              <button
                onClick={() => onNavigate('my-assessment')}
                className="px-3.5 py-1.5 rounded-lg bg-white text-[#121c2b] hover:bg-[#dee8fe] text-[12px] font-medium transition-all shadow-sm border border-[#e7eeff]"
              >
                Speed Drill
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Row 4: Priority Actionable Recommendations (3 Cards) */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[20px] font-semibold text-[#121c2b]">Priority Interventions</h2>
            <p className="text-[12px] text-[#464555]">High ROI steps to maximize placement shortlisting probability</p>
          </div>
          <button
            onClick={() => onNavigate('skill-gap-analysis')}
            className="text-[12px] text-[#3525cd] font-semibold hover:underline"
          >
            View All 8 Recommended Actions →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Critical */}
          <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group border border-[#e7eeff]">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#ba1a1a]"></div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#93000a] text-[11px] font-bold uppercase tracking-wider">
                  Critical Priority
                </span>
                <span className="text-[12px] text-[#464555] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">schedule</span> 12 hrs
                </span>
              </div>
              <h3 className="text-[16px] font-semibold text-[#121c2b] mt-1 group-hover:text-[#3525cd] transition-colors">
                Strengthen DSA Fundamentals (DP & Trees)
              </h3>
              <p className="text-[13px] text-[#464555]">
                Failure rate on Dynamic Programming tests is currently 62%. Completing the 14-pattern curriculum will boost score by approx +14 pts.
              </p>
            </div>
            <div className="pt-4 flex items-center justify-between">
              <span className="text-[12px] text-[#006a61] font-semibold">+14 pts impact</span>
              <button
                onClick={() => onNavigate('skill-gap-analysis')}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#4f46e5] text-white hover:bg-[#3525cd] text-[13px] font-medium transition-all"
              >
                <span>View Practice Plan</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Card 2: Medium */}
          <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group border border-[#e7eeff]">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#4f46e5]"></div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-full bg-[#e7eeff] text-[#464555] text-[11px] font-bold uppercase tracking-wider">
                  Medium Priority
                </span>
                <span className="text-[12px] text-[#464555] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">schedule</span> 3 hrs
                </span>
              </div>
              <h3 className="text-[16px] font-semibold text-[#121c2b] mt-1 group-hover:text-[#3525cd] transition-colors">
                Complete System Design Mock Assessment
              </h3>
              <p className="text-[13px] text-[#464555]">
                Your architectural module is currently unverified. Take the 45-minute timed mock on Scalable URL Shortener & Caching patterns.
              </p>
            </div>
            <div className="pt-4 flex items-center justify-between">
              <span className="text-[12px] text-[#464555] font-medium">Verify 100% module</span>
              <button
                onClick={() => onNavigate('my-assessment')}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white text-[#121c2b] hover:bg-[#dee8fe] text-[13px] font-medium transition-all shadow-sm border border-[#e7eeff]"
              >
                <span>Start Test</span>
                <span className="material-symbols-outlined text-[16px]">play_circle</span>
              </button>
            </div>
          </div>

          {/* Card 3: High */}
          <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group border border-[#e7eeff]">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#006a61]"></div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-full bg-[#86f2e4]/40 text-[#006f66] text-[11px] font-bold uppercase tracking-wider">
                  High Priority
                </span>
                <span className="text-[12px] text-[#464555] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">schedule</span> 1.5 hrs
                </span>
              </div>
              <h3 className="text-[16px] font-semibold text-[#121c2b] mt-1 group-hover:text-[#3525cd] transition-colors">
                Resume Impact Bullets (STAR Format)
              </h3>
              <p className="text-[13px] text-[#464555]">
                Automated parser detected missing quantitative outcome metrics in your 2 backend projects. Reframe using Action-Metric phrasing.
              </p>
            </div>
            <div className="pt-4 flex items-center justify-between">
              <span className="text-[12px] text-[#006a61] font-semibold">ATS score: 71 → 88</span>
              <button
                onClick={() => onNavigate('settings')}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white text-[#121c2b] hover:bg-[#dee8fe] text-[13px] font-medium transition-all shadow-sm border border-[#e7eeff]"
              >
                <span>Optimize Resume</span>
                <span className="material-symbols-outlined text-[16px]">magic_button</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Row 5: Preparation Roadmap Preview & Task Engine */}
      <section className="bg-white p-6 rounded-xl shadow-sm flex flex-col gap-6 border border-[#e7eeff]" id="roadmap-section">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#e7eeff] pb-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-[12px] text-[#3525cd] font-semibold">
              <span className="material-symbols-outlined text-[16px]">flag</span>
              <span>PHASE 2: CORE PROBLEM SOLVING & MOCK ENGINE</span>
            </div>
            <h2 className="text-[20px] font-semibold text-[#121c2b] mt-1">
              Active Milestone: Week 3 of 8
            </h2>
            <p className="text-[13px] text-[#464555]">
              Target: Reach DSA benchmark threshold of 65 before on-campus Day 1 hiring drives begin.
            </p>
          </div>

          <div className="flex flex-col gap-1.5 lg:w-72">
            <div className="flex justify-between items-center text-[12px]">
              <span className="text-[#464555] font-medium">Sprint Completion</span>
              <span className="text-[16px] font-bold text-[#3525cd]">65%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#e7eeff] overflow-hidden">
              <div className="h-full bg-[#4f46e5] rounded-full" style={{ width: '65%' }}></div>
            </div>
            <span className="text-[12px] text-[#464555] text-right">4 of 6 sprints validated</span>
          </div>
        </div>

        {/* Actionable Checklist */}
        <div className="flex flex-col gap-3">
          <span className="text-[12px] font-semibold text-[#464555] uppercase tracking-wider">
            Upcoming Execution Tasks
          </span>
          <div className="flex flex-col gap-2.5">
            {tasks.map(task => (
              <label
                key={task.id}
                className="group flex items-start gap-4 p-3.5 rounded-xl bg-[#f0f3ff]/50 hover:bg-[#f0f3ff] transition-colors cursor-pointer border border-transparent hover:border-[#e7eeff]"
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="mt-1 w-4 h-4 rounded text-[#4f46e5] focus:ring-[#4f46e5] cursor-pointer accent-[#4f46e5]"
                />
                <div className="flex flex-col flex-1 min-w-0">
                  <span
                    className={`text-[15px] font-semibold text-[#121c2b] transition-all ${
                      task.completed ? 'line-through text-[#777587]' : ''
                    }`}
                  >
                    {task.title}
                  </span>
                  <span className="text-[12px] text-[#464555]">
                    {task.subtitle}
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-[#e7eeff] text-[11px] text-[#464555] font-medium shrink-0">
                  {task.tag}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1.5 text-[#464555] text-[13px]">
            <span className="material-symbols-outlined text-[16px] text-[#006a61]">check_circle</span>
            <span>Next automated mentor sync in 2 days</span>
          </div>
          <button
            onClick={() => onNavigate('preparation-roadmap')}
            className="inline-flex items-center gap-1 text-[14px] font-semibold text-[#3525cd] hover:text-[#4f46e5] transition-colors"
          >
            <span>Open Full 90-Day Roadmap</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </section>
    </div>
  );
};
