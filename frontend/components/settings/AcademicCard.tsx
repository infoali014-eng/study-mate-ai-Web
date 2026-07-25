"use client";

import React, { useState, useEffect } from "react";
import { GraduationCap, Loader2, CheckCircle2 } from "lucide-react";
import { AcademicSettings, EducationLevel } from "@/types/settings.types";
import { SettingsService } from "@/services/settingsService";

export default function AcademicCard() {
  const [academic, setAcademic] = useState<AcademicSettings>({
    institution: "",
    fieldOfStudy: "",
    educationLevel: "university",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    SettingsService.getAcademicSettings().then((res) => {
      setAcademic(res);
      setLoading(false);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setToast(null);

    const res = await SettingsService.updateAcademicSettings(academic);
    setSaving(false);

    if (res.success) {
      setToast({ type: "success", text: res.message });
      setTimeout(() => setToast(null), 3000);
    } else {
      setToast({ type: "error", text: res.message });
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-[16px] border border-slate-200 p-6 shadow-xs animate-pulse space-y-4">
        <div className="h-6 w-32 bg-slate-100 rounded-md" />
        <div className="h-20 w-full bg-slate-100 rounded-md" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[16px] border border-slate-200 p-6 shadow-xs space-y-6 select-none">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-[#219EBC]" />
          <h2 className="text-base font-extrabold text-slate-900">Academic Background</h2>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
            Optional
          </span>
        </div>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          These details help Mr Owl tailor explanation complexity to your education level.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Institution */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Institution</label>
            <input
              type="text"
              value={academic.institution || ""}
              onChange={(e) => setAcademic({ ...academic, institution: e.target.value })}
              placeholder="University / College / School"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-[10px] text-slate-900 focus:bg-white focus:border-[#219EBC] outline-hidden transition-colors"
            />
          </div>

          {/* Program / Field of Study */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Program / Field of Study</label>
            <input
              type="text"
              value={academic.fieldOfStudy || ""}
              onChange={(e) => setAcademic({ ...academic, fieldOfStudy: e.target.value })}
              placeholder="e.g. Computer Science, Medicine, Law"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-[10px] text-slate-900 focus:bg-white focus:border-[#219EBC] outline-hidden transition-colors"
            />
          </div>
        </div>

        {/* Education Level */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Current Level</label>
          <select
            value={academic.educationLevel}
            onChange={(e) =>
              setAcademic({ ...academic, educationLevel: e.target.value as EducationLevel })
            }
            className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-[10px] text-slate-900 focus:bg-white focus:border-[#219EBC] outline-hidden transition-colors cursor-pointer"
          >
            <option value="school">School (High School / K-12)</option>
            <option value="college">College / A-Levels / High School Senior</option>
            <option value="university">University (Undergraduate / Graduate)</option>
            <option value="self_learner">Self Learner / Professional</option>
          </select>
        </div>

        {/* Action Button & Toast */}
        <div className="flex items-center justify-between pt-2">
          {toast ? (
            <div
              className={`flex items-center gap-1.5 text-xs font-bold ${
                toast.type === "success" ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              {toast.type === "success" && <CheckCircle2 className="w-4 h-4" />}
              <span>{toast.text}</span>
            </div>
          ) : (
            <span />
          )}

          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-[#219EBC] hover:bg-[#023047] text-white font-extrabold text-xs rounded-[10px] transition-colors shadow-xs cursor-pointer flex items-center gap-2"
          >
            {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>Save Academic Details</span>
          </button>
        </div>
      </form>
    </div>
  );
}
