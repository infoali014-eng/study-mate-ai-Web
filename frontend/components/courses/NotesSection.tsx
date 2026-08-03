"use client";

import React from "react";
import { Note } from "@/types/course.types";

interface NotesSectionProps {
  notes: Note;
}

export const NotesSection: React.FC<NotesSectionProps> = ({ notes }) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = notes.pdfUrl || "/courses/notes/sample-notes.pdf";
    link.download = `${notes.title.toLowerCase().replace(/\s+/g, "-")}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper to parse notes markdown into styled HTML elements
  const parseMarkdown = (content: string) => {
    const lines = content.split("\n");
    let isCodeBlock = false;
    let codeContent: string[] = [];
    const elements: React.ReactNode[] = [];

    lines.forEach((line, idx) => {
      // Toggle Code Blocks
      if (line.trim().startsWith("```")) {
        if (isCodeBlock) {
          elements.push(
            <pre key={idx} className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs sm:text-sm overflow-x-auto my-4 border border-slate-800 leading-relaxed">
              <code>{codeContent.join("\n")}</code>
            </pre>
          );
          codeContent = [];
          isCodeBlock = false;
        } else {
          isCodeBlock = true;
        }
        return;
      }

      if (isCodeBlock) {
        codeContent.push(line);
        return;
      }

      const trimmed = line.trim();

      // Headings
      if (trimmed.startsWith("## ")) {
        elements.push(
          <h2 key={idx} className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-8 mb-4 border-b border-slate-100 pb-2">
            {trimmed.replace("## ", "")}
          </h2>
        );
      } else if (trimmed.startsWith("### ")) {
        elements.push(
          <h3 key={idx} className="text-lg font-bold text-slate-900 mt-6 mb-3">
            {trimmed.replace("### ", "")}
          </h3>
        );
      }
      // Ordered/Unordered Lists
      else if (trimmed.match(/^\d+\.\s/)) {
        elements.push(
          <div key={idx} className="flex gap-2 text-slate-600 text-sm sm:text-base leading-relaxed pl-2 my-1">
            <span className="font-bold text-slate-800 shrink-0">{trimmed.split(".")[0]}.</span>
            <span>{trimmed.replace(/^\d+\.\s/, "")}</span>
          </div>
        );
      } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        elements.push(
          <div key={idx} className="flex gap-2 text-slate-600 text-sm sm:text-base leading-relaxed pl-2 my-1">
            <span className="text-[#219EBC] font-extrabold shrink-0">•</span>
            <span>{trimmed.replace(/^[-*]\s/, "")}</span>
          </div>
        );
      }
      // Blank Line
      else if (trimmed === "") {
        elements.push(<div key={idx} className="h-2" />);
      }
      // Regular Paragraph
      else {
        // Simple inline code replacement
        const parts = line.split("`");
        const renderedLine = parts.map((part, pIdx) => {
          if (pIdx % 2 === 1) {
            return (
              <code key={pIdx} className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded-md font-mono text-xs border border-slate-200/50">
                {part}
              </code>
            );
          }
          return part;
        });

        elements.push(
          <p key={idx} className="text-slate-600 text-sm sm:text-base leading-relaxed my-2.5">
            {renderedLine}
          </p>
        );
      }
    });

    return elements;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Lecture Notes
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm font-medium">
            Read the key concepts covered in this lesson.
          </p>
        </div>
        <button
          onClick={handleDownload}
          className="inline-flex items-center justify-center gap-2 bg-slate-950 text-white font-bold text-xs sm:text-sm px-4.5 py-2.5 rounded-xl hover:bg-slate-800 transition-colors shadow-xs"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Download PDF
        </button>
      </div>

      <div className="bg-white border border-slate-200/60 rounded-2xl p-6 sm:p-8 select-text">
        <article className="prose prose-slate max-w-none">
          {parseMarkdown(notes.content)}
        </article>
      </div>

      {/* PDF Document Embedded Preview */}
      {notes.pdfUrl && (
        <div className="space-y-3 pt-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Lecture Notes PDF Preview
            </h3>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <span>✓</span> Interactive PDF Document
            </span>
          </div>
          <div className="w-full h-[450px] sm:h-[600px] rounded-2xl overflow-hidden border border-slate-200/80 bg-slate-900 shadow-sm">
            <iframe
              src={`${notes.pdfUrl}#toolbar=0`}
              className="w-full h-full border-none"
              title={`${notes.title} PDF Document`}
            />
          </div>
        </div>
      )}
    </div>
  );
};
