"use client";

import React, { useState } from "react";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "student" | "instructor";
  status: "active" | "suspended" | "pending";
  joinedDate: string;
  lastActive: string;
  avatarUrl?: string;
}

export const UsersManagementTab: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([
    {
      id: "usr_101",
      name: "Ali Raza (Admin)",
      email: "infoali014@gmail.com",
      role: "admin",
      status: "active",
      joinedDate: "2024-01-15",
      lastActive: "Just now",
    },
    {
      id: "usr_102",
      name: "Sarah Jenkins",
      email: "sarah.jenkins@code.edu",
      role: "instructor",
      status: "active",
      joinedDate: "2024-03-10",
      lastActive: "2 hours ago",
    },
    {
      id: "usr_103",
      name: "David Miller",
      email: "david.m@student.org",
      role: "student",
      status: "active",
      joinedDate: "2024-05-22",
      lastActive: "Yesterday",
    },
    {
      id: "usr_104",
      name: "Emily Watson",
      email: "emily.w@dev.io",
      role: "student",
      status: "suspended",
      joinedDate: "2024-06-04",
      lastActive: "5 days ago",
    },
    {
      id: "usr_105",
      name: "Marcus Vance",
      email: "marcus.v@tech.com",
      role: "student",
      status: "active",
      joinedDate: "2024-07-19",
      lastActive: "3 hours ago",
    },
  ]);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "student" | "instructor">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "suspended" | "pending">("all");

  // Invite Modal
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState<"admin" | "student" | "instructor">("student");
  const [inviteSuccess, setInviteSuccess] = useState(false);

  const handleToggleStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === "active" ? "suspended" : "active" } : u
      )
    );
  };

  const handleChangeRole = (id: string, newRole: "admin" | "student" | "instructor") => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role: newRole } : u)));
  };

  const handleDeleteUser = (id: string) => {
    if (confirm("Are you sure you want to remove this user from the system?")) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    }
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !newName.trim()) return;

    const newUser: AdminUser = {
      id: `usr_${Date.now().toString().slice(-4)}`,
      name: newName,
      email: newEmail,
      role: newRole,
      status: "active",
      joinedDate: new Date().toISOString().split("T")[0],
      lastActive: "Just invited",
    };

    setUsers([newUser, ...users]);
    setInviteSuccess(true);
    setTimeout(() => {
      setInviteSuccess(false);
      setIsInviteModalOpen(false);
      setNewEmail("");
      setNewName("");
    }, 1200);
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.id.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" ? true : u.role === roleFilter;
    const matchesStatus = statusFilter === "all" ? true : u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === "admin").length;
  const studentCount = users.filter((u) => u.role === "student").length;
  const suspendedCount = users.filter((u) => u.status === "suspended").length;

  return (
    <div className="space-y-8 animate-fade-in select-text">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <span>👤</span> User Operations Directory
          </h2>
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mt-1">
            Manage user accounts, admin access privileges, active sessions, & account permissions
          </p>
        </div>
        <button
          onClick={() => setIsInviteModalOpen(true)}
          className="bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-xs cursor-pointer transition-all flex items-center gap-2 justify-center"
        >
          + Invite / Add User
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Accounts</span>
          <div className="text-2xl font-black text-slate-950">{totalUsers}</div>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Administrators</span>
          <div className="text-2xl font-black text-[#219EBC]">{adminCount}</div>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Students</span>
          <div className="text-2xl font-black text-emerald-600">{studentCount}</div>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Suspended</span>
          <div className="text-2xl font-black text-rose-600">{suspendedCount}</div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white border border-slate-200/80 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, or user ID..."
          className="flex-grow max-w-md p-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:border-slate-900 focus:outline-hidden"
        />

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className="p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admins Only</option>
            <option value="instructor">Instructors</option>
            <option value="student">Students</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-black uppercase text-slate-400 tracking-wider select-none">
                <th className="p-4">User</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Joined Date</th>
                <th className="p-4">Last Active</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400 text-xs">
                    No user accounts match the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-slate-700 uppercase shrink-0">
                          {u.name.charAt(0)}
                        </div>
                        <div className="space-y-0.5">
                          <div className="font-extrabold text-slate-900">{u.name}</div>
                          <div className="text-[10px] text-slate-400 font-medium">{u.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleChangeRole(u.id, e.target.value as any)}
                        className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-lg border focus:outline-hidden cursor-pointer ${
                          u.role === "admin"
                            ? "bg-rose-50 border-rose-200 text-rose-700"
                            : u.role === "instructor"
                            ? "bg-amber-50 border-amber-200 text-amber-700"
                            : "bg-slate-100 border-slate-200 text-slate-700"
                        }`}
                      >
                        <option value="student">Student</option>
                        <option value="instructor">Instructor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>

                    <td className="p-4">
                      <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded ${
                        u.status === "active"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-rose-50 text-rose-700"
                      }`}>
                        {u.status}
                      </span>
                    </td>

                    <td className="p-4 text-slate-500 font-medium">{u.joinedDate}</td>
                    <td className="p-4 text-slate-500 font-medium">{u.lastActive}</td>

                    <td className="p-4 text-right space-x-3 shrink-0">
                      <button
                        onClick={() => handleToggleStatus(u.id)}
                        className={`text-xs font-extrabold cursor-pointer hover:underline ${
                          u.status === "active" ? "text-amber-600" : "text-emerald-600"
                        }`}
                      >
                        {u.status === "active" ? "Suspend" : "Activate"}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="text-xs font-extrabold text-rose-600 hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite User Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Invite New User</h3>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-black text-sm"
              >
                ✕
              </button>
            </div>

            {inviteSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-center text-xs font-extrabold space-y-1">
                <div>✓ User invitation sent successfully!</div>
                <div className="text-[10px] text-emerald-600 font-normal">Account added to active user index.</div>
              </div>
            ) : (
              <form onSubmit={handleInviteSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 block">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 block">Email Address</label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 block">Assigned Role</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden"
                  >
                    <option value="student">Student</option>
                    <option value="instructor">Instructor</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsInviteModalOpen(false)}
                    className="px-4 py-2.5 text-xs font-extrabold text-slate-600 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#219EBC] hover:bg-[#1a849e] text-white text-xs font-extrabold rounded-xl shadow-xs"
                  >
                    Send Invitation
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
