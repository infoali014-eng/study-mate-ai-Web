"use client";

import React, { useState } from "react";
import { X, Share2, Users, Check, Copy } from "lucide-react";
import { Note } from "@/types/library.types";
import { getSupabaseClient } from "@/lib/supabase/client";

interface ShareNoteModalProps {
  note: Note | null;
  onClose: () => void;
}

export default function ShareNoteModal({ note, onClose }: ShareNoteModalProps) {
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [sharedSuccess, setSharedSuccess] = useState(false);

  if (!note) return null;

  const handleCreateShareReference = async () => {
    setSharing(true);
    try {
      const supabase = getSupabaseClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Create share reference row — ZERO binary duplication in R2!
        const db = supabase as unknown as {
          from: (table: string) => { insert: (data: Record<string, unknown>) => Promise<unknown> };
        };

        await db.from("note_shares").insert({
          note_id: note.id,
          shared_by: user.id,
          permission: "view",
        });

        // Log library_activity feed
        await db.from("library_activity").insert({
          user_id: user.id,
          note_id: note.id,
          action: "shared",
          details: { reference: "Study Group Share" },
        });
      }

      setSharedSuccess(true);
      setTimeout(() => setSharedSuccess(false), 2500);
    } catch (err) {
      console.error("[ShareNoteModal] Error creating reference share:", err);
    } finally {
      setSharing(false);
    }
  };

  const handleCopyReferenceLink = () => {
    const refLink = `${window.location.origin}/dashboard/library?noteId=${note.id}`;
    navigator.clipboard.writeText(refLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none animate-in fade-in-50">
      <div className="bg-white rounded-[20px] border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[8px] bg-[#FB8500]/10 text-[#FB8500] flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Share Note Reference</h3>
              <p className="text-[11px] text-slate-400 font-medium truncate max-w-[200px]">{note.title}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-[8px] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          <div className="p-3 bg-[#023047]/5 border border-[#023047]/10 rounded-[12px] text-slate-700 leading-relaxed">
            <div className="font-bold text-[#023047] mb-0.5 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#219EBC]" /> Zero-Duplication Architecture
            </div>
            Sharing this note creates a lightweight reference link for Study Groups. Physical storage in Cloudflare R2 is never duplicated.
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Internal Reference URL</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={`${window.location.origin}/dashboard/library?noteId=${note.id}`}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-[10px] px-3 py-2 text-xs font-mono text-slate-600 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleCopyReferenceLink}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-[10px] flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCreateShareReference}
            disabled={sharing}
            className="w-full py-2.5 bg-[#FB8500] hover:bg-[#e07700] text-white font-extrabold rounded-[12px] shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Users className="w-4 h-4" />
            <span>{sharing ? "Publishing Reference..." : "Publish Reference to Study Groups"}</span>
          </button>

          {sharedSuccess && (
            <div className="p-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-[10px] text-center font-bold animate-in fade-in-50">
              Reference share created successfully!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
