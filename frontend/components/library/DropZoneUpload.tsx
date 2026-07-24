"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";

interface DropZoneUploadProps {
  onUpload: (files: File[]) => void;
  uploading: boolean;
  progress: number;
  error?: string | null;
  success?: boolean;
}

const ALLOWED_EXTENSIONS = [".pdf", ".docx", ".pptx", ".doc", ".txt", ".png", ".jpg", ".jpeg", ".webp"];

export default function DropZoneUpload({
  onUpload,
  uploading,
  progress,
  error,
  success,
}: DropZoneUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFiles = (files: File[]): File[] => {
    setLocalError(null);
    const validFiles: File[] = [];

    for (const file of files) {
      const ext = "." + file.name.split(".").pop()?.toLowerCase();
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        setLocalError(`"${file.name}" is an unsupported file format. Please upload PDF, DOCX, PPTX, TXT, or Image files.`);
        return [];
      }
      if (file.size > 50 * 1024 * 1024) {
        setLocalError(`"${file.name}" exceeds the 50MB maximum upload size limit.`);
        return [];
      }
      validFiles.push(file);
    }
    return validFiles;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = validateFiles(Array.from(e.dataTransfer.files));
      if (files.length > 0) {
        onUpload(files);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = validateFiles(Array.from(e.target.files));
      if (files.length > 0) {
        onUpload(files);
      }
    }
  };

  const activeError = error || localError;

  return (
    <div className="space-y-2 select-none">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative w-full border-2 border-dashed rounded-[16px] p-6 text-center transition-all duration-200 ${
          isDragOver
            ? "border-[#219EBC] bg-[#219EBC]/10 scale-[1.01]"
            : "border-slate-300/80 bg-white hover:border-[#219EBC]/60 hover:bg-slate-50/50"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.pptx,.doc,.txt,.png,.jpg,.jpeg,.webp"
          onChange={handleFileSelect}
          className="hidden"
        />

        {uploading ? (
          <div className="space-y-3 py-2 max-w-sm mx-auto">
            <div className="flex items-center justify-center gap-2 text-[#023047] font-bold text-sm">
              <Sparkles className="w-5 h-5 text-[#219EBC] animate-spin" />
              <span>Uploading to Cloudflare R2 & Extracting Text...</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div
                className="h-full bg-gradient-to-r from-[#219EBC] to-[#FB8500] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
              <span>SHA-256 R2 Object Stream</span>
              <span>{progress}%</span>
            </div>
          </div>
        ) : success ? (
          <div className="flex items-center justify-center gap-2 text-emerald-600 font-bold py-2 text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span>Upload successful! Physical object saved in Cloudflare R2 & metadata recorded in Supabase.</span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-3">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-12 h-12 rounded-2xl bg-[#219EBC]/10 text-[#219EBC] flex items-center justify-center cursor-pointer transition-transform hover:scale-110 shadow-xs"
            >
              <UploadCloud className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <div className="text-sm font-extrabold text-slate-900">
                Drag & Drop study notes or{" "}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[#219EBC] hover:underline font-extrabold cursor-pointer"
                >
                  Browse Files
                </button>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Supports PDF, DOCX, PPTX, TXT & Images (PNG, JPG, WEBP) up to 50MB. Automatic SHA-256 R2 deduplication.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Validation / Upload Error Alert */}
      {activeError && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-[12px] text-xs font-bold flex items-center gap-2 animate-in fade-in-50">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{activeError}</span>
        </div>
      )}
    </div>
  );
}
