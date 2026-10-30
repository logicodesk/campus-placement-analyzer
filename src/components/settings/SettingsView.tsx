import React, { useState } from 'react';
import { StudentProfile } from '../../types';

interface SettingsViewProps {
  student: StudentProfile;
  onUpdateProfile: (updated: Partial<StudentProfile>) => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  student,
  onUpdateProfile,
  theme = 'light',
  onToggleTheme,
}) => {
  const [name, setName] = useState(student.name);
  const [cgpa, setCgpa] = useState(String(student.cgpa));
  const [backlogs, setBacklogs] = useState(String(student.backlogs));
  const [targetRole, setTargetRole] = useState(student.targetRole);
  const [weeklyHours, setWeeklyHours] = useState(String(student.weeklyTargetHours));
  const [atsScore, setAtsScore] = useState(71);
  const [isScanning, setIsScanning] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name,
      cgpa: parseFloat(cgpa) || student.cgpa,
      backlogs: parseInt(backlogs, 10) || 0,
      targetRole,
      weeklyTargetHours: parseInt(weeklyHours, 10) || 14,
    });
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const handleSimulateAtsScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setAtsScore(88);
      setIsScanning(false);
    }, 800);
  };

  return (
    <div className="px-6 sm:px-10 py-8 max-w-[1440px] mx-auto w-full flex flex-col gap-8 relative">
      {/* Toast */}
      {savedToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#006a61] text-white shadow-xl text-[13px] flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>Student profile & preferences successfully updated!</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-1.5 max-w-2xl">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#e7eeff] text-[#3525cd] text-[11px] font-semibold uppercase tracking-wider">
            <span className="material-symbols-outlined text-[14px]">settings</span>
            Profile & Credentials
          </span>
          <span className="text-[#464555] text-[12px]">Campus Dossier Configuration</span>
        </div>
        <h1 className="text-[32px] sm:text-[36px] font-bold text-[#121c2b] tracking-tight">
          Student Profile & Settings
        </h1>
        <p className="text-[14px] text-[#464555] leading-relaxed">
          Manage your verified academic records, target career aspirations, and optimize your resume for automated applicant tracking systems (ATS).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Academic & Target Profile (7 Cols) */}
        <form
          onSubmit={handleSave}
          className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-[#e7eeff] flex flex-col gap-6"
        >
          <div className="border-b border-[#e7eeff] pb-4">
            <h2 className="text-[18px] font-bold text-[#121c2b]">Academic & Career Information</h2>
            <p className="text-[13px] text-[#464555]">
              Used by the Placement Cell to calculate corporate eligibility cutoffs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-semibold text-[#121c2b]">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="h-10 px-3 rounded-lg border border-[#c7c4d8] text-[13px] focus:outline-none focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/20"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-semibold text-[#121c2b]">College Email (Read-Only)</label>
              <input
                type="email"
                value={student.email}
                disabled
                className="h-10 px-3 rounded-lg border border-[#dee8fe] bg-[#f0f3ff] text-[13px] text-[#464555] cursor-not-allowed"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-semibold text-[#121c2b]">Cumulative CGPA</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={cgpa}
                onChange={e => setCgpa(e.target.value)}
                className="h-10 px-3 rounded-lg border border-[#c7c4d8] text-[13px] focus:outline-none focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/20"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-semibold text-[#121c2b]">Active Backlogs</label>
              <input
                type="number"
                min="0"
                value={backlogs}
                onChange={e => setBacklogs(e.target.value)}
                className="h-10 px-3 rounded-lg border border-[#c7c4d8] text-[13px] focus:outline-none focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/20"
              />
            </div>

            <div className="sm:col-span-2 flex flex-col gap-1">
              <label className="text-[12px] font-semibold text-[#121c2b]">Degree & Department</label>
              <input
                type="text"
                value={student.degree}
                disabled
                className="h-10 px-3 rounded-lg border border-[#dee8fe] bg-[#f0f3ff] text-[13px] text-[#464555] cursor-not-allowed"
              />
            </div>

            <div className="sm:col-span-2 flex flex-col gap-1">
              <label className="text-[12px] font-semibold text-[#121c2b]">Primary Target Role</label>
              <select
                value={targetRole}
                onChange={e => setTargetRole(e.target.value)}
                className="h-10 px-3 rounded-lg border border-[#c7c4d8] text-[13px] focus:outline-none focus:border-[#4f46e5] bg-white cursor-pointer"
              >
                <option value="Software Development Engineer (SDE-1)">Software Development Engineer (SDE-1)</option>
                <option value="Frontend Developer (React/TS)">Frontend Developer (React/TS)</option>
                <option value="Backend Developer (Distributed Systems)">Backend Developer (Distributed Systems)</option>
                <option value="Full-Stack Developer">Full-Stack Developer</option>
                <option value="Data Analyst & BI Specialist">Data Analyst & BI Specialist</option>
                <option value="Machine Learning Engineer">Machine Learning Engineer</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-semibold text-[#121c2b]">Weekly Study Commitment (hrs)</label>
              <input
                type="number"
                min="7"
                max="35"
                value={weeklyHours}
                onChange={e => setWeeklyHours(e.target.value)}
                className="h-10 px-3 rounded-lg border border-[#c7c4d8] text-[13px] focus:outline-none focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/20"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-semibold text-[#121c2b]">Graduation Cohort</label>
              <input
                type="text"
                value={`${student.graduationYear} (Batch 2021-2025)`}
                disabled
                className="h-10 px-3 rounded-lg border border-[#dee8fe] bg-[#f0f3ff] text-[13px] text-[#464555] cursor-not-allowed"
              />
            </div>
          </div>

          {/* Appearance & Color Theme Selection */}
          <div className="pt-4 border-t border-[#e7eeff] flex flex-col gap-3">
            <div>
              <span className="text-[14px] font-bold text-[#121c2b] block">Interface Theme</span>
              <span className="text-[12px] text-[#464555]">Select between Light and Dark mode</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  if (theme === 'dark' && onToggleTheme) onToggleTheme();
                }}
                className={`p-3.5 rounded-xl border text-left flex flex-col gap-2 transition-all ${
                  theme === 'light'
                    ? 'border-[#4f46e5] bg-[#e7eeff]/60 shadow-sm ring-2 ring-[#4f46e5]/20'
                    : 'border-[#dee8fe] bg-white hover:bg-[#f0f3ff]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="material-symbols-outlined text-[20px] text-[#3525cd]">
                    light_mode
                  </span>
                  {theme === 'light' && (
                    <span className="material-symbols-outlined text-[18px] text-[#3525cd]">
                      check_circle
                    </span>
                  )}
                </div>
                <div>
                  <span className="font-semibold text-[13px] text-[#121c2b] block">Light Theme</span>
                  <span className="text-[11px] text-[#464555]">Clean ivory & precision indigo</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (theme === 'light' && onToggleTheme) onToggleTheme();
                }}
                className={`p-3.5 rounded-xl border text-left flex flex-col gap-2 transition-all ${
                  theme === 'dark'
                    ? 'border-[#4f46e5] bg-[#1e293b] shadow-sm ring-2 ring-[#4f46e5]/40'
                    : 'border-[#dee8fe] bg-white hover:bg-[#f0f3ff]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="material-symbols-outlined text-[20px] text-[#818cf8]">
                    dark_mode
                  </span>
                  {theme === 'dark' && (
                    <span className="material-symbols-outlined text-[18px] text-[#818cf8]">
                      check_circle
                    </span>
                  )}
                </div>
                <div>
                  <span className="font-semibold text-[13px] text-[#121c2b] block">Dark Theme</span>
                  <span className="text-[11px] text-[#464555]">Deep midnight navy & high-contrast accents</span>
                </div>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-[#e7eeff] flex items-center justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#4f46e5] text-white hover:bg-[#3525cd] text-[13px] font-semibold shadow-md transition-all active:scale-95"
            >
              Save Changes
            </button>
          </div>
        </form>

        {/* Right Panel: Resume ATS Parser & Quality Checker (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-[#e7eeff] flex flex-col gap-6">
          <div className="border-b border-[#e7eeff] pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-[18px] font-bold text-[#121c2b]">ATS Resume Readiness</h2>
              <p className="text-[12px] text-[#464555]">Automated parser & keyword coverage</p>
            </div>
            <span className="material-symbols-outlined text-[#4f46e5] text-[24px]">description</span>
          </div>

          {/* Current Uploaded Resume Status */}
          <div className="p-4 rounded-xl bg-[#f0f3ff] border border-[#dee8fe] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#dee8fe] text-[#3525cd] flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">picture_as_pdf</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-semibold text-[#121c2b]">Ananya_Sharma_SDE_2025.pdf</span>
                <span className="text-[11px] text-[#464555]">Uploaded 4 days ago · 142 KB</span>
              </div>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded bg-[#86f2e4]/40 text-[#006f66] font-semibold">
              Verified
            </span>
          </div>

          {/* Score Indicator */}
          <div className="flex flex-col gap-2 p-4 bg-[#f9f9ff] rounded-xl border border-[#e7eeff]">
            <div className="flex justify-between items-center text-[13px]">
              <span className="font-semibold text-[#121c2b]">ATS Shortlist Score</span>
              <span className={`font-bold text-[18px] ${atsScore >= 80 ? 'text-[#006a61]' : 'text-[#3525cd]'}`}>
                {atsScore} / 100
              </span>
            </div>
            <div className="w-full bg-[#dee8fe] h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  atsScore >= 80 ? 'bg-[#006a61]' : 'bg-[#4f46e5]'
                }`}
                style={{ width: `${atsScore}%` }}
              ></div>
            </div>
            <span className="text-[11px] text-[#464555]">
              {atsScore >= 80
                ? 'High Tier-1 Match: Project bullets incorporate STAR quantitative outcome metrics.'
                : 'Action required: Add quantitative metrics to your 2 backend project descriptions.'}
            </span>
          </div>

          {/* Keyword Recommendations */}
          <div className="flex flex-col gap-2">
            <span className="text-[12px] font-semibold text-[#121c2b]">Missing High-Yield Recruiter Keywords</span>
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2.5 py-1 rounded bg-[#ffdad6]/50 text-[#93000a] text-[11px] font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">add</span> Redis Caching
              </span>
              <span className="px-2.5 py-1 rounded bg-[#ffdad6]/50 text-[#93000a] text-[11px] font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">add</span> Docker Containerization
              </span>
              <span className="px-2.5 py-1 rounded bg-[#ffdad6]/50 text-[#93000a] text-[11px] font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">add</span> B-Tree Indexing
              </span>
              <span className="px-2.5 py-1 rounded bg-[#86f2e4]/30 text-[#006f66] text-[11px] font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">check</span> REST APIs
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSimulateAtsScan}
            disabled={isScanning}
            className="w-full py-2.5 rounded-xl bg-[#e7eeff] hover:bg-[#dee8fe] text-[#3525cd] text-[13px] font-semibold transition-all flex items-center justify-center gap-2"
          >
            <span className={`material-symbols-outlined text-[18px] ${isScanning ? 'animate-spin' : ''}`}>
              magic_button
            </span>
            <span>{isScanning ? 'Re-parsing Resume...' : 'Auto-Refactor STAR Bullets & Rescan'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
