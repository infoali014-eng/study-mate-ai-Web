"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, Sparkles } from "lucide-react";

interface DropZoneUploadProps {
  onUpload: (files: File[]) => void;
  uploading: boolean;
  progress: number;
}

export default function DropZoneUpload({ onUpload, uploading, progress }: DropZoneUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      onUpload(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(Array.from(e.target.files));
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative w-full border-2 border-dashed rounded-[16px] p-6 text-center transition-all duration-200 select-none ${
        isDragOver
          ? "border-[#219EBC] bg-[#219EBC]/10 scale-[1.01]"
          : "border-slate-300/80 bg-white hover:border-[#219EBC]/60 hover:bg-slate-50/50"
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.docx,.pptx,.doc,.txt,.png,.jpg,.jpeg"
        onChange={handleFileSelect}
        className="hidden"
      />

      {uploading ? (
        <div className="space-y-3 py-2 max-w-sm mx-auto">
          <div className="flex items-center justify-center gap-2 text-[#023047] font-bold text-sm">
            <Sparkles className="w-5 h-5 text-[#219EBC] animate-spin" />
            <span>Uploading & Processing 6-Stage AI Pipeline...</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div
              className="h-full bg-gradient-to-r from-[#219EBC] to-[#FB8500] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
            <span>R2 Binary Upload + Deduplication</span>
            <span>{progress}%</span>
          </div>
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
              Drag & Drop your study notes or{" "}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[#219EBC] hover:underline font-extrabold cursor-pointer"
              >
                Browse Files
              </button>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Supports PDF, DOCX, PPTX, Images up to 50MB. Automatic SHA-256 R2 deduplication & text extraction.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
