import React, { useState } from 'react';
import { CompetencyDiagnostic, ViewMode } from '../../types';

interface SkillGapViewProps {
  competencies: CompetencyDiagnostic[];
  onAddSprintToRoadmap: () => void;
  onNavigate: (view: ViewMode) => void;
}

export const SkillGapView: React.FC<SkillGapViewProps> = ({
  competencies: initialCompetencies,
  onAddSprintToRoadmap,
  onNavigate,
}) => {
  const [selectedRole, setSelectedRole] = useState('sde1');
  const [activeFilter, setActiveFilter] = useState<'all' | 'dsa' | 'core-cs' | 'aptitude' | 'soft'>('all');
  const [sortCriterion, setSortCriterion] = useState<'gap-desc' | 'gap-asc' | 'weight' | 'date'>('gap-desc');
  const [isReevaluating, setIsReevaluating] = useState(false);
  const [addedToRoadmap, setAddedToRoadmap] = useState(false);
  const [showCurriculumModal, setShowCurriculumModal] = useState(false);

  const handleReevaluate = () => {
    setIsReevaluating(true);
    setTimeout(() => {
      setIsReevaluating(false);
    }, 600);
  };

  const handleAddToRoadmap = () => {
    onAddSprintToRoadmap();
    setAddedToRoadmap(true);
    setTimeout(() => {
      setAddedToRoadmap(false);
    }, 3500);
  };

  // Filter competencies based on active pill
  let filtered = initialCompetencies.filter(comp => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'dsa') return comp.category === 'dsa';
    if (activeFilter === 'core-cs') return comp.category === 'core-cs' || comp.category === 'databases' || comp.category === 'system-design';
    if (activeFilter === 'aptitude') return comp.category === 'aptitude';
    if (activeFilter === 'soft') return comp.category === 'soft-skills';
    return true;
  });

  // Sort competencies
  filtered.sort((a, b) => {
    if (sortCriterion === 'gap-desc') return a.gapPercent - b.gapPercent; // biggest negative gap first
    if (sortCriterion === 'gap-asc') return b.gapPercent - a.gapPercent;
    if (sortCriterion === 'weight') return b.weight - a.weight;
    return 0;
  });

  return (
    <div className="px-6 sm:px-10 py-8 max-w-[1440px] mx-auto w-full flex flex-col gap-8">
      {/* Top Action / Context Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="flex flex-col gap-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#4f46e5]/10 text-[#3525cd] text-[11px] font-semibold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3525cd] animate-pulse"></span>
              Diagnostic Benchmark Engine
            </span>
            <span className="text-[#464555] text-[12px]">· Cohort 2025 Tier-1 Standard</span>
          </div>
          <h1 className="text-[32px] sm:text-[36px] font-bold text-[#121c2b] tracking-tight">
            Understand Your Skill Gaps
          </h1>
          <p className="text-[14px] text-[#464555] leading-relaxed">
            See where you stand today, benchmark against target job-role requirements, and close the highest-impact gaps first with precision remediation.
          </p>
        </div>

        {/* Configurable Target Role Switcher & Export */}
        <div className="flex flex-wrap items-center gap-2 bg-white p-1.5 rounded-xl shadow-sm border border-[#e7eeff]">
          <div className="relative flex items-center">
            <span className="material-symbols-outlined text-[#3525cd] text-[20px] absolute left-3 pointer-events-none">
              terminal
            </span>
            <select
              value={selectedRole}
              onChange={e => setSelectedRole(e.target.value)}
              className="appearance-none bg-[#f0f3ff] pl-9 pr-8 py-2 rounded-lg text-[13px] text-[#121c2b] font-semibold focus:outline-none cursor-pointer border border-[#dee8fe]"
            >
              <option value="sde1">Software Development Engineer (SDE-1)</option>
              <option value="frontend">Frontend Developer (React/TS)</option>
              <option value="backend">Backend Developer (Distributed Systems)</option>
              <option value="fullstack">Full-Stack Developer</option>
              <option value="data">Data Analyst & BI Specialist</option>
              <option value="ml">Machine Learning Engineer</option>
            </select>
            <span className="material-symbols-outlined text-[#464555] text-[18px] absolute right-2.5 pointer-events-none">
              unfold_more
            </span>
          </div>

          <button
            onClick={handleReevaluate}
            disabled={isReevaluating}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#e7eeff] hover:bg-[#dee8fe] rounded-lg text-[#121c2b] text-[13px] font-medium transition-all"
          >
            <span className={`material-symbols-outlined text-[18px] text-[#464555] ${isReevaluating ? 'animate-spin' : ''}`}>
              sync
            </span>
            <span>{isReevaluating ? 'Recalculating...' : 'Re-evaluate'}</span>
          </button>
        </div>
      </div>

      {/* Diagnostic Summary Banner / Key Metric Mosaic */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Primary Gap Index Metric Card */}
        <div className="md:col-span-4 bg-gradient-to-br from-[#4f46e5] to-[#3525cd] text-white p-6 rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-36 h-36 rounded-full bg-white/10 blur-xl pointer-events-none"></div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-[#dad7ff] font-semibold">
              Net Readiness Deficit
            </span>
            <span className="material-symbols-outlined text-[#dad7ff] text-[20px]">troubleshoot</span>
          </div>

          <div className="my-4 flex items-baseline gap-2">
            <span className="text-[44px] leading-none font-bold tracking-tight">-14</span>
            <span className="text-[13px] text-[#dad7ff]">pts below Target (85)</span>
          </div>

          <div className="flex flex-col gap-1.5 pt-1">
            <div className="flex justify-between text-[11px] text-[#dad7ff]">
              <span>Overall Preparedness</span>
              <span className="font-bold text-white">71% Composite</span>
            </div>
            <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden">
              <div className="bg-[#86f2e4] h-full rounded-full transition-all duration-700" style={{ width: '71%' }}></div>
            </div>
          </div>
        </div>

        {/* Critical Deficit Ticker */}
        <div className="md:col-span-4 bg-white p-6 rounded-xl shadow-sm flex flex-col justify-between border border-[#e7eeff]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a] animate-ping"></span>
              <span className="text-[11px] uppercase tracking-wider text-[#464555] font-semibold">
                Immediate Bottlenecks
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#93000a] text-[11px] font-semibold">
              3 Critical
            </span>
          </div>

          <div className="flex flex-col gap-2.5 my-3">
            <div className="flex items-center justify-between text-[#121c2b]">
              <span className="text-[13px] font-medium flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#ba1a1a] text-[18px]">account_tree</span>
                DSA: Trees, Graphs & DP
              </span>
              <span className="text-[11px] font-bold text-[#ba1a1a] bg-[#ffdad6]/40 px-1.5 py-0.5 rounded">
                -32% Gap
              </span>
            </div>

            <div className="flex items-center justify-between text-[#121c2b]">
              <span className="text-[13px] font-medium flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#ba1a1a] text-[18px]">memory</span>
                OS & Concurrency Semaphores
              </span>
              <span className="text-[11px] font-bold text-[#ba1a1a] bg-[#ffdad6]/40 px-1.5 py-0.5 rounded">
                -13% Gap
              </span>
            </div>

            <div className="flex items-center justify-between text-[#121c2b]">
              <span className="text-[13px] font-medium flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#ba1a1a] text-[18px]">dns</span>
                System Design & Scalability
              </span>
              <span className="text-[11px] font-bold text-[#ba1a1a] bg-[#ffdad6]/40 px-1.5 py-0.5 rounded">
                -15% Gap
              </span>
            </div>
          </div>

          <p className="text-[12px] text-[#464555] truncate">Requires ~24 total targeted review hours</p>
        </div>

        {/* Strengths Exceeding Target Card */}
        <div className="md:col-span-4 bg-white p-6 rounded-xl shadow-sm flex flex-col justify-between border border-[#e7eeff]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#006a61] text-[20px]">verified</span>
              <span className="text-[11px] uppercase tracking-wider text-[#464555] font-semibold">
                Competitive Moats
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#86f2e4]/40 text-[#006f66] text-[11px] font-semibold">
              4 Surpassing
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 my-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#f0f3ff] text-[#121c2b] text-[11px] font-medium">
              <span className="material-symbols-outlined text-[#006a61] text-[16px]">check</span> SQL Subqueries (+9%)
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#f0f3ff] text-[#121c2b] text-[11px] font-medium">
              <span className="material-symbols-outlined text-[#006a61] text-[16px]">check</span> OOP Architecture (+5%)
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#f0f3ff] text-[#121c2b] text-[11px] font-medium">
              <span className="material-symbols-outlined text-[#006a61] text-[16px]">check</span> Quantitative Aptitude (+8%)
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#f0f3ff] text-[#121c2b] text-[11px] font-medium">
              <span className="material-symbols-outlined text-[#006a61] text-[16px]">check</span> Git & Version Control (+12%)
            </span>
          </div>

          <p className="text-[12px] text-[#006a61] font-medium">
            Eligible for fast-track hiring rounds in DB & Core modules
          </p>
        </div>
      </div>

      {/* Filter & Sort Strip */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#f0f3ff] p-2.5 rounded-xl border border-[#e7eeff]">
        {/* Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-all whitespace-nowrap ${
              activeFilter === 'all'
                ? 'bg-white text-[#3525cd] font-semibold shadow-sm'
                : 'text-[#464555] hover:text-[#121c2b]'
            }`}
          >
            All Competencies (8)
          </button>
          <button
            onClick={() => setActiveFilter('dsa')}
            className={`px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-all whitespace-nowrap ${
              activeFilter === 'dsa'
                ? 'bg-white text-[#3525cd] font-semibold shadow-sm'
                : 'text-[#464555] hover:text-[#121c2b]'
            }`}
          >
            Data Structures (1)
          </button>
          <button
            onClick={() => setActiveFilter('core-cs')}
            className={`px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-all whitespace-nowrap ${
              activeFilter === 'core-cs'
                ? 'bg-white text-[#3525cd] font-semibold shadow-sm'
                : 'text-[#464555] hover:text-[#121c2b]'
            }`}
          >
            Core CS & Architecture (4)
          </button>
          <button
            onClick={() => setActiveFilter('aptitude')}
            className={`px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-all whitespace-nowrap ${
              activeFilter === 'aptitude'
                ? 'bg-white text-[#3525cd] font-semibold shadow-sm'
                : 'text-[#464555] hover:text-[#121c2b]'
            }`}
          >
            Aptitude & Logic (1)
          </button>
          <button
            onClick={() => setActiveFilter('soft')}
            className={`px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-all whitespace-nowrap ${
              activeFilter === 'soft'
                ? 'bg-white text-[#3525cd] font-semibold shadow-sm'
                : 'text-[#464555] hover:text-[#121c2b]'
            }`}
          >
            Behavioral & Comm (1)
          </button>
        </div>

        {/* Sorting Options & Legend */}
        <div className="flex items-center gap-4 justify-between sm:justify-end">
          <div className="hidden lg:flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1.5 text-[#464555]">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#4f46e5]"></span> Assessed Level
            </span>
            <span className="flex items-center gap-1.5 text-[#464555]">
              <span className="w-3 h-0.5 bg-[#777587]"></span> Target Cutoff ({selectedRole.toUpperCase()})
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[#464555] text-[11px]">Sort by:</span>
            <select
              value={sortCriterion}
              onChange={e => setSortCriterion(e.target.value as any)}
              className="bg-white text-[#121c2b] text-[12px] font-medium px-2.5 py-1.5 rounded-lg focus:outline-none cursor-pointer shadow-sm border border-[#dee8fe]"
            >
              <option value="gap-desc">Largest Gap First</option>
              <option value="gap-asc">Highest Surplus First</option>
              <option value="weight">Curriculum Weight</option>
              <option value="date">Most Recent Assessment</option>
            </select>
          </div>
        </div>
      </div>

      {/* Comparative Matrix: 8 Competency Diagnostic Cards */}
      <div className="flex flex-col gap-4">
        {filtered.map(comp => {
          const isNegative = comp.gapPercent < 0;
          const isSurplus = comp.gapPercent > 0;
          const isNeutral = comp.gapPercent === 0;

          return (
            <div
              key={comp.id}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col gap-4 border border-[#e7eeff]"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      isNegative
                        ? 'bg-[#ffdad6]/50 text-[#ba1a1a]'
                        : isSurplus
                        ? 'bg-[#86f2e4]/50 text-[#006a61]'
                        : 'bg-[#e7eeff] text-[#464555]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[24px]">
                      {comp.category === 'dsa'
                        ? 'code_blocks'
                        : comp.category === 'databases'
                        ? 'database'
                        : comp.category === 'system-design'
                        ? 'architecture'
                        : comp.category === 'aptitude'
                        ? 'psychology'
                        : comp.category === 'soft-skills'
                        ? 'forum'
                        : 'memory'}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[17px] font-semibold text-[#121c2b]">{comp.title}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          isNegative
                            ? 'bg-[#ffdad6] text-[#93000a]'
                            : isSurplus
                            ? 'bg-[#86f2e4]/60 text-[#006f66]'
                            : 'bg-[#dee8fe] text-[#121c2b]'
                        }`}
                      >
                        {comp.priority}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#e7eeff] text-[11px] text-[#464555]">
                        Weight: {comp.weight}%
                      </span>
                    </div>
                    <span className="text-[12px] text-[#464555] mt-0.5">
                      Assessed via: <strong className="font-semibold text-[#121c2b]">{comp.assessedVia}</strong> · {comp.assessedDate}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end lg:self-center">
                  <div className="text-right">
                    <div
                      className={`text-[24px] font-bold ${
                        isNegative ? 'text-[#ba1a1a]' : isSurplus ? 'text-[#006a61]' : 'text-[#121c2b]'
                      }`}
                    >
                      {comp.gapPercent > 0 ? `+${comp.gapPercent}%` : `${comp.gapPercent}%`}
                    </div>
                    <div className="text-[11px] text-[#464555]">
                      {isNegative ? 'Deficit to Benchmark' : isSurplus ? 'Surplus over Cutoff' : 'Matches Benchmark'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Comparative Dual Visual Bar */}
              <div className="flex flex-col gap-1.5 pt-1">
                <div className="flex justify-between text-[12px]">
                  <span className={`font-semibold ${isNegative ? 'text-[#4f46e5]' : 'text-[#006a61]'}`}>
                    Student Performance: {comp.studentScore}%
                  </span>
                  <span className="font-semibold text-[#464555]">
                    Target Minimum: {comp.targetScore}%
                  </span>
                </div>

                <div className="relative w-full h-4 bg-[#e7eeff] rounded-full overflow-visible">
                  {/* Student Level Bar */}
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      isNegative ? 'bg-[#4f46e5]' : 'bg-[#006a61]'
                    }`}
                    style={{ width: `${comp.studentScore}%` }}
                  ></div>

                  {/* Target Marker Notch */}
                  <div
                    className="absolute top-[-4px] bottom-[-4px] w-1 bg-[#777587] z-10 rounded shadow"
                    style={{ left: `${comp.targetScore}%` }}
                    title={`Target: ${comp.targetScore}%`}
                  >
                    <span className="absolute -top-5 -translate-x-1/2 text-[10px] bg-[#273141] text-[#ebf1ff] px-1 rounded shadow whitespace-nowrap font-medium">
                      {comp.targetScore}% Target
                    </span>
                  </div>
                </div>
              </div>

              {/* AI Diagnostic Box */}
              <div className="bg-[#f0f3ff] p-4 rounded-xl flex items-start gap-3 border border-[#dee8fe]/60">
                <span className="material-symbols-outlined text-[#4f46e5] text-[20px] shrink-0 mt-0.5">
                  smart_toy
                </span>
                <div className="flex flex-col gap-1 flex-1">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-[#3525cd]">
                    AI Diagnostic Analysis
                  </span>
                  <p className="text-[13px] text-[#121c2b] leading-relaxed">
                    {comp.aiDiagnosticAnalysis}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Targeted Action Plan Callout (Prescriptive Remediation) */}
      <div className="relative overflow-hidden bg-white p-6 sm:p-8 rounded-xl shadow-md flex flex-col lg:flex-row items-center justify-between gap-6 border border-[#e7eeff]">
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex w-16 h-16 rounded-2xl bg-[#4f46e5] text-white items-center justify-center shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-[32px]">bolt</span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-[#4f46e5]/10 text-[#3525cd] text-[11px] font-bold uppercase tracking-wider">
                Automated Remediation
              </span>
              <span className="text-[#464555] text-[11px]">High Expected Impact (+18% Score Lift)</span>
            </div>
            <h3 className="text-[20px] font-bold text-[#121c2b]">
              14-Day DSA & Systems Sprint Curated for Ananya
            </h3>
            <p className="text-[14px] text-[#464555] max-w-xl">
              A targeted daily sequence focusing strictly on Graph BFS/DFS, Knapsack DP patterns, and Semaphore synchronization to flip your top 3 gaps into hiring strengths.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
          <button
            onClick={() => setShowCurriculumModal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#e7eeff] hover:bg-[#dee8fe] text-[#121c2b] text-[13px] font-medium transition-all"
          >
            Preview Curriculum
          </button>
          <button
            onClick={handleAddToRoadmap}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all shadow-sm active:scale-95 ${
              addedToRoadmap
                ? 'bg-[#006a61] text-white'
                : 'bg-[#4f46e5] hover:bg-[#3525cd] text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {addedToRoadmap ? 'done_all' : 'add_task'}
            </span>
            <span>{addedToRoadmap ? 'Synced (14 Tasks Created)' : 'Add to My Roadmap'}</span>
          </button>
        </div>
      </div>

      {/* Curriculum Preview Modal */}
      {showCurriculumModal && (
        <div className="fixed inset-0 z-50 bg-[#273141]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-xl w-full rounded-2xl shadow-2xl p-6 flex flex-col gap-4 border border-[#e7eeff] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#e7eeff] pb-3">
              <div>
                <span className="text-[11px] font-semibold text-[#3525cd] uppercase tracking-wider">
                  Remediation Syllabus
                </span>
                <h3 className="text-[18px] font-bold text-[#121c2b]">14-Day Targeted Sprint Breakdown</h3>
              </div>
              <button
                onClick={() => setShowCurriculumModal(false)}
                className="p-1 rounded hover:bg-[#f0f3ff]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-3 text-[13px]">
              <div className="p-3 bg-[#f0f3ff] rounded-xl flex flex-col gap-1">
                <span className="font-semibold text-[#121c2b]">Days 1–4: Graph Fundamentals & Traversal</span>
                <span className="text-[#464555]">Topological Sort, Dijkstra on DAGs, Bipartite matching with cycle prevention.</span>
              </div>
              <div className="p-3 bg-[#f0f3ff] rounded-xl flex flex-col gap-1">
                <span className="font-semibold text-[#121c2b]">Days 5–8: Dynamic Programming 2D Patterns</span>
                <span className="text-[#464555]">0/1 Knapsack, Coin Change II, Longest Common Subsequence state tables.</span>
              </div>
              <div className="p-3 bg-[#f0f3ff] rounded-xl flex flex-col gap-1">
                <span className="font-semibold text-[#121c2b]">Days 9–11: Concurrency & Lock Contention</span>
                <span className="text-[#464555]">Deadlock Banker’s algorithm, Mutex vs Semaphore race-condition proofs in C++/Java.</span>
              </div>
              <div className="p-3 bg-[#f0f3ff] rounded-xl flex flex-col gap-1">
                <span className="font-semibold text-[#121c2b]">Days 12–14: Timed Live Interview Simulation</span>
                <span className="text-[#464555]">Two 45-min peer-matched technical screening mocks + AI speech defense review.</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#e7eeff]">
              <button
                onClick={() => setShowCurriculumModal(false)}
                className="px-4 py-2 bg-[#e7eeff] rounded-xl text-[13px] font-medium text-[#121c2b]"
              >
                Dismiss
              </button>
              <button
                onClick={() => {
                  setShowCurriculumModal(false);
                  handleAddToRoadmap();
                  onNavigate('preparation-roadmap');
                }}
                className="px-4 py-2 bg-[#4f46e5] text-white rounded-xl text-[13px] font-semibold hover:bg-[#3525cd]"
              >
                Activate & Open Roadmap
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
