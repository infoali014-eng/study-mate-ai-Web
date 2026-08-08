"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Send,
  Paperclip,
  Sparkles,
  Plus,
  Trash2,
  BookOpen,
  Bot,
  BrainCircuit,
  GraduationCap,
  RefreshCcw,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  FileText,
} from "lucide-react";
import { MarkdownRenderer } from "@/components/chat/MarkdownRenderer";
import { StudyLibraryDrawer } from "@/components/chat/StudyLibraryDrawer";
import MrOwl, { OwlAnimState } from "@/components/owl/MrOwl";
import { useOwlStore } from "@/store/owlStore";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at?: string;
}

export interface ConversationItem {
  id: string;
  title: string;
  subject?: string;
  mode: string;
  selected_note_ids?: string[];
  updated_at: string;
}

const SUBJECT_OPTIONS = [
  "General Knowledge",
  "C# Programming",
  "Computer Science",
  "Mathematics",
  "Physics",
  "Biology",
  "Business & Economics",
  "Psychology",
];

const TUTOR_MODES = [
  { id: "explain", label: "Explain", desc: "Step-by-step clear concept teaching", icon: BookOpen },
  { id: "quiz", label: "Quiz", desc: "Interactive MCQs & test questions", icon: BrainCircuit },
  { id: "practice", label: "Practice", desc: "Hands-on problem sets & scenarios", icon: Sparkles },
  { id: "revise", label: "Revise", desc: "High-yield summaries & key bullet points", icon: RefreshCcw },
  { id: "teach_me", label: "Teach Me", desc: "Feynman active recall & self-teaching", icon: GraduationCap },
];

export default function MrOwlChatPage() {
  const searchParams = useSearchParams();
  const initialNoteId = searchParams.get("noteId");

  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("General Knowledge");
  const [activeMode, setActiveMode] = useState<string>("explain");
  const [selectedNoteIds, setSelectedNoteIds] = useState<string[]>(
    initialNoteId ? [initialNoteId] : []
  );

  const [loadingConv, setLoadingConv] = useState(true);
  const [loadingMsg, setLoadingMsg] = useState(false);
  const [sending, setSending] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [apiError, setApiError] = useState<{ message: string; missingKey?: boolean } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { skin, accessories } = useOwlStore();

  const [owlMood, setOwlMood] = useState<OwlAnimState>("idle");

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, sending]);

  // 1. Fetch Conversations List
  const loadConversations = async () => {
    setLoadingConv(true);
    try {
      const res = await fetch("/api/chat/conversations");
      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations || []);
        if (data.conversations && data.conversations.length > 0 && !activeConvId) {
          setActiveConvId(data.conversations[0].id);
        }
      }
    } catch (err) {
      console.error("[ChatPage] Error fetching conversations:", err);
    } finally {
      setLoadingConv(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  // 2. Fetch Messages when active conversation changes
  useEffect(() => {
    if (!activeConvId) {
      setMessages([]);
      return;
    }

    const currentConv = conversations.find((c) => c.id === activeConvId);
    if (currentConv) {
      if (currentConv.subject) setSelectedSubject(currentConv.subject);
      if (currentConv.mode) setActiveMode(currentConv.mode);
      if (currentConv.selected_note_ids) setSelectedNoteIds(currentConv.selected_note_ids);
    }

    async function loadMessages() {
      setLoadingMsg(true);
      setApiError(null);
      try {
        const res = await fetch(`/api/chat/messages?conversationId=${activeConvId}`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages || []);
        }
      } catch (err) {
        console.error("[ChatPage] Error fetching messages:", err);
      } finally {
        setLoadingMsg(false);
      }
    }

    loadMessages();
  }, [activeConvId]);

  // Start new conversation
  const handleNewChat = () => {
    setActiveConvId(null);
    setMessages([]);
    setSelectedNoteIds(initialNoteId ? [initialNoteId] : []);
    setApiError(null);
    setOwlMood("idle");
  };

  // Delete conversation
  const handleDeleteConv = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("Delete this conversation?")) return;

    try {
      const res = await fetch(`/api/chat/conversations?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setConversations((prev) => prev.filter((c) => c.id !== id));
        if (activeConvId === id) {
          handleNewChat();
        }
      }
    } catch (err) {
      console.error("[ChatPage] Error deleting conversation:", err);
    }
  };

  // Toggle note attachment
  const handleToggleNote = (noteId: string) => {
    setSelectedNoteIds((prev) =>
      prev.includes(noteId) ? prev.filter((id) => id !== noteId) : [...prev, noteId]
    );
  };

  // Send message to Mr Owl API
  const handleSendMessage = async (textToSend?: string) => {
    const content = (textToSend || inputText).trim();
    if (!content || sending) return;

    setInputText("");
    setApiError(null);
    setSending(true);
    setOwlMood("thinking");

    // Optimistic User Message
    const tempUserMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      role: "user",
      content,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: activeConvId,
          message: content,
          subject: selectedSubject,
          selectedNoteIds,
          mode: activeMode,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.code === "MISSING_GEMINI_KEY") {
          setApiError({ message: data.error, missingKey: true });
        } else {
          setApiError({ message: data.error || "Failed to generate AI response." });
        }
        setOwlMood("dizzy");
        return;
      }

      // Success
      if (!activeConvId && data.conversationId) {
        setActiveConvId(data.conversationId);
        loadConversations();
      }

      const assistantMsg: ChatMessage = {
        id: data.messageId || `ast-${Date.now()}`,
        role: "assistant",
        content: data.content,
        created_at: data.createdAt || new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setOwlMood("talk");
      setTimeout(() => setOwlMood("idle"), 4000);
    } catch (err: any) {
      console.error("[ChatPage] Error sending message:", err);
      setApiError({ message: err.message || "Network error. Please try again." });
      setOwlMood("dizzy");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] bg-slate-50 border border-slate-200/80 rounded-[20px] overflow-hidden shadow-xs select-none">
      {/* 1. LEFT PANEL: Conversations History Sidebar */}
      <div className="hidden md:flex flex-col w-72 bg-white border-r border-slate-200/80 shrink-0">
        {/* New Chat Action */}
        <div className="p-4 border-b border-slate-100">
          <button
            type="button"
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#219EBC] hover:bg-[#023047] text-white font-extrabold text-xs rounded-[14px] transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
          <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-2 mb-1.5">
            Recent Conversations
          </div>

          {loadingConv ? (
            <div className="p-4 text-center text-xs text-slate-400 font-medium">Loading history...</div>
          ) : conversations.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-400 font-medium">No chat history yet</div>
          ) : (
            conversations.map((c) => {
              const isActive = activeConvId === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setActiveConvId(c.id)}
                  className={`group relative flex items-center justify-between p-3 rounded-[12px] text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#023047] text-white shadow-2xs"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-6">
                    <Bot className={`w-4 h-4 shrink-0 ${isActive ? "text-[#38BDF8]" : "text-[#219EBC]"}`} />
                    <span className="truncate">{c.title}</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleDeleteConv(e, c.id)}
                    className="absolute right-2 opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 rounded-md transition-opacity cursor-pointer"
                    title="Delete conversation"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 2. MAIN CHAT STAGE */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC]">
        {/* Top Navigation & Controls Header */}
        <div className="h-16 px-6 bg-white border-b border-slate-200/80 flex items-center justify-between shrink-0 shadow-2xs">
          <div className="flex items-center gap-3">
            {/* Mr Owl Avatar Preview */}
            <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-visible shrink-0">
              <MrOwl animState={owlMood} size={36} skin={skin} accessories={accessories} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-extrabold text-slate-900">Mr Owl AI</h2>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#219EBC]/15 text-[#219EBC]">
                  AI Tutor
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Personalized AI study assistant</p>
            </div>
          </div>

          {/* Controls: Subject Picker & Study Material Button */}
          <div className="flex items-center gap-2">
            {/* Subject Selector */}
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="text-xs font-extrabold bg-slate-100 border border-slate-200 text-slate-800 rounded-[10px] px-3 py-1.5 focus:bg-white outline-hidden transition-colors cursor-pointer"
            >
              {SUBJECT_OPTIONS.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>

            {/* Study Library Attach Button */}
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] text-xs font-extrabold transition-all cursor-pointer border ${
                selectedNoteIds.length > 0
                  ? "bg-[#219EBC]/10 border-[#219EBC] text-[#023047]"
                  : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <Paperclip className="w-3.5 h-3.5 text-[#219EBC]" />
              <span>
                {selectedNoteIds.length > 0 ? `${selectedNoteIds.length} Material Attached` : "Attach Notes"}
              </span>
            </button>
          </div>
        </div>

        {/* Tutor Modes Selector Pills */}
        <div className="px-6 py-2 bg-slate-100/60 border-b border-slate-200/60 flex items-center gap-1.5 overflow-x-auto custom-scrollbar shrink-0">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mr-1">
            Mode:
          </span>
          {TUTOR_MODES.map((m) => {
            const Icon = m.icon;
            const isActive = activeMode === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setActiveMode(m.id)}
                title={m.desc}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-[8px] text-xs font-extrabold transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? "bg-[#023047] text-white shadow-2xs"
                    : "bg-white text-slate-600 hover:bg-slate-200/80 border border-slate-200/80"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#38BDF8]" : "text-[#219EBC]"}`} />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* Missing Gemini Key Error Banner */}
        {apiError && apiError.missingKey && (
          <div className="mx-6 mt-4 p-4 bg-amber-50 border border-amber-200 rounded-[14px] flex items-center justify-between text-xs text-amber-900 shadow-xs animate-fade-in">
            <div className="flex items-center gap-3">
              <KeyRound className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <div className="font-extrabold">Gemini API Key Required</div>
                <div className="text-[11px] text-amber-700 font-medium mt-0.5">
                  Connect your Gemini API key in Settings to unlock Mr Owl AI chat features.
                </div>
              </div>
            </div>
            <Link
              href="/dashboard/settings"
              className="px-3.5 py-1.5 bg-[#023047] hover:bg-[#03405e] text-white text-xs font-extrabold rounded-[10px] transition-colors shrink-0 shadow-2xs"
            >
              Connect Key →
            </Link>
          </div>
        )}

        {/* General API Error Banner */}
        {apiError && !apiError.missingKey && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 rounded-[12px] flex items-center gap-2 text-xs font-bold text-rose-800 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{apiError.message}</span>
          </div>
        )}

        {/* Message Feed Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar select-text">
          {messages.length === 0 ? (
            /* Empty Chat State with Prompt Suggestions */
            <div className="h-full flex flex-col items-center justify-center max-w-xl mx-auto text-center space-y-6 py-8">
              <div className="w-20 h-20 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-visible">
                <MrOwl animState="idle" size={80} skin={skin} accessories={accessories} />
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  Hi, I’m Mr Owl — Your Personal AI Study Tutor!
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Ask me anything about your subjects, upload notes, generate quizzes, or practice concepts.
                </p>
              </div>

              {/* Quick Action Prompt Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left">
                {[
                  {
                    title: "Explain Concept",
                    text: "Explain object-oriented programming inheritance in C# with clear code examples.",
                    mode: "explain",
                  },
                  {
                    title: "Generate Quiz",
                    text: "Generate 5 interactive multiple-choice quiz questions on C# interfaces.",
                    mode: "quiz",
                  },
                  {
                    title: "Practice Exercises",
                    text: "Give me 3 practice problems to solve step-by-step.",
                    mode: "practice",
                  },
                  {
                    title: "Teach Me Mode",
                    text: "Test my knowledge using active recall questions.",
                    mode: "teach_me",
                  },
                ].map((card, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setActiveMode(card.mode);
                      handleSendMessage(card.text);
                    }}
                    className="p-3.5 bg-white hover:bg-sky-50/60 border border-slate-200 hover:border-[#219EBC] rounded-[14px] transition-all text-left shadow-2xs cursor-pointer group"
                  >
                    <div className="text-xs font-extrabold text-[#023047] group-hover:text-[#219EBC] flex items-center justify-between">
                      <span>{card.title}</span>
                      <Sparkles className="w-3.5 h-3.5 text-[#219EBC]" />
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium mt-1 leading-snug line-clamp-2">
                      {card.text}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${
                  msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                {/* Avatar */}
                {msg.role === "assistant" ? (
                  <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-visible mt-1">
                    <MrOwl animState="idle" size={28} skin={skin} accessories={accessories} />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#023047] text-white flex items-center justify-center text-xs font-extrabold shrink-0 mt-1 shadow-2xs">
                    U
                  </div>
                )}

                {/* Bubble */}
                <div
                  className={`p-4 rounded-[16px] text-sm shadow-2xs ${
                    msg.role === "user"
                      ? "bg-[#023047] text-white rounded-tr-xs"
                      : "bg-white border border-slate-200/90 text-slate-900 rounded-tl-xs"
                  }`}
                >
                  {msg.role === "user" ? (
                    <div className="whitespace-pre-wrap font-medium">{msg.content}</div>
                  ) : (
                    <MarkdownRenderer content={msg.content} />
                  )}
                </div>
              </div>
            ))
          )}

          {/* Typing Loading Indicator */}
          {sending && (
            <div className="flex gap-3 max-w-3xl mr-auto animate-pulse">
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-visible">
                <MrOwl animState="thinking" size={28} skin={skin} accessories={accessories} />
              </div>
              <div className="p-4 rounded-[16px] bg-white border border-slate-200 text-xs font-bold text-slate-500 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#219EBC] animate-spin" />
                <span>Mr Owl is thinking and preparing your response...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Composer Input Bar */}
        <div className="p-4 bg-white border-t border-slate-200/80 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 bg-slate-50 border border-slate-200 focus-within:border-[#219EBC] focus-within:bg-white rounded-[16px] p-2 transition-all shadow-2xs"
          >
            {/* Attachment Button */}
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="p-2 text-slate-400 hover:text-[#219EBC] hover:bg-slate-100 rounded-[10px] transition-colors cursor-pointer shrink-0"
              title="Attach notes from Study Library"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            {/* Input Text Area */}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Ask Mr Owl anything about ${selectedSubject}...`}
              disabled={sending}
              className="flex-1 text-sm bg-transparent border-none outline-hidden text-slate-900 placeholder:text-slate-400 font-medium px-2"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={sending || !inputText.trim()}
              className="p-2.5 bg-[#219EBC] hover:bg-[#023047] disabled:opacity-40 text-white rounded-[12px] transition-all shadow-xs cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Study Library Selection Drawer Modal */}
      <StudyLibraryDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        selectedNoteIds={selectedNoteIds}
        onToggleNote={handleToggleNote}
      />
    </div>
  );
}
