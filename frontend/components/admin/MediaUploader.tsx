"use client";

import React, { useState, useRef } from "react";

interface MediaUploaderProps {
  onUploadSuccess?: (fileKey: string) => void;
  onChange?: (fileKey: string) => void;
  accept?: string;
  label?: string;
  currentValue?: string | null;
  value?: string | null;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  onUploadSuccess,
  onChange,
  accept = "image/*,application/pdf",
  label = "Click or drag file here to upload",
  currentValue,
  value,
}) => {
  const effectiveValue = value !== undefined ? value : currentValue;
  const handleSuccess = (key: string) => {
    if (onUploadSuccess) onUploadSuccess(key);
    if (onChange) onChange(key);
  };
  const [mode, setMode] = useState<"file" | "url">("file");
  const [urlInput, setUrlInput] = useState(effectiveValue || "");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFile(e.target.files[0]);
    }
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(10);
    setFileName(file.name);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploadProgress(40);
      const res = await fetch("/api/storage/upload", {
        method: "POST",
        body: formData,
      });

      setUploadProgress(80);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "File upload failed");
      }

      setUploadProgress(100);
      handleSuccess(data.fileKey);
    } catch (err: unknown) {
      console.error("[MediaUploader] Upload error:", err);
      const errMsg = err instanceof Error ? err.message : "Failed to upload file";
      setError(errMsg);
      setFileName(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    handleSuccess(urlInput.trim());
    setError(null);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadFile(e.dataTransfer.files[0]);
    }
  };

  const triggerSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      {/* Mode Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-100 pb-2 text-xs font-bold">
        <button
          type="button"
          onClick={() => setMode("file")}
          className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
            mode === "file"
              ? "bg-slate-900 text-white"
              : "text-slate-500 hover:text-slate-900 bg-slate-100/80"
          }`}
        >
          📁 Upload File
        </button>
        <button
          type="button"
          onClick={() => setMode("url")}
          className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
            mode === "url"
              ? "bg-slate-900 text-white"
              : "text-slate-500 hover:text-slate-900 bg-slate-100/80"
          }`}
        >
          🔗 Enter Direct URL
        </button>
      </div>

      {mode === "file" ? (
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={triggerSelect}
          className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all duration-150 select-none ${
            isDragging
              ? "border-[#219EBC] bg-[#219EBC]/5"
              : "border-slate-200 hover:border-slate-350 bg-slate-50/50"
          } ${isUploading ? "pointer-events-none opacity-60" : ""}`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept={accept}
            className="hidden"
          />

          <div className="space-y-1.5">
            <div className="w-9 h-9 mx-auto rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
              </svg>
            </div>

            <div className="text-xs sm:text-sm font-bold text-slate-700">
              {fileName ? `Selected: ${fileName}` : label}
            </div>
            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">
              Images (PNG, JPG, WEBP) & Documents
            </p>
          </div>

          {isUploading && (
            <div className="mt-3 space-y-1">
              <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                <div
                  className="bg-[#219EBC] h-full transition-all duration-150"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Uploading... {uploadProgress}%
              </div>
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleUrlSubmit} className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://images.unsplash.com/photo-..."
            className="flex-grow p-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:border-slate-900 focus:outline-hidden"
          />
          <button
            type="submit"
            className="bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
          >
            Apply URL
          </button>
        </form>
      )}

      {currentValue && (
        <div className="text-xs font-semibold text-slate-600 truncate bg-slate-50 border border-slate-200 p-2.5 rounded-xl flex items-center justify-between">
          <span className="truncate max-w-xs font-mono text-[11px]">{currentValue}</span>
          <span className="text-emerald-600 shrink-0 font-bold text-[10px] uppercase tracking-wider ml-2">✓ Saved</span>
        </div>
      )}

      {error && (
        <div className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 p-2.5 rounded-xl">
          {error}
        </div>
      )}
    </div>
  );
};
