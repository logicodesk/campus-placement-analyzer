import React, { useState, useEffect } from 'react';
import { AssessmentModule, ExamQuestion } from '../../types';

interface AssessmentViewProps {
  modules: AssessmentModule[];
  questions: ExamQuestion[];
  onCompleteExam: (score: number) => void;
  onNavigate: (view: any) => void;
}

export const AssessmentView: React.FC<AssessmentViewProps> = ({
  modules,
  questions: initialQuestions,
  onCompleteExam,
}) => {
  const [questions, setQuestions] = useState<ExamQuestion[]>(initialQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(13); // Question 14 (0-indexed 13)
  const [secondsRemaining, setSecondsRemaining] = useState(18 * 60 + 42); // 18m 42s
  const [showCalculator, setShowCalculator] = useState(false);
  const [calcInput, setCalcInput] = useState('');
  const [calcResult, setCalcResult] = useState('');
  const [showExamResultModal, setShowExamResultModal] = useState(false);
  const [examScoreResult, setExamScoreResult] = useState<{ score: number; answeredCount: number; correctCount: number } | null>(null);
  const [showRubricModal, setShowRubricModal] = useState(false);
  const [showIntegrityModal, setShowIntegrityModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Timer Countdown Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsRemaining(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQ = questions[currentQuestionIndex] || questions[0];

  const handleSelectOption = (optionId: string) => {
    setQuestions(prev =>
      prev.map((q, idx) => {
        if (idx === currentQuestionIndex) {
          return {
            ...q,
            selectedOptionId: optionId,
            isAnswered: true,
            status: 'answered',
          };
        }
        return q;
      })
    );
  };

  const handleClearResponse = () => {
    setQuestions(prev =>
      prev.map((q, idx) => {
        if (idx === currentQuestionIndex) {
          return {
            ...q,
            selectedOptionId: undefined,
            isAnswered: false,
            status: 'not_answered',
          };
        }
        return q;
      })
    );
  };

  const handleToggleFlag = () => {
    setQuestions(prev =>
      prev.map((q, idx) => {
        if (idx === currentQuestionIndex) {
          return { ...q, isFlagged: !q.isFlagged };
        }
        return q;
      })
    );
    showToast(currentQ.isFlagged ? 'Removed flag' : 'Marked for review');
  };

  const handleSaveAndNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleJumpToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const handleSubmitExam = () => {
    let correct = 0;
    let answered = 0;
    questions.forEach(q => {
      if (q.selectedOptionId) {
        answered++;
        const opt = q.options.find(o => o.id === q.selectedOptionId);
        if (opt && opt.isCorrect) {
          correct++;
        }
      }
    });

    const score = Math.round((correct / questions.length) * 100);
    setExamScoreResult({
      score,
      answeredCount: answered,
      correctCount: correct,
    });
    setShowExamResultModal(true);
    onCompleteExam(score);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Status Counts
  const answeredCount = questions.filter(q => q.isAnswered).length;
  const notAnsweredCount = questions.filter(q => !q.isAnswered && q.status === 'not_answered').length;
  const notVisitedCount = questions.filter(q => q.status === 'not_visited').length;

  return (
    <div className="px-6 sm:px-10 py-8 max-w-[1440px] mx-auto w-full flex flex-col gap-8 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#121c2b] text-white shadow-xl text-[13px] flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-[18px] text-[#86f2e4]">info</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Context & Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="flex flex-col gap-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#e2dfff] text-[#0f0069] text-[11px] font-semibold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3525cd] animate-pulse"></span>
              Proctored Testing Engine
            </span>
            <span className="text-[12px] text-[#464555]">Assessment Wave: Fall Cohort 2024</span>
          </div>
          <h1 className="text-[32px] sm:text-[36px] font-bold text-[#121c2b] tracking-tight">
            Placement Assessment Centre
          </h1>
          <p className="text-[15px] text-[#464555] leading-relaxed">
            Take diagnostic quizzes, standardized coding challenges, and mock interviews to evaluate your verified placement readiness.
          </p>
        </div>

        {/* Student Readiness Index Monitor */}
        <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-[#dee8fe]/70 shrink-0">
          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-[#e7eeff]"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
              />
              <path
                className="text-[#4f46e5]"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeDasharray="68, 100"
                strokeLinecap="round"
                strokeWidth="3.5"
              />
            </svg>
            <span className="absolute text-[16px] font-bold text-[#121c2b]">68</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold uppercase text-[#464555]">Readiness Index</span>
              <span className="px-1.5 py-0.5 rounded bg-[#dee8fe] text-[#121c2b] text-[10px] font-semibold">
                Tier-1 Benchmark: 75
              </span>
            </div>
            <span className="text-[15px] font-semibold text-[#121c2b]">68 / 100 Potential</span>
            <span className="text-[12px] text-[#006a61] font-medium">5 Completed · 1 In Progress</span>
          </div>
        </div>
      </div>

      {/* 6 Assessment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map(mod => {
          const isError = mod.colorTone === 'error';
          const isPrimary = mod.colorTone === 'primary';
          const isCompleted = mod.status === 'completed';

          return (
            <div
              key={mod.id}
              className="flex flex-col justify-between bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group border border-[#e7eeff]"
            >
              <div
                className={`absolute top-0 left-0 right-0 h-1 ${
                  isError ? 'bg-[#ba1a1a]' : isPrimary ? 'bg-[#4f46e5]' : 'bg-[#006a61]'
                }`}
              ></div>

              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-lg bg-[#e7eeff] flex items-center justify-center text-[#3525cd]">
                    <span className="material-symbols-outlined text-[22px]">{mod.icon}</span>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                      isError
                        ? 'bg-[#ffdad6] text-[#93000a]'
                        : isPrimary
                        ? 'bg-[#e2dfff] text-[#3525cd] flex items-center gap-1'
                        : 'bg-[#86f2e4]/40 text-[#006f66]'
                    }`}
                  >
                    {isPrimary && <span className="w-2 h-2 rounded-full bg-[#4f46e5] animate-ping"></span>}
                    {mod.statusLabel}
                  </span>
                </div>

                <div>
                  <h3 className="text-[16px] font-semibold text-[#121c2b] group-hover:text-[#3525cd] transition-colors leading-tight">
                    {mod.title}
                  </h3>
                  <p className="text-[12px] text-[#464555] mt-1">{mod.description}</p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[12px] text-[#464555]">
                    {isCompleted ? 'Validated Score' : mod.previousScore ? 'Previous Score' : 'Live Milestone'}
                  </span>
                  <span
                    className={`text-[20px] font-bold ${
                      isError ? 'text-[#ba1a1a]' : isPrimary ? 'text-[#3525cd] text-[14px]' : 'text-[#121c2b]'
                    }`}
                  >
                    {isCompleted ? (
                      <>
                        {mod.validatedScore}
                        <span className="text-[12px] text-[#777587] font-normal">/100</span>
                      </>
                    ) : mod.previousScore ? (
                      <>
                        {mod.previousScore}
                        <span className="text-[12px] text-[#777587] font-normal">/100</span>
                      </>
                    ) : (
                      'Stage 2 of 5'
                    )}
                  </span>
                </div>

                <div className="w-full bg-[#dee8fe] h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      isError ? 'bg-[#ba1a1a]' : isPrimary ? 'bg-[#4f46e5]' : 'bg-[#006a61]'
                    }`}
                    style={{ width: `${mod.progressPercent}%` }}
                  ></div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#f0f3ff] flex items-center justify-between">
                <span className="text-[11px] text-[#464555] flex items-center gap-1">
                  {isError ? (
                    <span className="text-[#ba1a1a] font-medium flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[15px]">priority_high</span> {mod.attemptsRemaining} attempts left
                    </span>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[15px] text-[#006a61]">verified</span>
                      <span>{mod.highlightText.split('·')[0]}</span>
                    </>
                  )}
                </span>

                {isError ? (
                  <button
                    onClick={() => {
                      showToast('Initializing fresh proctored attempt...');
                      setCurrentQuestionIndex(0);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#dee8fe] text-[#121c2b] hover:bg-[#d9e3f9] text-[12px] font-medium transition-all"
                  >
                    <span>Retake Test</span>
                    <span className="material-symbols-outlined text-[15px]">replay</span>
                  </button>
                ) : isPrimary ? (
                  <button
                    onClick={() => {
                      const el = document.getElementById('active-simulator-drawer');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-[#4f46e5] text-white hover:bg-[#3525cd] text-[12px] font-semibold transition-all shadow-sm active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[16px]">play_circle</span>
                    <span>Resume Test</span>
                  </button>
                ) : (
                  <button
                    onClick={() => showToast(`Reviewing score telemetry for ${mod.title}`)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#f0f3ff] text-[#121c2b] hover:bg-[#e7eeff] text-[12px] font-medium transition-all"
                  >
                    <span>Review Analysis</span>
                    <span className="material-symbols-outlined text-[15px]">chevron_right</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Assessment Live Simulator Drawer / Interactive Panel */}
      <div
        id="active-simulator-drawer"
        className="flex flex-col bg-white rounded-xl shadow-md overflow-hidden border border-[#e7eeff]"
      >
        {/* Simulator Header Bar */}
        <div className="px-6 py-3.5 bg-[#f0f3ff] flex flex-wrap items-center justify-between gap-4 border-b border-[#e7eeff]">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a] animate-pulse"></span>
              <span className="text-[13px] font-semibold text-[#121c2b]">
                SIMULATOR ACTIVE: Section B (Operating Systems)
              </span>
            </div>
            <span className="hidden sm:inline-block w-px h-4 bg-[#c7c4d8]"></span>
            <span className="text-[12px] text-[#464555]">Test ID: ARC-8942-OS</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Live Countdown Timer */}
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-lg font-mono text-[#121c2b] border border-[#e7eeff] shadow-sm">
              <span className="material-symbols-outlined text-[18px] text-[#3525cd]">timer</span>
              <span className="text-[13px] font-bold tracking-wider">{formatTimer(secondsRemaining)}</span>
              <span className="text-[11px] text-[#464555]">remaining</span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowCalculator(!showCalculator)}
                className="p-1.5 rounded-lg hover:bg-[#dee8fe] text-[#464555] hover:text-[#121c2b] transition-colors"
                title="Calculator Tool"
              >
                <span className="material-symbols-outlined text-[20px]">calculate</span>
              </button>
              <button
                onClick={() => showToast('Full-screen proctored lock simulated.')}
                className="p-1.5 rounded-lg hover:bg-[#dee8fe] text-[#464555] hover:text-[#121c2b] transition-colors"
                title="Full Screen Mode"
              >
                <span className="material-symbols-outlined text-[20px]">fullscreen</span>
              </button>
            </div>
          </div>
        </div>

        {/* Floating Simple Calculator */}
        {showCalculator && (
          <div className="p-3 bg-white border-b border-[#e7eeff] flex items-center gap-3">
            <span className="text-[12px] font-semibold text-[#121c2b]">Calculator:</span>
            <input
              type="text"
              placeholder="e.g. 180 / 20"
              value={calcInput}
              onChange={e => setCalcInput(e.target.value)}
              className="px-3 py-1 border border-[#c7c4d8] rounded text-[13px] w-48 font-mono focus:outline-none"
            />
            <button
              onClick={() => {
                try {
                  // Safe basic eval of digits and operators
                  const cleaned = calcInput.replace(/[^0-9+\-*/.]/g, '');
                  // eslint-disable-next-line no-eval
                  const res = Function(`"use strict"; return (${cleaned})`)();
                  setCalcResult(String(res));
                } catch {
                  setCalcResult('Error');
                }
              }}
              className="px-3 py-1 bg-[#4f46e5] text-white rounded text-[12px] font-medium"
            >
              Calculate
            </button>
            {calcResult && (
              <span className="font-mono text-[13px] font-bold text-[#006a61]">Result: {calcResult}</span>
            )}
            <button
              onClick={() => setShowCalculator(false)}
              className="ml-auto text-[11px] text-[#464555] hover:underline"
            >
              Close
            </button>
          </div>
        )}

        {/* Main Simulator Layout: Left Question View (8 Cols) + Right Palette (4 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Question Workspace (Col 1-8) */}
          <div className="lg:col-span-8 p-6 flex flex-col justify-between gap-6 border-b lg:border-b-0 lg:border-r border-[#e7eeff]">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#e7eeff] text-[#121c2b] text-[13px] font-semibold">
                  Question {currentQ.number} of {questions.length}
                </span>

                <div className="flex items-center gap-3">
                  <span className="text-[12px] text-[#464555]">
                    {currentQ.markingScheme}
                  </span>
                  <button
                    onClick={handleToggleFlag}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[12px] font-medium transition-colors ${
                      currentQ.isFlagged
                        ? 'bg-[#ffdad6] text-[#ba1a1a]'
                        : 'text-[#464555] hover:bg-[#e7eeff]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {currentQ.isFlagged ? 'bookmark' : 'bookmark_border'}
                    </span>
                    <span>{currentQ.isFlagged ? 'Flagged' : 'Flag for Review'}</span>
                  </button>
                </div>
              </div>

              {/* Question Stem */}
              <div className="py-1 flex flex-col gap-2">
                <h2 className="text-[17px] font-semibold text-[#121c2b] leading-snug">
                  {currentQ.title}
                </h2>

                {currentQ.codeSnippet && (
                  <div className="p-3 bg-[#e7eeff]/60 border border-[#c7c4d8]/40 rounded-lg font-mono text-[13px] text-[#121c2b] overflow-x-auto">
                    {currentQ.codeSnippet}
                  </div>
                )}

                <p className="text-[14px] text-[#464555] leading-relaxed">
                  {currentQ.explanation}
                </p>
              </div>

              {/* Multiple Choice Radio Group */}
              <div className="flex flex-col gap-2.5 pt-1">
                {currentQ.options.map(opt => {
                  const isChecked = currentQ.selectedOptionId === opt.id;
                  return (
                    <label
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      className={`flex items-start gap-3 p-3.5 rounded-xl cursor-pointer transition-all border ${
                        isChecked
                          ? 'bg-[#e7eeff]/70 border-[#4f46e5]/50 shadow-sm'
                          : 'bg-[#f0f3ff]/60 border-transparent hover:bg-[#dee8fe]/60'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q_${currentQ.id}`}
                        checked={isChecked}
                        onChange={() => handleSelectOption(opt.id)}
                        className="mt-1 w-4 h-4 text-[#4f46e5] focus:ring-[#4f46e5] accent-[#4f46e5] cursor-pointer"
                      />
                      <div className="flex flex-col flex-1">
                        <span className={`text-[14px] ${isChecked ? 'font-semibold text-[#121c2b]' : 'font-medium text-[#121c2b]'}`}>
                          {opt.label}
                        </span>
                        {opt.note && (
                          <span className="text-[12px] text-[#464555] mt-0.5">
                            {opt.note}
                          </span>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Bottom Action Buttons in Question Pane */}
            <div className="pt-4 border-t border-[#f0f3ff] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className="px-3.5 py-2 rounded-lg bg-[#e7eeff] text-[#121c2b] hover:bg-[#dee8fe] text-[13px] font-medium transition-colors inline-flex items-center gap-1 disabled:opacity-40"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                  <span>Previous</span>
                </button>
                <button
                  onClick={handleClearResponse}
                  disabled={!currentQ.selectedOptionId}
                  className="px-3.5 py-2 rounded-lg bg-[#e7eeff] text-[#121c2b] hover:bg-[#dee8fe] text-[13px] font-medium transition-colors inline-flex items-center gap-1 disabled:opacity-40"
                >
                  <span>Clear Response</span>
                </button>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => {
                    handleToggleFlag();
                    handleSaveAndNext();
                  }}
                  className="px-4 py-2 rounded-lg bg-[#dee8fe] text-[#121c2b] hover:bg-[#d9e3f9] text-[13px] font-medium transition-colors inline-flex items-center gap-1"
                >
                  <span>Mark for Review & Next</span>
                </button>
                <button
                  onClick={handleSaveAndNext}
                  className="px-5 py-2 rounded-lg bg-[#4f46e5] text-white hover:bg-[#3525cd] text-[13px] font-semibold transition-all inline-flex items-center gap-1 shadow-sm active:scale-95"
                >
                  <span>Save & Next</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>

          {/* Question Palette Navigator (Col 9-12) */}
          <div className="lg:col-span-4 p-6 bg-[#f0f3ff] flex flex-col justify-between gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-[#dee8fe] pb-3">
                <span className="text-[15px] font-semibold text-[#121c2b]">Question Palette</span>
                <span className="text-[12px] text-[#006a61] font-semibold">
                  {answeredCount}/{questions.length} Answered
                </span>
              </div>

              {/* Legend Summary */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-medium">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded bg-[#86f2e4] border border-[#006a61]/30"></span>
                  <span className="text-[#121c2b]">Answered ({answeredCount})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded bg-[#ffdad6] border border-[#ba1a1a]/30"></span>
                  <span className="text-[#121c2b]">Not Answered ({notAnsweredCount})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded bg-[#dee8fe] border border-[#c7c4d8]"></span>
                  <span className="text-[#121c2b]">Not Visited ({notVisitedCount})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded bg-[#4f46e5]"></span>
                  <span className="text-[#121c2b]">Active (1)</span>
                </div>
              </div>

              {/* 25 Questions Grid Buttons */}
              <div className="grid grid-cols-5 gap-2 pt-2">
                {questions.map((q, idx) => {
                  const isActive = idx === currentQuestionIndex;
                  const isAns = q.isAnswered;
                  const isFlag = q.isFlagged;

                  let bgClass = 'bg-[#dee8fe] text-[#464555]';
                  if (isAns) {
                    bgClass = 'bg-[#86f2e4]/70 text-[#006f66] font-semibold';
                  } else if (q.status === 'not_answered') {
                    bgClass = 'bg-[#ffdad6] text-[#93000a] font-medium';
                  }

                  if (isActive) {
                    bgClass = 'bg-[#4f46e5] text-white font-bold ring-2 ring-[#3525cd] ring-offset-2 ring-offset-white';
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => handleJumpToQuestion(idx)}
                      className={`h-8 rounded-lg text-[12px] transition-all flex items-center justify-center relative hover:scale-105 ${bgClass}`}
                    >
                      {q.number < 10 ? `0${q.number}` : q.number}
                      {isFlag && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#ba1a1a] rounded-full border border-white"></span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Proctored Diagnostic Feed Preview */}
              <div className="mt-2 p-3 bg-white rounded-lg border border-[#dee8fe] flex items-center gap-3 shadow-sm">
                <div className="w-9 h-9 rounded-lg bg-[#e7eeff] relative flex items-center justify-center shrink-0 text-[#4f46e5]">
                  <span className="material-symbols-outlined text-[20px]">videocam</span>
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#006a61]"></span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] font-semibold text-[#121c2b] truncate">
                    AI Proctor Status: Active
                  </span>
                  <span className="text-[10px] text-[#464555] truncate">
                    0 tab switches · Audio stream clean
                  </span>
                </div>
              </div>
            </div>

            {/* Submit Exam CTA */}
            <div className="pt-2">
              <button
                onClick={handleSubmitExam}
                className="w-full py-2.5 px-4 rounded-xl bg-[#ba1a1a] text-white hover:bg-[#93000a] text-[13px] font-semibold transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
                <span>Submit Section & Conclude Exam</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Diagnostics & Evaluation Integrity Note */}
      <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-[#e7eeff]">
        <div className="flex items-start gap-4 max-w-3xl">
          <div className="w-12 h-12 rounded-xl bg-[#e2dfff] flex items-center justify-center text-[#3525cd] shrink-0">
            <span className="material-symbols-outlined text-[26px]">gavel</span>
          </div>
          <div className="flex flex-col gap-1">
            <h4 className="text-[16px] font-semibold text-[#121c2b]">
              Placement Readiness Scoring Methodology & Integrity Guarantee
            </h4>
            <p className="text-[13px] text-[#464555] leading-relaxed">
              The placement readiness index is dynamically synthesized using an Item Response Theory (IRT) model. Your final percentile weights problem difficulty tiers, code execution telemetry (cyclomatic complexity, memory profiling), and cognitive response timing—ensuring an objective, bias-free benchmark verified for enterprise placement drives.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0 self-stretch md:self-auto justify-end">
          <button
            onClick={() => setShowRubricModal(true)}
            className="px-4 py-2 rounded-lg bg-[#e7eeff] text-[#121c2b] hover:bg-[#dee8fe] text-[13px] font-medium text-center transition-colors"
          >
            View Grading Rubric
          </button>
          <button
            onClick={() => setShowIntegrityModal(true)}
            className="px-4 py-2 rounded-lg bg-[#4f46e5] text-white hover:bg-[#3525cd] text-[13px] font-medium text-center transition-colors shadow-sm"
          >
            Integrity Report
          </button>
        </div>
      </div>

      {/* Exam Result Modal */}
      {showExamResultModal && examScoreResult && (
        <div className="fixed inset-0 z-50 bg-[#273141]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl p-6 flex flex-col gap-4 border border-[#e7eeff] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] bg-[#86f2e4]/40 text-[#006f66] font-semibold">
                Exam Section Concluded
              </span>
              <button
                onClick={() => setShowExamResultModal(false)}
                className="p-1 rounded-lg hover:bg-[#f0f3ff] text-[#464555]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="flex flex-col items-center text-center py-2">
              <div className="w-16 h-16 rounded-full bg-[#e7eeff] flex items-center justify-center text-[#4f46e5] mb-2">
                <span className="material-symbols-outlined text-[32px]">emoji_events</span>
              </div>
              <h3 className="text-[22px] font-bold text-[#121c2b]">Assessment Score Calculated</h3>
              <p className="text-[13px] text-[#464555] mt-1">
                Your answers have been cryptographically verified against the IRT difficulty model.
              </p>
            </div>

            <div className="bg-[#f0f3ff] p-4 rounded-xl flex flex-col gap-2">
              <div className="flex justify-between items-center text-[13px]">
                <span className="text-[#464555]">Section Score:</span>
                <span className="font-bold text-[18px] text-[#006a61]">
                  {examScoreResult.score} / 100
                </span>
              </div>
              <div className="flex justify-between items-center text-[12px]">
                <span className="text-[#464555]">Questions Answered:</span>
                <span className="font-semibold text-[#121c2b]">
                  {examScoreResult.answeredCount} of {questions.length}
                </span>
              </div>
              <div className="flex justify-between items-center text-[12px]">
                <span className="text-[#464555]">Correct Validated:</span>
                <span className="font-semibold text-[#006a61]">
                  {examScoreResult.correctCount}
                </span>
              </div>
              <div className="flex justify-between items-center text-[12px]">
                <span className="text-[#464555]">Readiness Score Lift:</span>
                <span className="font-semibold text-[#4f46e5]">+4.5 pts composite</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowExamResultModal(false)}
                className="w-full py-2.5 rounded-xl bg-[#4f46e5] text-white hover:bg-[#3525cd] text-[13px] font-semibold transition-all shadow-sm"
              >
                Sync with Readiness Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rubric Modal */}
      {showRubricModal && (
        <div className="fixed inset-0 z-50 bg-[#273141]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl shadow-2xl p-6 flex flex-col gap-4 border border-[#e7eeff]">
            <div className="flex items-center justify-between">
              <h3 className="text-[18px] font-bold text-[#121c2b]">Evaluation Rubric (IRT 3-Parameter Model)</h3>
              <button onClick={() => setShowRubricModal(false)} className="p-1 rounded hover:bg-[#f0f3ff]">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="text-[13px] text-[#464555] flex flex-col gap-3 leading-relaxed">
              <p>
                Each item is parameterized with:
                <br />• <strong>Discrimination (a):</strong> How sharply the question separates high-ability from average students.
                <br />• <strong>Difficulty (b):</strong> Median skill required to have a 50% chance of a correct solution.
                <br />• <strong>Guessing (c):</strong> Pseudo-chance floor for multiple-choice selections.
              </p>
              <div className="p-3 bg-[#f0f3ff] rounded-lg">
                <span className="font-semibold text-[#121c2b] block">Tier-1 Shortlist Thresholds:</span>
                <span>• FAANG/Product: Theta ≥ +1.28 (Top 10th percentile, Score ≥ 80)</span>
                <br />
                <span>• Core Fintech: Theta ≥ +0.84 (Top 20th percentile, Score ≥ 75)</span>
                <br />
                <span>• Mass Recruiters (Prime Track): Theta ≥ +0.25 (Score ≥ 60)</span>
              </div>
            </div>
            <button
              onClick={() => setShowRubricModal(false)}
              className="mt-2 py-2 bg-[#e7eeff] hover:bg-[#dee8fe] text-[#121c2b] rounded-xl text-[13px] font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Integrity Report Modal */}
      {showIntegrityModal && (
        <div className="fixed inset-0 z-50 bg-[#273141]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl shadow-2xl p-6 flex flex-col gap-4 border border-[#e7eeff]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006a61]">verified</span>
                <h3 className="text-[18px] font-bold text-[#121c2b]">AI Proctor Integrity Certificate</h3>
              </div>
              <button onClick={() => setShowIntegrityModal(false)} className="p-1 rounded hover:bg-[#f0f3ff]">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="text-[13px] text-[#464555] flex flex-col gap-2.5">
              <div className="p-3 rounded-lg bg-[#86f2e4]/30 text-[#006f66] font-medium flex items-center gap-2">
                <span className="material-symbols-outlined">security</span>
                <span>Session Verified Clean · Zero Anomaly Flags (Score: 100/100)</span>
              </div>
              <ul className="list-disc pl-5 flex flex-col gap-1 text-[12px]">
                <li>Audio stream telemetry: No background whispers or secondary devices.</li>
                <li>Focus telemetry: Window blur events = 0. Fullscreen maintained.</li>
                <li>Keystroke cadence & paste check: Natural typing velocity detected (no mass pastes).</li>
              </ul>
            </div>
            <button
              onClick={() => setShowIntegrityModal(false)}
              className="mt-2 py-2 bg-[#4f46e5] text-white hover:bg-[#3525cd] rounded-xl text-[13px] font-medium"
            >
              Dismiss Certificate
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
