import { z } from "zod";

export const onboardingValidationSchema = z.object({
  education: z.string().min(1, "Please select what you are studying"),
  subjects: z.array(z.string()).min(1, "Please select at least one subject"),
  primaryGoals: z.array(z.string()).min(1, "Please select at least one goal"),
  heardFrom: z.string().min(1, "Please select how you heard about us"),
  interests: z.array(z.string()).default([]),
  learningStyles: z.array(z.string()).min(1, "Please select at least one learning style"),
  dailyStudyTime: z.string().min(1, "Please select your daily study time"),
  nextExam: z.string().nullable().default(null),
  dashboardFocus: z.string().min(1, "Please select your preferred dashboard view"),
});
