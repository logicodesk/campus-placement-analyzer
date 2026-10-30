import React from 'react';
import { ViewMode, UserRole } from '../../types';

interface SidebarProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  userRole: UserRole;
  onToggleRole: () => void;
  studentName?: string;
  studentBatch?: string;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  userRole,
  onToggleRole,
  studentName = 'Ananya Sharma',
  studentBatch = 'B.Tech CS · 2025',
  theme = 'light',
  onToggleTheme,
}) => {
  const isPlacementCell = userRole === 'placement_officer';

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-[#f0f3ff] shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between overflow-y-auto border-r border-[#e7eeff]">
      <div className="flex flex-col">
        {/* Logo and Demo Pill */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-[#e7eeff] bg-white">
          <button
            onClick={() => onNavigate('overview')}
            className="flex items-center gap-3 text-left focus:outline-none group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#4f46e5] text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[20px]">analytics</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-[16px] text-[#121c2b] leading-tight">Placement</span>
              <span className="text-[11px] font-medium text-[#464555] tracking-wide leading-tight">Analyzer</span>
            </div>
          </button>
          <span className="px-2 py-0.5 rounded-full bg-[#e7eeff] text-[11px] text-[#3525cd] font-semibold tracking-wider">
            {isPlacementCell ? 'ADMIN' : 'DEMO'}
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 flex flex-col gap-1">
          {!isPlacementCell ? (
            <>
              <button
                onClick={() => onNavigate('overview')}
                className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl transition-all text-left text-[14px] font-medium ${
                  currentView === 'overview'
                    ? 'bg-[#4f46e5] text-white font-semibold shadow-[0_1px_3px_0_rgba(23,32,51,0.08)]'
                    : 'text-[#464555] hover:bg-[#dee8fe] hover:text-[#121c2b]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">dashboard</span>
                <span>Overview</span>
              </button>

              <button
                onClick={() => onNavigate('my-assessment')}
                className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl transition-all text-left text-[14px] font-medium ${
                  currentView === 'my-assessment'
                    ? 'bg-[#4f46e5] text-white font-semibold shadow-[0_1px_3px_0_rgba(23,32,51,0.08)]'
                    : 'text-[#464555] hover:bg-[#dee8fe] hover:text-[#121c2b]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">assignment_turned_in</span>
                <span>My Assessment</span>
              </button>

              <button
                onClick={() => onNavigate('skill-gap-analysis')}
                className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl transition-all text-left text-[14px] font-medium ${
                  currentView === 'skill-gap-analysis'
                    ? 'bg-[#4f46e5] text-white font-semibold shadow-[0_1px_3px_0_rgba(23,32,51,0.08)]'
                    : 'text-[#464555] hover:bg-[#dee8fe] hover:text-[#121c2b]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">radar</span>
                <span>Skill Gap Analysis</span>
              </button>

              <button
                onClick={() => onNavigate('career-company-matches')}
                className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl transition-all text-left text-[14px] font-medium ${
                  currentView === 'career-company-matches'
                    ? 'bg-[#4f46e5] text-white font-semibold shadow-[0_1px_3px_0_rgba(23,32,51,0.08)]'
                    : 'text-[#464555] hover:bg-[#dee8fe] hover:text-[#121c2b]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">domain_verification</span>
                <span>Career & Company Matches</span>
              </button>

              <button
                onClick={() => onNavigate('preparation-roadmap')}
                className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl transition-all text-left text-[14px] font-medium ${
                  currentView === 'preparation-roadmap'
                    ? 'bg-[#4f46e5] text-white font-semibold shadow-[0_1px_3px_0_rgba(23,32,51,0.08)]'
                    : 'text-[#464555] hover:bg-[#dee8fe] hover:text-[#121c2b]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">alt_route</span>
                <span>Preparation Roadmap</span>
              </button>

              <button
                onClick={() => onNavigate('progress-analytics')}
                className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl transition-all text-left text-[14px] font-medium ${
                  currentView === 'progress-analytics'
                    ? 'bg-[#4f46e5] text-white font-semibold shadow-[0_1px_3px_0_rgba(23,32,51,0.08)]'
                    : 'text-[#464555] hover:bg-[#dee8fe] hover:text-[#121c2b]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">trending_up</span>
                <span>Progress & Analytics</span>
              </button>

              <button
                onClick={() => onNavigate('what-if-simulator')}
                className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl transition-all text-left text-[14px] font-medium ${
                  currentView === 'what-if-simulator'
                    ? 'bg-[#4f46e5] text-white font-semibold shadow-[0_1px_3px_0_rgba(23,32,51,0.08)]'
                    : 'text-[#464555] hover:bg-[#dee8fe] hover:text-[#121c2b]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">tune</span>
                <span>What-If Simulator</span>
              </button>

              <button
                onClick={() => onNavigate('reports')}
                className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl transition-all text-left text-[14px] font-medium ${
                  currentView === 'reports'
                    ? 'bg-[#4f46e5] text-white font-semibold shadow-[0_1px_3px_0_rgba(23,32,51,0.08)]'
                    : 'text-[#464555] hover:bg-[#dee8fe] hover:text-[#121c2b]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">description</span>
                <span>Reports</span>
              </button>

              <button
                onClick={() => onNavigate('settings')}
                className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl transition-all text-left text-[14px] font-medium ${
                  currentView === 'settings'
                    ? 'bg-[#4f46e5] text-white font-semibold shadow-[0_1px_3px_0_rgba(23,32,51,0.08)]'
                    : 'text-[#464555] hover:bg-[#dee8fe] hover:text-[#121c2b]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">settings</span>
                <span>Settings</span>
              </button>
            </>
          ) : (
            <>
              <div className="px-3 py-1.5 text-[11px] font-semibold text-[#777587] uppercase tracking-wider">
                Placement Cell Portal
              </div>
              <button
                onClick={() => onNavigate('admin-cohort')}
                className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl transition-all text-left text-[14px] font-medium ${
                  currentView === 'admin-cohort'
                    ? 'bg-[#4f46e5] text-white font-semibold shadow-[0_1px_3px_0_rgba(23,32,51,0.08)]'
                    : 'text-[#464555] hover:bg-[#dee8fe] hover:text-[#121c2b]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">groups</span>
                <span>Cohort Analytics & Gaps</span>
              </button>

              <button
                onClick={() => onNavigate('admin-dataset-ml')}
                className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl transition-all text-left text-[14px] font-medium ${
                  currentView === 'admin-dataset-ml'
                    ? 'bg-[#4f46e5] text-white font-semibold shadow-[0_1px_3px_0_rgba(23,32,51,0.08)]'
                    : 'text-[#464555] hover:bg-[#dee8fe] hover:text-[#121c2b]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">model_training</span>
                <span>ML Lab & CSV Import</span>
              </button>

              <button
                onClick={() => onNavigate('reports')}
                className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl transition-all text-left text-[14px] font-medium ${
                  currentView === 'reports'
                    ? 'bg-[#4f46e5] text-white font-semibold shadow-[0_1px_3px_0_rgba(23,32,51,0.08)]'
                    : 'text-[#464555] hover:bg-[#dee8fe] hover:text-[#121c2b]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">print</span>
                <span>Student Audit Reports</span>
              </button>
            </>
          )}
        </nav>
      </div>

      {/* Bottom Switch Role & Profile Container */}
      <div className="p-4 flex flex-col gap-2 border-t border-[#e7eeff] bg-white/70">
        <div className="flex items-center justify-between px-3.5 py-2 bg-[#dee8fe]/70 rounded-xl">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#464555]">
              {isPlacementCell ? 'school' : 'admin_panel_settings'}
            </span>
            <span className="text-[12px] font-medium text-[#121c2b]">
              {isPlacementCell ? 'Viewing: Officer' : 'Placement Cell'}
            </span>
          </div>
          <button
            onClick={onToggleRole}
            className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] text-[#006a61] bg-[#86f2e4]/40 font-semibold hover:bg-[#86f2e4]/70 transition-colors"
          >
            {isPlacementCell ? 'Student' : 'Switch'}
          </button>
        </div>

        {onToggleTheme && (
          <button
            onClick={onToggleTheme}
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-[#464555] hover:bg-[#dee8fe] hover:text-[#121c2b] transition-all text-[13px] font-medium text-left"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#3525cd]">
                {theme === 'dark' ? 'light_mode' : 'dark_mode'}
              </span>
              <span>{theme === 'dark' ? 'Light Theme' : 'Dark Theme'}</span>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#dee8fe] text-[#3525cd]">
              {theme === 'dark' ? 'DARK' : 'LIGHT'}
            </span>
          </button>
        )}

        <button
          onClick={() => alert('Placement Readiness Support Desk: Reach out to placement@campus.edu or your allocated faculty mentor.')}
          className="flex items-center gap-3.5 px-3.5 py-2 rounded-xl text-[#464555] hover:bg-[#dee8fe] hover:text-[#121c2b] transition-all text-[13px] font-medium text-left"
        >
          <span className="material-symbols-outlined text-[18px]">help_outline</span>
          <span>Help & Support</span>
        </button>

        <div className="flex items-center gap-3 p-2 bg-[#e7eeff] rounded-xl mt-1">
          <img
            alt={studentName}
            className="w-8 h-8 rounded-full object-cover ring-1 ring-white"
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&h=128&q=80"
          />
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[13px] text-[#121c2b] font-semibold truncate leading-tight">
              {studentName}
            </span>
            <span className="text-[11px] text-[#464555] truncate leading-tight">
              {isPlacementCell ? 'TPO Administrator' : studentBatch}
            </span>
          </div>
          <span className="material-symbols-outlined text-[18px] text-[#464555]">
            unfold_more
          </span>
        </div>
      </div>
    </aside>
  );
};
