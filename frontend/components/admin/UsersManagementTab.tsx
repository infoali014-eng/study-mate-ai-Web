"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  ShieldCheck,
  UserCheck,
  GraduationCap,
  RefreshCw,
  Loader2,
  CheckCircle2,
  XCircle,
  Sparkles,
  Calendar,
  Clock,
} from "lucide-react";

export interface UserProfileItem {
  id: string;
  username: string;
  full_name: string;
  display_name: string;
  email: string;
  avatar_url?: string;
  role: "student" | "buddy" | "admin";
  created_at?: string;
  last_active_at?: string;
}

export default function UsersManagementTab() {
  const [users, setUsers] = useState<UserProfileItem[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [stats, setStats] = useState({
    total: 0,
    buddyCount: 0,
    adminCount: 0,
    studentCount: 0,
  });

  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users?search=${encodeURIComponent(search)}&role=${roleFilter}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
        setStats({
          total: data.totalCount || 0,
          buddyCount: data.buddyCount || 0,
          adminCount: data.adminCount || 0,
          studentCount: data.studentCount || 0,
        });
      }
    } catch (err) {
      console.error("[UsersManagementTab] Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleRoleChange = async (targetUserId: string, newRole: "student" | "buddy" | "admin") => {
    setUpdatingId(targetUserId);
    setToast(null);

    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId, newRole }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === targetUserId ? { ...u, role: newRole } : u))
        );
        setToast({ type: "success", text: data.message || `Role updated to "${newRole}"!` });
        setTimeout(() => setToast(null), 3000);
        fetchUsers();
      } else {
        setToast({ type: "error", text: data.error || "Failed to update role." });
      }
    } catch (err: any) {
      setToast({ type: "error", text: err.message || "Failed to update role." });
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6 select-none animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-[#219EBC]" /> User Operations Directory
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Manage registered users, search directory, and assign **Buddy** role permissions for StudyMate AI access.
          </p>
        </div>
        <button
          type="button"
          onClick={fetchUsers}
          disabled={loading}
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-[10px] transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div
          className={`p-3 rounded-[12px] text-xs font-bold flex items-center gap-2 ${
            toast.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-white border border-slate-200/80 rounded-[14px] shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
            <Users className="w-4 h-4 text-slate-400" />
            <span>Total Registered</span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">{stats.total}</div>
        </div>

        <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-[14px] shadow-2xs">
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-extrabold">
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <span>Buddies (AI Granted)</span>
          </div>
          <div className="text-2xl font-black text-emerald-950 mt-1">{stats.buddyCount}</div>
        </div>

        <div className="p-4 bg-sky-50/70 border border-sky-200 rounded-[14px] shadow-2xs">
          <div className="flex items-center gap-2 text-sky-800 text-xs font-extrabold">
            <ShieldCheck className="w-4 h-4 text-sky-600" />
            <span>Admins</span>
          </div>
          <div className="text-2xl font-black text-sky-950 mt-1">{stats.adminCount}</div>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-[14px] shadow-2xs">
          <div className="flex items-center gap-2 text-slate-600 text-xs font-bold">
            <GraduationCap className="w-4 h-4 text-slate-400" />
            <span>Standard Students</span>
          </div>
          <div className="text-2xl font-black text-slate-800 mt-1">{stats.studentCount}</div>
        </div>
      </div>

      {/* Search & Filter Control Bar */}
      <div className="bg-white p-4 border border-slate-200/80 rounded-[16px] shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input Form */}
        <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or role..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-[12px] text-slate-900 focus:bg-white focus:border-[#219EBC] outline-hidden transition-colors"
          />
        </form>

        {/* Role Filter Pills */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-[12px] w-full md:w-auto overflow-x-auto">
          {[
            { id: "all", label: "All Users" },
            { id: "student", label: "Students" },
            { id: "buddy", label: "Buddies 🤝" },
            { id: "admin", label: "Admins 🛡️" },
          ].map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRoleFilter(r.id)}
              className={`px-3 py-1.5 text-xs font-extrabold rounded-[8px] transition-all cursor-pointer ${
                roleFilter === r.id
                  ? "bg-[#023047] text-white shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Users Directory Table */}
      <div className="bg-white border border-slate-200/80 rounded-[16px] overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400 font-medium flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#219EBC]" />
            <span>Loading user directory from database...</span>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Users className="w-8 h-8 text-slate-300 mx-auto" />
            <div className="text-xs font-extrabold text-slate-700">No users found</div>
            <p className="text-[11px] text-slate-400 font-medium">
              Try adjusting your search query or role filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 text-slate-900 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-extrabold uppercase tracking-wider">User</th>
                  <th className="px-4 py-3 font-extrabold uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 font-extrabold uppercase tracking-wider">Current Status</th>
                  <th className="px-4 py-3 font-extrabold uppercase tracking-wider">Assign Database Role</th>
                  <th className="px-4 py-3 font-extrabold uppercase tracking-wider">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {users.map((u) => {
                  const isBuddy = u.role === "buddy";
                  const isAdmin = u.role === "admin";
                  const isUpdating = updatingId === u.id;

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Name & Avatar */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#023047] text-white flex items-center justify-center text-xs font-extrabold shrink-0 shadow-2xs">
                            {u.display_name?.charAt(0) || u.full_name?.charAt(0) || "U"}
                          </div>
                          <div>
                            <div className="font-extrabold text-slate-900">
                              {u.display_name || u.full_name || "Anonymous User"}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              @{u.username || u.id.slice(0, 8)}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-4 py-3 text-slate-600 font-medium font-mono">
                        {u.email || "No email"}
                      </td>

                      {/* Role Badge */}
                      <td className="px-4 py-3">
                        {isAdmin ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-sky-50 text-sky-800 border border-sky-200">
                            <ShieldCheck className="w-3 h-3 text-sky-600" /> Admin
                          </span>
                        ) : isBuddy ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
                            <Sparkles className="w-3 h-3 text-emerald-600" /> Buddy Access Granted
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-700 border border-slate-200">
                            <GraduationCap className="w-3 h-3 text-slate-500" /> Student
                          </span>
                        )}
                      </td>

                      {/* Role Selector Dropdown */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <select
                            value={u.role || "student"}
                            disabled={isUpdating}
                            onChange={(e) =>
                              handleRoleChange(u.id, e.target.value as "student" | "buddy" | "admin")
                            }
                            className={`text-xs font-extrabold rounded-[8px] px-2.5 py-1.5 border transition-all cursor-pointer outline-hidden ${
                              isBuddy
                                ? "bg-emerald-50 border-emerald-300 text-emerald-950 focus:bg-white"
                                : isAdmin
                                ? "bg-sky-50 border-sky-300 text-sky-950 focus:bg-white"
                                : "bg-slate-50 border-slate-200 text-slate-800 focus:bg-white"
                            }`}
                          >
                            <option value="student">🎓 Student (Default)</option>
                            <option value="buddy">🤝 Buddy (StudyMate AI Access)</option>
                            <option value="admin">🛡️ Admin (Full Management)</option>
                          </select>
                          {isUpdating && <Loader2 className="w-4 h-4 animate-spin text-[#219EBC]" />}
                        </div>
                      </td>

                      {/* Joined Date */}
                      <td className="px-4 py-3 text-slate-400 text-[11px] font-medium">
                        {u.created_at ? new Date(u.created_at).toLocaleDateString() : "Recent"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
