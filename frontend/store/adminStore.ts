import { create } from "zustand";
import { DBCourse, DBCourseSection, DBLecture } from "@/types/admin.types";

interface AdminUIState {
  activeTab: "dashboard" | "homepage" | "courses" | "media" | "owl" | "community" | "users" | "settings";
  coursesSearch: string;
  coursesFilterStatus: "all" | "published" | "draft" | "archived";
  coursesFilterDifficulty: "all" | "beginner" | "intermediate" | "advanced";
  selectedCourse: DBCourse | null;
  activeCourse: DBCourse | null;
  activeSection: DBCourseSection | null;
  activeLecture: DBLecture | null;
  isCourseModalOpen: boolean;
  isSectionModalOpen: boolean;
  isLectureModalOpen: boolean;
  
  setActiveTab: (tab: AdminUIState["activeTab"]) => void;
  setCoursesSearch: (search: string) => void;
  setFilterStatus: (status: AdminUIState["coursesFilterStatus"]) => void;
  setFilterDifficulty: (diff: AdminUIState["coursesFilterDifficulty"]) => void;
  setSelectedCourse: (course: DBCourse | null) => void;
  setActiveCourse: (course: DBCourse | null) => void;
  setActiveSection: (section: DBCourseSection | null) => void;
  setActiveLecture: (lecture: DBLecture | null) => void;
  setIsCourseModalOpen: (open: boolean) => void;
  setIsSectionModalOpen: (open: boolean) => void;
  setIsLectureModalOpen: (open: boolean) => void;
  resetUI: () => void;
}

export const useAdminStore = create<AdminUIState>((set) => ({
  activeTab: "dashboard",
  coursesSearch: "",
  coursesFilterStatus: "all",
  coursesFilterDifficulty: "all",
  selectedCourse: null,
  activeCourse: null,
  activeSection: null,
  activeLecture: null,
  isCourseModalOpen: false,
  isSectionModalOpen: false,
  isLectureModalOpen: false,

  setActiveTab: (tab) => set({ activeTab: tab }),
  setCoursesSearch: (search) => set({ coursesSearch: search }),
  setFilterStatus: (status) => set({ coursesFilterStatus: status }),
  setFilterDifficulty: (diff) => set({ coursesFilterDifficulty: diff }),
  setSelectedCourse: (course) => set({ selectedCourse: course }),
  setActiveCourse: (course) => set({ activeCourse: course }),
  setActiveSection: (section) => set({ activeSection: section }),
  setActiveLecture: (lecture) => set({ activeLecture: lecture }),
  setIsCourseModalOpen: (open) => set({ isCourseModalOpen: open }),
  setIsSectionModalOpen: (open) => set({ isSectionModalOpen: open }),
  setIsLectureModalOpen: (open) => set({ isLectureModalOpen: open }),
  resetUI: () =>
    set({
      coursesSearch: "",
      coursesFilterStatus: "all",
      coursesFilterDifficulty: "all",
      selectedCourse: null,
      activeCourse: null,
      activeSection: null,
      activeLecture: null,
      isCourseModalOpen: false,
      isSectionModalOpen: false,
      isLectureModalOpen: false,
    }),
}));
