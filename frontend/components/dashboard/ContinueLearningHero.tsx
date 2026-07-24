"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BookOpen, Upload, Eye } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import DashboardSection from "./DashboardSection";
import { FeatureCard, Button } from "@/components/ui";
import { LibraryService } from "@/services/libraryService";
import { Note } from "@/types/library.types";
import { getFileIcon } from "@/utils/filePreview";
import NotePreviewModal from "@/components/library/NotePreviewModal";

export default function ContinueLearningHero() {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const { data: recentNotes = [], isLoading } = useQuery({
    queryKey: ["recentNotes"],
    queryFn: () => LibraryService.getRecentNotes(6),
  });

  const formatDate = (dateStr: string): string => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <>
      <DashboardSection
        title="Continue Learning"
        description="Pick up right where you left off with your recent study notes and documents"
      >
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-slate-100 rounded-[16px] animate-pulse border border-slate-200" />
            ))}
          </div>
        ) : recentNotes.length === 0 ? (
          <FeatureCard
            icon={<BookOpen className="w-7 h-7 text-[#219EBC]" />}
            title="You haven't uploaded study notes yet"
            description="Upload your first note or document to begin building your personal AI study workspace. Your active materials will appear here."
            action={
              <Link href="/dashboard/library">
                <Button variant="primary" size="md" leftIcon={<Upload className="w-4 h-4" />}>
                  Upload Notes
                </Button>
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentNotes.map((note) => (
              <div
                key={note.id}
                className="group bg-white rounded-[16px] border border-slate-200/90 hover:border-[#219EBC] p-4 shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between space-y-3 select-none"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-[12px] bg-slate-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    {getFileIcon(note.mime_type, note.original_filename, "w-5 h-5")}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 group-hover:text-[#219EBC] transition-colors truncate">
                      {note.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
                      {formatDate(note.created_at)}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">
                    v{note.current_version || 1}
                  </span>

                  <button
                    type="button"
                    onClick={() => setSelectedNote(note)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#219EBC]/10 hover:bg-[#219EBC] text-[#219EBC] hover:text-white rounded-[10px] text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Continue</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </DashboardSection>

      {/* Note Preview Modal for quick Continue action directly on Dashboard */}
      <NotePreviewModal note={selectedNote} onClose={() => setSelectedNote(null)} />
    </>
  );
}
