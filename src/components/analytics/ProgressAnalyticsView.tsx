import React, { useState } from 'react';
import { StudentProfile, ViewMode } from '../../types';

interface ProgressAnalyticsViewProps {
  student: StudentProfile;
  onNavigate: (view: ViewMode) => void;
}

export const ProgressAnalyticsView: React.FC<ProgressAnalyticsViewProps> = ({
  student,
  onNavigate,
}) => {
  const [selectedMetric, setSelectedMetric] = useState<'readiness' | 'dsa' | 'sql' | 'hours'>('readiness');

  const cohortPercentiles = [
    { domain: 'SQL & Database Architecture', score: 84, percentile: 92, status: 'Top 8% in Batch', color: 'bg-[#006a61]' },
    { domain: 'Aptitude & Quantitative Logic', score: 78, percentile: 84, status: 'Top 16% in Batch', color: 'bg-[#006a61]' },
    { domain: 'Core CS (OS & Networks)', score: 76, percentile: 75, status: 'Top 25% in Batch', color: 'bg-[#006a61]' },
    { domain: 'Overall Composite Readiness', score: 68, percentile: 78, status: '78th Percentile', color: 'bg-[#4f46e5]' },
    { domain: 'Technical Communication / STAR', score: 70, percentile: 66, status: 'Median Band', color: 'bg-[#4f46e5]' },
    { domain: 'System Design & Projects', score: 64, percentile: 58, status: 'Needs Focus', color: 'bg-[#4f46e5]' },
    { domain: 'Programming & Data Structures', score: 48, percentile: 44, status: 'At Risk Bottleneck', color: 'bg-[#ba1a1a]' },
  ];

  return (
    <div className="px-6 sm:px-10 py-8 max-w-[1440px] mx-auto w-full flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="flex flex-col gap-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#e2dfff] text-[#3525cd] text-[11px] font-semibold uppercase tracking-wider">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              Longitudinal Intelligence Engine
            </span>
            <span className="text-[#464555] text-[12px]">8-Week Continuous Monitoring</span>
          </div>
          <h1 className="text-[32px] sm:text-[36px] font-bold text-[#121c2b] tracking-tight">
            Progress & Longitudinal Analytics
          </h1>
          <p className="text-[14px] text-[#464555] leading-relaxed">
            Detailed telemetry evaluating weekly growth rate, cognitive response timing, and cohort benchmark percentiles against 1,240 students in Batch 2025.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('reports')}
            className="px-4 py-2 bg-white hover:bg-[#dee8fe] text-[#121c2b] text-[13px] font-medium rounded-xl border border-[#e7eeff] shadow-sm transition-all"
          >
            Export Audit Report
          </button>
          <button
            onClick={() => onNavigate('preparation-roadmap')}
            className="px-4 py-2 bg-[#4f46e5] hover:bg-[#3525cd] text-white text-[13px] font-semibold rounded-xl shadow-md transition-all"
          >
            Adjust Roadmap Sprints
          </button>
        </div>
      </div>

      {/* Metric Selector Tabs */}
      <div className="flex items-center gap-2 bg-[#f0f3ff] p-1.5 rounded-xl border border-[#e7eeff] w-fit">
        <button
          onClick={() => setSelectedMetric('readiness')}
          className={`px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
            selectedMetric === 'readiness' ? 'bg-white text-[#3525cd] font-semibold shadow-sm' : 'text-[#464555]'
          }`}
        >
          Overall Readiness (42 → 68)
        </button>
        <button
          onClick={() => setSelectedMetric('dsa')}
          className={`px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
            selectedMetric === 'dsa' ? 'bg-white text-[#3525cd] font-semibold shadow-sm' : 'text-[#464555]'
          }`}
        >
          DSA Trajectory (28 → 48)
        </button>
        <button
          onClick={() => setSelectedMetric('sql')}
          className={`px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
            selectedMetric === 'sql' ? 'bg-white text-[#3525cd] font-semibold shadow-sm' : 'text-[#464555]'
          }`}
        >
          SQL & DB (60 → 84)
        </button>
        <button
          onClick={() => setSelectedMetric('hours')}
          className={`px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
            selectedMetric === 'hours' ? 'bg-white text-[#3525cd] font-semibold shadow-sm' : 'text-[#464555]'
          }`}
        >
          Study Velocity (hrs/wk)
        </button>
      </div>

      {/* Main Chart Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-[#e7eeff] flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-[18px] font-bold text-[#121c2b]">
              Weekly Score Progression vs Cohort 75th Percentile
            </h2>
            <p className="text-[13px] text-[#464555]">
              Demonstrating +26 points of momentum over the past 8 weekly evaluation cycles.
            </p>
          </div>
          <div className="flex items-center gap-4 text-[12px]">
            <span className="flex items-center gap-1.5 text-[#4f46e5] font-semibold">
              <span className="w-3 h-1 bg-[#4f46e5] rounded"></span> Ananya Sharma
            </span>
            <span className="flex items-center gap-1.5 text-[#006a61] font-semibold">
              <span className="w-3 h-1 bg-[#006a61] border-dashed rounded"></span> Tier-1 Cutoff (75)
            </span>
            <span className="flex items-center gap-1.5 text-[#777587]">
              <span className="w-3 h-1 bg-[#c7c4d8] rounded"></span> Batch Median (58)
            </span>
          </div>
        </div>

        {/* Visual Bar Graph */}
        <div className="grid grid-cols-8 gap-3 sm:gap-6 pt-6 pb-2 items-end h-64 border-b border-[#e7eeff]">
          {[
            { label: 'W1', score: 42, median: 40 },
            { label: 'W2', score: 45, median: 44 },
            { label: 'W3', score: 49, median: 47 },
            { label: 'W4', score: 54, median: 50 },
            { label: 'W5', score: 58, median: 52 },
            { label: 'W6', score: 62, median: 55 },
            { label: 'W7', score: 64, median: 57 },
            { label: 'Current', score: 68, median: 58 },
          ].map((bar, i) => (
            <div key={i} className="flex flex-col items-center gap-2 h-full justify-end group">
              <div className="text-[12px] font-bold text-[#4f46e5] group-hover:scale-110 transition-transform">
                {bar.score}
              </div>
              <div className="w-full max-w-[48px] flex items-end justify-center gap-1 h-44 bg-[#f0f3ff] rounded-t-lg p-1 relative">
                {/* User bar */}
                <div
                  className="w-1/2 bg-[#4f46e5] rounded-t transition-all duration-700"
                  style={{ height: `${(bar.score / 100) * 100}%` }}
                ></div>
                {/* Cohort Median bar */}
                <div
                  className="w-1/2 bg-[#c7c4d8] rounded-t transition-all duration-700"
                  style={{ height: `${(bar.median / 100) * 100}%` }}
                  title={`Batch median: ${bar.median}`}
                ></div>
              </div>
              <span
                className={`text-[12px] ${
                  bar.label === 'Current' ? 'font-bold text-[#121c2b]' : 'text-[#777587]'
                }`}
              >
                {bar.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Cohort Percentile Rankings Table */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-[#e7eeff] flex flex-col gap-6">
        <div>
          <h2 className="text-[18px] font-bold text-[#121c2b]">
            Batch 2025 Competency Percentile Distribution
          </h2>
          <p className="text-[13px] text-[#464555]">
            Item Response Theory (IRT) calibrated percentile ranks computed across 1,240 active students.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {cohortPercentiles.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[#f0f3ff]/60 border border-[#dee8fe] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="w-64 flex flex-col">
                <span className="font-semibold text-[14px] text-[#121c2b]">{item.domain}</span>
                <span className="text-[12px] text-[#464555]">Tested Score: {item.score}/100</span>
              </div>

              <div className="flex-1 max-w-md flex flex-col gap-1">
                <div className="flex justify-between text-[11px]">
                  <span className="font-bold text-[#121c2b]">{item.percentile}th Percentile</span>
                  <span className="text-[#464555]">Cohort Top {100 - item.percentile}%</span>
                </div>
                <div className="w-full bg-[#dee8fe] h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: `${item.percentile}%` }}
                  ></div>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-white border border-[#dee8fe] text-[#121c2b] shrink-0 text-center">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
