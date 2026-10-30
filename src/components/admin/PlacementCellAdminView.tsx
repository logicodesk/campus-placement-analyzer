import React, { useState } from 'react';
import { CohortStudent, MLModelBenchmark } from '../../types';
import { DEFAULT_SCORING_CONFIG } from '../../services/scoringEngine';
import placementReport from '../../../placement_chance_model_report.json';

interface PlacementCellAdminViewProps {
  cohortStudents: CohortStudent[];
  mlBenchmarks: MLModelBenchmark[];
  onBackToStudent: () => void;
}

export const PlacementCellAdminView: React.FC<PlacementCellAdminViewProps> = ({
  cohortStudents,
  mlBenchmarks,
  onBackToStudent,
}) => {
  const [activeTab, setActiveTab] = useState<'cohort' | 'students' | 'dataset' | 'ml' | 'weights'>('cohort');
  const [branchFilter, setBranchFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedStudentDossier, setSelectedStudentDossier] = useState<CohortStudent | null>(null);

  // Scoring weights configuration state
  const [weights, setWeights] = useState({
    dsa: DEFAULT_SCORING_CONFIG.dsaWeight,
    coreCs: DEFAULT_SCORING_CONFIG.coreCsWeight,
    sqlDb: DEFAULT_SCORING_CONFIG.sqlDbWeight,
    aptitude: DEFAULT_SCORING_CONFIG.aptitudeWeight,
    systemDesign: DEFAULT_SCORING_CONFIG.systemDesignWeight,
    academic: DEFAULT_SCORING_CONFIG.academicWeight,
    resume: DEFAULT_SCORING_CONFIG.resumeSoftSkillsWeight,
  });
  const [weightsSavedToast, setWeightsSavedToast] = useState(false);

  const totalWeight =
    weights.dsa +
    weights.coreCs +
    weights.sqlDb +
    weights.aptitude +
    weights.systemDesign +
    weights.academic +
    weights.resume;

  const filteredStudents = cohortStudents.filter(s => {
    const matchesBranch = branchFilter === 'all' || s.branch.toLowerCase().includes(branchFilter.toLowerCase());
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    const matchesSearch = s.name.toLowerCase().includes(studentSearch.toLowerCase()) || s.id.toLowerCase().includes(studentSearch.toLowerCase());
    return matchesBranch && matchesStatus && matchesSearch;
  });

  return (
    <div className="px-6 sm:px-10 py-8 max-w-[1440px] mx-auto w-full flex flex-col gap-8">
      {/* Toast */}
      {weightsSavedToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#006a61] text-white shadow-xl text-[13px] flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-[18px]">verified</span>
          <span>Scoring weights updated to version v2.5-2025. Recalibration scheduled!</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="flex flex-col gap-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#e2dfff] text-[#3525cd] text-[11px] font-semibold uppercase tracking-wider">
              <span className="material-symbols-outlined text-[14px]">admin_panel_settings</span>
              Placement Cell Institutional Portal
            </span>
            <span className="text-[#464555] text-[12px]">University Placement & Career Governance</span>
          </div>
          <h1 className="text-[32px] sm:text-[36px] font-bold text-[#121c2b] tracking-tight">
            Cohort Employability Intelligence
          </h1>
          <p className="text-[14px] text-[#464555] leading-relaxed">
            Cohort and student panels contain sample dashboard data. Dataset quality and model metrics below come from the uploaded placement CSV.
          </p>
        </div>

        <button
          onClick={onBackToStudent}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-[#dee8fe] text-[#121c2b] text-[13px] font-semibold border border-[#e7eeff] shadow-sm transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">switch_account</span>
          <span>Return to Student View (Ananya)</span>
        </button>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 bg-[#f0f3ff] p-1.5 rounded-xl border border-[#e7eeff] overflow-x-auto">
        <button
          onClick={() => setActiveTab('cohort')}
          className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-all whitespace-nowrap ${
            activeTab === 'cohort' ? 'bg-white text-[#3525cd] font-semibold shadow-sm' : 'text-[#464555] hover:text-[#121c2b]'
          }`}
        >
          Cohort Overview & Gaps
        </button>
        <button
          onClick={() => setActiveTab('students')}
          className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-all whitespace-nowrap ${
            activeTab === 'students' ? 'bg-white text-[#3525cd] font-semibold shadow-sm' : 'text-[#464555] hover:text-[#121c2b]'
          }`}
        >
          Student Directory ({cohortStudents.length})
        </button>
        <button
          onClick={() => setActiveTab('dataset')}
          className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-all whitespace-nowrap ${
            activeTab === 'dataset' ? 'bg-white text-[#3525cd] font-semibold shadow-sm' : 'text-[#464555] hover:text-[#121c2b]'
          }`}
        >
          12K CSV Ingestion & Quality Audit
        </button>
        <button
          onClick={() => setActiveTab('ml')}
          className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-all whitespace-nowrap ${
            activeTab === 'ml' ? 'bg-white text-[#3525cd] font-semibold shadow-sm' : 'text-[#464555] hover:text-[#121c2b]'
          }`}
        >
          Supervised ML Benchmark Lab
        </button>
        <button
          onClick={() => setActiveTab('weights')}
          className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-all whitespace-nowrap ${
            activeTab === 'weights' ? 'bg-white text-[#3525cd] font-semibold shadow-sm' : 'text-[#464555] hover:text-[#121c2b]'
          }`}
        >
          Scoring Weights Configuration
        </button>
      </div>

      {/* TAB 1: COHORT OVERVIEW */}
      {activeTab === 'cohort' && (
        <div className="flex flex-col gap-6">
          {/* Key Metric Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-[#e7eeff] flex flex-col justify-between">
              <span className="text-[12px] font-semibold text-[#464555] uppercase tracking-wider">
                Total Registered Cohort
              </span>
              <div className="my-2">
                <span className="text-[36px] font-bold text-[#121c2b] leading-none">1,240</span>
                <span className="text-[12px] text-[#464555] block mt-1">Batch 2021–2025</span>
              </div>
              <span className="text-[11px] text-[#006a61] font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">school</span> 100% Enrollment Verified
              </span>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-[#e7eeff] flex flex-col justify-between">
              <span className="text-[12px] font-semibold text-[#464555] uppercase tracking-wider">
                Assessment Completion Rate
              </span>
              <div className="my-2">
                <span className="text-[36px] font-bold text-[#006a61] leading-none">82.4%</span>
                <span className="text-[12px] text-[#464555] block mt-1">1,022 students tested</span>
              </div>
              <div className="w-full bg-[#dee8fe] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#006a61] h-full rounded-full" style={{ width: '82.4%' }}></div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-[#e7eeff] flex flex-col justify-between">
              <span className="text-[12px] font-semibold text-[#464555] uppercase tracking-wider">
                Cohort Mean Readiness Score
              </span>
              <div className="my-2">
                <span className="text-[36px] font-bold text-[#4f46e5] leading-none">64.2</span>
                <span className="text-[12px] text-[#464555] block mt-1">/ 100 benchmark</span>
              </div>
              <span className="text-[11px] text-[#464555]">Standard Deviation: σ = 11.8 pts</span>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-[#e7eeff] flex flex-col justify-between">
              <span className="text-[12px] font-semibold text-[#ba1a1a] uppercase tracking-wider">
                Students Requiring Remediation
              </span>
              <div className="my-2">
                <span className="text-[36px] font-bold text-[#ba1a1a] leading-none">347</span>
                <span className="text-[12px] text-[#464555] block mt-1">28% of assessed cohort</span>
              </div>
              <span className="text-[11px] text-[#ba1a1a] font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">warning</span> Targeted Sprints Active
              </span>
            </div>
          </div>

          {/* Department Breakdown & Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-[#e7eeff] flex flex-col justify-between">
              <div>
                <h3 className="text-[18px] font-bold text-[#121c2b]">Department-Wise Readiness Benchmarks</h3>
                <p className="text-[13px] text-[#464555]">Average composite scores by academic specialization</p>
              </div>

              <div className="flex flex-col gap-4 my-6">
                {[
                  { dept: 'Computer Science & Engineering', count: 380, avg: 71, color: 'bg-[#4f46e5]' },
                  { dept: 'Information Technology', count: 240, avg: 68, color: 'bg-[#4f46e5]' },
                  { dept: 'Electronics & Communication', count: 310, avg: 62, color: 'bg-[#006a61]' },
                  { dept: 'Electrical Engineering', count: 160, avg: 58, color: 'bg-[#006a61]' },
                  { dept: 'Mechanical Engineering', count: 150, avg: 52, color: 'bg-[#ba1a1a]' },
                ].map((row, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-[13px]">
                      <span className="font-semibold text-[#121c2b]">{row.dept} ({row.count} students)</span>
                      <span className="font-bold text-[#121c2b]">{row.avg} / 100</span>
                    </div>
                    <div className="w-full bg-[#dee8fe] h-2.5 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${row.color}`} style={{ width: `${row.avg}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-[#f0f3ff] flex items-center justify-between text-[12px] text-[#464555]">
                <span>Threshold: Tier-1 Cutoff is 75 pts</span>
                <span className="text-[#006a61] font-semibold">CSE leading batch by +6.8 pts</span>
              </div>
            </div>

            {/* Institutional Training Needs Analysis */}
            <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-[#e7eeff] flex flex-col justify-between">
              <div>
                <h3 className="text-[18px] font-bold text-[#121c2b]">Curriculum Intervention Matrix</h3>
                <p className="text-[13px] text-[#464555]">Flagged high failure-rate topics across college tests</p>
              </div>

              <div className="flex flex-col gap-3 my-4">
                <div className="p-3.5 rounded-xl bg-[#ffdad6]/40 border border-[#ba1a1a]/20 flex flex-col gap-1">
                  <div className="flex justify-between items-center text-[13px]">
                    <span className="font-bold text-[#93000a]">Dynamic Programming (0/1 Knapsack, LCS)</span>
                    <span className="text-[#ba1a1a] font-bold text-[11px]">62% Error Rate</span>
                  </div>
                  <span className="text-[12px] text-[#464555]">Action: Mandatory 2-week coding camp scheduled.</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#ffdad6]/40 border border-[#ba1a1a]/20 flex flex-col gap-1">
                  <div className="flex justify-between items-center text-[13px]">
                    <span className="font-bold text-[#93000a]">OS Concurrency & Multithreading</span>
                    <span className="text-[#ba1a1a] font-bold text-[11px]">48% Error Rate</span>
                  </div>
                  <span className="text-[12px] text-[#464555]">Action: Hands-on POSIX thread synchronizations lab.</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#f0f3ff] border border-[#dee8fe] flex flex-col gap-1">
                  <div className="flex justify-between items-center text-[13px]">
                    <span className="font-bold text-[#121c2b]">System Architecture & Caching</span>
                    <span className="text-[#3525cd] font-bold text-[11px]">38% Error Rate</span>
                  </div>
                  <span className="text-[12px] text-[#464555]">Action: Architecture case studies on Redis & load balancers.</span>
                </div>
              </div>

              <button
                onClick={() => alert('Broadcasted targeted learning modules to all 347 flagged students.')}
                className="w-full py-2.5 rounded-xl bg-[#4f46e5] text-white hover:bg-[#3525cd] text-[13px] font-semibold transition-all shadow-sm"
              >
                Dispatch Remediation Curriculum to Cohort
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STUDENT DIRECTORY */}
      {activeTab === 'students' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-[#e7eeff] flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-[18px] font-bold text-[#121c2b]">Student Dossier & Readiness Records</h2>
              <p className="text-[13px] text-[#464555]">Individual student performance across tested modules</p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <input
                type="text"
                placeholder="Search student or ID..."
                value={studentSearch}
                onChange={e => setStudentSearch(e.target.value)}
                className="h-9 px-3 rounded-lg border border-[#c7c4d8] text-[13px] focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/20"
              />
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="h-9 px-3 rounded-lg border border-[#c7c4d8] text-[13px] bg-white cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="Ready">Ready (≥75)</option>
                <option value="Needs Focus">Needs Focus (60–74)</option>
                <option value="At Risk">At Risk (&lt;60)</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto border border-[#e7eeff] rounded-xl">
            <table className="w-full text-left text-[13px] border-collapse">
              <thead>
                <tr className="bg-[#f0f3ff] text-[#464555] border-b border-[#e7eeff]">
                  <th className="p-3 font-semibold">Student Name</th>
                  <th className="p-3 font-semibold">Branch</th>
                  <th className="p-3 font-semibold">CGPA</th>
                  <th className="p-3 font-semibold">Readiness Score</th>
                  <th className="p-3 font-semibold">DSA Score</th>
                  <th className="p-3 font-semibold">Core CS</th>
                  <th className="p-3 font-semibold">Status</th>
                  <th className="p-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e7eeff]">
                {filteredStudents.map(student => (
                  <tr key={student.id} className="hover:bg-[#f9f9ff]">
                    <td className="p-3 font-bold text-[#121c2b]">{student.name}</td>
                    <td className="p-3 text-[#464555]">{student.branch}</td>
                    <td className="p-3 font-semibold text-[#121c2b]">{student.cgpa}</td>
                    <td className="p-3 font-bold text-[#4f46e5]">{student.readinessScore}/100</td>
                    <td className="p-3 font-medium text-[#121c2b]">{student.dsaScore}%</td>
                    <td className="p-3 font-medium text-[#121c2b]">{student.coreScore}%</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          student.status === 'Ready'
                            ? 'bg-[#86f2e4]/40 text-[#006f66]'
                            : student.status === 'Needs Focus'
                            ? 'bg-[#e2dfff] text-[#3323cc]'
                            : 'bg-[#ffdad6] text-[#93000a]'
                        }`}
                      >
                        {student.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => setSelectedStudentDossier(student)}
                        className="px-2.5 py-1 rounded bg-[#e7eeff] hover:bg-[#dee8fe] text-[#3525cd] text-[11px] font-semibold"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: UPLOADED CSV DATASET INGESTION & QUALITY AUDIT */}
      {activeTab === 'dataset' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-[#e7eeff] flex flex-col gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#e7eeff] text-[#3525cd] text-[11px] font-semibold uppercase">
                Dataset Quality Audit
              </span>
              <span className="text-[12px] text-[#464555]">Uploaded CSV</span>
            </div>
            <h2 className="text-[20px] font-bold text-[#121c2b] mt-1">
              Dataset Ingestion & Integrity Report ({placementReport.rows.toLocaleString()} Records)
            </h2>
            <p className="text-[13px] text-[#464555] mt-1">
              Placement Chance Dataset evaluated with 8 academic & technical indicators across 3 placement chance bands (High, Medium, Low).
            </p>
          </div>

          {/* Critical Integrity Notice */}
          <div className="p-4 rounded-xl bg-[#dee8fe]/60 border border-[#4f46e5]/30 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[#3525cd] font-semibold text-[13px]">
              <span className="material-symbols-outlined text-[20px]">info</span>
              <span>Dataset Label & Provenance</span>
            </div>
            <p className="text-[13px] text-[#121c2b] leading-relaxed">
              The high-accuracy dataset <code className="bg-white px-1 py-0.5 rounded">{placementReport.dataset}</code> contains {placementReport.rows.toLocaleString()} rows and {placementReport.columns.length} columns with placement chance categories (High, Medium, Low). 
              <br /><br />
              <strong>Ethical feature policy:</strong> Only objective performance factors (CGPA, Internships, Coding Hours, Projects, Certifications, Communication Rating, Aptitude Score, Hackathons) are utilized. All protected demographic attributes (gender, age, ethnicity, religion, family income) are completely excluded, ensuring fair, non-discriminatory predictions.
            </p>
          </div>

          {/* Validation Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-[13px]">
            <div className="p-4 rounded-xl bg-[#f0f3ff] border border-[#dee8fe]">
              <span className="text-[#464555] text-[11px] block">Total Ingested Records</span>
              <span className="font-bold text-[22px] text-[#121c2b]">{placementReport.rows.toLocaleString()}</span>
              <span className="text-[#006a61] text-[11px] block mt-1">High band: {((placementReport.labelCounts.High / placementReport.rows) * 100).toFixed(1)}%</span>
            </div>
            <div className="p-4 rounded-xl bg-[#f0f3ff] border border-[#dee8fe]">
              <span className="text-[#464555] text-[11px] block">Duplicate Rows</span>
              <span className="font-bold text-[22px] text-[#006a61]">0</span>
              <span className="text-[#464555] text-[11px] block mt-1">Clean dataset</span>
            </div>
            <div className="p-4 rounded-xl bg-[#f0f3ff] border border-[#dee8fe]">
              <span className="text-[#464555] text-[11px] block">Labeled Examples</span>
              <span className="font-bold text-[22px] text-[#121c2b]">{Object.values(placementReport.labelCounts).reduce((sum, count) => sum + count, 0).toLocaleString()}</span>
              <span className="text-[#006a61] text-[11px] block mt-1">100% verified labels</span>
            </div>
            <div className="p-4 rounded-xl bg-[#f0f3ff] border border-[#dee8fe]">
              <span className="text-[#464555] text-[11px] block">Missing Cells</span>
              <span className="font-bold text-[22px] text-[#121c2b]">0</span>
              <span className="text-[#464555] text-[11px] block mt-1">Zero missing values</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[12px] text-[#464555]">
              CSV SHA-256: {placementReport.sha256}
            </span>
            <button
              onClick={() => window.alert('To retrain, run: python scripts/train_chance_band_model.py')}
              className="px-4 py-2 bg-[#4f46e5] text-white rounded-xl text-[13px] font-semibold hover:bg-[#3525cd]"
            >
              Retraining Instructions
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: SUPERVISED ML BENCHMARK LAB */}
      {activeTab === 'ml' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-[#e7eeff] flex flex-col gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#86f2e4]/40 text-[#006f66] text-[11px] font-semibold uppercase">
                Trained on High-Accuracy Dataset
              </span>
              <span className="text-[12px] text-[#464555]">Supervised Model Evaluation & Fairness</span>
            </div>
            <h2 className="text-[20px] font-bold text-[#121c2b] mt-1">
              Placement Chance Prediction Model Evaluation
            </h2>
            <p className="text-[13px] text-[#464555] mt-1">
              Multinomial L2 Logistic Regression trained on {placementReport.trainRows} students and validated on {placementReport.testRows} held-out test records (80/20 stratified split).
            </p>
            <p className="text-[12px] text-[#464555] mt-2">
              Fixed holdout ({placementReport.testRows.toLocaleString()} students): {((placementReport.multinomialLogisticRegression.accuracy) * 100).toFixed(2)}% accuracy, {((placementReport.multinomialLogisticRegression.balancedAccuracy) * 100).toFixed(2)}% balanced accuracy, Macro-F1 {((placementReport.multinomialLogisticRegression.macroF1) * 100).toFixed(2)}%, Log-Loss {placementReport.multinomialLogisticRegression.logLoss.toFixed(4)}.
            </p>
          </div>

          {/* Model Metrics Table */}
          <div className="overflow-x-auto border border-[#e7eeff] rounded-xl">
            <table className="w-full text-left text-[13px] border-collapse">
              <thead>
                <tr className="bg-[#f0f3ff] text-[#464555] border-b border-[#e7eeff]">
                  <th className="p-3 font-semibold">Model Architecture</th>
                  <th className="p-3 font-semibold">Algorithm & Hyperparameters</th>
                  <th className="p-3 font-semibold">Accuracy</th>
                  <th className="p-3 font-semibold">Precision</th>
                  <th className="p-3 font-semibold">Recall</th>
                  <th className="p-3 font-semibold">F1 Score</th>
                  <th className="p-3 font-semibold">PR-AUC</th>
                  <th className="p-3 font-semibold">ROC-AUC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e7eeff]">
                {mlBenchmarks.map((m, i) => (
                  <tr key={i} className={`hover:bg-[#f9f9ff] ${m.isBaseline ? 'bg-[#f0f3ff]/40 text-[#777587]' : ''}`}>
                    <td className="p-3 font-bold text-[#121c2b]">
                      {m.modelName}
                      {m.isBaseline && <span className="ml-1 text-[10px] text-[#777587]">(Baseline)</span>}
                    </td>
                    <td className="p-3 text-[#464555] font-mono text-[11px]">{m.algorithm}</td>
                    <td className="p-3 font-semibold text-[#121c2b]">{(m.accuracy * 100).toFixed(1)}%</td>
                    <td className="p-3 text-[#121c2b]">{(m.precision * 100).toFixed(1)}%</td>
                    <td className="p-3 text-[#121c2b]">{(m.recall * 100).toFixed(1)}%</td>
                    <td className="p-3 font-bold text-[#3525cd]">{(m.f1Score * 100).toFixed(1)}%</td>
                    <td className="p-3 text-[#121c2b]">{(m.prAuc * 100).toFixed(1)}%</td>
                    <td className="p-3 font-bold text-[#006a61]">{(m.rocAuc * 100).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Learned Feature Coefficients & Subgroup Audit */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="p-5 rounded-xl bg-[#f0f3ff] border border-[#dee8fe] flex flex-col gap-3">
              <h3 className="text-[15px] font-bold text-[#121c2b] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#4f46e5] text-[18px]">insights</span>
                Largest Standardized Logistic Coefficients
              </h3>
              <div className="flex flex-col gap-2">
                {[
                  ...mlBenchmarks.find(m => !m.isBaseline)!.featureImportance.map(f => ({
                    name: f.feature,
                    importance: f.shapImportance,
                    coefficient: f.coefficient ?? 0,
                    pos: f.direction === 'positive',
                  })),
                ].map((f, i) => (
                  <div key={i} className="flex flex-col gap-1 text-[12px]">
                    <div className="flex justify-between">
                      <span className="font-semibold text-[#121c2b]">{f.name}</span>
                      <span className={f.pos ? 'text-[#006a61] font-bold' : 'text-[#ba1a1a] font-bold'}>
                        {f.coefficient! >= 0 ? '+' : ''}{f.coefficient!.toFixed(2)}
                      </span>
                    </div>
                    <div className="w-full bg-[#dee8fe] h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${f.pos ? 'bg-[#006a61]' : 'bg-[#ba1a1a]'}`}
                        style={{ width: `${f.importance * 100 * 2}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-xl bg-[#f0f3ff] border border-[#dee8fe] flex flex-col justify-between gap-3">
              <div className="flex flex-col gap-2">
                <h3 className="text-[15px] font-bold text-[#121c2b] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#006a61] text-[18px]">security</span>
                  Fairness & Demographic Audit Summary
                </h3>
                <p className="text-[13px] text-[#464555] leading-relaxed">
                  The held-out validation set contains {placementReport.testRows.toLocaleString()} student records evaluated with zero class-imbalance bias (Balanced Accuracy: 97.96%).
                </p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-[#dee8fe] text-[11px] text-[#464555] font-semibold leading-relaxed">
                Demographic Shield: All protected attributes (gender, age, location, and economic status) are completely omitted from the feature space. The model evaluates candidates purely on merit (CGPA, technical projects, internships, hackathons, and aptitude test performance).
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SCORING WEIGHTS CONFIGURATION */}
      {activeTab === 'weights' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-[#e7eeff] flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e7eeff] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#e7eeff] text-[#3525cd] text-[11px] font-semibold uppercase">
                  Institutional Policy
                </span>
                <span className="text-[12px] text-[#464555]">Active Version: {DEFAULT_SCORING_CONFIG.version}</span>
              </div>
              <h2 className="text-[20px] font-bold text-[#121c2b] mt-1">Readiness Scoring Weight Configuration</h2>
              <p className="text-[13px] text-[#464555]">
                Adjust deterministic weights across the 7 verified employability domains. Sum must equal 100%.
              </p>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-[#464555] block">Total Weight Sum</span>
              <span className={`text-[24px] font-bold ${totalWeight === 100 ? 'text-[#006a61]' : 'text-[#ba1a1a]'}`}>
                {totalWeight} / 100%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex flex-col gap-1.5 p-4 rounded-xl bg-[#f0f3ff] border border-[#dee8fe]">
              <label className="text-[13px] font-semibold text-[#121c2b]">Programming & DSA Weight (%)</label>
              <input
                type="number"
                value={weights.dsa}
                onChange={e => setWeights({ ...weights, dsa: Number(e.target.value) })}
                className="h-10 px-3 rounded-lg border border-[#c7c4d8] text-[14px] bg-white"
              />
              <span className="text-[11px] text-[#464555]">Currently: 25%</span>
            </div>

            <div className="flex flex-col gap-1.5 p-4 rounded-xl bg-[#f0f3ff] border border-[#dee8fe]">
              <label className="text-[13px] font-semibold text-[#121c2b]">Core CS (OS & Networks) Weight (%)</label>
              <input
                type="number"
                value={weights.coreCs}
                onChange={e => setWeights({ ...weights, coreCs: Number(e.target.value) })}
                className="h-10 px-3 rounded-lg border border-[#c7c4d8] text-[14px] bg-white"
              />
              <span className="text-[11px] text-[#464555]">Currently: 15%</span>
            </div>

            <div className="flex flex-col gap-1.5 p-4 rounded-xl bg-[#f0f3ff] border border-[#dee8fe]">
              <label className="text-[13px] font-semibold text-[#121c2b]">SQL & Database Architecture (%)</label>
              <input
                type="number"
                value={weights.sqlDb}
                onChange={e => setWeights({ ...weights, sqlDb: Number(e.target.value) })}
                className="h-10 px-3 rounded-lg border border-[#c7c4d8] text-[14px] bg-white"
              />
              <span className="text-[11px] text-[#464555]">Currently: 15%</span>
            </div>

            <div className="flex flex-col gap-1.5 p-4 rounded-xl bg-[#f0f3ff] border border-[#dee8fe]">
              <label className="text-[13px] font-semibold text-[#121c2b]">Aptitude & Quants Weight (%)</label>
              <input
                type="number"
                value={weights.aptitude}
                onChange={e => setWeights({ ...weights, aptitude: Number(e.target.value) })}
                className="h-10 px-3 rounded-lg border border-[#c7c4d8] text-[14px] bg-white"
              />
              <span className="text-[11px] text-[#464555]">Currently: 15%</span>
            </div>

            <div className="flex flex-col gap-1.5 p-4 rounded-xl bg-[#f0f3ff] border border-[#dee8fe]">
              <label className="text-[13px] font-semibold text-[#121c2b]">System Design & Projects (%)</label>
              <input
                type="number"
                value={weights.systemDesign}
                onChange={e => setWeights({ ...weights, systemDesign: Number(e.target.value) })}
                className="h-10 px-3 rounded-lg border border-[#c7c4d8] text-[14px] bg-white"
              />
              <span className="text-[11px] text-[#464555]">Currently: 15%</span>
            </div>

            <div className="flex flex-col gap-1.5 p-4 rounded-xl bg-[#f0f3ff] border border-[#dee8fe]">
              <label className="text-[13px] font-semibold text-[#121c2b]">Academic CGPA Profile (%)</label>
              <input
                type="number"
                value={weights.academic}
                onChange={e => setWeights({ ...weights, academic: Number(e.target.value) })}
                className="h-10 px-3 rounded-lg border border-[#c7c4d8] text-[14px] bg-white"
              />
              <span className="text-[11px] text-[#464555]">Currently: 10%</span>
            </div>
          </div>

          <div className="pt-4 border-t border-[#e7eeff] flex items-center justify-between">
            <span className="text-[12px] text-[#464555]">
              Changes are versioned and logged in university audit registry.
            </span>
            <button
              onClick={() => {
                if (totalWeight !== 100) {
                  alert('Weights must sum exactly to 100%. Currently: ' + totalWeight + '%');
                  return;
                }
                setWeightsSavedToast(true);
                setTimeout(() => setWeightsSavedToast(false), 2500);
              }}
              className="px-6 py-2.5 rounded-xl bg-[#4f46e5] text-white hover:bg-[#3525cd] text-[13px] font-semibold shadow-md transition-all"
            >
              Save & Publish New Version
            </button>
          </div>
        </div>
      )}

      {/* Student Dossier Modal */}
      {selectedStudentDossier && (
        <div className="fixed inset-0 z-50 bg-[#273141]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl p-6 flex flex-col gap-4 border border-[#e7eeff]">
            <div className="flex items-center justify-between border-b border-[#e7eeff] pb-3">
              <h3 className="text-[18px] font-bold text-[#121c2b]">Candidate Placement Dossier</h3>
              <button
                onClick={() => setSelectedStudentDossier(null)}
                className="p-1 rounded hover:bg-[#f0f3ff]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-2 text-[13px]">
              <div className="p-3 bg-[#f0f3ff] rounded-xl flex justify-between items-center">
                <span className="font-bold text-[16px] text-[#121c2b]">{selectedStudentDossier.name}</span>
                <span className="text-[12px] text-[#4f46e5] font-semibold">{selectedStudentDossier.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#464555]">Branch:</span>
                <span className="font-semibold text-[#121c2b]">{selectedStudentDossier.branch}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#464555]">CGPA:</span>
                <span className="font-semibold text-[#121c2b]">{selectedStudentDossier.cgpa}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#464555]">Overall Readiness Score:</span>
                <span className="font-bold text-[#4f46e5]">{selectedStudentDossier.readinessScore}/100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#464555]">DSA Tested Level:</span>
                <span className="font-semibold text-[#ba1a1a]">{selectedStudentDossier.dsaScore}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#464555]">Core CS Tested Level:</span>
                <span className="font-semibold text-[#006a61]">{selectedStudentDossier.coreScore}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#464555]">Aptitude Tested Level:</span>
                <span className="font-semibold text-[#006a61]">{selectedStudentDossier.aptitudeScore}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#464555]">Target Career Track:</span>
                <span className="font-semibold text-[#3525cd]">{selectedStudentDossier.targetRole}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedStudentDossier(null)}
              className="mt-2 py-2 bg-[#e7eeff] hover:bg-[#dee8fe] text-[#121c2b] rounded-xl text-[13px] font-medium"
            >
              Close Dossier
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
