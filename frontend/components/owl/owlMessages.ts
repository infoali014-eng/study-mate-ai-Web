import { OwlAnimState } from "./MrOwl";

export interface OwlMessage {
  text: string;
  mood: OwlAnimState;
}

export const OWL_MESSAGES: Record<string, OwlMessage> = {
  loginGreet: {
    text: "Hey there! Ready to pick up where you left off?",
    mood: "idle",
  },
  signupGreet: {
    text: "Hi! Let's get you set up in a minute.",
    mood: "idle",
  },
  focusEmail: {
    text: "Nice, what's your email?",
    mood: "talk",
  },
  focusName: {
    text: "Awesome, what should I call you?",
    mood: "talk",
  },
  focusPassword: {
    text: "Keep this one safe 🔒",
    mood: "talk",
  },
  passwordShort: {
    text: "Needs a few more characters.",
    mood: "talk",
  },
  submitting: {
    text: "", // No message display during submission
    mood: "idle",
  },
  success: {
    text: "You're in! 🎉",
    mood: "celebrate",
  },
  error: {
    text: "Hmm, that didn't work — try again?",
    mood: "talk",
  },
  idleTimeout: {
    text: "Need a hand? I'm here if you get stuck.",
    mood: "talk",
  },
};
