import React, { useState } from 'react';
import { CompanyMatch, StudentProfile, ViewMode } from '../../types';

interface CompanyMatchesViewProps {
  companies: CompanyMatch[];
  student: StudentProfile;
  onNavigate: (view: ViewMode) => void;
  onToggleBookmark: (id: string) => void;
}

export const CompanyMatchesView: React.FC<CompanyMatchesViewProps> = ({
  companies: initialCompanies,
  student,
  onNavigate,
  onToggleBookmark,
}) => {
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompanyModal, setSelectedCompanyModal] = useState<CompanyMatch | null>(null);

  const filtered = initialCompanies.filter(comp => {
    const matchesTier = tierFilter === 'all' || comp.tier === tierFilter;
    const matchesSearch =
      comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTier && matchesSearch;
  });

  return (
    <div className="px-6 sm:px-10 py-8 max-w-[1440px] mx-auto w-full flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="flex flex-col gap-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#86f2e4]/40 text-[#006f66] text-[11px] font-semibold uppercase tracking-wider">
              <span className="material-symbols-outlined text-[14px]">domain_verification</span>
              Recruiter Requirement Engine
            </span>
            <span className="text-[#464555] text-[12px]">Campus Placement Season 2024-25</span>
          </div>
          <h1 className="text-[32px] sm:text-[36px] font-bold text-[#121c2b] tracking-tight">
            Career & Company Matches
          </h1>
          <p className="text-[14px] text-[#464555] leading-relaxed">
            Transparent compatibility scores benchmarking your verified assessment skills against verified recruitment criteria for 14 Tier-1 and campus marquee recruiters.
          </p>
        </div>

        {/* Quick Stats Pill */}
        <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-[#e7eeff] shrink-0">
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold uppercase text-[#464555]">Eligible Drives</span>
            <span className="text-[20px] font-bold text-[#006a61]">
              {initialCompanies.filter(c => c.isEligible).length} / {initialCompanies.length} Companies
            </span>
          </div>
          <div className="h-8 w-px bg-[#e7eeff]"></div>
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold uppercase text-[#464555]">Your Academic Cutoff</span>
            <span className="text-[13px] font-semibold text-[#121c2b]">
              CGPA {student.cgpa} · {student.backlogs} Backlogs (Cleared)
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-3 rounded-xl border border-[#e7eeff] shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setTierFilter('all')}
            className={`px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-all whitespace-nowrap ${
              tierFilter === 'all'
                ? 'bg-[#4f46e5] text-white shadow-sm'
                : 'text-[#464555] hover:bg-[#f0f3ff]'
            }`}
          >
            All Companies ({initialCompanies.length})
          </button>
          <button
            onClick={() => setTierFilter('Tier-1 Tech')}
            className={`px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-all whitespace-nowrap ${
              tierFilter === 'Tier-1 Tech'
                ? 'bg-[#4f46e5] text-white shadow-sm'
                : 'text-[#464555] hover:bg-[#f0f3ff]'
            }`}
          >
            Tier-1 Tech
          </button>
          <button
            onClick={() => setTierFilter('Tier-1 Fintech')}
            className={`px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-all whitespace-nowrap ${
              tierFilter === 'Tier-1 Fintech'
                ? 'bg-[#4f46e5] text-white shadow-sm'
                : 'text-[#464555] hover:bg-[#f0f3ff]'
            }`}
          >
            Tier-1 Fintech
          </button>
          <button
            onClick={() => setTierFilter('High-Growth Tech')}
            className={`px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-all whitespace-nowrap ${
              tierFilter === 'High-Growth Tech'
                ? 'bg-[#4f46e5] text-white shadow-sm'
                : 'text-[#464555] hover:bg-[#f0f3ff]'
            }`}
          >
            High-Growth
          </button>
          <button
            onClick={() => setTierFilter('Mass Premier')}
            className={`px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-all whitespace-nowrap ${
              tierFilter === 'Mass Premier'
                ? 'bg-[#4f46e5] text-white shadow-sm'
                : 'text-[#464555] hover:bg-[#f0f3ff]'
            }`}
          >
            Mass Premier
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <span className="material-symbols-outlined text-[18px] text-[#777587] absolute left-3 top-2.5">
            search
          </span>
          <input
            type="text"
            placeholder="Search company or role..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-lg bg-[#f0f3ff] text-[13px] focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/30 border border-[#dee8fe]"
          />
        </div>
      </div>

      {/* Company Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(comp => {
          const isHighMatch = comp.matchScore >= 80;
          const isModerate = comp.matchScore >= 65 && comp.matchScore < 80;

          return (
            <div
              key={comp.id}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between border border-[#e7eeff] relative group"
            >
              <div>
                {/* Header with Logo Initials & Bookmark */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-[20px] font-bold shadow-sm ${comp.logoBg}`}
                    >
                      {comp.logoInitial}
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-[17px] font-bold text-[#121c2b]">{comp.name}</h3>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#e7eeff] text-[#3525cd]">
                          {comp.tier}
                        </span>
                      </div>
                      <span className="text-[12px] text-[#464555]">{comp.role}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleBookmark(comp.id)}
                    className="p-1.5 rounded-lg hover:bg-[#f0f3ff] text-[#777587] hover:text-[#4f46e5] transition-colors"
                    title={comp.isBookmarked ? 'Bookmarked' : 'Bookmark Company'}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {comp.isBookmarked ? 'bookmark' : 'bookmark_border'}
                    </span>
                  </button>
                </div>

                {/* Compensation & Drive Meta */}
                <div className="grid grid-cols-2 gap-2 my-4 p-3 bg-[#f0f3ff] rounded-xl text-[12px]">
                  <div>
                    <span className="text-[#464555] block text-[11px]">CTC Package:</span>
                    <span className="font-bold text-[#006a61]">{comp.packageLpa}</span>
                  </div>
                  <div>
                    <span className="text-[#464555] block text-[11px]">Drive Date:</span>
                    <span className="font-semibold text-[#121c2b]">{comp.driveDate}</span>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-[#dee8fe] flex items-center justify-between text-[11px] text-[#464555]">
                    <span>Platform: {comp.assessmentPlatform}</span>
                    <span>Min CGPA: {comp.minCgpa}</span>
                  </div>
                </div>

                {/* Compatibility Progress */}
                <div className="flex flex-col gap-1.5 my-3">
                  <div className="flex justify-between items-center text-[12px]">
                    <span className="font-semibold text-[#464555]">Skill Match Compatibility</span>
                    <span
                      className={`font-bold text-[14px] ${
                        isHighMatch ? 'text-[#006a61]' : isModerate ? 'text-[#3525cd]' : 'text-[#ba1a1a]'
                      }`}
                    >
                      {comp.matchScore}%
                    </span>
                  </div>
                  <div className="w-full bg-[#e7eeff] h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isHighMatch ? 'bg-[#006a61]' : isModerate ? 'bg-[#4f46e5]' : 'bg-[#ba1a1a]'
                      }`}
                      style={{ width: `${comp.matchScore}%` }}
                    ></div>
                  </div>
                </div>

                {/* Skill Checklist Tags */}
                <div className="flex flex-col gap-1.5 my-3">
                  <span className="text-[11px] font-semibold uppercase text-[#464555]">Key Skill Check</span>
                  <div className="flex flex-wrap gap-1.5">
                    {comp.requiredSkills.slice(0, 3).map((skill, idx) => (
                      <span
                        key={idx}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] ${
                          skill.matched
                            ? 'bg-[#86f2e4]/30 text-[#006f66]'
                            : 'bg-[#ffdad6]/50 text-[#93000a]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[13px]">
                          {skill.matched ? 'check' : 'close'}
                        </span>
                        {skill.name}
                      </span>
                    ))}
                    {comp.requiredSkills.length > 3 && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#e7eeff] text-[#464555]">
                        +{comp.requiredSkills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-[#f0f3ff] flex items-center justify-between">
                <span className="text-[11px] text-[#006a61] font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span>
                  Academic Eligible
                </span>
                <button
                  onClick={() => setSelectedCompanyModal(comp)}
                  className="px-3.5 py-1.5 bg-[#e7eeff] hover:bg-[#dee8fe] text-[#3525cd] text-[12px] font-semibold rounded-lg transition-colors flex items-center gap-1"
                >
                  <span>View Details</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Company Detail Modal */}
      {selectedCompanyModal && (
        <div className="fixed inset-0 z-50 bg-[#273141]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl shadow-2xl p-6 flex flex-col gap-4 border border-[#e7eeff] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#e7eeff] pb-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-[18px] font-bold ${selectedCompanyModal.logoBg}`}
                >
                  {selectedCompanyModal.logoInitial}
                </div>
                <div className="flex flex-col">
                  <h3 className="text-[18px] font-bold text-[#121c2b]">{selectedCompanyModal.name}</h3>
                  <span className="text-[12px] text-[#464555]">{selectedCompanyModal.role}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedCompanyModal(null)}
                className="p-1 rounded hover:bg-[#f0f3ff]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-[13px] bg-[#f0f3ff] p-3.5 rounded-xl">
              <div>
                <span className="text-[#464555] block text-[11px]">Location</span>
                <span className="font-medium text-[#121c2b]">{selectedCompanyModal.location}</span>
              </div>
              <div>
                <span className="text-[#464555] block text-[11px]">Package</span>
                <span className="font-bold text-[#006a61]">{selectedCompanyModal.packageLpa}</span>
              </div>
              <div>
                <span className="text-[#464555] block text-[11px]">Drive Date</span>
                <span className="font-medium text-[#121c2b]">{selectedCompanyModal.driveDate}</span>
              </div>
              <div>
                <span className="text-[#464555] block text-[11px]">Platform</span>
                <span className="font-medium text-[#121c2b]">{selectedCompanyModal.assessmentPlatform}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <h4 className="text-[14px] font-semibold text-[#121c2b]">Detailed Skill Requirements Breakdown</h4>
              <div className="flex flex-col gap-2">
                {selectedCompanyModal.requiredSkills.map((s, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-[#f9f9ff] border border-[#e7eeff] flex items-center justify-between text-[12px]"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`material-symbols-outlined text-[16px] ${
                          s.matched ? 'text-[#006a61]' : 'text-[#ba1a1a]'
                        }`}
                      >
                        {s.matched ? 'check_circle' : 'cancel'}
                      </span>
                      <span className="font-medium text-[#121c2b]">{s.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#464555]">Your score: {s.studentScore}%</span>
                      <span className="font-semibold text-[#121c2b]">(Req: {s.requiredScore}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedCompanyModal.missingCritical.length > 0 && (
              <div className="p-3 rounded-xl bg-[#ffdad6]/40 border border-[#ba1a1a]/20 flex flex-col gap-1">
                <span className="text-[11px] font-bold text-[#ba1a1a] uppercase tracking-wider">
                  Critical Remediation Focus
                </span>
                {selectedCompanyModal.missingCritical.map((msg, idx) => (
                  <p key={idx} className="text-[12px] text-[#93000a]">
                    • {msg}
                  </p>
                ))}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#e7eeff]">
              <button
                onClick={() => setSelectedCompanyModal(null)}
                className="px-4 py-2 bg-[#e7eeff] rounded-xl text-[13px] font-medium text-[#121c2b]"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedCompanyModal(null);
                  onNavigate('skill-gap-analysis');
                }}
                className="px-4 py-2 bg-[#4f46e5] text-white rounded-xl text-[13px] font-semibold hover:bg-[#3525cd]"
              >
                Close Gap in Simulator
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
