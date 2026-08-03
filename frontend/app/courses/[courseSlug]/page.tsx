import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/landing/Container";
import { Section } from "@/components/landing/Section";
import { Footer } from "@/components/landing/Footer";
import { HeaderAuth } from "@/components/landing/HeaderAuth";
import { CourseHeader } from "@/components/courses/CourseHeader";
import { getCourseStats } from "@/lib/data/seed-courses";
import { getPublicCourseFullBySlug } from "@/lib/api/cms";

export const dynamic = "force-dynamic";

interface CourseDetailPageProps {
  params: Promise<{
    courseSlug: string;
  }>;
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { courseSlug } = await params;
  const course = await getPublicCourseFullBySlug(courseSlug);


  if (!course) {
    notFound();
  }

  // Server-side auth check for the unified header
  let userEmail: string | null = null;
  let isAdmin = false;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      userEmail = user.email || null;
      const userRole = user.user_metadata?.role || user.app_metadata?.role;
      isAdmin = userRole === "admin";
    }
  } catch {
    // Silent fail
  }

  const stats = getCourseStats(course);
  const breadcrumbs = [
    { label: "Courses", href: "/courses" },
    { label: course.title },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col justify-between relative overflow-x-hidden">
      {/* Navigation Header */}
      <header className="relative w-full border-b border-slate-100 bg-white/50 backdrop-blur-xs z-30 select-none">
        <Container className="h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/branding/deepcode/logo.png"
              alt="Deep Code logo"
              className="h-8 w-auto object-contain"
              draggable={false}
            />
            <span className="font-extrabold text-lg tracking-tight">
              <span className="text-black">Deep</span>
              <span className="text-[#219EBC]">Code</span>
            </span>
          </Link>

          <HeaderAuth userEmail={userEmail} isAdmin={isAdmin} />
        </Container>
      </header>

      {/* Course Banner Header */}
      <CourseHeader
        breadcrumbs={breadcrumbs}
        title={course.title}
        description={course.description}
      />

      {/* Main Content Layout */}
      <main className="flex-grow pt-10 pb-20">
        <Section className="py-0 relative z-20">
          <Container className="max-w-5xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
              
              {/* Syllabus (Lectures Tree) */}
              <div className="lg:col-span-2 space-y-6">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Syllabus
                  </h2>
                  <p className="text-slate-500 text-xs sm:text-sm font-medium">
                    Select a lecture to view notes, quizzes, tasks, and videos.
                  </p>
                </div>

                {/* Lecture row nodes */}
                <div className="space-y-4">
                  {course.lectures.map((lecture) => (
                    <Link
                      key={lecture.id}
                      href={`/courses/${course.slug}/lecture/${lecture.slug}`}
                      className="block group"
                    >
                      <div className="p-6 rounded-2xl border border-slate-200/80 bg-white hover:border-[#219EBC]/40 hover:shadow-md hover:shadow-slate-100/50 transition-all duration-300 flex items-center justify-between gap-6">
                        <div className="space-y-1">
                          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 group-hover:text-[#219EBC] transition-colors">
                            {lecture.title}
                          </h3>
                          <p className="text-slate-500 text-xs sm:text-sm font-semibold max-w-xl">
                            {lecture.description}
                          </p>
                        </div>
                        <div className="shrink-0 w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#219EBC]/10 group-hover:text-[#219EBC] transition-colors">
                          <svg
                            className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2.5"
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Sidebar Quick Statistics */}
              <div className="space-y-6 lg:border-l lg:border-slate-100 lg:pl-10">
                <div className="w-full aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 border border-slate-200/40">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                </div>

                <div className="bg-slate-50 border border-slate-200/40 rounded-2xl p-6 space-y-4 select-none">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Course Summary
                  </h3>
                  
                  <div className="space-y-3 font-semibold text-sm text-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Total Lectures</span>
                      <span>{stats.lectures}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Study Notes</span>
                      <span>{stats.notes} PDF</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Practice Quizzes</span>
                      <span>{stats.quizzes}</span>
                    </div>
                    {stats.tasks > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Hands-on Tasks</span>
                        <span>{stats.tasks}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </Container>
        </Section>
      </main>

      {/* Footer */}
      <Footer
        brandName="Deep Code"
        brandLogo="/branding/deepcode/logo.png"
        connectHref="#"
        contactHref="mailto:hello@deepcode.ai"
        privacyHref="#"
        termsHref="#"
      />
    </div>
  );
}
