"use client";

import React from "react";
import { HardDrive, Server } from "lucide-react";
import { StorageUsageStats } from "@/types/library.types";

interface StorageUsageCardProps {
  stats: StorageUsageStats;
}

export default function StorageUsageCard({ stats }: StorageUsageCardProps) {
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 MB";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const percentageUsed = Math.min(
    100,
    Math.max(1, Math.round((stats.usedBytes / stats.totalBytes) * 100))
  );

  return (
    <div className="bg-[#023047] text-white p-4 rounded-[16px] border border-[#03405e] shadow-sm select-none">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-[8px] bg-[#219EBC]/20 text-[#8ECAE6] flex items-center justify-center shrink-0">
            <HardDrive className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Storage Usage</div>
            <div className="text-[11px] text-[#8ECAE6] font-medium">Cloudflare R2 Bucket</div>
          </div>
        </div>
        <span className="text-xs font-extrabold text-[#FFB703] bg-[#FFB703]/10 px-2 py-0.5 rounded-full border border-[#FFB703]/20">
          {percentageUsed}% Used
        </span>
      </div>

      {/* Main Meter Track */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-[#8ECAE6]">{formatBytes(stats.usedBytes)} used</span>
          <span className="text-slate-400">{formatBytes(stats.totalBytes)} limit</span>
        </div>
        <div className="w-full h-2 bg-[#03405e] rounded-full overflow-hidden flex">
          <div
            className="h-full bg-[#219EBC] transition-all duration-300"
            style={{ width: `${(stats.breakdown.pdf / (stats.usedBytes || 1)) * 100}%` }}
            title="PDFs"
          />
          <div
            className="h-full bg-[#FB8500] transition-all duration-300"
            style={{ width: `${(stats.breakdown.docs / (stats.usedBytes || 1)) * 100}%` }}
            title="Docs"
          />
          <div
            className="h-full bg-[#FFB703] transition-all duration-300"
            style={{ width: `${(stats.breakdown.slides / (stats.usedBytes || 1)) * 100}%` }}
            title="Slides"
          />
          <div
            className="h-full bg-[#38BDF8] transition-all duration-300"
            style={{ width: `${(stats.breakdown.images / (stats.usedBytes || 1)) * 100}%` }}
            title="Images"
          />
        </div>
      </div>

      {/* Legend & Stats */}
      <div className="mt-3 pt-2.5 border-t border-[#03405e]/60 flex items-center justify-between text-[11px] text-[#8ECAE6]">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#219EBC]" /> PDF
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#FB8500]" /> DOC
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#FFB703]" /> PPT
          </span>
        </div>
        <div className="flex items-center gap-1 text-[#8ECAE6]">
          <Server className="w-3 h-3" />
          <span>{stats.noteCount} Files</span>
        </div>
      </div>
    </div>
  );
}
