"use client";

import React, { useState } from "react";
import { ShieldAlert, KeyRound, Trash2, X, CheckCircle2, Loader2 } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

function getSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  );
}

export default function PrivacySecurityCard() {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordToast, setPasswordToast] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setPasswordToast({ type: "error", text: "Password must be at least 6 characters long." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordToast({ type: "error", text: "Passwords do not match." });
      return;
    }

    setSavingPassword(true);
    setPasswordToast(null);

    const supabase = getSupabaseClient();
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      setSavingPassword(false);

      if (error) {
        setPasswordToast({ type: "error", text: error.message });
      } else {
        setPasswordToast({ type: "success", text: "Password updated successfully!" });
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => {
          setShowPasswordModal(false);
          setPasswordToast(null);
        }, 2000);
      }
    } catch (err: unknown) {
      setSavingPassword(false);
      const msg = err instanceof Error ? err.message : "Failed to change password.";
      setPasswordToast({ type: "error", text: msg });
    }
  };

  return (
    <>
      <div className="bg-white rounded-[16px] border border-slate-200 p-6 shadow-xs space-y-6 select-none">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-slate-700" />
            <h2 className="text-base font-extrabold text-slate-900">Privacy & Security</h2>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Manage your account password and security settings.
          </p>
        </div>

        <div className="space-y-3">
          {/* Change Password */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-[12px] border border-slate-200/80">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[10px] bg-slate-200/70 flex items-center justify-center text-slate-700 shrink-0">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-extrabold text-slate-900">Change Password</h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  Update your authentication password securely.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowPasswordModal(true)}
              className="px-3.5 py-1.5 bg-[#023047] hover:bg-[#219EBC] text-white font-extrabold text-xs rounded-[8px] transition-colors shadow-2xs cursor-pointer"
            >
              Update Password
            </button>
          </div>

          {/* Delete Account (Coming Soon) */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-[12px] border border-slate-200/80">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[10px] bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-extrabold text-slate-900">Delete Account</h3>
                  <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-slate-200 text-slate-600">
                    Coming Soon
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  Permanently purge notes, files, storage assets, and profile data.
                </p>
              </div>
            </div>

            <button
              type="button"
              disabled
              className="px-3.5 py-1.5 bg-slate-200 text-slate-400 font-bold text-xs rounded-[8px] cursor-not-allowed opacity-70"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none">
          <div className="bg-white rounded-[16px] border border-slate-200 p-6 shadow-2xl w-full max-w-md space-y-5 animate-in fade-in-50 zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-[#219EBC]" />
                <h3 className="text-base font-extrabold text-slate-900">Update Password</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-[8px] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">New Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-[10px] text-slate-900 focus:bg-white focus:border-[#219EBC] outline-hidden transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Confirm New Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-[10px] text-slate-900 focus:bg-white focus:border-[#219EBC] outline-hidden transition-colors"
                />
              </div>

              {passwordToast && (
                <div
                  className={`flex items-center gap-1.5 text-xs font-bold ${
                    passwordToast.type === "success" ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {passwordToast.type === "success" && <CheckCircle2 className="w-4 h-4" />}
                  <span>{passwordToast.text}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-[10px] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingPassword}
                  className="px-4 py-2 bg-[#219EBC] hover:bg-[#023047] text-white font-extrabold text-xs rounded-[10px] transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  {savingPassword && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save New Password</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
