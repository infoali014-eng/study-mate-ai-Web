"use client";

import React, { useState, useEffect } from "react";
import { DBCourse } from "@/types/admin.types";
import { MediaUploader } from "./MediaUploader";
import { createCourse, updateCourse } from "@/lib/api/cms";

interface CourseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: DBCourse | null; // Null if creating a new course
  onSaveSuccess: () => void;
}

export const CourseFormModal: React.FC<CourseFormModalProps> = ({
  isOpen,
  onClose,
  course,
  onSaveSuccess,
}) => {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [fullDesc, setFullDesc] = useState("");
  const [difficulty, setDifficulty] = useState<DBCourse["difficulty"]>("beginner");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState<DBCourse["status"]>("draft");
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize values when course changes
  useEffect(() => {
    if (course) {
      setTitle(course.title);
      setSlug(course.slug);
      setShortDesc(course.short_description);
      setFullDesc(course.full_description);
      setDifficulty(course.difficulty);
      setCategory(course.category);
      setTags(course.tags.join(", "));
      setStatus(course.status);
      setThumbnailUrl(course.thumbnail_url);
    } else {
      setTitle("");
      setSlug("");
      setShortDesc("");
      setFullDesc("");
      setDifficulty("beginner");
      setCategory("");
      setTags("");
      setStatus("draft");
      setThumbnailUrl(null);
    }
    setError(null);
  }, [course, isOpen]);

  // Auto-generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!course) {
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
    if (!title.trim() || !slug.trim() || !shortDesc.trim() || !category.trim()) {
      setError("Please fill out all required fields (*).");
      return;
    }

    setLoading(true);
    setError(null);

    const parsedTags = tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const coursePayload = {
      title,
      slug,
      short_description: shortDesc,
      full_description: fullDesc,
      difficulty,
      category,
      tags: parsedTags,
      status,
      thumbnail_url: thumbnailUrl,
    };

    try {
      if (course) {
        await updateCourse(course.id, coursePayload);
      } else {
        await createCourse(coursePayload);
      }
      onSaveSuccess();
      onClose();
    } catch (err: unknown) {
      console.error("[CourseFormModal] Error saving:", err);
      const errMsg = err instanceof Error ? err.message : "Failed to save course.";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs select-none">
      <div className="bg-white rounded-3xl border border-slate-200/80 max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-fade-in duration-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
          <h3 className="text-xl font-black text-slate-900 tracking-tight">
            {course ? "Edit Course" : "Create New Course"}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSave} className="flex-grow overflow-y-auto p-6 sm:p-8 space-y-6">
          {error && (
            <div className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 p-3 rounded-xl">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                Course Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                placeholder="e.g. Compiler Engineering"
                className="w-full p-3 rounded-xl border border-slate-200 text-sm font-semibold focus:border-slate-900 focus:outline-hidden"
                required
              />
            </div>

            {/* Slug */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                Course Slug *
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="compiler-engineering"
                className="w-full p-3 rounded-xl border border-slate-200 text-sm font-semibold focus:border-slate-900 focus:outline-hidden"
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                Category *
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Systems Engineering"
                className="w-full p-3 rounded-xl border border-slate-200 text-sm font-semibold focus:border-slate-900 focus:outline-hidden"
                required
              />
            </div>

            {/* Difficulty */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as DBCourse["difficulty"])}
                className="w-full p-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 bg-white focus:border-slate-900 focus:outline-hidden"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Short Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Short Description *
            </label>
            <input
              type="text"
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
              placeholder="Provide a quick one-sentence summary..."
              className="w-full p-3 rounded-xl border border-slate-200 text-sm font-semibold focus:border-slate-900 focus:outline-hidden"
              required
            />
          </div>

          {/* Full Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Full Description
            </label>
            <textarea
              rows={4}
              value={fullDesc}
              onChange={(e) => setFullDesc(e.target.value)}
              placeholder="Provide the full curriculum summary description..."
              className="w-full p-3 rounded-xl border border-slate-200 text-sm font-medium focus:border-slate-900 focus:outline-hidden resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Tags */}
            <div className="space-y-1.5 font-medium">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                Tags (Comma Separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="compiler, logic, parse"
                className="w-full p-3 rounded-xl border border-slate-200 text-sm font-semibold focus:border-slate-900 focus:outline-hidden"
              />
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as DBCourse["status"])}
                className="w-full p-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 bg-white focus:border-slate-900 focus:outline-hidden"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          {/* Thumbnail Uploader */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Course Thumbnail Image
            </label>
            <MediaUploader
              accept="image/*"
              label="Select course thumbnail image file"
              currentValue={thumbnailUrl}
              onUploadSuccess={(fileKey) => setThumbnailUrl(fileKey)}
            />
          </div>

          {/* Submit Footer */}
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
              {loading ? "Saving..." : "Save Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
