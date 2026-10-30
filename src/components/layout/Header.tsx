import React, { useState } from 'react';
import { ViewMode } from '../../types';

interface HeaderProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  targetRole?: string;
  targetTier?: string;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  targetRole = 'SDE 1',
  targetTier = 'Tier-1 Tech',
  theme = 'light',
  onToggleTheme,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const viewTitles: Record<ViewMode, string> = {
    'overview': 'Readiness Intelligence',
    'my-assessment': 'Assessment Centre & Proctored Simulator',
    'skill-gap-analysis': 'Skill Gap Analysis & Benchmarks',
    'career-company-matches': 'Company Matches & Eligibility',
    'preparation-roadmap': 'Preparation Roadmap',
    'progress-analytics': 'Progress & Longitudinal Analytics',
    'what-if-simulator': 'What-If Score Simulator',
    'reports': 'Student Audit & Placement Reports',
    'settings': 'Student Profile & Settings',
    'admin-cohort': 'Placement Cell Cohort Dashboard',
    'admin-dataset-ml': 'Dataset Ingestion & ML Benchmark Lab',
  };

  const sampleSearchItems = [
    { label: 'Data Structures & Algorithms (Trees, DP)', category: 'Skill Gap', view: 'skill-gap-analysis' as ViewMode },
    { label: 'Virtual Memory & Page Faults Simulator', category: 'Assessment', view: 'my-assessment' as ViewMode },
    { label: 'Amazon OA Mock (HackerEarth)', category: 'Roadmap', view: 'preparation-roadmap' as ViewMode },
    { label: 'Morgan Stanley Tech Analyst (Eligibility)', category: 'Company', view: 'career-company-matches' as ViewMode },
    { label: 'What-If Simulation on DSA Score (+14 pts)', category: 'Simulator', view: 'what-if-simulator' as ViewMode },
    { label: 'Full 90-Day Comprehensive Placement Plan', category: 'Roadmap', view: 'preparation-roadmap' as ViewMode },
  ];

  const filteredItems = searchQuery.trim()
    ? sampleSearchItems.filter(
        item =>
          item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : sampleSearchItems;

  return (
    <header className="fixed top-0 left-72 right-0 h-16 bg-[#f9f9ff]/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 px-6 flex items-center justify-between border-b border-[#e7eeff]">
      {/* Breadcrumb & Search */}
      <div className="flex items-center gap-6">
        <nav className="flex items-center gap-1.5 text-[#464555] text-[13px] font-medium">
          <button
            onClick={() => onNavigate('overview')}
            className="hover:text-[#121c2b] transition-colors focus:outline-none"
          >
            Platform
          </button>
          <span className="material-symbols-outlined text-[16px] text-[#777587]">chevron_right</span>
          <span className="text-[#121c2b] font-semibold truncate max-w-xs sm:max-w-md">
            {viewTitles[currentView] || 'Readiness Intelligence'}
          </span>
        </nav>

        {/* Global Search Bar */}
        <div className="relative hidden md:flex items-center w-80">
          <span className="material-symbols-outlined absolute left-3 text-[#777587] text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onFocus={() => setShowSearchModal(true)}
            placeholder="Search skills, roles, assessments (Cmd+K)"
            className="w-full h-9 pl-9 pr-3 rounded-lg bg-white border border-[#c7c4d8]/60 text-[13px] text-[#121c2b] placeholder:text-[#777587] focus:outline-none focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/20"
          />

          {/* Quick Search Dropdown */}
          {showSearchModal && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowSearchModal(false)}
              />
              <div className="absolute top-11 left-0 w-96 bg-white rounded-xl shadow-xl border border-[#e7eeff] p-2 z-50 flex flex-col gap-1 max-h-80 overflow-y-auto">
                <div className="px-2 py-1 text-[11px] font-semibold text-[#777587] uppercase tracking-wider">
                  Quick Navigation & Insights
                </div>
                {filteredItems.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      onNavigate(item.view);
                      setShowSearchModal(false);
                      setSearchQuery('');
                    }}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-[#f0f3ff] text-left transition-colors"
                  >
                    <span className="text-[13px] text-[#121c2b] font-medium truncate">
                      {item.label}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-[#e7eeff] text-[#3525cd] font-semibold shrink-0 ml-2">
                      {item.category}
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Target Badge */}
        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#86f2e4]/30 border border-[#006a61]/20">
          <span className="material-symbols-outlined text-[#006a61] text-[16px]">flag</span>
          <span className="text-[11px] font-semibold text-[#006a61]">
            Target: {targetRole} @ {targetTier}
          </span>
        </div>

        {/* Theme Toggle Button */}
        {onToggleTheme && (
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg text-[#464555] hover:bg-[#dee8fe] hover:text-[#121c2b] transition-all focus:outline-none flex items-center justify-center"
            title={theme === 'dark' ? 'Switch to Light mode' : 'Switch to Dark mode'}
            aria-label="Toggle dark/light mode"
          >
            <span className="material-symbols-outlined text-[20px] text-[#3525cd]">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
        )}

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-[#464555] hover:bg-[#dee8fe] hover:text-[#121c2b] transition-colors focus:outline-none"
            title="Notifications"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ba1a1a] ring-2 ring-white animate-pulse"></span>
          </button>

          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 top-11 w-80 bg-white rounded-xl shadow-xl border border-[#e7eeff] p-3 z-50 flex flex-col gap-2">
                <div className="flex items-center justify-between border-b border-[#e7eeff] pb-2">
                  <span className="text-[13px] font-semibold text-[#121c2b]">Placement Alerts</span>
                  <span className="text-[11px] text-[#3525cd] font-medium">3 New</span>
                </div>
                <div className="flex flex-col gap-2 text-[12px]">
                  <div className="p-2 rounded-lg bg-[#f0f3ff] flex flex-col gap-0.5">
                    <span className="font-semibold text-[#121c2b]">Amazon Campus Drive Announced</span>
                    <span className="text-[#464555]">Drive starts Oct 14. Minimum eligibility: 7.0 CGPA & 0 backlogs.</span>
                    <span className="text-[10px] text-[#777587] mt-1">2 hours ago</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#ffdad6]/40 flex flex-col gap-0.5">
                    <span className="font-semibold text-[#ba1a1a]">DSA Diagnostic Retake Available</span>
                    <span className="text-[#464555]">Your score (48/100) has 2 remaining retake attempts.</span>
                    <span className="text-[10px] text-[#777587] mt-1">Yesterday</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#e7eeff]/60 flex flex-col gap-0.5">
                    <span className="font-semibold text-[#006a61]">Mentor Evaluation Sync Scheduled</span>
                    <span className="text-[#464555]">Automated placement progress sync in 2 days.</span>
                    <span className="text-[10px] text-[#777587] mt-1">2 days ago</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Continue Assessment Primary CTA */}
        <button
          onClick={() => onNavigate('my-assessment')}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#4f46e5] text-white text-[13px] font-semibold hover:bg-[#3525cd] transition-all shadow-[0_1px_2px_0_rgba(23,32,51,0.08)] active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">play_arrow</span>
          <span>Continue Assessment</span>
        </button>

        {/* Profile Avatar */}
        <button
          onClick={() => onNavigate('settings')}
          className="flex items-center gap-1 pl-1 focus:outline-none"
          title="Account Settings"
        >
          <img
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover ring-1 ring-[#c7c4d8]"
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&h=128&q=80"
          />
          <span className="material-symbols-outlined text-[#464555] text-[18px]">
            expand_more
          </span>
        </button>
      </div>
    </header>
  );
};
