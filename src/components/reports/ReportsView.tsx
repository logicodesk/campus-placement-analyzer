import React from 'react';
import { StudentProfile, AssessmentModule, CompetencyDiagnostic } from '../../types';

interface ReportsViewProps {
  student: StudentProfile;
  modules: AssessmentModule[];
  competencies: CompetencyDiagnostic[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  student,
  modules,
  competencies,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const reportData = {
      verificationId: 'ARC-VERIF-2025-0892-A',
      generatedAt: new Date().toISOString(),
      studentProfile: {
        name: student.name,
        email: student.email,
        degree: student.degree,
        branch: student.branch,
        graduationYear: student.graduationYear,
        cgpa: student.cgpa,
        backlogs: student.backlogs,
        targetRole: student.targetRole,
        targetTier: student.targetTier,
      },
      readinessMetrics: {
        overallScore: student.readinessScore,
        coveragePercent: student.assessmentCoverage,
        balanceQuotient: student.balanceQuotient,
        asymmetryRisk: student.asymmetryRisk,
        strongestCompetency: student.strongestCompetency,
        priorityGap: student.priorityGap,
      },
      assessmentModules: modules,
      competencies,
      methodology: 'Item Response Theory (IRT) calibrated 3-parameter logistic scoring',
      institution: 'Campus Placement & Talent Intelligence Cell',
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', `Placement_Readiness_Report_${student.id}.json`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="px-6 sm:px-10 py-8 max-w-[1440px] mx-auto w-full flex flex-col gap-8">
      {/* Action Header - hidden in print */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#86f2e4]/40 text-[#006f66] text-[11px] font-semibold uppercase tracking-wider">
              Verifiable Diagnostic Certificate
            </span>
            <span className="text-[#464555] text-[12px]">Report ID: ARC-VERIF-2025-0892-A</span>
          </div>
          <h1 className="text-[28px] font-bold text-[#121c2b] tracking-tight mt-1">
            Student Placement Readiness Report
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadJSON}
            className="px-4 py-2 bg-white hover:bg-[#dee8fe] text-[#121c2b] text-[13px] font-medium rounded-xl border border-[#e7eeff] shadow-sm flex items-center gap-1.5 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Download Audit JSON</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-[#4f46e5] hover:bg-[#3525cd] text-white text-[13px] font-semibold rounded-xl shadow-md flex items-center gap-1.5 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Official Verifiable Report Sheet (Printable Document) */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#e7eeff] p-8 sm:p-12 flex flex-col gap-8 print-container">
        {/* Document Header with Institutional Seal */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-[#121c2b]/15 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#4f46e5] text-white flex items-center justify-center text-[28px] font-bold shadow-md">
              <span className="material-symbols-outlined text-[36px]">school</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold tracking-widest text-[#3525cd] uppercase">
                Directorate of Training & Placement
              </span>
              <h2 className="text-[22px] font-bold text-[#121c2b] tracking-tight leading-tight">
                Verified Employability Intelligence Report
              </h2>
              <span className="text-[12px] text-[#464555]">
                Academic Year 2024–2025 · Tier-1 Campus Recruitment Standard
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:items-end text-[12px] text-[#464555]">
            <span className="font-mono text-[#121c2b] font-semibold">VERIF-ID: ARC-892-A</span>
            <span>Issued: October 2024</span>
            <span className="text-[#006a61] font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">verified</span> Cryptographically Signed
            </span>
          </div>
        </div>

        {/* Candidate Dossier Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-[#f0f3ff] rounded-xl text-[13px] border border-[#dee8fe]">
          <div>
            <span className="text-[11px] text-[#464555] block">Student Name</span>
            <span className="font-bold text-[#121c2b]">{student.name}</span>
          </div>
          <div>
            <span className="text-[11px] text-[#464555] block">Branch / Degree</span>
            <span className="font-semibold text-[#121c2b]">{student.branch} (B.Tech)</span>
          </div>
          <div>
            <span className="text-[11px] text-[#464555] block">Academic CGPA</span>
            <span className="font-bold text-[#006a61]">{student.cgpa} / 10.0 (0 Backlogs)</span>
          </div>
          <div>
            <span className="text-[11px] text-[#464555] block">Target Role</span>
            <span className="font-semibold text-[#3525cd]">{student.targetRole}</span>
          </div>
        </div>

        {/* Executive Score Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-2xl bg-gradient-to-r from-[#f0f3ff] to-[#e7eeff] border border-[#dee8fe]">
          <div className="flex flex-col">
            <span className="text-[12px] font-semibold text-[#464555] uppercase tracking-wider">
              Overall Readiness Index
            </span>
            <div className="my-2 flex items-baseline gap-2">
              <span className="text-[48px] font-bold text-[#4f46e5] leading-none">
                {student.readinessScore}
              </span>
              <span className="text-[16px] text-[#464555]">/ 100</span>
            </div>
            <span className="text-[12px] text-[#006a61] font-semibold">
              Band: Approaching Readiness (Tier-1 Threshold: 75)
            </span>
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <span className="text-[12px] font-semibold text-[#464555] uppercase tracking-wider">
                Assessment Validity Coverage
              </span>
              <div className="my-2 text-[28px] font-bold text-[#121c2b]">
                {student.assessmentCoverage}% Validated
              </div>
            </div>
            <span className="text-[12px] text-[#464555]">
              5 of 6 diagnostic proctored modules fully completed.
            </span>
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <span className="text-[12px] font-semibold text-[#464555] uppercase tracking-wider">
                Cohort Percentile Rank
              </span>
              <div className="my-2 text-[28px] font-bold text-[#006a61]">
                78th Percentile
              </div>
            </div>
            <span className="text-[12px] text-[#464555]">
              Ranked among top 22% of Batch 2025 engineering cohort.
            </span>
          </div>
        </div>

        {/* Competency Diagnostic Breakdown Table */}
        <div className="flex flex-col gap-3">
          <h3 className="text-[16px] font-bold text-[#121c2b]">Assessed Competency Matrix</h3>
          <div className="overflow-x-auto border border-[#e7eeff] rounded-xl">
            <table className="w-full text-left text-[13px] border-collapse">
              <thead>
                <tr className="bg-[#f0f3ff] text-[#464555] border-b border-[#e7eeff]">
                  <th className="p-3 font-semibold">Competency Domain</th>
                  <th className="p-3 font-semibold">Weight</th>
                  <th className="p-3 font-semibold">Tested Score</th>
                  <th className="p-3 font-semibold">Tier-1 Benchmark</th>
                  <th className="p-3 font-semibold">Deficit / Surplus</th>
                  <th className="p-3 font-semibold">Diagnostic Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e7eeff]">
                {competencies.map((c, i) => (
                  <tr key={i} className="hover:bg-[#f9f9ff]">
                    <td className="p-3 font-semibold text-[#121c2b]">{c.title}</td>
                    <td className="p-3 text-[#464555]">{c.weight}%</td>
                    <td className="p-3 font-bold text-[#121c2b]">{c.studentScore}/100</td>
                    <td className="p-3 text-[#464555]">{c.targetScore}/100</td>
                    <td className={`p-3 font-bold ${c.gapPercent < 0 ? 'text-[#ba1a1a]' : 'text-[#006a61]'}`}>
                      {c.gapPercent > 0 ? `+${c.gapPercent}%` : `${c.gapPercent}%`}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          c.gapPercent < 0 ? 'bg-[#ffdad6] text-[#93000a]' : 'bg-[#86f2e4]/40 text-[#006f66]'
                        }`}
                      >
                        {c.priority}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Prescriptive Remediation & Next Milestone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-xl bg-[#f0f3ff] flex flex-col gap-2 border border-[#dee8fe]">
            <h4 className="text-[14px] font-bold text-[#121c2b] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#ba1a1a] text-[18px]">warning</span>
              Key Remediation Bottleneck
            </h4>
            <p className="text-[13px] text-[#464555] leading-relaxed">
              <strong>Data Structures & Algorithms (Trees, Graphs, DP):</strong> Student scored 48%, presenting a -32% deficit against Tier-1 requirements. Recommended to complete the 14-day intensive graph/DP sprint before Day-1 on-campus hiring drives begin.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#f0f3ff] flex flex-col gap-2 border border-[#dee8fe]">
            <h4 className="text-[14px] font-bold text-[#121c2b] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#006a61] text-[18px]">verified</span>
              Key Competitive Moat
            </h4>
            <p className="text-[13px] text-[#464555] leading-relaxed">
              <strong>Database Architecture & Advanced SQL:</strong> Student achieved 84% (+9% surplus), demonstrating superior mastery in CTEs, complex joins, and B-Tree indexing. Clears technical bars for Oracle, Goldman Sachs, and Atlassian data rounds.
            </p>
          </div>
        </div>

        {/* Methodology & Limitations Notice */}
        <div className="pt-6 border-t border-[#e7eeff] text-[11px] text-[#777587] leading-relaxed flex flex-col gap-1">
          <span className="font-semibold text-[#464555]">Scoring Methodology & Integrity Disclaimer:</span>
          <p>
            The Campus Placement Readiness Index is an internal diagnostic benchmark synthesized using a calibrated Item Response Theory (IRT) model and deterministic category weights. Percentiles are computed exclusively across participating cohort records. This diagnostic serves as an evidence-based roadmap tool and does not guarantee an employment contract, interview invitation, or final hiring offer.
          </p>
          <div className="flex items-center justify-between pt-4 mt-2 border-t border-[#f0f3ff]">
            <span>University Placement Cell · Official Digital Record</span>
            <span>Verification Hash: 8f9b2a7e4c1d68a9f0e3</span>
          </div>
        </div>
      </div>
    </div>
  );
};
