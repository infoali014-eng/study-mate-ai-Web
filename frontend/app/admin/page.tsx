"use client";

import React, { useState, useEffect } from "react";
import { useAdminStore } from "@/store/adminStore";
import { DBCourse } from "@/types/admin.types";
import {
  getAdminStats,
  getAdminCourses,
  deleteCourse,
  duplicateCourse,
} from "@/lib/api/cms";
import { CourseFormModal } from "@/components/admin/CourseFormModal";
import { LectureManager } from "@/components/admin/LectureManager";
import { HomepageSettingsTab } from "@/components/admin/HomepageSettingsTab";
import { OwlSettingsTab } from "@/components/admin/OwlSettingsTab";
import { CommunitySettingsTab } from "@/components/admin/CommunitySettingsTab";
import { UsersManagementTab } from "@/components/admin/UsersManagementTab";
import { PlatformSettingsTab } from "@/components/admin/PlatformSettingsTab";

export default function AdminPage() {
  const {
    activeTab,
    coursesSearch,
    setCoursesSearch,
    coursesFilterStatus,
    setFilterStatus,
    coursesFilterDifficulty,
    setFilterDifficulty,
  } = useAdminStore();

  const [stats, setStats] = useState({
    courses: 0,
    publishedCourses: 0,
    draftCourses: 0,
    sections: 0,
    lectures: 0,
    notes: 0,
    quizzes: 0,
    tasks: 0,
  });

  const [courses, setCourses] = useState<DBCourse[]>([]);
  
  // Loading states
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(true);

  // Modals
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<DBCourse | null>(null);
  const [activeCourseSyllabus, setActiveCourseSyllabus] = useState<DBCourse | null>(null);

  const refreshData = async () => {
    try {
      setLoadingStats(true);
      const data = await getAdminStats();
      setStats(data);
    } catch (err) {
      console.error("Error loading stats:", err);
    } finally {
      setLoadingStats(false);
    }

    try {
      setLoadingCourses(true);
      const data = await getAdminCourses();
      setCourses(data);
    } catch (err) {
      console.error("Error loading courses:", err);
    } finally {
      setLoadingCourses(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleCreateCourseClick = () => {
    setEditingCourse(null);
    setIsCourseModalOpen(true);
  };

  const handleEditCourseClick = (course: DBCourse) => {
    setEditingCourse(course);
    setIsCourseModalOpen(true);
  };

  const handleDeleteCourseClick = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course? All sections, lectures, tasks, and quizzes will be deleted permanently.")) {
      return;
    }
    try {
      await deleteCourse(id);
      await refreshData();
    } catch (err) {
      console.error(err);
      alert("Failed to delete course");
    }
  };

  const handleDuplicateCourseClick = async (id: string) => {
    try {
      await duplicateCourse(id);
      await refreshData();
    } catch (err) {
      console.error(err);
      alert("Failed to duplicate course");
    }
  };

  // Filter courses list
  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(coursesSearch.toLowerCase()) ||
      c.slug.toLowerCase().includes(coursesSearch.toLowerCase()) ||
      c.category.toLowerCase().includes(coursesSearch.toLowerCase());

    const matchesStatus =
      coursesFilterStatus === "all" ? true : c.status === coursesFilterStatus;

    const matchesDifficulty =
      coursesFilterDifficulty === "all" ? true : c.difficulty === coursesFilterDifficulty;

    return matchesSearch && matchesStatus && matchesDifficulty;
  });

  return (
    <div className="space-y-8 select-text">
      {/* 1. DASHBOARD TAB */}
      {activeTab === "dashboard" && (
        <div className="space-y-8 animate-fade-in">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Overview Dashboard</h2>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mt-1">Real-time statistics & database index metrics</p>
          </div>

          {loadingStats ? (
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center py-10">Syncing Database Counters...</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {/* Courses Count */}
              <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Courses</span>
                <div className="text-2xl font-black text-slate-950 flex items-center justify-between">
                  <span>{stats.courses}</span>
                  <span className="text-xs font-bold text-slate-400">({stats.publishedCourses} Pub)</span>
                </div>
              </div>

              {/* Lectures Count */}
              <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Lectures</span>
                <div className="text-2xl font-black text-slate-950">{stats.lectures}</div>
              </div>

              {/* Notes Count */}
              <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">PDF Notes</span>
                <div className="text-2xl font-black text-slate-950">{stats.notes}</div>
              </div>

              {/* Tasks & Quizzes */}
              <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quizzes & Tasks</span>
                <div className="text-2xl font-black text-slate-950 flex items-center gap-3">
                  <span>{stats.quizzes}Q</span>
                  <span className="text-slate-200">/</span>
                  <span>{stats.tasks}T</span>
                </div>
              </div>
            </div>
          )}

          {/* R2 Cloudflare Storage Stats Card */}
          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Cloudflare R2 Object Storage</span>
              <span className="text-xs font-bold text-slate-500">12.4 MB / 5.0 GB used</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#219EBC] h-full" style={{ width: "0.25%" }} />
            </div>
          </div>
        </div>
      )}

      {/* 2. HOMEPAGE TAB */}
      {activeTab === "homepage" && <HomepageSettingsTab />}

      {/* 3. COURSES TAB */}
      {activeTab === "courses" && (
        <div className="space-y-8 animate-fade-in">
          {activeCourseSyllabus ? (
            <LectureManager
              course={activeCourseSyllabus}
              onClose={() => {
                setActiveCourseSyllabus(null);
                refreshData();
              }}
            />
          ) : (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Courses Catalog CMS</h2>
                  <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mt-1">Manage public catalog parameters and lectures syllabus</p>
                </div>
                <button
                  onClick={handleCreateCourseClick}
                  className="bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm px-4.5 py-3 rounded-xl shadow-xs cursor-pointer text-center"
                >
                  + Create Course
                </button>
              </div>

              {/* Search & Filter Bar */}
              <div className="bg-white border border-slate-200/80 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
                {/* Search */}
                <input
                  type="text"
                  value={coursesSearch}
                  onChange={(e) => setCoursesSearch(e.target.value)}
                  placeholder="Search by title, slug, or category..."
                  className="flex-grow max-w-md p-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:border-slate-900 focus:outline-hidden"
                />

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3">
                  <select
                    value={coursesFilterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as "all" | "published" | "draft" | "archived")}
                    className="p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white"
                  >
                    <option value="all">All Statuses</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>

                  <select
                    value={coursesFilterDifficulty}
                    onChange={(e) => setFilterDifficulty(e.target.value as "all" | "beginner" | "intermediate" | "advanced")}
                    className="p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white"
                  >
                    <option value="all">All Difficulties</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              {/* Courses List Table */}
              {loadingCourses ? (
                <div className="text-center py-10 text-xs font-bold text-slate-400 uppercase tracking-widest">Querying Courses...</div>
              ) : filteredCourses.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                  <p className="text-slate-400 text-xs font-semibold">No courses matches the current search/filters.</p>
                </div>
              ) : (
                <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs sm:text-sm">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-black uppercase text-slate-400 tracking-wider select-none">
                          <th className="p-4">Title / Slug</th>
                          <th className="p-4">Difficulty</th>
                          <th className="p-4">Category</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-semibold">
                        {filteredCourses.map((c) => (
                          <tr key={c.id} className="hover:bg-slate-50/30 transition-colors">
                            <td className="p-4 space-y-0.5 max-w-xs">
                              <div className="font-extrabold text-slate-800 truncate">{c.title}</div>
                              <div className="text-[10px] text-slate-400 font-semibold truncate">/{c.slug}</div>
                            </td>
                            <td className="p-4">
                              <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded ${
                                c.difficulty === "beginner"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : c.difficulty === "intermediate"
                                  ? "bg-amber-50 text-amber-700"
                                  : "bg-rose-50 text-rose-700"
                              }`}>
                                {c.difficulty}
                              </span>
                            </td>
                            <td className="p-4 text-slate-500 font-medium">{c.category}</td>
                            <td className="p-4">
                              <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded ${
                                c.status === "published"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : c.status === "draft"
                                  ? "bg-slate-100 text-slate-650"
                                  : "bg-rose-50 text-rose-700"
                              }`}>
                                {c.status}
                              </span>
                            </td>
                            <td className="p-4 text-right space-x-3 shrink-0">
                              <button
                                onClick={() => setActiveCourseSyllabus(c)}
                                className="text-xs font-extrabold text-slate-700 hover:text-slate-950 border border-slate-200 px-2.5 py-1.5 rounded-lg bg-white cursor-pointer"
                              >
                                Syllabus
                              </button>
                              <button
                                onClick={() => handleEditCourseClick(c)}
                                className="text-xs font-extrabold text-[#219EBC] hover:underline cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDuplicateCourseClick(c.id)}
                                className="text-xs font-extrabold text-slate-500 hover:text-slate-700 cursor-pointer"
                              >
                                Duplicate
                              </button>
                              <button
                                onClick={() => handleDeleteCourseClick(c.id)}
                                className="text-xs font-extrabold text-rose-600 hover:text-rose-800 cursor-pointer"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <CourseFormModal
                isOpen={isCourseModalOpen}
                onClose={() => setIsCourseModalOpen(false)}
                course={editingCourse}
                onSaveSuccess={refreshData}
              />
            </>
          )}
        </div>
      )}

      {/* 4. MEDIA LIBRARY TAB */}
      {activeTab === "media" && (
        <div className="space-y-8 animate-fade-in select-none">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Media Library</h2>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mt-1">View and manage raw files uploaded to Cloudflare R2</p>
          </div>

          <div className="bg-white border border-slate-200/80 p-8 rounded-2xl text-center space-y-2 shadow-xs">
            <span className="text-3xl">📁</span>
            <h4 className="text-sm font-bold text-slate-800">Media Files Registry</h4>
            <p className="text-slate-500 text-xs leading-relaxed max-w-sm mx-auto font-medium">
              Files are uploaded automatically inside Course details and Lecture notes modules. 
              The central media manager index is planned for the next release.
            </p>
          </div>
        </div>
      )}

      {/* 5. MR OWL AI TAB */}
      {activeTab === "owl" && <OwlSettingsTab />}

      {/* 6. JOIN DEEP CODE COMMUNITY TAB */}
      {activeTab === "community" && <CommunitySettingsTab />}

      {/* 7. USERS TAB */}
      {activeTab === "users" && <UsersManagementTab />}

      {/* 8. SETTINGS TAB */}
      {activeTab === "settings" && <PlatformSettingsTab />}
    </div>
  );
}
