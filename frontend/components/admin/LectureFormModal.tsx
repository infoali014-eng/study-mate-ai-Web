"use client";

import React, { useState, useEffect } from "react";
import { DBLecture } from "@/types/admin.types";
import { MediaUploader } from "./MediaUploader";
import { createLecture, updateLecture } from "@/lib/api/cms";

interface LectureFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectionId: string;
  lecture: DBLecture | null; // Null if creating
  onSaveSuccess: () => void;
  nextOrder: number;
}

export const LectureFormModal: React.FC<LectureFormModalProps> = ({
  isOpen,
  onClose,
  sectionId,
  lecture,
  onSaveSuccess,
  nextOrder,
}) => {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [notesPdfUrl, setNotesPdfUrl] = useState<string | null>(null);
  const [order, setOrder] = useState(0);
  const [status, setStatus] = useState<DBLecture["status"]>("published");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (lecture) {
      setTitle(lecture.title);
      setSlug(lecture.slug);
      setDescription(lecture.description || "");
      setVideoUrl(lecture.video_url || "");
      setNotesPdfUrl(lecture.notes_pdf_url);
      setOrder(lecture.order);
      setStatus(lecture.status);
    } else {
      setTitle("");
      setSlug("");
      setDescription("");
      setVideoUrl("");
      setNotesPdfUrl(null);
      setOrder(nextOrder);
      setStatus("published");
    }
    setError(null);
  }, [lecture, isOpen, nextOrder]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!lecture) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
      );
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) {
      setError("Lecture title and slug are required.");
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      section_id: sectionId,
      title,
      slug,
      description: description || null,
      video_url: videoUrl || null,
      notes_pdf_url: notesPdfUrl || null,
      order,
      status,
    };

    try {
      if (lecture) {
        await updateLecture(lecture.id, payload);
      } else {
        await createLecture(payload);
      }
      onSaveSuccess();
      onClose();
    } catch (err: unknown) {
      console.error("[LectureFormModal] Error saving lecture:", err);
      const errMsg = err instanceof Error ? err.message : "Failed to save lecture.";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs select-none">
      <div className="bg-white rounded-3xl border border-slate-200/80 max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl animate-fade-in duration-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
          <h3 className="text-lg font-black text-slate-900 tracking-tight">
            {lecture ? "Edit Lecture" : "Add New Lecture"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSave} className="flex-grow overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 p-2.5 rounded-xl">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                Lecture Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                placeholder="e.g. Variables and Types"
                className="w-full p-3 rounded-xl border border-slate-200 text-sm font-semibold focus:border-slate-900 focus:outline-hidden"
                required
              />
            </div>

            {/* Slug */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                Lecture Slug *
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="variables-and-types"
                className="w-full p-3 rounded-xl border border-slate-200 text-sm font-semibold focus:border-slate-900 focus:outline-hidden"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a quick summary of what is covered..."
              className="w-full p-3 rounded-xl border border-slate-200 text-sm font-medium focus:border-slate-900 focus:outline-hidden resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Video URL */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                Related YouTube / Video URL
              </label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full p-3 rounded-xl border border-slate-200 text-sm font-semibold focus:border-slate-900 focus:outline-hidden"
              />
            </div>

            {/* Order */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                Display Order
              </label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                className="w-full p-3 rounded-xl border border-slate-200 text-sm font-semibold focus:border-slate-900 focus:outline-hidden"
                required
              />
            </div>
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as DBLecture["status"])}
              className="w-full p-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 bg-white focus:border-slate-900 focus:outline-hidden"
            >
              <option value="draft">Draft (Hidden)</option>
              <option value="published">Published (Visible)</option>
            </select>
          </div>

          {/* Notes PDF Upload */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Study Notes PDF
            </label>
            <MediaUploader
              accept="application/pdf"
              label="Select study notes PDF file"
              currentValue={notesPdfUrl}
              onUploadSuccess={(fileKey) => setNotesPdfUrl(fileKey)}
            />
          </div>

          {/* Actions Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 shrink-0">
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
              {loading ? "Saving..." : "Save Lecture"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
