import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/landing/Container";
import { Section } from "@/components/landing/Section";
import { Footer } from "@/components/landing/Footer";
import { HeaderAuth } from "@/components/landing/HeaderAuth";
import { CourseHeader } from "@/components/courses/CourseHeader";
import { NotesSection } from "@/components/courses/NotesSection";
import { QuizSection } from "@/components/courses/QuizSection";
import { TaskSection } from "@/components/courses/TaskSection";
import { VideoSection } from "@/components/courses/VideoSection";
import { getPublicCourseFullBySlug } from "@/lib/api/cms";

export const dynamic = "force-dynamic";

interface LectureDetailPageProps {
  params: Promise<{
    courseSlug: string;
    lectureSlug: string;
  }>;
}

export default async function LectureDetailPage({ params }: LectureDetailPageProps) {
  const { courseSlug, lectureSlug } = await params;
  const course = await getPublicCourseFullBySlug(courseSlug);

  if (!course) {
    notFound();
  }

  const lecture = course.lectures.find((l) => l.slug === lectureSlug);

  if (!lecture) {
    notFound();
  }

  // Generate secure presigned URL for PDF notes stored in Cloudflare R2
  if (lecture.notes && lecture.notes.pdfUrl) {
    let notesUrl = "";
    if (lecture.notes.pdfUrl.startsWith("http")) {
      notesUrl = lecture.notes.pdfUrl;
    } else {
      try {
        const { generateR2SignedUrl } = await import("@/lib/storage/r2");
        notesUrl = await generateR2SignedUrl(lecture.notes.pdfUrl, 3600);
      } catch (err) {
        console.error("Error generating signed R2 link:", err);
        notesUrl = lecture.notes.pdfUrl;
      }
    }
    lecture.notes.pdfUrl = notesUrl;
  }


  // Server-side auth checks for navigation header
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
    // Fail silently
  }

  const breadcrumbs = [
    { label: "Courses", href: "/courses" },
    { label: course.title, href: `/courses/${course.slug}` },
    { label: lecture.title },
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

      {/* Course & Lecture Details Header Banner */}
      <CourseHeader
        breadcrumbs={breadcrumbs}
        title={lecture.title}
        description={lecture.description}
      />

      {/* Main Content Layout */}
      <main className="flex-grow pt-10 pb-20">
        <Section className="py-0 relative z-20">
          <Container className="max-w-5xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
              
              {/* Main Column: Notes (with embedded PDF preview) & Hands-on Tasks */}
              <div className="lg:col-span-2 space-y-12">
                {/* Notes Module */}
                {lecture.notes && (
                  <NotesSection notes={lecture.notes} />
                )}

                {/* Hands-on Tasks Module */}
                {lecture.task && (
                  <div className="border-t border-slate-100 pt-12">
                    <TaskSection task={lecture.task} />
                  </div>
                )}
              </div>

              {/* Sidebar Column: Video, Quiz Card & Resources */}
              <div className="space-y-8 lg:border-l lg:border-slate-100 lg:pl-10">
                {/* Video Module */}
                {lecture.videoUrl && (
                  <VideoSection videoUrl={lecture.videoUrl} />
                )}

                {/* Lesson Quiz Module (Right Sidebar) */}
                {lecture.quiz && (
                  <QuizSection quiz={lecture.quiz} videoUrl={lecture.videoUrl} />
                )}

                {/* Lesson Resources Module */}
                <div className="bg-slate-50 border border-slate-200/40 rounded-2xl p-6 space-y-4 select-none">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Lesson Resources
                  </h3>

                  {lecture.resources && lecture.resources.length > 0 ? (
                    <div className="space-y-3">
                      {lecture.resources.map((res) => (
                        <a
                          key={res.id}
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 rounded-xl border border-slate-200/40 bg-white hover:border-[#219EBC]/40 transition-colors text-xs sm:text-sm font-semibold text-slate-700"
                        >
                          <span className="w-6 h-6 rounded-lg bg-slate-50 text-slate-500 flex items-center justify-center text-[10px] font-black uppercase">
                            {res.type}
                          </span>
                          <span className="flex-grow truncate">{res.title}</span>
                          <span className="text-slate-400">→</span>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400 text-xs font-medium">
                      No additional files for this lesson.
                    </p>
                  )}
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
