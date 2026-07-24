"use client";

import React, { useState } from "react";
import {
  Folder as FolderIcon,
  Plus,
  Star,
  FileText,
  FileCode,
  Image as ImageIcon,
  Presentation,
  Archive,
  Users,
  ChevronDown,
  ChevronRight,
  Trash2,
} from "lucide-react";
import { Folder, FileCategoryFilter, StorageUsageStats } from "@/types/library.types";
import StorageUsageCard from "./StorageUsageCard";

interface LibrarySidebarProps {
  folders: Folder[];
  activeCategory: FileCategoryFilter;
  activeFolderId: string | null;
  onSelectCategory: (category: FileCategoryFilter) => void;
  onSelectFolder: (folderId: string | null) => void;
  onCreateFolderClick: () => void;
  onDeleteFolderClick?: (folder: Folder) => void;
  storageStats: StorageUsageStats;
}

export default function LibrarySidebar({
  folders,
  activeCategory,
  activeFolderId,
  onSelectCategory,
  onSelectFolder,
  onCreateFolderClick,
  onDeleteFolderClick,
  storageStats,
}: LibrarySidebarProps) {
  const [personalExpanded, setPersonalExpanded] = useState(true);
  const [sharedExpanded, setSharedExpanded] = useState(true);
  const [archiveExpanded, setArchiveExpanded] = useState(false);

  const personalFolders = folders.filter((f) => f.folder_type === "personal" || !f.folder_type);
  const sharedFolders = folders.filter((f) => f.folder_type === "shared");
  const archiveFolders = folders.filter((f) => f.folder_type === "archive");

  const categoryItems: { id: FileCategoryFilter; label: string; icon: React.ElementType }[] = [
    { id: "all", label: "All Study Notes", icon: FileText },
    { id: "favorites", label: "Favorite Notes", icon: Star },
    { id: "pdf", label: "PDF Documents", icon: FileText },
    { id: "docs", label: "Word & Notes", icon: FileCode },
    { id: "slides", label: "Presentations", icon: Presentation },
    { id: "images", label: "Diagrams & Images", icon: ImageIcon },
  ];

  return (
    <aside className="w-full lg:w-64 shrink-0 space-y-5 select-none">
      {/* 1. Quick Category Navigation Links */}
      <div className="bg-white rounded-[16px] border border-slate-200/80 p-3 shadow-xs space-y-1">
        <div className="px-2 py-1 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
          Library Categories
        </div>
        {categoryItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeCategory === item.id && activeFolderId === null;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectCategory(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-[10px] text-xs font-semibold transition-colors duration-120 cursor-pointer ${
                isActive
                  ? "bg-[#219EBC]/10 text-[#023047] font-bold"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? "text-[#219EBC]" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 2. Folders Tree (Personal, Shared, Archive) */}
      <div className="bg-white rounded-[16px] border border-slate-200/80 p-3 shadow-xs space-y-3">
        <div className="flex items-center justify-between px-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
            Folders
          </span>
          <button
            type="button"
            onClick={onCreateFolderClick}
            className="p-1 text-slate-400 hover:text-[#219EBC] hover:bg-slate-100 rounded-[6px] transition-colors cursor-pointer"
            title="Create new folder"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Personal Folders Section */}
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => setPersonalExpanded(!personalExpanded)}
            className="w-full flex items-center justify-between px-2 py-1 text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors"
          >
            <div className="flex items-center gap-1.5">
              {personalExpanded ? (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              )}
              <span>Personal Folders</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">{personalFolders.length}</span>
          </button>

          {personalExpanded && (
            <div className="pl-3 space-y-0.5 border-l border-slate-100 ml-2">
              {personalFolders.length === 0 ? (
                <div className="px-3 py-1.5 text-[11px] text-slate-400 italic">No personal folders</div>
              ) : (
                personalFolders.map((f) => {
                  const isActive = activeFolderId === f.id;
                  return (
                    <div
                      key={f.id}
                      className={`group/folder w-full flex items-center justify-between px-2.5 py-1.5 rounded-[8px] text-xs font-medium transition-colors cursor-pointer ${
                        isActive
                          ? "bg-[#219EBC] text-white font-bold"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                      onClick={() => onSelectFolder(f.id)}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FolderIcon
                          className="w-3.5 h-3.5 shrink-0"
                          style={{ color: isActive ? "#FFFFFF" : f.color || "#219EBC" }}
                        />
                        <span className="truncate">{f.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {f.note_count !== undefined && f.note_count > 0 && (
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                              isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {f.note_count}
                          </span>
                        )}
                        {onDeleteFolderClick && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteFolderClick(f);
                            }}
                            className={`p-1 rounded-[4px] opacity-0 group-hover/folder:opacity-100 transition-opacity cursor-pointer ${
                              isActive ? "hover:bg-white/20 text-white" : "hover:bg-slate-200 text-slate-400 hover:text-rose-600"
                            }`}
                            title="Delete folder"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Shared Folders Section */}
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => setSharedExpanded(!sharedExpanded)}
            className="w-full flex items-center justify-between px-2 py-1 text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors"
          >
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#FB8500]" />
              <span>Study Group Shared</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">{sharedFolders.length}</span>
          </button>

          {sharedExpanded && (
            <div className="pl-3 space-y-0.5 border-l border-slate-100 ml-2">
              {sharedFolders.length === 0 ? (
                <div className="px-3 py-1.5 text-[11px] text-slate-400 italic">No shared folders</div>
              ) : (
                sharedFolders.map((f) => {
                  const isActive = activeFolderId === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => onSelectFolder(f.id)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-[8px] text-xs font-medium transition-colors cursor-pointer ${
                        isActive
                          ? "bg-[#FB8500] text-white font-bold"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Users className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{f.name}</span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Archive Section */}
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => setArchiveExpanded(!archiveExpanded)}
            className="w-full flex items-center justify-between px-2 py-1 text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors"
          >
            <div className="flex items-center gap-1.5">
              <Archive className="w-3.5 h-3.5 text-slate-400" />
              <span>Archive</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">{archiveFolders.length}</span>
          </button>
        </div>
      </div>

      {/* 3. Storage Usage Meter Card */}
      <StorageUsageCard stats={storageStats} />
    </aside>
  );
}
