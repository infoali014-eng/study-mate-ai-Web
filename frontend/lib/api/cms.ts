"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { generateR2SignedUrl } from "@/lib/storage/r2";
import { revalidatePath } from "next/cache";
import {
  DBCourse,
  DBCourseSection,
  DBLecture,
  DBQuizQuestion,
  DBTask,
  DBHomepageSettings,
  DBHomepageNavItem,
  DBHomepageHighlight,
  DBHomepageProduct,
  DBHomepageFooterSection,
  DBHomepageFooterLink,
  DBHomepageAnnouncement,
} from "@/types/admin.types";

// ============================================================================
// SECURITY CHECK HELPER
// ============================================================================
async function verifyAdmin() {
  const supabase = await createClient();
  let {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    user = session?.user || null;
  }

  if (!user) {
    throw new Error("Unauthorized: Not logged in. Please log in at /login.");
  }

  const role = user.user_metadata?.role || user.app_metadata?.role;
  if (role !== "admin") {
    throw new Error("Unauthorized: Admin privileges required");
  }

  const adminSupabase = await createAdminClient();
  return { supabase, adminSupabase, user };
}

// ============================================================================
// STATS & OVERVIEW ACTIONS
// ============================================================================
export async function getAdminStats() {
  await verifyAdmin();
  const supabase = await createClient();

  const [
    { count: coursesTotal },
    { count: coursesPublished },
    { count: sectionsTotal },
    { count: lecturesTotal },
    { count: quizzesTotal },
    { count: tasksTotal },
  ] = await Promise.all([
    supabase.from("courses").select("*", { count: "exact", head: true }),
    supabase.from("courses").select("*", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("course_sections").select("*", { count: "exact", head: true }),
    supabase.from("lectures").select("*", { count: "exact", head: true }),
    supabase.from("quizzes").select("*", { count: "exact", head: true }),
    supabase.from("tasks").select("*", { count: "exact", head: true }),
  ]);

  // Notes Count (lectures with notes_pdf_url)
  const { count: notesTotal } = await supabase
    .from("lectures")
    .select("*", { count: "exact", head: true })
    .not("notes_pdf_url", "is", null)
    .neq("notes_pdf_url", "");

  return {
    courses: coursesTotal || 0,
    publishedCourses: coursesPublished || 0,
    draftCourses: (coursesTotal || 0) - (coursesPublished || 0),
    sections: sectionsTotal || 0,
    lectures: lecturesTotal || 0,
    notes: notesTotal || 0,
    quizzes: quizzesTotal || 0,
    tasks: tasksTotal || 0,
  };
}

// ============================================================================
// HOMEPAGE MANAGEMENT
// ============================================================================
export async function getHomepageSettings(): Promise<DBHomepageSettings | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("homepage_settings")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[CMS API] Error fetching homepage settings:", error);
    return null;
  }
  if (!data) return null;

  // Unpack fallback extended settings if stored inside feature_cards JSON
  let extended: Record<string, unknown> = {};
  const rawCards = data.feature_cards as Array<{ title?: string; description?: string }> | null;
  if (Array.isArray(rawCards)) {
    const extCard = rawCards.find((c) => c && typeof c === "object" && c.title === "__extended_settings__");
    if (extCard?.description) {
      try {
        extended = JSON.parse(extCard.description);
      } catch (e) {
        console.error("[CMS API] Failed parsing extended settings JSON:", e);
      }
    }
  }

  const merged = {
    ...data,
    hero_badge: data.hero_badge || (extended.hero_badge as string) || "🚀 Empowering Developers. Building Tomorrow.",
    hero_primary_btn_text: data.hero_primary_btn_text || (extended.hero_primary_btn_text as string) || "Get Started",
    hero_primary_btn_url: data.hero_primary_btn_url || (extended.hero_primary_btn_url as string) || "/signup",
    hero_secondary_btn_text: data.hero_secondary_btn_text || (extended.hero_secondary_btn_text as string) || "Explore Courses",
    hero_secondary_btn_url: data.hero_secondary_btn_url || (extended.hero_secondary_btn_url as string) || "/courses",
    hero_media_type: data.hero_media_type || (extended.hero_media_type as string) || "logo",
    hero_media_url: data.hero_media_url || (extended.hero_media_url as string) || "/branding/deepcode/logo.png",
    seo_title: data.seo_title || (extended.seo_title as string) || "Deep Code - Interactive Developer Platform",
    seo_description: data.seo_description || (extended.seo_description as string) || "Learn in-depth, build real-world projects, and grow together.",
    og_image_url: data.og_image_url || (extended.og_image_url as string) || "/branding/deepcode/logo.png",
    keywords: data.keywords || (extended.keywords as string) || "deepcode, programming, c#, compiler engineering",
    canonical_url: data.canonical_url || (extended.canonical_url as string) || "https://deepcode.ai",
    theme_primary: data.theme_primary || (extended.theme_primary as string) || "#0F172A",
    theme_accent: data.theme_accent || (extended.theme_accent as string) || "#219EBC",
    theme_radius: data.theme_radius || (extended.theme_radius as string) || "1rem",
    visibility_flags: data.visibility_flags || (extended.visibility_flags as Record<string, boolean>) || {
      announcement: true,
      hero: true,
      highlights: true,
      products: true,
      footer: true,
    },
    footer_description: data.footer_description || (extended.footer_description as string) || "Pioneering the next dimension of developer tools and interactive learning.",
    copyright_text: data.copyright_text || (extended.copyright_text as string) || "© 2026 Deep Code. All rights reserved.",
  };

  return merged as unknown as DBHomepageSettings;
}

export async function updateHomepageSettings(
  data: Partial<Omit<DBHomepageSettings, "id" | "updated_at">>
) {
  const { adminSupabase } = await verifyAdmin();

  const { data: current } = await adminSupabase
    .from("homepage_settings")
    .select("id, feature_cards")
    .limit(1)
    .maybeSingle();

  // Prepare fallback JSON blob containing all extended settings
  const extendedPayload = {
    hero_badge: data.hero_badge,
    hero_primary_btn_text: data.hero_primary_btn_text,
    hero_primary_btn_url: data.hero_primary_btn_url,
    hero_secondary_btn_text: data.hero_secondary_btn_text,
    hero_secondary_btn_url: data.hero_secondary_btn_url,
    hero_media_type: data.hero_media_type,
    hero_media_url: data.hero_media_url,
    seo_title: data.seo_title,
    seo_description: data.seo_description,
    og_image_url: data.og_image_url,
    keywords: data.keywords,
    canonical_url: data.canonical_url,
    theme_primary: data.theme_primary,
    theme_accent: data.theme_accent,
    theme_radius: data.theme_radius,
    visibility_flags: data.visibility_flags,
    footer_description: data.footer_description,
    copyright_text: data.copyright_text,
  };

  let existingCards: Array<{ title: string; description: string; status: string; icon: string; comingSoon: boolean; disabled: boolean; href: string }> = [];
  const rawFeatureCards = (current?.feature_cards || data.feature_cards) as Array<{ title?: string; description?: string; status?: string; icon?: string; comingSoon?: boolean; disabled?: boolean; href?: string }> | null;
  if (Array.isArray(rawFeatureCards)) {
    existingCards = rawFeatureCards
      .filter((c) => c && typeof c === "object" && c.title !== "__extended_settings__")
      .map((c) => ({
        title: c.title || "",
        description: c.description || "",
        status: c.status || "active",
        icon: c.icon || "",
        comingSoon: Boolean(c.comingSoon),
        disabled: Boolean(c.disabled),
        href: c.href || "#",
      }));
  }

  existingCards.push({
    title: "__extended_settings__",
    description: JSON.stringify(extendedPayload),
    status: "hidden",
    icon: "",
    comingSoon: false,
    disabled: true,
    href: "#",
  });

  let error;
  if (current?.id) {
    // Attempt full update
    ({ error } = await adminSupabase
      .from("homepage_settings")
      .update({
        ...data,
        feature_cards: existingCards,
        updated_at: new Date().toISOString(),
      })
      .eq("id", current.id));

    if (error) {
      console.warn("[CMS API] Direct column update failed, storing extended payload via feature_cards JSON:", error.message);
      const fallbackResult = await adminSupabase
        .from("homepage_settings")
        .update({
          hero_title: data.hero_title || "Learn.\nBuild.\nGrow Together.",
          hero_subtitle: data.hero_subtitle || "",
          feature_cards: existingCards,
          updated_at: new Date().toISOString(),
        })
        .eq("id", current.id);
      error = fallbackResult.error;
    }
  } else {
    // Attempt full insert
    ({ error } = await adminSupabase
      .from("homepage_settings")
      .insert({
        hero_title: data.hero_title || "Learn.\nBuild.\nGrow Together.",
        hero_subtitle: data.hero_subtitle || "Deep Code is your all-in-one platform to learn in-depth, build real-world projects, and connect with a global community of developers.",
        feature_cards: existingCards,
        ...data,
      }));

    if (error) {
      console.warn("[CMS API] Direct insert failed, inserting extended payload via feature_cards JSON:", error.message);
      const fallbackResult = await adminSupabase
        .from("homepage_settings")
        .insert({
          hero_title: data.hero_title || "Learn.\nBuild.\nGrow Together.",
          hero_subtitle: data.hero_subtitle || "",
          feature_cards: existingCards,
        });
      error = fallbackResult.error;
    }
  }

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  return { success: true };
}

// ----------------------------------------------------------------------------
// NORMALIZED CMS BUILDER ACTIONS
// ----------------------------------------------------------------------------
export async function getHomepageNavItems(): Promise<DBHomepageNavItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("homepage_navigation")
    .select("*")
    .order("order", { ascending: true });

  if (error || !data || data.length === 0) {
    return [
      { id: "nav-1", label: "Home", url: "/", order: 1, is_hidden: false },
      { id: "nav-2", label: "Courses", url: "/courses", order: 2, is_hidden: false },
      { id: "nav-3", label: "Mr Owl AI", url: "/mr-owl", order: 3, is_hidden: false },
      { id: "nav-4", label: "Join Deep Code", url: "/join", order: 4, is_hidden: false },
    ];
  }
  const items = data as DBHomepageNavItem[];
  return items.map((item) => {
    if (item.label.toLowerCase().includes("owl") && (item.url === "/dashboard" || item.url === "#")) {
      return { ...item, url: "/mr-owl" };
    }
    if (item.label.toLowerCase().includes("join") && (item.url === "/signup" || item.url === "#")) {
      return { ...item, url: "/join" };
    }
    return item;
  });
}

export async function upsertNavItems(items: DBHomepageNavItem[]) {
  const { adminSupabase } = await verifyAdmin();

  for (const item of items) {
    if (item.id.startsWith("nav-") || item.id.length < 20) {
      await adminSupabase.from("homepage_navigation").insert({
        label: item.label,
        url: item.url,
        order: item.order,
        is_hidden: item.is_hidden,
      });
    } else {
      await adminSupabase
        .from("homepage_navigation")
        .update({
          label: item.label,
          url: item.url,
          order: item.order,
          is_hidden: item.is_hidden,
          updated_at: new Date().toISOString(),
        })
        .eq("id", item.id);
    }
  }
  revalidatePath("/");
  return { success: true };
}

export async function deleteNavItem(id: string) {
  const { adminSupabase } = await verifyAdmin();
  await adminSupabase.from("homepage_navigation").delete().eq("id", id);
  revalidatePath("/");
  return { success: true };
}

export async function getHomepageHighlights(): Promise<DBHomepageHighlight[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("homepage_highlights")
    .select("*")
    .order("order", { ascending: true });

  if (error || !data || data.length === 0) {
    return [
      { id: "hl-1", icon: "GraduationCap", title: "Expert-Led Content", description: "Learn from industry professionals building production systems.", order: 1, is_hidden: false },
      { id: "hl-2", icon: "Code2", title: "Hands-On Learning", description: "Practice with real-world projects and verified code challenges.", order: 2, is_hidden: false },
      { id: "hl-3", icon: "Users", title: "Community Driven", description: "Collaborate, share feedback, and grow together as developers.", order: 3, is_hidden: false },
    ];
  }
  return data as DBHomepageHighlight[];
}

export async function upsertHighlightItems(items: DBHomepageHighlight[]) {
  const { adminSupabase } = await verifyAdmin();

  for (const item of items) {
    if (item.id.startsWith("hl-") || item.id.length < 20) {
      await adminSupabase.from("homepage_highlights").insert({
        icon: item.icon,
        title: item.title,
        description: item.description,
        order: item.order,
        is_hidden: item.is_hidden,
      });
    } else {
      await adminSupabase
        .from("homepage_highlights")
        .update({
          icon: item.icon,
          title: item.title,
          description: item.description,
          order: item.order,
          is_hidden: item.is_hidden,
          updated_at: new Date().toISOString(),
        })
        .eq("id", item.id);
    }
  }
  revalidatePath("/");
  return { success: true };
}

export async function deleteHighlightItem(id: string) {
  const { adminSupabase } = await verifyAdmin();
  await adminSupabase.from("homepage_highlights").delete().eq("id", id);
  revalidatePath("/");
  return { success: true };
}

export async function getHomepageProducts(): Promise<DBHomepageProduct[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("homepage_products")
    .select("*")
    .order("order", { ascending: true });

  if (error || !data || data.length === 0) {
    return [
      {
        id: "prod-1",
        title: "Mr Owl AI",
        description: "Your intelligent study companion. Summarize notes, ask questions, generate quizzes, and learn with AI.",
        status: "coming_soon",
        logo_url: "/branding/mrowl/logo.png",
        button_text: "Coming Soon",
        button_url: "/mr-owl",
        order: 1,
        is_hidden: false,
      },
      {
        id: "prod-2",
        title: "Courses",
        description: "In-depth, structured learning tracks with notes, quizzes, projects and challenges that accelerate your career.",
        status: "active",
        logo_url: "/branding/deepcode/logo.png",
        button_text: "Explore Courses",
        button_url: "/courses",
        order: 2,
        is_hidden: false,
      },
      {
        id: "prod-3",
        title: "Join Deep Code",
        description: "Connect with thousands of developers, access open-source resources, and collaborate on impactful projects worldwide.",
        status: "coming_soon",
        logo_url: "/branding/deepcode/logo.png",
        button_text: "Coming Soon",
        button_url: "/join",
        order: 3,
        is_hidden: false,
      },
    ];
  }

  const items = data as DBHomepageProduct[];
  return items.map((item) => {
    if (item.title.toLowerCase().includes("owl") && (item.button_url === "/dashboard" || item.button_url === "#")) {
      return { ...item, button_url: "/mr-owl" };
    }
    if (item.title.toLowerCase().includes("join") && (item.button_url === "/signup" || item.button_url === "#")) {
      return { ...item, button_url: "/join" };
    }
    return item;
  });
}

export async function upsertProductItems(items: DBHomepageProduct[]) {
  const { adminSupabase } = await verifyAdmin();

  for (const item of items) {
    if (item.id.startsWith("prod-") || item.id.length < 20) {
      await adminSupabase.from("homepage_products").insert({
        title: item.title,
        description: item.description,
        status: item.status,
        logo_url: item.logo_url,
        button_text: item.button_text,
        button_url: item.button_url,
        order: item.order,
        is_hidden: item.is_hidden,
      });
    } else {
      await adminSupabase
        .from("homepage_products")
        .update({
          title: item.title,
          description: item.description,
          status: item.status,
          logo_url: item.logo_url,
          button_text: item.button_text,
          button_url: item.button_url,
          order: item.order,
          is_hidden: item.is_hidden,
          updated_at: new Date().toISOString(),
        })
        .eq("id", item.id);
    }
  }
  revalidatePath("/");
  return { success: true };
}

export async function deleteProductItem(id: string) {
  const { adminSupabase } = await verifyAdmin();
  await adminSupabase.from("homepage_products").delete().eq("id", id);
  revalidatePath("/");
  return { success: true };
}

export async function getHomepageFooterSections(): Promise<DBHomepageFooterSection[]> {
  const supabase = await createClient();
  const { data: sections } = await supabase
    .from("homepage_footer_sections")
    .select("*")
    .order("order", { ascending: true });

  if (!sections || sections.length === 0) {
    return [
      {
        id: "sec-1",
        title: "Products",
        order: 1,
        links: [
          { id: "lnk-1", section_id: "sec-1", label: "Courses", url: "/courses", order: 1 },
          { id: "lnk-2", section_id: "sec-1", label: "Mr Owl AI", url: "/dashboard", order: 2 },
          { id: "lnk-3", section_id: "sec-1", label: "Join Deep Code", url: "/signup", order: 3 },
        ],
      },
      {
        id: "sec-2",
        title: "Resources",
        order: 2,
        links: [
          { id: "lnk-4", section_id: "sec-2", label: "Documentation", url: "/courses", order: 1 },
          { id: "lnk-5", section_id: "sec-2", label: "Roadmap", url: "/courses", order: 2 },
          { id: "lnk-6", section_id: "sec-2", label: "Blog", url: "/", order: 3 },
        ],
      },
      {
        id: "sec-3",
        title: "Company",
        order: 3,
        links: [
          { id: "lnk-7", section_id: "sec-3", label: "About", url: "/", order: 1 },
          { id: "lnk-8", section_id: "sec-3", label: "Contact", url: "mailto:hello@deepcode.ai", order: 2 },
          { id: "lnk-9", section_id: "sec-3", label: "Privacy Policy", url: "/", order: 3 },
          { id: "lnk-10", section_id: "sec-3", label: "Terms of Service", url: "/", order: 4 },
        ],
      },
    ];
  }

  const result: DBHomepageFooterSection[] = [];
  for (const sec of sections) {
    const { data: links } = await supabase
      .from("homepage_footer_links")
      .select("*")
      .eq("section_id", sec.id)
      .order("order", { ascending: true });

    result.push({
      ...sec,
      links: (links || []) as DBHomepageFooterLink[],
    });
  }

  return result;
}

export async function upsertFooterSection(title: string, order: number, id?: string) {
  const { adminSupabase } = await verifyAdmin();

  if (!id || id.startsWith("sec-")) {
    const { data } = await adminSupabase
      .from("homepage_footer_sections")
      .insert({ title, order })
      .select()
      .single();
    revalidatePath("/");
    return data as DBHomepageFooterSection;
  } else {
    const { data } = await adminSupabase
      .from("homepage_footer_sections")
      .update({ title, order, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    revalidatePath("/");
    return data as DBHomepageFooterSection;
  }
}

export async function deleteFooterSection(id: string) {
  const { adminSupabase } = await verifyAdmin();
  await adminSupabase.from("homepage_footer_links").delete().eq("section_id", id);
  await adminSupabase.from("homepage_footer_sections").delete().eq("id", id);
  revalidatePath("/");
  return { success: true };
}

export async function upsertFooterLink(sectionId: string, label: string, url: string, order: number, id?: string) {
  const { adminSupabase } = await verifyAdmin();

  if (!id || id.startsWith("lnk-")) {
    const { data } = await adminSupabase
      .from("homepage_footer_links")
      .insert({ section_id: sectionId, label, url, order })
      .select()
      .single();
    revalidatePath("/");
    return data as DBHomepageFooterLink;
  } else {
    const { data } = await adminSupabase
      .from("homepage_footer_links")
      .update({ label, url, order, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    revalidatePath("/");
    return data as DBHomepageFooterLink;
  }
}

export async function deleteFooterLink(id: string) {
  const { adminSupabase } = await verifyAdmin();
  await adminSupabase.from("homepage_footer_links").delete().eq("id", id);
  revalidatePath("/");
  return { success: true };
}

export async function getHomepageAnnouncements(): Promise<DBHomepageAnnouncement | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("homepage_announcements")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) {
    return {
      id: "ann-default",
      title: "🚀 Deep Code Platform Updates & Masterclasses are Live!",
      badge_text: "NEW",
      link_text: "Explore Courses",
      link_url: "/courses",
      is_active: true,
    };
  }
  return data as DBHomepageAnnouncement;
}

export async function upsertAnnouncement(data: {
  title: string;
  badge_text?: string | null;
  link_text?: string | null;
  link_url?: string | null;
  is_active: boolean;
  id?: string;
}) {
  const { adminSupabase } = await verifyAdmin();

  try {
    if (!data.id || data.id.startsWith("ann-")) {
      await adminSupabase.from("homepage_announcements").insert({
        title: data.title,
        badge_text: data.badge_text || null,
        link_text: data.link_text || null,
        link_url: data.link_url || null,
        is_active: data.is_active,
      });
    } else {
      await adminSupabase
        .from("homepage_announcements")
        .update({
          title: data.title,
          badge_text: data.badge_text || null,
          link_text: data.link_text || null,
          link_url: data.link_url || null,
          is_active: data.is_active,
          updated_at: new Date().toISOString(),
        })
        .eq("id", data.id);
    }
  } catch (err) {
    console.warn("[CMS API] Warning: could not upsert announcement:", err);
  }
  revalidatePath("/");
  return { success: true };
}

// ============================================================================
// COURSE CRUD ACTIONS
// ============================================================================
export async function getAdminCourses(): Promise<DBCourse[]> {
  await verifyAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data as DBCourse[];
}

export async function getPublicCourses(): Promise<DBCourse[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data as DBCourse[];
}

export async function getCourseBySlug(slug: string): Promise<DBCourse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) return null;
  return data as DBCourse;
}

export async function createCourse(data: Omit<DBCourse, "id" | "created_at" | "updated_at" | "published_at">) {
  const { adminSupabase } = await verifyAdmin();

  const { data: newCourse, error } = await adminSupabase
    .from("courses")
    .insert({
      ...data,
      published_at: data.status === "published" ? new Date().toISOString() : null,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/courses");
  return newCourse as DBCourse;
}

export async function updateCourse(id: string, data: Partial<DBCourse>) {
  const { adminSupabase } = await verifyAdmin();

  const updates: Partial<DBCourse> = {
    ...data,
    updated_at: new Date().toISOString(),
  };

  if (data.status) {
    updates.published_at = data.status === "published" ? new Date().toISOString() : null;
  }

  const { data: updatedCourse, error } = await adminSupabase
    .from("courses")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/courses");
  revalidatePath(`/courses/${updatedCourse.slug}`);
  return updatedCourse as DBCourse;
}

export async function deleteCourse(id: string) {
  const { adminSupabase } = await verifyAdmin();

  const { error } = await adminSupabase.from("courses").delete().eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/courses");
  return { success: true };
}

export async function duplicateCourse(id: string) {
  await verifyAdmin();
  const supabase = await createClient();

  const { data: original, error: fetchErr } = await supabase
    .from("courses")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchErr) throw new Error(fetchErr.message);

  const newSlug = `${original.slug}-copy-${Math.floor(Math.random() * 1000)}`;
  const { data: newCourse, error: insertErr } = await supabase
    .from("courses")
    .insert({
      title: `${original.title} (Copy)`,
      slug: newSlug,
      short_description: original.short_description,
      full_description: original.full_description,
      thumbnail_url: original.thumbnail_url,
      difficulty: original.difficulty,
      category: original.category,
      tags: original.tags,
      status: "draft",
    })
    .select()
    .single();

  if (insertErr) throw new Error(insertErr.message);

  // Duplicate sections and lectures in order
  const { data: sections } = await supabase
    .from("course_sections")
    .select("*")
    .eq("course_id", id)
    .order("order", { ascending: true });

  if (sections) {
    for (const section of sections) {
      const { data: newSec } = await supabase
        .from("course_sections")
        .insert({
          course_id: newCourse.id,
          title: section.title,
          description: section.description,
          order: section.order,
        })
        .select()
        .single();

      if (newSec) {
        const { data: lectures } = await supabase
          .from("lectures")
          .select("*")
          .eq("section_id", section.id)
          .order("order", { ascending: true });

        if (lectures) {
          for (const lec of lectures) {
            await supabase.from("lectures").insert({
              section_id: newSec.id,
              title: lec.title,
              slug: lec.slug,
              description: lec.description,
              video_url: lec.video_url,
              notes_pdf_url: lec.notes_pdf_url,
              order: lec.order,
              status: lec.status,
            });
          }
        }
      }
    }
  }

  revalidatePath("/courses");
  return newCourse as DBCourse;
}

// ============================================================================
// SECTION CRUD ACTIONS
// ============================================================================
export async function getCourseSections(courseId: string): Promise<DBCourseSection[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("course_sections")
    .select("*")
    .eq("course_id", courseId)
    .order("order", { ascending: true });

  if (error) throw new Error(error.message);
  return (data || []) as DBCourseSection[];
}

export async function createSection(data: Omit<DBCourseSection, "id" | "created_at" | "updated_at">) {
  const { adminSupabase } = await verifyAdmin();

  const { data: newSection, error } = await adminSupabase
    .from("course_sections")
    .insert(data)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return newSection as DBCourseSection;
}

export async function updateSection(id: string, data: Partial<DBCourseSection>) {
  const { adminSupabase } = await verifyAdmin();

  const { data: updated, error } = await adminSupabase
    .from("course_sections")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return updated as DBCourseSection;
}

export async function deleteSection(id: string) {
  const { adminSupabase } = await verifyAdmin();

  const { error } = await adminSupabase.from("course_sections").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return { success: true };
}

export async function reorderSections(sections: { id: string; order: number }[]) {
  const { adminSupabase } = await verifyAdmin();

  for (const sec of sections) {
    await adminSupabase
      .from("course_sections")
      .update({ order: sec.order })
      .eq("id", sec.id);
  }
  return { success: true };
}

// ============================================================================
// LECTURE CRUD ACTIONS
// ============================================================================
export async function getSectionLectures(sectionId: string): Promise<DBLecture[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lectures")
    .select("*")
    .eq("section_id", sectionId)
    .order("order", { ascending: true });

  if (error) throw new Error(error.message);
  return (data || []) as DBLecture[];
}

export async function createLecture(data: Omit<DBLecture, "id" | "created_at" | "updated_at">) {
  const { adminSupabase } = await verifyAdmin();

  const { data: newLec, error } = await adminSupabase
    .from("lectures")
    .insert(data)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return newLec as DBLecture;
}

export async function updateLecture(id: string, data: Partial<DBLecture>) {
  const { adminSupabase } = await verifyAdmin();

  const { data: updated, error } = await adminSupabase
    .from("lectures")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return updated as DBLecture;
}

export async function deleteLecture(id: string) {
  await verifyAdmin();
  const supabase = await createClient();

  const { error } = await supabase.from("lectures").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return { success: true };
}

export async function reorderLectures(lectures: { id: string; order: number }[]) {
  await verifyAdmin();
  const supabase = await createClient();

  for (const lec of lectures) {
    await supabase
      .from("lectures")
      .update({ order: lec.order })
      .eq("id", lec.id);
  }
  return { success: true };
}

// ============================================================================
// QUIZ & QUESTION CRUD ACTIONS
// ============================================================================
export async function getLectureQuiz(lectureId: string) {
  const supabase = await createClient();
  
  const { data: quiz, error: quizError } = await supabase
    .from("quizzes")
    .select("*")
    .eq("lecture_id", lectureId)
    .maybeSingle();

  if (quizError) return null;
  if (!quiz) return null;

  const { data: questions } = await supabase
    .from("quiz_questions")
    .select("*")
    .eq("quiz_id", quiz.id)
    .order("order", { ascending: true });

  return {
    ...quiz,
    questions: questions || [],
  };
}

export async function saveQuiz(
  lectureId: string,
  quizData: { title: string; passing_percentage: number },
  questions: Array<Omit<DBQuizQuestion, "id" | "quiz_id" | "created_at" | "updated_at">>
) {
  const { adminSupabase } = await verifyAdmin();

  let { data: quiz } = await adminSupabase
    .from("quizzes")
    .select("id")
    .eq("lecture_id", lectureId)
    .maybeSingle();

  if (!quiz) {
    const { data: newQuiz, error } = await adminSupabase
      .from("quizzes")
      .insert({
        lecture_id: lectureId,
        title: quizData.title,
        passing_percentage: quizData.passing_percentage,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    quiz = newQuiz;
  } else {
    const { error } = await adminSupabase
      .from("quizzes")
      .update({
        title: quizData.title,
        passing_percentage: quizData.passing_percentage,
        updated_at: new Date().toISOString(),
      })
      .eq("id", quiz.id);
    if (error) throw new Error(error.message);
  }

  // Rewrite questions (safe rebuild for quiz questions)
  await adminSupabase.from("quiz_questions").delete().eq("quiz_id", quiz.id);

  if (questions.length > 0) {
    const questionsToInsert = questions.map((q, idx) => ({
      quiz_id: quiz!.id,
      question: q.question,
      option_a: q.option_a,
      option_b: q.option_b,
      option_c: q.option_c,
      option_d: q.option_d,
      correct_option: q.correct_option,
      explanation: q.explanation || null,
      order: idx,
    }));

    const { error: insErr } = await adminSupabase
      .from("quiz_questions")
      .insert(questionsToInsert);
    if (insErr) throw new Error(insErr.message);
  }

  return { success: true };
}

export async function deleteQuiz(lectureId: string) {
  const { adminSupabase } = await verifyAdmin();

  const { error } = await adminSupabase
    .from("quizzes")
    .delete()
    .eq("lecture_id", lectureId);

  if (error) throw new Error(error.message);
  return { success: true };
}

// ============================================================================
// TASK CRUD ACTIONS
// ============================================================================
export async function getLectureTasks(lectureId: string): Promise<DBTask[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("lecture_id", lectureId)
    .order("order", { ascending: true });

  if (error) throw new Error(error.message);
  return (data || []) as DBTask[];
}

export async function createTask(data: Omit<DBTask, "id" | "created_at" | "updated_at">) {
  const { adminSupabase } = await verifyAdmin();

  const { data: newTask, error } = await adminSupabase
    .from("tasks")
    .insert(data)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return newTask as DBTask;
}

export async function updateTask(id: string, data: Partial<DBTask>) {
  const { adminSupabase } = await verifyAdmin();

  const { data: updated, error } = await adminSupabase
    .from("tasks")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return updated as DBTask;
}

export async function deleteTask(id: string) {
  const { adminSupabase } = await verifyAdmin();

  const { error } = await adminSupabase.from("tasks").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return { success: true };
}

// ============================================================================
// PUBLIC WEBSITE NESTED MAPPING ADAPTERS
// ============================================================================
import { Course } from "@/types/course.types";

export async function getPublicCoursesFull(): Promise<Course[]> {
  const supabase = await createClient();
  
  // 1. Get all published courses
  const { data: dbCourses, error: courseErr } = await supabase
    .from("courses")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (courseErr || !dbCourses || dbCourses.length === 0) {
    const { seedCourses } = await import("@/lib/data/seed-courses");
    return seedCourses;
  }

  const fullCourses: Course[] = [];

  for (const dbC of dbCourses) {
    // 2. Fetch sections for this course
    const { data: dbSections } = await supabase
      .from("course_sections")
      .select("*")
      .eq("course_id", dbC.id)
      .order("order", { ascending: true });

    const lecturesList: Course["lectures"] = [];

    if (dbSections) {
      for (const sec of dbSections) {
        // 3. Fetch lectures for this section
        const { data: dbLectures } = await supabase
          .from("lectures")
          .select("*")
          .eq("section_id", sec.id)
          .order("order", { ascending: true });

        if (dbLectures) {
          for (const lec of dbLectures) {
            // 4. Fetch quiz for this lecture
            const { data: dbQuiz } = await supabase
              .from("quizzes")
              .select("*")
              .eq("lecture_id", lec.id)
              .maybeSingle();

            let quizQuestions: Array<{
              id: string;
              question: string;
              options: string[];
              correctOptionIndex: number;
              explanation?: string;
            }> = [];
            if (dbQuiz) {
              const { data: dbQuestions } = await supabase
                .from("quiz_questions")
                .select("*")
                .eq("quiz_id", dbQuiz.id)
                .order("order", { ascending: true });
              if (dbQuestions) {
                quizQuestions = dbQuestions.map((q) => ({
                  id: q.id,
                  question: q.question,
                  options: [q.option_a, q.option_b, q.option_c, q.option_d],
                  correctOptionIndex: q.correct_option === "A" ? 0 : q.correct_option === "B" ? 1 : q.correct_option === "C" ? 2 : 3,
                  explanation: q.explanation || undefined,
                }));
              }
            }

            // 5. Fetch tasks for this lecture
            const { data: dbTasks } = await supabase
              .from("tasks")
              .select("*")
              .eq("lecture_id", lec.id)
              .order("order", { ascending: true });

            lecturesList.push({
              id: lec.id,
              slug: lec.slug,
              title: lec.title,
              description: lec.description || "",
              videoUrl: lec.video_url || undefined,
              notes: lec.notes_pdf_url
                ? {
                    id: `notes-${lec.id}`,
                    title: `${lec.title} Notes`,
                    pdfUrl: lec.notes_pdf_url,
                    content: lec.description || "",
                  }
                : undefined,
              quiz: dbQuiz
                ? {
                    id: dbQuiz.id,
                    title: dbQuiz.title,
                    passing_percentage: dbQuiz.passing_percentage,
                    questions: quizQuestions,
                  }
                : undefined,
              task: dbTasks && dbTasks.length > 0
                ? {
                    id: dbTasks[0].id,
                    title: dbTasks[0].title,
                    description: dbTasks[0].description,
                    instructions: dbTasks.map(t => `${t.title}:\n${t.description}`).join("\n\n"),
                  }
                : undefined,
            });
          }
        }
      }
    }

    let resolvedThumbnail = dbC.thumbnail_url || "/courses/compiler-engineering.png";
    if (resolvedThumbnail && resolvedThumbnail.startsWith("users/")) {
      try {
        resolvedThumbnail = await generateR2SignedUrl(resolvedThumbnail);
      } catch {
        // Fallback to original key/url
      }
    }

    fullCourses.push({
      id: dbC.id,
      slug: dbC.slug,
      title: dbC.title,
      description: dbC.short_description,
      thumbnail: resolvedThumbnail,
      lectures: lecturesList,
    });
  }

  return fullCourses;
}

export async function getPublicCourseFullBySlug(slug: string): Promise<Course | null> {
  const courses = await getPublicCoursesFull();
  return courses.find((c) => c.slug === slug) || null;
}

