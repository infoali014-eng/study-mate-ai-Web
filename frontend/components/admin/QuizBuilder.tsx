"use client";

import React, { useState, useEffect } from "react";
import { getLectureQuiz, saveQuiz, deleteQuiz } from "@/lib/api/cms";

interface QuizBuilderProps {
  lectureId: string;
  onClose: () => void;
}

export const QuizBuilder: React.FC<QuizBuilderProps> = ({ lectureId, onClose }) => {
  const [title, setTitle] = useState("Lesson Assessment");
  const [passingPercentage, setPassingPercentage] = useState(80);
  const [questions, setQuestions] = useState<
    Array<{
      question: string;
      option_a: string;
      option_b: string;
      option_c: string;
      option_d: string;
      correct_option: "A" | "B" | "C" | "D";
      explanation: string;
    }>
  >([]);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  interface DBQ {
    question: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    correct_option: "A" | "B" | "C" | "D";
    explanation: string | null;
  }

  // Load existing quiz if any
  useEffect(() => {
    async function loadQuiz() {
      setFetching(true);
      setError(null);
      try {
        const quiz = await getLectureQuiz(lectureId);
        if (quiz) {
          setTitle(quiz.title);
          setPassingPercentage(quiz.passing_percentage);
          const mappedQuestions = ((quiz.questions as DBQ[]) || []).map((q) => ({
            question: q.question,
            option_a: q.option_a,
            option_b: q.option_b,
            option_c: q.option_c,
            option_d: q.option_d,
            correct_option: q.correct_option,
            explanation: q.explanation || "",
          }));
          setQuestions(mappedQuestions);
        } else {
          setTitle("Lesson Assessment");
          setPassingPercentage(80);
          setQuestions([]);
        }
      } catch (err: unknown) {
        console.error("Error loading quiz:", err);
        setError("Failed to load existing quiz.");
      } finally {
        setFetching(false);
      }
    }
    loadQuiz();
  }, [lectureId]);

  const handleAddQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        question: "",
        option_a: "",
        option_b: "",
        option_c: "",
        option_d: "",
        correct_option: "A",
        explanation: "",
      },
    ]);
  };

  const handleRemoveQuestion = (idx: number) => {
    setQuestions((prev) => prev.filter((_, qIdx) => qIdx !== idx));
  };

  const handleQuestionFieldChange = (idx: number, field: string, value: string) => {
    setQuestions((prev) =>
      prev.map((q, qIdx) => {
        if (qIdx === idx) {
          return { ...q, [field]: value };
        }
        return q;
      })
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Validate that all questions have at least a question title
      const invalid = questions.some(
        (q) =>
          !q.question.trim() ||
          !q.option_a.trim() ||
          !q.option_b.trim() ||
          !q.option_c.trim() ||
          !q.option_d.trim()
      );
      if (invalid) {
        throw new Error("All questions must have a query title and all 4 options filled out.");
      }

      const questionsWithOrder = questions.map((q, idx) => ({ ...q, order: idx }));
      await saveQuiz(lectureId, { title, passing_percentage: passingPercentage }, questionsWithOrder);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err: unknown) {
      console.error("[QuizBuilder] Error saving:", err);
      const errMsg = err instanceof Error ? err.message : "Failed to save quiz.";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete the quiz and all its questions?")) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await deleteQuiz(lectureId);
      setQuestions([]);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err: unknown) {
      console.error(err);
      setError("Failed to delete quiz.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="text-center py-8 text-xs font-bold text-slate-400 uppercase tracking-wider">Loading Quiz Data...</div>;
  }

  return (
    <div className="space-y-6 select-text max-h-[80vh] flex flex-col overflow-hidden">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
        <div>
          <h4 className="text-base font-extrabold text-slate-900">Quiz Builder</h4>
          <p className="text-slate-500 text-xs font-semibold">Build practice assessments for this lecture.</p>
        </div>
        <button
          onClick={onClose}
          className="text-xs font-bold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg border border-slate-200"
        >
          Back
        </button>
      </div>

      {error && (
        <div className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 p-2.5 rounded-xl shrink-0">
          {error}
        </div>
      )}
      {success && (
        <div className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 p-2.5 rounded-xl shrink-0">
          Success! Quiz state updated.
        </div>
      )}

      {/* Scrollable Form Area */}
      <form onSubmit={handleSave} className="flex-grow overflow-y-auto space-y-6 pr-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Quiz Title */}
          <div className="space-y-1.5 font-medium">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Quiz Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:border-slate-900 focus:outline-hidden"
              required
            />
          </div>

          {/* Passing Percentage */}
          <div className="space-y-1.5 font-medium">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Passing Score (%) *</label>
            <input
              type="number"
              min="0"
              max="100"
              value={passingPercentage}
              onChange={(e) => setPassingPercentage(parseInt(e.target.value) || 0)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:border-slate-900 focus:outline-hidden"
              required
            />
          </div>
        </div>

        {/* Questions Header */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-6">
          <h5 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">Questions ({questions.length})</h5>
          <button
            type="button"
            onClick={handleAddQuestion}
            className="text-xs font-bold bg-[#219EBC] hover:bg-[#219EBC]/90 text-white px-3 py-1.5 rounded-lg shadow-xs"
          >
            + Add Question
          </button>
        </div>

        {/* Question Cards */}
        {questions.length === 0 ? (
          <div className="text-center py-8 text-xs font-semibold text-slate-400 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            No questions added. Click &quot;+ Add Question&quot; to start.
          </div>
        ) : (
          <div className="space-y-6">
            {questions.map((q, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200/50 rounded-2xl p-5 space-y-4 relative">
                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => handleRemoveQuestion(idx)}
                  className="absolute top-4 right-4 text-xs font-bold text-rose-600 hover:text-rose-800"
                >
                  Delete
                </button>

                <h6 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Question #{idx + 1}</h6>

                {/* Question text */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Question *</label>
                  <input
                    type="text"
                    value={q.question}
                    onChange={(e) => handleQuestionFieldChange(idx, "question", e.target.value)}
                    placeholder="Enter question text..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-semibold bg-white focus:border-slate-900 focus:outline-hidden"
                    required
                  />
                </div>

                {/* Grid for Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Option A */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Option A *</label>
                    <input
                      type="text"
                      value={q.option_a}
                      onChange={(e) => handleQuestionFieldChange(idx, "option_a", e.target.value)}
                      placeholder="Answer option A"
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-semibold bg-white focus:border-slate-900 focus:outline-hidden"
                      required
                    />
                  </div>

                  {/* Option B */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Option B *</label>
                    <input
                      type="text"
                      value={q.option_b}
                      onChange={(e) => handleQuestionFieldChange(idx, "option_b", e.target.value)}
                      placeholder="Answer option B"
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-semibold bg-white focus:border-slate-900 focus:outline-hidden"
                      required
                    />
                  </div>

                  {/* Option C */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Option C *</label>
                    <input
                      type="text"
                      value={q.option_c}
                      onChange={(e) => handleQuestionFieldChange(idx, "option_c", e.target.value)}
                      placeholder="Answer option C"
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-semibold bg-white focus:border-slate-900 focus:outline-hidden"
                      required
                    />
                  </div>

                  {/* Option D */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Option D *</label>
                    <input
                      type="text"
                      value={q.option_d}
                      onChange={(e) => handleQuestionFieldChange(idx, "option_d", e.target.value)}
                      placeholder="Answer option D"
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-semibold bg-white focus:border-slate-900 focus:outline-hidden"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Correct Option */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Correct Option *</label>
                    <select
                      value={q.correct_option}
                      onChange={(e) => handleQuestionFieldChange(idx, "correct_option", e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 bg-white focus:border-slate-900 focus:outline-hidden"
                    >
                      <option value="A">Option A</option>
                      <option value="B">Option B</option>
                      <option value="C">Option C</option>
                      <option value="D">Option D</option>
                    </select>
                  </div>

                  {/* Explanation */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Explanation</label>
                    <input
                      type="text"
                      value={q.explanation}
                      onChange={(e) => handleQuestionFieldChange(idx, "explanation", e.target.value)}
                      placeholder="Why is this option correct?"
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-semibold bg-white focus:border-slate-900 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-6 shrink-0">
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="text-xs font-bold text-rose-600 hover:text-rose-800 px-3 py-2 rounded-xl transition-colors cursor-pointer"
          >
            Delete Quiz
          </button>
          
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs sm:text-sm font-bold text-slate-500 hover:text-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-slate-950 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Saving..." : "Save Quiz"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
