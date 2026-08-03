"use client";

import React, { useState, useEffect } from "react";
import { DBCourseSection } from "@/types/admin.types";
import { createSection, updateSection } from "@/lib/api/cms";

interface SectionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  section: DBCourseSection | null; // Null if creating
  onSaveSuccess: () => void;
  nextOrder: number;
}

export const SectionFormModal: React.FC<SectionFormModalProps> = ({
  isOpen,
  onClose,
  courseId,
  section,
  onSaveSuccess,
  nextOrder,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (section) {
      setTitle(section.title);
      setDescription(section.description || "");
      setOrder(section.order);
    } else {
      setTitle("");
      setDescription("");
      setOrder(nextOrder);
    }
    setError(null);
  }, [section, isOpen, nextOrder]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Section title is required.");
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      course_id: courseId,
      title,
      description: description || null,
      order,
    };

    try {
      if (section) {
        await updateSection(section.id, payload);
      } else {
        await createSection(payload);
      }
      onSaveSuccess();
      onClose();
    } catch (err: unknown) {
      console.error("[SectionFormModal] Error saving section:", err);
      const errMsg = err instanceof Error ? err.message : "Failed to save section.";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs select-none">
      <div className="bg-white rounded-3xl border border-slate-200/80 max-w-md w-full p-6 space-y-6 shadow-2xl animate-fade-in duration-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-lg font-black text-slate-900 tracking-tight">
            {section ? "Edit Section" : "Add New Section"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 p-2.5 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          {/* Title */}
          <div className="space-y-1.5 font-medium">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Section Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Getting Started"
              className="w-full p-3 rounded-xl border border-slate-200 text-sm font-semibold focus:border-slate-900 focus:outline-hidden"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Introduction and environment setup..."
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

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs sm:text-sm font-bold text-slate-500 hover:text-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-slate-950 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-colors shadow-xs"
            >
              {loading ? "Saving..." : "Save Section"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
