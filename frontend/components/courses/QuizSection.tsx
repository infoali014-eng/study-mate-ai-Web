"use client";

import React, { useState } from "react";
import { Quiz } from "@/types/course.types";

interface QuizSectionProps {
  quiz: Quiz;
  videoUrl?: string;
}

export const QuizSection: React.FC<QuizSectionProps> = ({ quiz, videoUrl }) => {
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);

  const startQuizFlow = () => {
    if (videoUrl) {
      setShowWarningModal(true);
    } else {
      setIsModalOpen(true);
      setQuizStarted(true);
    }
  };

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const resetQuiz = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setQuizStarted(false);
    setQuizCompleted(false);
    setShowWarningModal(false);
  };

  const closeQuizModal = () => {
    setIsModalOpen(false);
    resetQuiz();
  };

  // Calculate Scores
  const getResults = () => {
    let correct = 0;
    let incorrect = 0;
    quiz.questions.forEach((q) => {
      const selected = answers[q.id];
      if (selected === q.correctOptionIndex) {
        correct++;
      } else {
        incorrect++;
      }
    });
    return {
      score: correct,
      total: quiz.questions.length,
      correct,
      incorrect,
    };
  };

  const results = quizCompleted ? getResults() : null;

  return (
    <div className="space-y-4 select-none">
      {/* Sidebar Header */}
      <div className="border-b border-slate-100 pb-3">
        <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
          Lesson Quiz
        </h2>
        <p className="text-slate-500 text-xs font-medium">
          Test your comprehension of the lecture concepts.
        </p>
      </div>

      {/* Sidebar Card Trigger */}
      <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FFB703]/15 text-[#FFB703] flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.2"
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <div className="space-y-0.5 truncate">
            <h3 className="text-sm font-bold text-slate-900 truncate">{quiz.title}</h3>
            <p className="text-slate-500 text-xs font-medium">
              {quiz.questions.length} {quiz.questions.length === 1 ? "Question" : "Questions"} • Pass {quiz.passing_percentage ?? 70}%
            </p>
          </div>
        </div>

        <button
          onClick={startQuizFlow}
          className="w-full bg-[#FFB703] hover:bg-[#E0A100] text-slate-950 font-extrabold text-xs sm:text-sm py-2.5 rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Take Lesson Quiz</span>
          <span className="text-xs">→</span>
        </button>
      </div>

      {/* Recommended Video Warning Modal (Uniform Equal Sized Buttons) */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs select-none">
          <div className="bg-white rounded-2xl border border-slate-200/80 max-w-md w-full p-6 sm:p-7 space-y-6 shadow-xl animate-fade-in">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-slate-900 leading-snug">
                  Video Recommended
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed">
                  It is recommended to watch the related video before attempting this quiz to have a better understanding of the topic.
                </p>
              </div>
            </div>

            {/* Equal Sized Uniform Buttons Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full">
              <button
                type="button"
                onClick={() => {
                  if (videoUrl) window.open(videoUrl, "_blank");
                }}
                className="w-full h-11 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center border border-slate-200 text-center cursor-pointer"
              >
                Watch Video
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowWarningModal(false);
                  setIsModalOpen(true);
                  setQuizStarted(true);
                }}
                className="w-full h-11 px-3 bg-[#219EBC] hover:bg-[#1A829B] text-white font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center border border-[#219EBC] text-center shadow-xs cursor-pointer"
              >
                Continue to Quiz
              </button>
              <button
                type="button"
                onClick={() => setShowWarningModal(false)}
                className="w-full h-11 px-3 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center border border-slate-200/80 text-center cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Interactive Quiz Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs select-none">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in relative max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="space-y-0.5">
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900">{quiz.title}</h3>
                <p className="text-xs font-semibold text-slate-400">
                  Passing score: {quiz.passing_percentage ?? 70}%
                </p>
              </div>
              <button
                onClick={closeQuizModal}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Interactive Questions Flow */}
            {!quizCompleted ? (
              <div className="space-y-6">
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <span>Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
                    <span>{Math.round(((currentQuestionIndex + 1) / quiz.questions.length) * 100)}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#219EBC] h-full transition-all duration-300"
                      style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Question */}
                <div className="space-y-4 pt-2">
                  <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {quiz.questions[currentQuestionIndex].question}
                  </h4>

                  {/* Options */}
                  <div className="grid grid-cols-1 gap-2.5">
                    {quiz.questions[currentQuestionIndex].options.map((option, idx) => {
                      const isSelected = answers[quiz.questions[currentQuestionIndex].id] === idx;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelectOption(quiz.questions[currentQuestionIndex].id, idx)}
                          className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer ${
                            isSelected
                              ? "bg-slate-900 border-slate-900 text-white shadow-xs"
                              : "border-slate-200/80 text-slate-700 hover:border-slate-350 hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs font-black shrink-0 ${
                              isSelected ? "bg-white border-white text-slate-900" : "border-slate-300 text-slate-500"
                            }`}>
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <span>{option}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Action Bar */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <button
                    onClick={handlePrev}
                    disabled={currentQuestionIndex === 0}
                    className="text-xs font-bold text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                  >
                    ← Previous
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={answers[quiz.questions[currentQuestionIndex].id] === undefined}
                    className="bg-[#219EBC] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl hover:bg-[#1A829B] transition-colors shadow-xs disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                  >
                    {currentQuestionIndex === quiz.questions.length - 1 ? "Submit Quiz" : "Next Question →"}
                  </button>
                </div>
              </div>
            ) : (
              /* Quiz Results State */
              <div className="space-y-6">
                <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-6 text-center space-y-3">
                  <div className="text-3xl font-black text-slate-900">
                    {results?.score} / {results?.total}
                  </div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {((results?.score || 0) / (results?.total || 1)) * 100 >= (quiz.passing_percentage ?? 70)
                      ? "🎉 Quiz Passed!"
                      : "Quiz Attempted"}
                  </div>
                  <div className="flex items-center justify-center gap-6 text-xs font-extrabold pt-2">
                    <span className="text-emerald-600">{results?.correct} Correct</span>
                    <span className="text-rose-600">{results?.incorrect} Incorrect</span>
                  </div>
                </div>

                {/* Review */}
                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {quiz.questions.map((q, idx) => {
                    const selectedIdx = answers[q.id];
                    const isCorrect = selectedIdx === q.correctOptionIndex;
                    return (
                      <div key={q.id} className={`p-4 rounded-xl border ${isCorrect ? "border-emerald-100 bg-emerald-50/20" : "border-rose-100 bg-rose-50/20"} space-y-1.5 text-xs`}>
                        <div className="font-bold text-slate-900">
                          {idx + 1}. {q.question}
                        </div>
                        <div className="text-slate-600 font-medium">
                          Your answer: <span className={isCorrect ? "text-emerald-700 font-bold" : "text-rose-700 font-bold"}>{q.options[selectedIdx]}</span>
                        </div>
                        {!isCorrect && (
                          <div className="text-emerald-700 font-semibold">
                            Correct: {q.options[q.correctOptionIndex]}
                          </div>
                        )}
                        {q.explanation && (
                          <div className="text-slate-500 text-[11px] pt-1 italic">
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={resetQuiz}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2.5 rounded-xl transition-colors cursor-pointer"
                  >
                    Retake Quiz
                  </button>
                  <button
                    onClick={closeQuizModal}
                    className="flex-1 bg-slate-950 text-white font-bold text-xs py-2.5 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
