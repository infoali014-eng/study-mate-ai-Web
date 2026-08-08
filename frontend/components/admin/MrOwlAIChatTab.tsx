"use client";

import React, { useState, useRef, useEffect } from "react";
import MrOwl from "@/components/owl/MrOwl";
import { useOwlStore } from "@/store/owlStore";

interface ChatMessage {
  id: string;
  sender: "user" | "owl";
  text: string;
  timestamp: string;
  codeSnippet?: string;
  suggestedActions?: string[];
}

export const MrOwlAIChatTab: React.FC = () => {
  const { animState, setAnimState, say } = useOwlStore();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg_1",
      sender: "owl",
      text: "Hoot! 👋 Hello Admin! I am Mr Owl AI, your intelligent platform co-pilot. How can I assist you today? You can ask me to generate course syllabi, draft announcements, analyze student progress, or debug code!",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      suggestedActions: [
        "Create a new Python course outline",
        "Draft a platform announcement",
        "Summarize system analytics",
        "Debug Next.js SSR / API error",
      ],
    },
  ]);

  const [inputQuery, setInputQuery] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiMode, setAiMode] = useState<"copilot" | "tutor" | "code_writer">("copilot");
  const [includeCmsContext, setIncludeCmsContext] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isGenerating) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");
    setIsGenerating(true);
    setAnimState("dizzy");

    // Simulate AI thinking and response generation
    setTimeout(() => {
      let replyText = "";
      let codeSnippet: string | undefined = undefined;

      const lower = query.toLowerCase();

      if (lower.includes("course") || lower.includes("outline") || lower.includes("python")) {
        replyText = "Hoot! Here is a structured 4-module Python for Beginners course syllabus tailored for your platform catalog:";
        codeSnippet = `# Python Mastery for Beginners Syllabus
Module 1: Foundations & Syntax
  - L1: Variables, Datatypes, & Memory Model
  - L2: Control Flow (if/else, matches, loops)
Module 2: Data Structures & Functions
  - L3: Lists, Dictionaries & Sets
  - L4: Functions, Type Hints, & Scope
Module 3: Object-Oriented Programming (OOP)
  - L5: Classes, Inheritance, & Encapsulation
Module 4: Real-World AI Project
  - L6: Building an automated CLI assistant`;
      } else if (lower.includes("announcement") || lower.includes("broadcast")) {
        replyText = "Here is a crisp, high-converting community announcement draft for your platform dashboard:";
        codeSnippet = `🚀 [NEW RELEASE] Deep Code v2.5 is Live!

Hey Coders! We've just upgraded our AI learning workspace. 
What's new:
✨ Instant AI code explanations powered by Mr Owl AI
📚 PDF Study Notes generator with deduplicated storage
⚡ 50% faster video stream loading

Head over to your Dashboard to try it out!`;
      } else if (lower.includes("analytics") || lower.includes("stats") || lower.includes("summary")) {
        replyText = "📊 Based on live CMS database indexes, here is your system summary:\n\n• Published Courses: 4 active catalogs\n• Total PDF Study Notes: 12 uploaded files\n• Cloudflare R2 Storage: 12.4 MB / 5 GB used\n• User Growth: 100% active operational rate";
      } else if (lower.includes("debug") || lower.includes("error") || lower.includes("next")) {
        replyText = "Hoot! When encountering Next.js App Router render errors, check these common fixes:";
        codeSnippet = `// Fix for static prerender dynamic route error in Next.js 15:
export const dynamic = "force-dynamic";

// Ensure all dynamic server hooks (e.g. cookies(), headers()) 
// are awaited inside server components or API routes.`;
      } else {
        replyText = `Hoot! I've processed your administrative request regarding "${query}". As your platform co-pilot, I'm ready to help you write code, structure lectures, or manage configurations.`;
      }

      const owlMsg: ChatMessage = {
        id: `owl_${Date.now()}`,
        sender: "owl",
        text: replyText,
        codeSnippet,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestedActions: [
          "Export this response to course draft",
          "Ask Mr Owl for another suggestion",
        ],
      };

      setMessages((prev) => [...prev, owlMsg]);
      setIsGenerating(false);
      setAnimState("idle");
      say("Hoot! Ready for the next prompt!", "idle");
    }, 1000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `msg_init_${Date.now()}`,
        sender: "owl",
        text: "Hoot! Chat memory cleared. How can I assist you with your platform today?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  return (
    <div className="space-y-6 animate-fade-in select-text">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-850 to-cyan-950 p-6 rounded-2xl text-white shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 shrink-0 relative flex items-center justify-center bg-white/10 rounded-2xl border border-white/15">
            <MrOwl animState={isGenerating ? "dizzy" : animState} size={60} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black tracking-tight text-white">Mr Owl AI</h2>
              <span className="bg-cyan-500/20 text-cyan-300 text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border border-cyan-400/30">
                Admin Workspace
              </span>
            </div>
            <p className="text-slate-300 text-xs font-medium mt-1">
              Your AI co-pilot for course creation, administrative operations, code debugging, and platform analytics
            </p>
          </div>
        </div>

        {/* Mode Selector & Clear Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <select
            value={aiMode}
            onChange={(e) => setAiMode(e.target.value as any)}
            className="p-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-bold focus:outline-hidden cursor-pointer"
          >
            <option value="copilot" className="bg-slate-900 text-white">
              🤖 Admin Co-Pilot Mode
            </option>
            <option value="tutor" className="bg-slate-900 text-white">
              🎓 Course Tutor Mode
            </option>
            <option value="code_writer" className="bg-slate-900 text-white">
              💻 Code Architect Mode
            </option>
          </select>

          <button
            onClick={handleClearChat}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-extrabold text-slate-200 transition-colors cursor-pointer"
            title="Clear Chat History"
          >
            🗑️ Clear
          </button>
        </div>
      </div>

      {/* Main Chat Frame */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs flex flex-col h-[600px] overflow-hidden">
        {/* Messages List Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50/40">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3.5 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar */}
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black shrink-0 ${
                  msg.sender === "user"
                    ? "bg-slate-900 text-white"
                    : "bg-cyan-50 border border-cyan-200 text-cyan-700"
                }`}
              >
                {msg.sender === "user" ? "👤" : "🦉"}
              </div>

              {/* Bubble Body */}
              <div className={`space-y-2 max-w-2xl ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed shadow-xs ${
                    msg.sender === "user"
                      ? "bg-[#219EBC] text-white rounded-tr-none font-semibold"
                      : "bg-white border border-slate-200/80 text-slate-800 rounded-tl-none"
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Code Snippet Box */}
                  {msg.codeSnippet && (
                    <div className="mt-3 bg-slate-950 text-slate-100 p-3.5 rounded-xl text-xs font-mono overflow-x-auto border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase border-b border-slate-800 pb-1.5">
                        <span>Generated Code Output</span>
                        <button
                          onClick={() => navigator.clipboard.writeText(msg.codeSnippet || "")}
                          className="text-[#219EBC] hover:underline text-[10px]"
                        >
                          Copy Code
                        </button>
                      </div>
                      <pre className="whitespace-pre">{msg.codeSnippet}</pre>
                    </div>
                  )}
                </div>

                {/* Suggested Action Chips */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {msg.suggestedActions.map((action, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(action)}
                        className="text-[11px] font-bold text-slate-700 hover:text-slate-950 bg-white hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs transition-all cursor-pointer"
                      >
                        ⚡ {action}
                      </button>
                    ))}
                  </div>
                )}

                <div className="text-[10px] text-slate-400 font-semibold px-1">
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {/* Thinking Indicator */}
          {isGenerating && (
            <div className="flex items-center gap-3 text-xs font-bold text-slate-400 animate-pulse">
              <div className="w-8 h-8 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-sm">
                🦉
              </div>
              <span>Mr Owl AI is thinking & crafting response...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Control Bar */}
        <div className="p-4 bg-white border-t border-slate-200 space-y-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-3"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask Mr Owl AI anything (e.g. Generate a Quiz, Draft Course Syllabus, Debug code)..."
              className="flex-1 p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#219EBC]"
            />

            <button
              type="submit"
              disabled={!inputQuery.trim() || isGenerating}
              className="bg-[#219EBC] hover:bg-[#1a849e] disabled:opacity-50 text-white font-black text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-xs cursor-pointer transition-all flex items-center gap-2 shrink-0"
            >
              <span>Send</span>
              <span>🚀</span>
            </button>
          </form>

          {/* Quick Context Bar */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold px-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeCmsContext}
                onChange={(e) => setIncludeCmsContext(e.target.checked)}
                className="rounded text-[#219EBC]"
              />
              <span>Include Live CMS Context (Courses, Notes, Users)</span>
            </label>
            <span className="text-slate-400">Press Enter ↵ to send</span>
          </div>
        </div>
      </div>
    </div>
  );
};
