import React, { useState } from 'react';
import { RoadmapTask, StudentProfile, ViewMode } from '../../types';

interface RoadmapViewProps {
  student: StudentProfile;
  tasks: RoadmapTask[];
  onToggleTask: (taskId: string) => void;
  onUpdateWeeklyHours: (hours: number) => void;
  onNavigate: (view: ViewMode) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  student,
  tasks: initialTasks,
  onToggleTask,
  onUpdateWeeklyHours,
  onNavigate,
}) => {
  const [activePlan, setActivePlan] = useState<'30' | '60' | '90'>('90');
  const [selectedDomain, setSelectedDomain] = useState<'all' | 'dsa' | 'core' | 'interview'>('all');
  const [showHoursModal, setShowHoursModal] = useState(false);
  const [sliderHours, setSliderHours] = useState(student.weeklyTargetHours || 14);
  const [selectedTaskModal, setSelectedTaskModal] = useState<RoadmapTask | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleDownloadIcs = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Placement Analyzer//Roadmap Sync//EN
CALSCALE:GREGORIAN
BEGIN:VEVENT
SUMMARY:DSA Graph BFS/DFS Practice
DESCRIPTION:Topological Sort and DAG Shortest Path
DTSTART:20250815T090000Z
DTEND:20250815T110000Z
STATUS:CONFIRMED
END:VEVENT
BEGIN:VEVENT
SUMMARY:SQL Advanced Indexing & Query Plan
DESCRIPTION:EXPLAIN ANALYZE execution trees and B-Tree indexes
DTSTART:20250816T140000Z
DTEND:20250816T153000Z
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'placement-study-schedule.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Calendar .ics file downloaded!');
  };

  const handleSaveHours = () => {
    onUpdateWeeklyHours(sliderHours);
    setShowHoursModal(false);
    showToast(`Weekly study target updated to ${sliderHours}h/week! Schedule re-calibrated.`);
  };

  // Filter tasks by domain
  const filteredTasks = initialTasks.filter(t => {
    if (selectedDomain === 'all') return true;
    if (selectedDomain === 'dsa') return t.category === 'dsa';
    if (selectedDomain === 'core') return t.category === 'core';
    if (selectedDomain === 'interview') return t.category === 'interview';
    return true;
  });

  const week3Tasks = filteredTasks.filter(t => t.week === 3);
  const week4Tasks = filteredTasks.filter(t => t.week === 4);
  const week5Tasks = filteredTasks.filter(t => t.week === 5);

  const completedCount = initialTasks.filter(t => t.isCompleted).length;
  const progressPercent = Math.round((completedCount / initialTasks.length) * 100);

  return (
    <div className="px-6 sm:px-10 py-8 max-w-[1440px] mx-auto w-full flex flex-col gap-8 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#121c2b] text-white shadow-xl text-[13px] flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-[18px] text-[#86f2e4]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col gap-4 bg-white p-6 sm:p-8 rounded-2xl shadow-sm relative overflow-hidden border border-[#e7eeff]">
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-[#e2dfff]/30 blur-3xl pointer-events-none"></div>

        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-[#3525cd] text-[11px] font-semibold tracking-wider uppercase">
              <span className="inline-block w-2 h-2 rounded-full bg-[#3525cd]"></span>
              <span>AI-Calibrated Study Schedule</span>
            </div>
            <h1 className="text-[32px] sm:text-[36px] font-bold text-[#121c2b] tracking-tight">
              Your Placement Preparation Roadmap
            </h1>
            <p className="text-[14px] text-[#464555] max-w-2xl">
              Adaptive multi-week schedule generated based on your diagnosed skill gaps and target placement date. Automatically balances DSA depth, CS essentials, and behavioral mocks.
            </p>
          </div>

          {/* Plan Switcher & Utility Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="inline-flex p-1 bg-[#dee8fe] rounded-xl">
              <button
                onClick={() => {
                  setActivePlan('30');
                  showToast('Switched to 30 Days Intensive track.');
                }}
                className={`px-3.5 py-1.5 rounded-lg text-[13px] transition-all font-medium ${
                  activePlan === '30'
                    ? 'bg-white text-[#3525cd] shadow-sm font-semibold'
                    : 'text-[#464555] hover:text-[#121c2b]'
                }`}
              >
                30 Days Intensive
              </button>
              <button
                onClick={() => {
                  setActivePlan('60');
                  showToast('Switched to 60 Days Standard track.');
                }}
                className={`px-3.5 py-1.5 rounded-lg text-[13px] transition-all font-medium ${
                  activePlan === '60'
                    ? 'bg-white text-[#3525cd] shadow-sm font-semibold'
                    : 'text-[#464555] hover:text-[#121c2b]'
                }`}
              >
                60 Days Standard
              </button>
              <button
                onClick={() => {
                  setActivePlan('90');
                  showToast('Switched to 90 Days Comprehensive track.');
                }}
                className={`px-3.5 py-1.5 rounded-lg text-[13px] transition-all font-medium ${
                  activePlan === '90'
                    ? 'bg-white text-[#3525cd] shadow-sm font-semibold'
                    : 'text-[#464555] hover:text-[#121c2b]'
                }`}
              >
                90 Days Comprehensive
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowHoursModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#dee8fe] hover:bg-[#d9e3f9] text-[#121c2b] text-[13px] font-medium rounded-xl transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px] text-[#3525cd]">schedule</span>
                <span>{student.weeklyTargetHours}h/week</span>
              </button>

              <button
                onClick={handleDownloadIcs}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#dee8fe] hover:bg-[#d9e3f9] text-[#121c2b] text-[13px] font-medium rounded-xl transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">calendar_add_on</span>
                <span className="hidden md:inline">Sync .ics</span>
              </button>

              <button
                onClick={() => showToast('Roadmap regenerated and synchronized with latest diagnostic scores!')}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#4f46e5] text-white hover:bg-[#3525cd] text-[13px] font-semibold rounded-xl transition-all shadow-sm active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">autorenew</span>
                <span className="hidden md:inline">Regenerate</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Snapshot Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Roadmap Progress */}
        <div className="p-6 rounded-xl bg-white shadow-sm flex flex-col justify-between border border-[#e7eeff]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] font-semibold text-[#464555] uppercase tracking-wider">
              Overall Progress
            </span>
            <span className="material-symbols-outlined text-[#3525cd] text-[20px]">flag_circle</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[36px] font-bold text-[#121c2b] leading-none">
              {progressPercent}%
            </span>
            <span className="text-[13px] text-[#464555] font-medium">
              {completedCount} / {initialTasks.length} tasks
            </span>
          </div>
          <div className="mt-4 w-full bg-[#dee8fe] h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#4f46e5] h-full rounded-full transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <span className="text-[12px] text-[#006a61] font-medium mt-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">trending_up</span> +6 tasks ahead of median pace
          </span>
        </div>

        {/* Card 2: Current Phase */}
        <div className="p-6 rounded-xl bg-white shadow-sm flex flex-col justify-between border border-[#e7eeff]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] font-semibold text-[#464555] uppercase tracking-wider">
              Active Cycle
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#e2dfff] text-[#3525cd] text-[11px] font-semibold">
              Phase 2 of 4
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[16px] font-semibold text-[#121c2b] line-clamp-1">
              Problem Solving & Tech Interviews
            </span>
            <span className="text-[12px] text-[#464555] mt-1">
              Focus: High-concurrency DSA & SQL profiling
            </span>
          </div>
          <div className="flex items-center gap-2 mt-4 pt-2 border-t border-[#f0f3ff]">
            <div className="flex -space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#006a61]"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#4f46e5]"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#dee8fe]"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#dee8fe]"></span>
            </div>
            <span className="text-[11px] text-[#464555]">Step 11 of 24 in Phase</span>
          </div>
        </div>

        {/* Card 3: Weekly Output */}
        <div className="p-6 rounded-xl bg-white shadow-sm flex flex-col justify-between border border-[#e7eeff]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] font-semibold text-[#464555] uppercase tracking-wider">
              Weekly Output
            </span>
            <div className="flex items-center gap-1 text-[#006a61] text-[11px] font-semibold">
              <span className="material-symbols-outlined text-[16px]">local_fire_department</span>
              <span>{student.streakDays} Days Streak</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[36px] font-bold text-[#121c2b] leading-none">
              {student.weeklyHoursLogged}
            </span>
            <span className="text-[13px] text-[#464555]">/ {student.weeklyTargetHours} target hrs logged</span>
          </div>
          <div className="grid grid-cols-7 gap-1 mt-4 items-center">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
              <div
                key={idx}
                className={`h-6 rounded flex items-center justify-center text-[10px] font-semibold ${
                  idx < 5 ? 'bg-[#4f46e5] text-white' : 'bg-[#dee8fe] text-[#464555]'
                }`}
              >
                {day}
              </div>
            ))}
          </div>
          <span className="text-[12px] text-[#464555] mt-2">
            {Math.max(0, student.weeklyTargetHours - student.weeklyHoursLogged)}h remaining for weekend
          </span>
        </div>

        {/* Card 4: Target Horizon */}
        <div className="p-6 rounded-xl bg-gradient-to-br from-[#4f46e5] via-[#3525cd] to-[#3323cc] text-white shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-[#dad7ff] font-semibold">
              Target Horizon
            </span>
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-white text-[11px] font-semibold">
              Tier-1 Drives
            </span>
          </div>
          <div className="my-2">
            <div className="text-[36px] font-bold leading-none">{student.daysToTargetDrive} Days</div>
            <p className="text-[12px] text-[#dad7ff] mt-1 font-medium leading-snug">
              {student.targetDriveCompany}
            </p>
          </div>
          <div className="flex items-center justify-between text-[#dad7ff] text-[12px]">
            <span>Drive starts: {student.targetDriveDate}</span>
            <span className="material-symbols-outlined text-[16px] text-white">arrow_forward</span>
          </div>
        </div>
      </div>

      {/* Domain Filtering Strip */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[13px] text-[#464555] mr-1">Filter Domain:</span>
          <button
            onClick={() => setSelectedDomain('all')}
            className={`px-3 py-1.5 rounded-lg text-[13px] transition-all ${
              selectedDomain === 'all'
                ? 'bg-white text-[#3525cd] font-semibold shadow-sm border border-[#e7eeff]'
                : 'bg-[#e7eeff] text-[#464555] hover:bg-[#dee8fe]'
            }`}
          >
            All Modules
          </button>
          <button
            onClick={() => setSelectedDomain('dsa')}
            className={`px-3 py-1.5 rounded-lg text-[13px] transition-all ${
              selectedDomain === 'dsa'
                ? 'bg-white text-[#3525cd] font-semibold shadow-sm border border-[#e7eeff]'
                : 'bg-[#e7eeff] text-[#464555] hover:bg-[#dee8fe]'
            }`}
          >
            Data Structures & Algo
          </button>
          <button
            onClick={() => setSelectedDomain('core')}
            className={`px-3 py-1.5 rounded-lg text-[13px] transition-all ${
              selectedDomain === 'core'
                ? 'bg-white text-[#3525cd] font-semibold shadow-sm border border-[#e7eeff]'
                : 'bg-[#e7eeff] text-[#464555] hover:bg-[#dee8fe]'
            }`}
          >
            CS Fundamentals
          </button>
          <button
            onClick={() => setSelectedDomain('interview')}
            className={`px-3 py-1.5 rounded-lg text-[13px] transition-all ${
              selectedDomain === 'interview'
                ? 'bg-white text-[#3525cd] font-semibold shadow-sm border border-[#e7eeff]'
                : 'bg-[#e7eeff] text-[#464555] hover:bg-[#dee8fe]'
            }`}
          >
            Soft Skills & Mocks
          </button>
        </div>

        <div className="flex items-center gap-2 text-[#464555] text-[13px]">
          <span className="material-symbols-outlined text-[18px] text-[#006a61]">verified</span>
          <span>AI Auto-balancing active</span>
        </div>
      </div>

      {/* Roadmap Vertical Execution Tree */}
      <div className="flex flex-col gap-10 relative">
        {/* Background Connecting Line */}
        <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-[#dee8fe] -z-0"></div>

        {/* WEEK 3: CURRENT WEEK SPRINT */}
        {week3Tasks.length > 0 && (
          <div className="flex flex-col gap-4 relative z-10">
            {/* Week Group Header Node */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#4f46e5] text-white flex items-center justify-center text-[18px] font-bold shadow-md ring-4 ring-[#f9f9ff]">
                3
              </div>
              <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-4">
                <h2 className="text-[20px] font-semibold text-[#121c2b]">
                  Week 3: Deep Dive into Graphs & SQL Transactions
                </h2>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#86f2e4]/40 text-[#006f66] text-[11px] font-semibold">
                  Current Sprint · 75% Target Completion
                </span>
              </div>
            </div>

            {/* Task Cards Grid */}
            <div className="ml-0 sm:ml-16 grid grid-cols-1 gap-4">
              {week3Tasks.map(task => (
                <div
                  key={task.id}
                  className="p-5 rounded-xl bg-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:shadow-md border border-[#e7eeff]"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <button
                      onClick={() => onToggleTask(task.id)}
                      className={`mt-1 w-5 h-5 rounded flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                        task.isCompleted
                          ? 'bg-[#4f46e5] text-white'
                          : 'bg-[#dee8fe] text-transparent hover:text-[#464555]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">check</span>
                    </button>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded text-[11px] bg-[#e7eeff] text-[#121c2b] font-medium">
                          {task.domainLabel}
                        </span>
                        {task.isCompleted ? (
                          <span className="text-[11px] text-[#006a61] font-medium flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[14px]">done_all</span> Done yesterday
                          </span>
                        ) : task.dueNotice ? (
                          <span className="text-[11px] text-[#ba1a1a] bg-[#ffdad6] px-2 py-0.5 rounded font-medium flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[13px]">alarm</span> {task.dueNotice}
                          </span>
                        ) : (
                          <span className="text-[11px] text-[#464555]">Est. {task.estimatedHours}h</span>
                        )}
                      </div>
                      <h3
                        className={`text-[16px] font-semibold mt-1 transition-all ${
                          task.isCompleted ? 'line-through text-[#777587]' : 'text-[#121c2b]'
                        }`}
                      >
                        {task.title}
                      </h3>
                      <p className="text-[13px] text-[#464555] mt-0.5">
                        {task.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 justify-between md:justify-end">
                    {task.loggedHours && (
                      <div className="flex items-center gap-1 text-[#464555] text-[12px]">
                        <span className="material-symbols-outlined text-[16px]">timelapse</span>
                        <span>{task.loggedHours}h logged</span>
                      </div>
                    )}
                    <button
                      onClick={() => setSelectedTaskModal(task)}
                      className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-all ${
                        task.isCompleted
                          ? 'bg-[#e7eeff] text-[#121c2b] hover:bg-[#dee8fe]'
                          : 'bg-[#4f46e5] text-white hover:bg-[#3525cd] shadow-sm'
                      }`}
                    >
                      {task.detailsData.actionLabel}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* WEEK 4: UPCOMING SPRINT */}
        {week4Tasks.length > 0 && (
          <div className="flex flex-col gap-4 relative z-10 opacity-95">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#dee8fe] text-[#464555] flex items-center justify-center text-[18px] font-bold shadow-sm ring-4 ring-[#f9f9ff]">
                4
              </div>
              <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-4">
                <h2 className="text-[20px] font-semibold text-[#121c2b]">
                  Week 4: Dynamic Programming & System Architecture Basics
                </h2>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#e7eeff] text-[#464555] text-[11px] font-semibold">
                  Starts Monday, Aug 19
                </span>
              </div>
            </div>

            <div className="ml-0 sm:ml-16 grid grid-cols-1 md:grid-cols-2 gap-4">
              {week4Tasks.map(task => (
                <div
                  key={task.id}
                  className="p-5 rounded-xl bg-white shadow-sm flex flex-col justify-between gap-4 hover:shadow-md transition-all border border-[#e7eeff]"
                >
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[11px] bg-[#e7eeff] text-[#464555] font-medium">
                        {task.domainLabel}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[11px] bg-[#ffdad6] text-[#93000a] font-semibold">
                        {task.tags[0]}
                      </span>
                    </div>
                    <h3 className="text-[16px] font-semibold text-[#121c2b] mt-1">
                      {task.title}
                    </h3>
                    <p className="text-[13px] text-[#464555]">
                      {task.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#f0f3ff]">
                    <span className="text-[12px] text-[#464555]">{task.tags[1]}</span>
                    <button
                      onClick={() => setSelectedTaskModal(task)}
                      className="text-[#3525cd] hover:underline text-[13px] font-semibold flex items-center gap-1"
                    >
                      Details <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* WEEK 5: TARGET COMPANY SPECIFIC SIMULATION */}
        {week5Tasks.length > 0 && (
          <div className="flex flex-col gap-4 relative z-10 opacity-90">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#dee8fe] text-[#464555] flex items-center justify-center text-[18px] font-bold shadow-sm ring-4 ring-[#f9f9ff]">
                5
              </div>
              <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-4">
                <h2 className="text-[20px] font-semibold text-[#121c2b]">
                  Week 5: Company-Specific Previous Year Drive Challenges
                </h2>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#e7eeff] text-[#464555] text-[11px] font-semibold">
                  Starts Monday, Aug 26
                </span>
              </div>
            </div>

            <div className="ml-0 sm:ml-16 bg-white p-6 sm:p-8 rounded-xl shadow-sm flex flex-col gap-6 border border-[#e7eeff]">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <h3 className="text-[17px] font-semibold text-[#121c2b]">
                    Target Recruiter Pattern Deep Dive
                  </h3>
                  <p className="text-[13px] text-[#464555]">
                    Simulated assessment environments mirror past drive timings and test platforms.
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-[#dee8fe] text-[#121c2b] text-[11px] font-medium">
                    Amazon (HackerEarth)
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#dee8fe] text-[#121c2b] text-[11px] font-medium">
                    Morgan Stanley
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#dee8fe] text-[#121c2b] text-[11px] font-medium">
                    Infosys Specialist
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {week5Tasks.map(task => (
                  <div
                    key={task.id}
                    className="p-4 rounded-xl bg-[#f0f3ff] flex flex-col justify-between gap-3 border border-[#dee8fe]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#d9e3f9] flex items-center justify-center text-[#3525cd] font-bold text-[16px]">
                        {task.domainLabel.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[13px] font-semibold text-[#121c2b]">{task.domainLabel}</span>
                        <span className="text-[11px] text-[#464555]">{task.tags[0]}</span>
                      </div>
                    </div>
                    <p className="text-[12px] text-[#464555]">{task.description}</p>
                    <button
                      onClick={() => setSelectedTaskModal(task)}
                      className="w-full py-2 bg-[#d9e3f9] hover:bg-[#dee8fe] text-[#121c2b] text-[12px] font-medium rounded-lg transition-colors text-center"
                    >
                      Preview OA Paper
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Task Detail Modal */}
      {selectedTaskModal && (
        <div className="fixed inset-0 z-50 bg-[#273141]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl shadow-2xl p-6 flex flex-col gap-4 border border-[#e7eeff] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#e2dfff] text-[#3525cd]">
                {selectedTaskModal.detailsData.category}
              </span>
              <button
                onClick={() => setSelectedTaskModal(null)}
                className="p-1 rounded-lg hover:bg-[#f0f3ff] text-[#464555]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-1">
              <h3 className="text-[18px] font-bold text-[#121c2b]">{selectedTaskModal.title}</h3>
              <p className="text-[13px] text-[#464555]">{selectedTaskModal.detailsData.description}</p>
            </div>

            <div className="p-4 rounded-xl bg-[#f0f3ff] flex flex-col gap-1 border border-[#dee8fe]">
              <span className="text-[11px] font-semibold text-[#464555] uppercase tracking-wider">
                Placement Benchmark Insight
              </span>
              <p className="text-[12px] text-[#121c2b]">{selectedTaskModal.detailsData.benchmarkNote}</p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedTaskModal(null)}
                className="px-4 py-2 rounded-xl bg-[#e7eeff] hover:bg-[#dee8fe] text-[#121c2b] text-[13px] font-medium"
              >
                Dismiss
              </button>
              <button
                onClick={() => {
                  setSelectedTaskModal(null);
                  onNavigate('my-assessment');
                }}
                className="px-4 py-2 rounded-xl bg-[#4f46e5] text-white hover:bg-[#3525cd] text-[13px] font-semibold shadow-sm"
              >
                Launch Module
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Adjust Weekly Hours Modal */}
      {showHoursModal && (
        <div className="fixed inset-0 z-50 bg-[#273141]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl p-6 flex flex-col gap-4 border border-[#e7eeff] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-[18px] font-bold text-[#121c2b]">Adjust Weekly Commitment</h3>
              <button
                onClick={() => setShowHoursModal(false)}
                className="p-1 rounded-lg hover:bg-[#f0f3ff] text-[#464555]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <p className="text-[13px] text-[#464555]">
              Modifying your study capacity re-balances daily problem volume without delaying your milestone target.
            </p>

            <div className="flex flex-col gap-3 my-2">
              <div className="flex justify-between items-center text-[13px] text-[#121c2b]">
                <span>
                  Weekly Target: <span className="font-bold text-[#3525cd]">{sliderHours}</span> Hours
                </span>
                <span className="text-[#464555]">~{Math.round((sliderHours / 7) * 10) / 10}h / day</span>
              </div>

              <input
                type="range"
                min="7"
                max="28"
                step="1"
                value={sliderHours}
                onChange={e => setSliderHours(Number(e.target.value))}
                className="w-full accent-[#4f46e5] h-2 bg-[#dee8fe] rounded-lg cursor-pointer"
              />

              <div className="flex justify-between text-[#464555] text-[11px]">
                <span>7h (Light)</span>
                <span>14h (Balanced)</span>
                <span>28h (Intense)</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={handleSaveHours}
                className="w-full py-2.5 rounded-xl bg-[#4f46e5] text-white hover:bg-[#3525cd] text-[13px] font-semibold transition-all shadow-sm text-center"
              >
                Update Schedule & Recalibrate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
