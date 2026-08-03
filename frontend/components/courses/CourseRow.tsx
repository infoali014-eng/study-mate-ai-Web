import React from "react";
import Link from "next/link";
import { Course } from "@/types/course.types";
import { getCourseStats } from "@/lib/data/seed-courses";

interface CourseRowProps {
  course: Course;
}

export const CourseRow: React.FC<CourseRowProps> = ({ course }) => {
  const stats = getCourseStats(course);

  return (
    <Link href={`/courses/${course.slug}`} className="block group">
      <div className="flex flex-col sm:flex-row items-start gap-6 p-6 sm:p-8 rounded-2xl border border-slate-200/80 bg-white hover:border-[#219EBC]/40 hover:shadow-md hover:shadow-slate-100/60 transition-all duration-300">
        {/* Course Thumbnail */}
        <div className="w-full sm:w-44 md:w-52 aspect-[16/10] shrink-0 rounded-xl overflow-hidden bg-slate-100 border border-slate-200/40 relative">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
            draggable={false}
          />
        </div>

        {/* Course Details */}
        <div className="flex-grow flex flex-col justify-between h-full space-y-3">
          <div className="space-y-1.5">
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight group-hover:text-[#219EBC] transition-colors duration-200">
              {course.title}
            </h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-2xl">
              {course.description}
            </p>
          </div>

          {/* Dynamic Metrics */}
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider pt-2">
            <span>{stats.lectures} {stats.lectures === 1 ? "Lesson" : "Lessons"}</span>
            <span className="text-slate-300">•</span>
            <span>{stats.notes} {stats.notes === 1 ? "Note" : "Notes"}</span>
            <span className="text-slate-300">•</span>
            <span>{stats.quizzes} {stats.quizzes === 1 ? "Quiz" : "Quizzes"}</span>
            {stats.tasks > 0 && (
              <>
                <span className="text-slate-300">•</span>
                <span>{stats.tasks} {stats.tasks === 1 ? "Task" : "Tasks"}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
