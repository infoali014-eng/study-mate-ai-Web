"use client";

import { useQuery } from "@tanstack/react-query";
import { SettingsService } from "@/services/settingsService";
import { ProfileSettings, AcademicSettings } from "@/types/settings.types";

export interface UserProfileData {
  profile: ProfileSettings;
  academic: AcademicSettings;
}

export function useUserProfile() {
  const { data, isLoading, refetch } = useQuery<UserProfileData>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const [profile, academic] = await Promise.all([
        SettingsService.getProfileSettings(),
        SettingsService.getAcademicSettings(),
      ]);
      return { profile, academic };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  const getInitials = (name?: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return {
    profile: data?.profile || {
      displayName: "User",
      username: "user",
      email: "",
      avatarUrl: null,
      bio: null,
    },
    academic: data?.academic || {
      institution: "",
      fieldOfStudy: "",
      educationLevel: "university",
    },
    isLoading,
    refetch,
    getInitials,
  };
}
