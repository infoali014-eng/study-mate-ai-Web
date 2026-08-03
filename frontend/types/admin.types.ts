export interface DBCourse {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  full_description: string;
  thumbnail_url: string | null;
  difficulty: "beginner" | "intermediate" | "advanced";
  category: string;
  tags: string[];
  status: "draft" | "published" | "archived";
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DBCourseSection {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface DBLecture {
  id: string;
  section_id: string;
  title: string;
  slug: string;
  description: string | null;
  video_url: string | null;
  notes_pdf_url: string | null;
  order: number;
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
}

export interface DBQuiz {
  id: string;
  lecture_id: string;
  title: string;
  passing_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface DBQuizQuestion {
  id: string;
  quiz_id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: "A" | "B" | "C" | "D";
  explanation: string | null;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface DBTask {
  id: string;
  lecture_id: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  order: number;
  created_at: string;
  updated_at: string;
}

export type ProductStatus = "active" | "coming_soon" | "beta" | "new" | "updated" | "maintenance";

export interface HomepageVisibilityFlags {
  announcement?: boolean;
  hero?: boolean;
  highlights?: boolean;
  products?: boolean;
  footer?: boolean;
  [key: string]: boolean | undefined;
}

export interface DBHomepageSettings {
  id: string;
  hero_title: string;
  hero_subtitle: string;
  hero_badge: string | null;
  hero_primary_btn_text: string | null;
  hero_primary_btn_url: string | null;
  hero_secondary_btn_text: string | null;
  hero_secondary_btn_url: string | null;
  hero_media_type: "logo" | "image" | "video" | "illustration" | "none";
  hero_media_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
  og_image_url: string | null;
  keywords: string | null;
  canonical_url: string | null;
  favicon_url: string | null;
  theme_primary: string | null;
  theme_accent: string | null;
  theme_radius: string | null;
  visibility_flags: HomepageVisibilityFlags;
  footer_description: string | null;
  copyright_text: string | null;
  footer_links?: Array<{ label: string; url: string }>;
  social_links?: Array<{ platform: string; url: string }>;
  feature_cards?: Array<{
    title: string;
    description: string;
    status: string;
    icon: string;
    comingSoon: boolean;
    disabled: boolean;
    href: string;
  }>;
  updated_at: string;
}

export interface DBHomepageNavItem {
  id: string;
  label: string;
  url: string;
  order: number;
  is_hidden: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface DBHomepageHighlight {
  id: string;
  icon: string;
  title: string;
  description: string;
  order: number;
  is_hidden: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface DBHomepageProduct {
  id: string;
  title: string;
  description: string;
  status: ProductStatus;
  logo_url: string | null;
  button_text: string;
  button_url: string;
  order: number;
  is_hidden: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface DBHomepageFooterSection {
  id: string;
  title: string;
  order: number;
  links?: DBHomepageFooterLink[];
  created_at?: string;
  updated_at?: string;
}

export interface DBHomepageFooterLink {
  id: string;
  section_id: string;
  label: string;
  url: string;
  order: number;
  created_at?: string;
  updated_at?: string;
}

export interface DBHomepageAnnouncement {
  id: string;
  title: string;
  badge_text: string | null;
  link_text: string | null;
  link_url: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface DBCommunitySettings {
  id: string;
  title: string;
  description: string;
  social_links: Array<{ platform: string; url: string }>;
  announcement: string | null;
  updated_at: string;
}
