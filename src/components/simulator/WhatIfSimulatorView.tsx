import React, { useState } from 'react';
import { StudentProfile, ViewMode } from '../../types';
import { simulateWhatIf, CategoryScoreInput } from '../../services/scoringEngine';

interface WhatIfSimulatorViewProps {
  student: StudentProfile;
  onNavigate: (view: ViewMode) => void;
  onApplySimulatedGoals: (dsaDelta: number) => void;
}

export const WhatIfSimulatorView: React.FC<WhatIfSimulatorViewProps> = ({
  student,
  onNavigate,
  onApplySimulatedGoals,
}) => {
  const initialBaseScores: CategoryScoreInput = {
    dsa: 48,
    coreCs: 76,
    sqlDb: 84,
    aptitude: 78,
    systemDesign: 64,
    academicCgpaScaled: 84, // 8.42 CGPA -> ~84
    resumeSoftSkills: 70,
  };

  const [scores, setScores] = useState<CategoryScoreInput>(initialBaseScores);
  const [appliedToast, setAppliedToast] = useState(false);

  // Calculate delta against base
  const deltas = {
    dsa: scores.dsa - initialBaseScores.dsa,
    coreCs: scores.coreCs - initialBaseScores.coreCs,
    sqlDb: scores.sqlDb - initialBaseScores.sqlDb,
    aptitude: scores.aptitude - initialBaseScores.aptitude,
    systemDesign: scores.systemDesign - initialBaseScores.systemDesign,
    resumeSoftSkills: scores.resumeSoftSkills - initialBaseScores.resumeSoftSkills,
  };

  const simulationResult = simulateWhatIf(initialBaseScores, deltas);

  const handleReset = () => {
    setScores(initialBaseScores);
  };

  const handleApply = () => {
    onApplySimulatedGoals(deltas.dsa);
    setAppliedToast(true);
    setTimeout(() => setAppliedToast(false), 3000);
  };

  // Check companies that become newly unlocked
  const unlockedDrives = [];
  if (scores.dsa >= 75 && initialBaseScores.dsa < 75) {
    unlockedDrives.push({ name: 'Amazon SDE-1', cutoff: '75% DSA' });
  }
  if (scores.dsa >= 80 && initialBaseScores.dsa < 80) {
    unlockedDrives.push({ name: 'Atlassian Associate SWE', cutoff: '80% DSA' });
  }
  if (scores.systemDesign >= 70 && initialBaseScores.systemDesign < 70) {
    unlockedDrives.push({ name: 'Razorpay Backend SDE', cutoff: '70% System Design' });
  }
  if (scores.dsa >= 85 && initialBaseScores.dsa < 85) {
    unlockedDrives.push({ name: 'Google SWE University Grad', cutoff: '85% DSA' });
  }

  return (
    <div className="px-6 sm:px-10 py-8 max-w-[1440px] mx-auto w-full flex flex-col gap-8">
      {/* Toast */}
      {appliedToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#006a61] text-white shadow-xl text-[13px] flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-[18px]">verified</span>
          <span>Simulated study goals applied! New tasks scheduled in your Roadmap.</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="flex flex-col gap-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#86f2e4]/40 text-[#006f66] text-[11px] font-semibold uppercase tracking-wider">
              <span className="material-symbols-outlined text-[14px]">tune</span>
              Deterministic Sensitivity Engine
            </span>
            <span className="text-[#464555] text-[12px]">Formula-Locked What-If Projections</span>
          </div>
          <h1 className="text-[32px] sm:text-[36px] font-bold text-[#121c2b] tracking-tight">
            What-If Readiness Simulator
          </h1>
          <p className="text-[14px] text-[#464555] leading-relaxed">
            Test the direct numerical impact of closing targeted skill deficits before committing study time. Does not alter your verified permanent test records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-xl bg-white hover:bg-[#dee8fe] text-[#121c2b] text-[13px] font-medium border border-[#e7eeff] shadow-sm transition-all"
          >
            Reset to Baseline
          </button>
          <button
            onClick={handleApply}
            className="px-5 py-2 rounded-xl bg-[#4f46e5] hover:bg-[#3525cd] text-white text-[13px] font-semibold shadow-md transition-all active:scale-95"
          >
            Apply Goals to Roadmap
          </button>
        </div>
      </div>

      {/* Outcome Projection Mosaic (3 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Baseline vs Simulated */}
        <div className="p-6 rounded-2xl bg-white shadow-sm border border-[#e7eeff] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold text-[#464555] uppercase tracking-wider">
              Projected Readiness
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                simulationResult.scoreDelta > 0
                  ? 'bg-[#86f2e4]/40 text-[#006f66]'
                  : 'bg-[#e7eeff] text-[#464555]'
              }`}
            >
              {simulationResult.scoreDelta > 0 ? `+${simulationResult.scoreDelta} pts` : 'No Change'}
            </span>
          </div>

          <div className="my-4 flex items-baseline justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] text-[#777587]">Current Score</span>
              <span className="text-[32px] font-bold text-[#121c2b] leading-tight">
                {simulationResult.currentScore}
              </span>
            </div>
            <span className="material-symbols-outlined text-[24px] text-[#777587]">trending_flat</span>
            <div className="flex flex-col text-right">
              <span className="text-[11px] text-[#3525cd] font-semibold">Simulated Score</span>
              <span className="text-[36px] font-bold text-[#4f46e5] leading-tight">
                {simulationResult.simulatedScore}
              </span>
            </div>
          </div>

          <div className="w-full bg-[#dee8fe] h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#4f46e5] h-full rounded-full transition-all duration-300"
              style={{ width: `${simulationResult.simulatedScore}%` }}
            ></div>
          </div>
        </div>

        {/* Band Progression */}
        <div className="p-6 rounded-2xl bg-white shadow-sm border border-[#e7eeff] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold text-[#464555] uppercase tracking-wider">
              Eligibility Classification
            </span>
            <span className="material-symbols-outlined text-[#4f46e5] text-[20px]">workspace_premium</span>
          </div>

          <div className="my-3 flex flex-col gap-1">
            <span className="text-[11px] text-[#777587]">Status Band Transition:</span>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-lg bg-[#e7eeff] text-[#3323cc] text-[12px] font-semibold">
                {simulationResult.currentBand}
              </span>
              <span className="material-symbols-outlined text-[16px] text-[#777587]">arrow_forward</span>
              <span className="px-2.5 py-1 rounded-lg bg-[#86f2e4]/40 text-[#006f66] text-[12px] font-bold">
                {simulationResult.simulatedBand}
              </span>
            </div>
          </div>

          <p className="text-[12px] text-[#464555]">
            Passing the 75-point threshold qualifies student for Tier-1 Super Dream recruiter shortlists.
          </p>
        </div>

        {/* Unlocked Companies Callout */}
        <div className="p-6 rounded-2xl bg-white shadow-sm border border-[#e7eeff] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold text-[#464555] uppercase tracking-wider">
              Newly Unlocked Recruiter Bars
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#86f2e4]/40 text-[#006f66] text-[11px] font-semibold">
              {unlockedDrives.length} Unlocked
            </span>
          </div>

          <div className="my-2 flex flex-col gap-1.5">
            {unlockedDrives.length > 0 ? (
              unlockedDrives.map((d, i) => (
                <div key={i} className="flex items-center justify-between text-[12px] p-1.5 bg-[#f0f3ff] rounded-lg">
                  <span className="font-semibold text-[#121c2b]">{d.name}</span>
                  <span className="text-[11px] text-[#006a61] font-medium">{d.cutoff} Met</span>
                </div>
              ))
            ) : (
              <span className="text-[12px] text-[#464555] italic py-2">
                Slide DSA to ≥75% or System Design to ≥70% to unlock Tier-1 Tech drives.
              </span>
            )}
          </div>

          <span className="text-[11px] text-[#006a61] font-medium flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">lock_open</span>
            Automatic eligibility recalculation
          </span>
        </div>
      </div>

      {/* Main Sliders Grid */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-[#e7eeff] flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e7eeff] pb-4">
          <div>
            <h2 className="text-[18px] font-bold text-[#121c2b]">Adjust Simulated Category Performance</h2>
            <p className="text-[13px] text-[#464555]">
              Weighted according to the active institutional scoring policy (DSA: 25%, Core CS: 15%, SQL: 15%, System Design: 15%, Aptitude: 15%).
            </p>
          </div>
          <span className="text-[12px] text-[#3525cd] font-semibold bg-[#e7eeff] px-3 py-1 rounded-lg w-fit">
            Deterministic IRT Weighted Scale
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Slider 1: DSA */}
          <div className="flex flex-col gap-2 p-4 bg-[#f0f3ff]/60 rounded-xl border border-[#dee8fe]">
            <div className="flex justify-between items-center text-[13px]">
              <span className="font-semibold text-[#121c2b] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#ba1a1a] text-[18px]">code_blocks</span>
                Programming & DSA (Weight: 25%)
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[#777587] text-[11px]">Base: 48%</span>
                <span className="font-bold text-[15px] text-[#4f46e5]">{scores.dsa}%</span>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={scores.dsa}
              onChange={e => setScores({ ...scores, dsa: Number(e.target.value) })}
              className="w-full accent-[#4f46e5] h-2 bg-[#dee8fe] rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-[#464555]">
              <span>0% (Untested)</span>
              <span className="text-[#ba1a1a] font-medium">Current: 48%</span>
              <span className="text-[#006a61] font-semibold">Target Cutoff: 80%</span>
            </div>
          </div>

          {/* Slider 2: System Design */}
          <div className="flex flex-col gap-2 p-4 bg-[#f0f3ff]/60 rounded-xl border border-[#dee8fe]">
            <div className="flex justify-between items-center text-[13px]">
              <span className="font-semibold text-[#121c2b] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#ba1a1a] text-[18px]">dns</span>
                System Design & Projects (Weight: 15%)
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[#777587] text-[11px]">Base: 64%</span>
                <span className="font-bold text-[15px] text-[#4f46e5]">{scores.systemDesign}%</span>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={scores.systemDesign}
              onChange={e => setScores({ ...scores, systemDesign: Number(e.target.value) })}
              className="w-full accent-[#4f46e5] h-2 bg-[#dee8fe] rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-[#464555]">
              <span>0%</span>
              <span className="text-[#4f46e5] font-medium">Current: 64%</span>
              <span className="text-[#006a61] font-semibold">Target: 70%</span>
            </div>
          </div>

          {/* Slider 3: Core CS & OS */}
          <div className="flex flex-col gap-2 p-4 bg-[#f0f3ff]/60 rounded-xl border border-[#dee8fe]">
            <div className="flex justify-between items-center text-[13px]">
              <span className="font-semibold text-[#121c2b] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#006a61] text-[18px]">memory</span>
                Core CS & Operating Systems (Weight: 15%)
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[#777587] text-[11px]">Base: 76%</span>
                <span className="font-bold text-[15px] text-[#4f46e5]">{scores.coreCs}%</span>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={scores.coreCs}
              onChange={e => setScores({ ...scores, coreCs: Number(e.target.value) })}
              className="w-full accent-[#4f46e5] h-2 bg-[#dee8fe] rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-[#464555]">
              <span>0%</span>
              <span className="text-[#006a61] font-semibold">Current: 76%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Slider 4: Database & SQL */}
          <div className="flex flex-col gap-2 p-4 bg-[#f0f3ff]/60 rounded-xl border border-[#dee8fe]">
            <div className="flex justify-between items-center text-[13px]">
              <span className="font-semibold text-[#121c2b] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#006a61] text-[18px]">database</span>
                Database Architecture & SQL (Weight: 15%)
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[#777587] text-[11px]">Base: 84%</span>
                <span className="font-bold text-[15px] text-[#4f46e5]">{scores.sqlDb}%</span>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={scores.sqlDb}
              onChange={e => setScores({ ...scores, sqlDb: Number(e.target.value) })}
              className="w-full accent-[#4f46e5] h-2 bg-[#dee8fe] rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-[#464555]">
              <span>0%</span>
              <span className="text-[#006a61] font-semibold">Current: 84%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Slider 5: Aptitude & Reasoning */}
          <div className="flex flex-col gap-2 p-4 bg-[#f0f3ff]/60 rounded-xl border border-[#dee8fe]">
            <div className="flex justify-between items-center text-[13px]">
              <span className="font-semibold text-[#121c2b] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#006a61] text-[18px]">psychology</span>
                Aptitude & Quantitative Logic (Weight: 15%)
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[#777587] text-[11px]">Base: 78%</span>
                <span className="font-bold text-[15px] text-[#4f46e5]">{scores.aptitude}%</span>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={scores.aptitude}
              onChange={e => setScores({ ...scores, aptitude: Number(e.target.value) })}
              className="w-full accent-[#4f46e5] h-2 bg-[#dee8fe] rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-[#464555]">
              <span>0%</span>
              <span className="text-[#006a61] font-semibold">Current: 78%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Slider 6: Soft Skills & Resume */}
          <div className="flex flex-col gap-2 p-4 bg-[#f0f3ff]/60 rounded-xl border border-[#dee8fe]">
            <div className="flex justify-between items-center text-[13px]">
              <span className="font-semibold text-[#121c2b] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#3525cd] text-[18px]">forum</span>
                Verbal Communication & Resume (Weight: 5%)
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[#777587] text-[11px]">Base: 70%</span>
                <span className="font-bold text-[15px] text-[#4f46e5]">{scores.resumeSoftSkills}%</span>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={scores.resumeSoftSkills}
              onChange={e => setScores({ ...scores, resumeSoftSkills: Number(e.target.value) })}
              className="w-full accent-[#4f46e5] h-2 bg-[#dee8fe] rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-[#464555]">
              <span>0%</span>
              <span className="text-[#4f46e5] font-semibold">Current: 70%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
