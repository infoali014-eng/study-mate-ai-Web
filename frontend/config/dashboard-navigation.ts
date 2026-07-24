import {
  House,
  LibraryBig,
  Users,
  Bot,
  ChartColumn,
  Ellipsis,
  Settings2,
  CircleUserRound,
  Upload,
  BrainCircuit,
  Layers3,
  CalendarClock,
  FolderPlus,
  Search,
  Bell,
  Flame,
  LogOut,
  Calendar,
  Sparkles,
  LucideIcon,
} from "lucide-react";

export interface NavItem {
  id: string;
  title: string;
  href: string;
  icon: LucideIcon;
  description?: string;
  badge?: string;
  requiresAuth?: boolean;
  isComingSoon?: boolean;
  permission?: string;
  hidden?: boolean;
  isExternal?: boolean;
}

export interface NavSection {
  id: string;
  title?: string;
  items: NavItem[];
}

export interface CreateOption {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

// 1. Canva-Style "+ Create" Dropdown Options
export const CREATE_MENU_OPTIONS: CreateOption[] = [
  {
    id: "upload_notes",
    title: "Upload Notes",
    description: "Add PDFs, DOCX or PPTX",
    href: "/dashboard/library?action=upload",
    icon: Upload,
  },
  {
    id: "create_quiz",
    title: "Create Quiz",
    description: "Generate AI practice questions",
    href: "/quiz?action=create",
    icon: BrainCircuit,
  },
  {
    id: "create_flashcards",
    title: "Create Flashcards",
    description: "Spaced repetition deck",
    href: "/flashcards?action=create",
    icon: Layers3,
  },
  {
    id: "revision_plan",
    title: "Revision Planner",
    description: "Automated study schedule",
    href: "/planner?action=create",
    icon: CalendarClock,
  },
  {
    id: "create_folder",
    title: "Create Folder",
    description: "Organize your subjects",
    href: "/dashboard/library?action=new_folder",
    icon: FolderPlus,
  },
];

// 2. Primary Sidebar Navigation Sections
export const DASHBOARD_NAVIGATION: NavSection[] = [
  {
    id: "main",
    items: [
      {
        id: "home",
        title: "Home",
        href: "/dashboard",
        icon: House,
      },
      {
        id: "library",
        title: "Study Library",
        href: "/dashboard/library",
        icon: LibraryBig,
      },
      {
        id: "groups",
        title: "Study Groups",
        href: "/groups",
        icon: Users,
        badge: "Soon",
        isComingSoon: true,
      },
      {
        id: "owl_ai",
        title: "Owl AI",
        href: "/chat",
        icon: Bot,
      },
      {
        id: "analytics",
        title: "Analytics",
        href: "/analytics",
        icon: ChartColumn,
        isComingSoon: true,
      },
    ],
  },
  {
    id: "tools",
    title: "Tools",
    items: [
      {
        id: "calendar",
        title: "Calendar",
        href: "/planner",
        icon: Calendar,
      },
      {
        id: "pomodoro",
        title: "Pomodoro Timer",
        href: "/tools/pomodoro",
        icon: Sparkles,
        hidden: true, // Reserved future item
      },
      {
        id: "more_tools",
        title: "More Tools",
        href: "/tools",
        icon: Ellipsis,
      },
    ],
  },
  {
    id: "system",
    title: "Account",
    items: [
      {
        id: "settings",
        title: "Settings",
        href: "/settings",
        icon: Settings2,
      },
    ],
  },
];
