"use client";

import React, { useState, useEffect } from "react";
import { DBCourse, DBCourseSection, DBLecture } from "@/types/admin.types";
import { SectionFormModal } from "./SectionFormModal";
import { LectureFormModal } from "./LectureFormModal";
import { QuizBuilder } from "./QuizBuilder";
import { TaskBuilder } from "./TaskBuilder";
import {
  getCourseSections,
  deleteSection,
  reorderSections,
  getSectionLectures,
  deleteLecture,
  reorderLectures,
} from "@/lib/api/cms";

interface LectureManagerProps {
  course: DBCourse;
  onClose: () => void;
}

export const LectureManager: React.FC<LectureManagerProps> = ({ course, onClose }) => {
  const [sections, setSections] = useState<DBCourseSection[]>([]);
  const [lecturesBySection, setLecturesBySection] = useState<Record<string, DBLecture[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [isSectionOpen, setIsSectionOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<DBCourseSection | null>(null);
  
  const [isLectureOpen, setIsLectureOpen] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [editingLecture, setEditingLecture] = useState<DBLecture | null>(null);

  // Sub-builders state
  const [activeQuizLectureId, setActiveQuizLectureId] = useState<string | null>(null);
  const [activeTaskLectureId, setActiveTaskLectureId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const secs = await getCourseSections(course.id);
      setSections(secs);

      const lecsMap: Record<string, DBLecture[]> = {};
      for (const sec of secs) {
        const lecs = await getSectionLectures(sec.id);
        lecsMap[sec.id] = lecs;
      }
      setLecturesBySection(lecsMap);
    } catch (err: unknown) {
      console.error("[LectureManager] Error loading syllabus:", err);
      setError("Failed to load course syllabus.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course.id]);

  // Section CRUD handlers
  const handleAddSection = () => {
    setEditingSection(null);
    setIsSectionOpen(true);
  };

  const handleEditSection = (sec: DBCourseSection) => {
    setEditingSection(sec);
    setIsSectionOpen(true);
  };

  const handleDeleteSection = async (secId: string) => {
    if (!confirm("Are you sure you want to delete this section? All lectures inside will be permanently deleted.")) {
      return;
    }
    try {
      await deleteSection(secId);
      await loadData();
    } catch (err) {
      console.error(err);
      alert("Failed to delete section");
    }
  };

  const handleMoveSection = async (idx: number, direction: "up" | "down") => {
    const newSecs = [...sections];
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= newSecs.length) return;

    // Swap order
    const temp = newSecs[idx];
    newSecs[idx] = newSecs[targetIdx];
    newSecs[targetIdx] = temp;

    const payload = newSecs.map((s, index) => ({
      id: s.id,
      order: index,
    }));

    try {
      setSections(newSecs);
      await reorderSections(payload);
    } catch (err) {
      console.error("Reorder error:", err);
    }
  };

  // Lecture CRUD handlers
  const handleAddLecture = (secId: string) => {
    setActiveSectionId(secId);
    setEditingLecture(null);
    setIsLectureOpen(true);
  };

  const handleEditLecture = (secId: string, lec: DBLecture) => {
    setActiveSectionId(secId);
    setEditingLecture(lec);
    setIsLectureOpen(true);
  };

  const handleDeleteLecture = async (lecId: string) => {
    if (!confirm("Are you sure you want to delete this lecture?")) return;
    try {
      await deleteLecture(lecId);
      await loadData();
    } catch (err) {
      console.error(err);
      alert("Failed to delete lecture");
    }
  };

  const handleMoveLecture = async (secId: string, idx: number, direction: "up" | "down") => {
    const lecs = [...(lecturesBySection[secId] || [])];
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= lecs.length) return;

    // Swap order
    const temp = lecs[idx];
    lecs[idx] = lecs[targetIdx];
    lecs[targetIdx] = temp;

    const payload = lecs.map((l, index) => ({
      id: l.id,
      order: index,
    }));

    try {
      setLecturesBySection((prev) => ({ ...prev, [secId]: lecs }));
      await reorderLectures(payload);
    } catch (err) {
      console.error("Reorder error:", err);
    }
  };

  if (loading && sections.length === 0) {
    return <div className="text-center py-16 text-xs font-bold text-slate-400 uppercase tracking-wider">Loading Syllabus Tree...</div>;
  }

  // Quiz Builder Overlay
  if (activeQuizLectureId) {
    return (
      <QuizBuilder
        lectureId={activeQuizLectureId}
        onClose={() => {
          setActiveQuizLectureId(null);
          loadData();
        }}
      />
    );
  }

  // Task Builder Overlay
  if (activeTaskLectureId) {
    return (
      <TaskBuilder
        lectureId={activeTaskLectureId}
        onClose={() => {
          setActiveTaskLectureId(null);
          loadData();
        }}
      />
    );
  }

  return (
    <div className="space-y-6 select-text max-h-[85vh] flex flex-col overflow-hidden">
      {/* Header Panel */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
        <div>
          <h4 className="text-base font-extrabold text-slate-900">{course.title} - Syllabus</h4>
          <p className="text-slate-500 text-xs font-semibold">Manage section hierarchy, lecture items, tasks, and quizzes.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleAddSection}
            className="text-xs font-bold bg-slate-900 text-white px-3.5 py-2 rounded-xl shadow-xs cursor-pointer hover:bg-slate-800"
          >
            + Add Section
          </button>
          <button
            onClick={onClose}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 px-3.5 py-2 rounded-xl border border-slate-200"
          >
            Back to Courses
          </button>
        </div>
      </div>

      {error && (
        <div className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 p-2.5 rounded-xl shrink-0">
          {error}
        </div>
      )}

      {/* Main Sections Tree (Scrollable) */}
      <div className="flex-grow overflow-y-auto space-y-6 pr-2">
        {sections.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
            <p className="text-slate-400 text-xs font-semibold">No sections created yet. Add a section to start structuring your course.</p>
          </div>
        ) : (
          sections.map((sec, secIdx) => {
            const lecs = Array.isArray(lecturesBySection[sec.id]) ? lecturesBySection[sec.id] : [];
            return (
              <div key={sec.id} className="border border-slate-200/60 rounded-2xl bg-white overflow-hidden shadow-xs">
                {/* Section Header Row */}
                <div className="p-4 sm:p-5 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between gap-4">
                  <div className="space-y-0.5 truncate">
                    <h5 className="text-sm sm:text-base font-extrabold text-slate-900 truncate">{sec.title}</h5>
                    {sec.description && (
                      <p className="text-slate-500 text-xs font-medium truncate">{sec.description}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {/* Up/Down buttons */}
                    <button
                      onClick={() => handleMoveSection(secIdx, "up")}
                      disabled={secIdx === 0}
                      className="text-xs font-bold text-slate-400 hover:text-slate-700 disabled:opacity-20"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => handleMoveSection(secIdx, "down")}
                      disabled={secIdx === sections.length - 1}
                      className="text-xs font-bold text-slate-400 hover:text-slate-700 disabled:opacity-20"
                    >
                      ▼
                    </button>

                    <span className="text-slate-200 text-xs">|</span>

                    <button
                      onClick={() => handleAddLecture(sec.id)}
                      className="text-xs font-bold text-[#219EBC] hover:underline"
                    >
                      + Add Lecture
                    </button>
                    <button
                      onClick={() => handleEditSection(sec)}
                      className="text-xs font-bold text-slate-500 hover:text-slate-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteSection(sec.id)}
                      className="text-xs font-bold text-rose-600 hover:text-rose-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Section Lectures List */}
                <div className="p-4 sm:p-5 space-y-3 bg-white">
                  {lecs.length === 0 ? (
                    <div className="text-center py-6 text-xs font-semibold text-slate-400">
                      No lectures added to this section.
                    </div>
                  ) : (
                    lecs.map((lec, lecIdx) => (
                      <div
                        key={lec.id}
                        className="p-4 border border-slate-100 rounded-xl hover:border-slate-350 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1 truncate">
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-extrabold text-slate-800 truncate">{lec.title}</span>
                            <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                              lec.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
                            }`}>
                              {lec.status}
                            </span>
                          </div>
                          <p className="text-slate-500 text-xs truncate max-w-lg font-medium">{lec.description || "No description provided."}</p>
                        </div>

                        {/* Lecture Action tools */}
                        <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                          {/* Up/Down reordering */}
                          <button
                            onClick={() => handleMoveLecture(sec.id, lecIdx, "up")}
                            disabled={lecIdx === 0}
                            className="text-xs font-bold text-slate-400 hover:text-slate-700 disabled:opacity-20"
                          >
                            ▲
                          </button>
                          <button
                            onClick={() => handleMoveLecture(sec.id, lecIdx, "down")}
                            disabled={lecIdx === lecs.length - 1}
                            className="text-xs font-bold text-slate-400 hover:text-slate-700 disabled:opacity-20"
                          >
                            ▼
                          </button>

                          <span className="text-slate-200 text-xs">|</span>

                          {/* Quiz Builder */}
                          <button
                            onClick={() => setActiveQuizLectureId(lec.id)}
                            className="text-xs font-bold text-slate-600 hover:text-slate-800 border border-slate-200 px-2 py-1 rounded-lg"
                          >
                            Quiz
                          </button>

                          {/* Task Builder */}
                          <button
                            onClick={() => setActiveTaskLectureId(lec.id)}
                            className="text-xs font-bold text-slate-600 hover:text-slate-800 border border-slate-200 px-2 py-1 rounded-lg"
                          >
                            Tasks
                          </button>

                          <button
                            onClick={() => handleEditLecture(sec.id, lec)}
                            className="text-xs font-bold text-[#219EBC] hover:text-[#219EBC]/80"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteLecture(lec.id)}
                            className="text-xs font-bold text-rose-600 hover:text-rose-800"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Sub Modals */}
      <SectionFormModal
        isOpen={isSectionOpen}
        onClose={() => setIsSectionOpen(false)}
        courseId={course.id}
        section={editingSection}
        onSaveSuccess={loadData}
        nextOrder={sections.length}
      />

      <LectureFormModal
        isOpen={isLectureOpen}
        onClose={() => setIsLectureOpen(false)}
        sectionId={activeSectionId || ""}
        lecture={editingLecture}
        onSaveSuccess={loadData}
        nextOrder={activeSectionId ? (lecturesBySection[activeSectionId] || []).length : 0}
      />
    </div>
  );
};
