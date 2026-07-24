import React from "react";
import {
  FileText,
  FileCode,
  Presentation,
  Image as ImageIcon,
  File as GenericFile,
} from "lucide-react";

const IMAGE_EXTENSIONS = ["png", "jpg", "jpeg", "webp", "gif", "svg", "bmp", "avif"];
const IMAGE_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/bmp",
  "image/avif",
];

const PPT_EXTENSIONS = ["ppt", "pptx"];
const PPT_MIME_TYPES = [
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/powerpoint",
];

const WORD_EXTENSIONS = ["doc", "docx", "txt"];
const WORD_MIME_TYPES = [
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

/**
 * Checks if a file is an image based on MIME type or file extension.
 */
export function isImageFile(mimeType: string, filename?: string): boolean {
  const mime = (mimeType || "").toLowerCase();
  if (IMAGE_MIME_TYPES.some((m) => mime.includes(m)) || mime.startsWith("image/")) {
    return true;
  }
  if (filename) {
    const ext = filename.split(".").pop()?.toLowerCase() || "";
    return IMAGE_EXTENSIONS.includes(ext);
  }
  return false;
}

/**
 * Checks if a file is a PowerPoint presentation (.ppt, .pptx).
 */
export function isPptFile(mimeType: string, filename?: string): boolean {
  const mime = (mimeType || "").toLowerCase();
  if (PPT_MIME_TYPES.some((m) => mime.includes(m)) || mime.includes("presentation") || mime.includes("powerpoint")) {
    return true;
  }
  if (filename) {
    const ext = filename.split(".").pop()?.toLowerCase() || "";
    return PPT_EXTENSIONS.includes(ext);
  }
  return false;
}

/**
 * Checks if a file is a Word or Text document (.doc, .docx, .txt).
 */
export function isWordFile(mimeType: string, filename?: string): boolean {
  const mime = (mimeType || "").toLowerCase();
  if (WORD_MIME_TYPES.some((m) => mime.includes(m))) {
    return true;
  }
  if (filename) {
    const ext = filename.split(".").pop()?.toLowerCase() || "";
    return WORD_EXTENSIONS.includes(ext);
  }
  return false;
}

/**
 * Returns the normalized file category string.
 */
export function getPreviewType(mimeType: string, filename?: string): "image" | "pdf" | "ppt" | "docs" | "other" {
  if (isImageFile(mimeType, filename)) return "image";
  if ((mimeType || "").toLowerCase().includes("pdf") || (filename || "").toLowerCase().endsWith(".pdf")) return "pdf";
  if (isPptFile(mimeType, filename)) return "ppt";
  if (isWordFile(mimeType, filename)) return "docs";
  return "other";
}

/**
 * Returns the appropriate Lucide icon component for a file type.
 */
export function getFileIcon(mimeType: string, filename?: string, className: string = "w-5 h-5"): React.ReactElement {
  const type = getPreviewType(mimeType, filename);
  switch (type) {
    case "image":
      return React.createElement(ImageIcon, { className: `${className} text-[#38BDF8]` });
    case "pdf":
      return React.createElement(FileText, { className: `${className} text-[#219EBC]` });
    case "ppt":
      return React.createElement(Presentation, { className: `${className} text-[#FFB703]` });
    case "docs":
      return React.createElement(FileCode, { className: `${className} text-[#FB8500]` });
    default:
      return React.createElement(GenericFile, { className: `${className} text-slate-500` });
  }
}
