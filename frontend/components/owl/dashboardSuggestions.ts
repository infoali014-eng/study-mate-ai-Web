import { OwlAnimState } from "./MrOwl";

export interface OwlSuggestion {
  text: string;
  mood: OwlAnimState;
}

// Placeholder rotation — will later be replaced by real AI-generated
// suggestions driven by notes count, streak, daily goal progress, etc.
export const DASHBOARD_SUGGESTIONS: OwlSuggestion[] = [
  {
    text: "You've got 8 notes ready — want me to turn one into a quiz?",
    mood: "talk",
  },
  {
    text: "Haven't started today's 60-min goal yet. Even 15 minutes counts!",
    mood: "talk",
  },
  {
    text: "Pick up Ch10 where you left off? I can quiz you on it after.",
    mood: "talk",
  },
  {
    text: "Tip: upload your messiest notes first — I organize them for you.",
    mood: "idle",
  },
  {
    text: "Consistency beats intensity. One short session today keeps your streak alive.",
    mood: "talk",
  },
];
