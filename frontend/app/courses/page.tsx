import React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/landing/Container";
import { Section } from "@/components/landing/Section";
import { Footer } from "@/components/landing/Footer";
import { HeaderAuth } from "@/components/landing/HeaderAuth";
import { CourseRow } from "@/components/courses/CourseRow";
import { getPublicCoursesFull } from "@/lib/api/cms";

export const dynamic = "force-dynamic";

export default async function PublicCoursesCatalog() {
  // Server-side auth check to display user session status in navigation header
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
    // Fail silently, authentication is not mandatory
  }

  const courses = await getPublicCoursesFull();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col justify-between relative overflow-x-hidden animate-fade-in">
      {/* Glow Effect */}
      <div className="absolute top-0 inset-x-0 h-[600px] bg-[radial-gradient(ellipse_60%_40%_at_50%_-10%,rgba(33,158,188,0.04),transparent)] pointer-events-none" />

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

      {/* Main Content */}
      <main className="flex-grow flex flex-col pt-12 pb-20">
        <Section className="py-0 relative z-20">
          <Container className="max-w-4xl space-y-12">
            {/* Page Title & Slogan */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 leading-none">
                Courses
              </h1>
              <p className="text-slate-500 text-base sm:text-lg font-medium leading-relaxed max-w-2xl">
                Curated learning paths on systems engineering, compilation, and advanced frontend architectures. Open to everyone.
              </p>
            </div>

            {/* Courses Rows Container */}
            <div className="space-y-6">
              {courses.length > 0 ? (
                courses.map((course) => (
                  <CourseRow key={course.id} course={course} />
                ))
              ) : (
                <div className="text-center py-16 border border-dashed border-slate-200 rounded-2xl bg-white max-w-md mx-auto">
                  <p className="text-slate-400 text-sm font-semibold">
                    No courses published yet. Check back soon!
                  </p>
                </div>
              )}
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
