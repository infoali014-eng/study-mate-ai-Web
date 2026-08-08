"use client";

import React, { useState } from "react";
import katex from "katex";
import { Check, Copy, Info, AlertTriangle } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  if (!content) return null;

  const renderedBlocks = parseMarkdownBlocks(content);

  return (
    <div className="prose prose-slate max-w-none text-slate-800 text-sm leading-relaxed space-y-3 selection:bg-[#219EBC]/20">
      {renderedBlocks}
    </div>
  );
};

// Component: Typeset LaTeX Display Math (Centered Block)
const MathDisplay: React.FC<{ math: string }> = ({ math }) => {
  const html = React.useMemo(() => {
    try {
      return katex.renderToString(math.trim(), {
        displayMode: true,
        throwOnError: false,
      });
    } catch {
      return `<span>${math}</span>`;
    }
  }, [math]);

  return (
    <div
      className="my-3.5 py-3 px-4 bg-[#023047]/5 border border-[#219EBC]/20 rounded-xl overflow-x-auto text-center text-slate-900 shadow-2xs"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

// Component: Typeset LaTeX Inline Math
const MathInline: React.FC<{ math: string }> = ({ math }) => {
  const html = React.useMemo(() => {
    try {
      return katex.renderToString(math.trim(), {
        displayMode: false,
        throwOnError: false,
      });
    } catch {
      return `<span>${math}</span>`;
    }
  }, [math]);

  return (
    <span
      className="inline-block px-1 text-slate-900 font-normal"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

// Check if string contains LaTeX math commands (\int, \frac, \sqrt, \sum, \lim, etc.)
function isMathExpression(str: string): boolean {
  return /\\(int|frac|sqrt|sum|lim|partial|alpha|beta|gamma|theta|pi|sigma|infty|approx|times|div|pm|leq|geq|neq|vec|hat|bar|matrix|begin|end|cdot|partial|dx|dy|dt)/i.test(
    str
  );
}

// Check if a standalone line is purely a mathematical equation without prose words
function isPureMathLine(str: string): boolean {
  const clean = str.trim();
  if (!clean) return false;
  // Strip common math commands before checking for prose text
  const stripped = clean.replace(
    /\\(int|frac|sqrt|sum|lim|partial|alpha|beta|gamma|theta|pi|sigma|infty|approx|times|div|pm|leq|geq|neq|vec|hat|bar|matrix|begin|end|sin|cos|tan|log|ln|dx|dy|dt)/gi,
    ""
  );
  // If line still contains normal English prose words (3+ letters), it's a paragraph, not pure display math
  if (/[a-zA-Z]{3,}/.test(stripped)) {
    return false;
  }
  return /\\(int|frac|sqrt|sum|lim|partial|matrix|begin|end|=|dx|dy)/.test(clean);
}

// Main Parser
function parseMarkdownBlocks(text: string): React.ReactNode[] {
  const lines = text.split("\n");
  const nodes: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let codeLanguage = "";
  let listBuffer: { type: "ul" | "ol"; items: string[] } | null = null;
  let tableBuffer: string[] = [];

  const flushList = (key: string) => {
    if (!listBuffer) return;
    const ListTag = listBuffer.type === "ul" ? "ul" : "ol";
    nodes.push(
      <ListTag
        key={`list-${key}`}
        className={`${
          listBuffer.type === "ul" ? "list-disc" : "list-decimal"
        } pl-5 space-y-1.5 my-2 text-slate-800`}
      >
        {listBuffer.items.map((item, i) => (
          <li key={i}>{formatInlineFormatting(item)}</li>
        ))}
      </ListTag>
    );
    listBuffer = null;
  };

  const flushTable = (key: string) => {
    if (tableBuffer.length < 2) {
      tableBuffer.forEach((line, idx) =>
        nodes.push(<p key={`tbl-raw-${key}-${idx}`}>{formatInlineFormatting(line)}</p>)
      );
      tableBuffer = [];
      return;
    }

    const headerLine = tableBuffer[0];
    const dataLines = tableBuffer.slice(2);

    const parseRow = (line: string) =>
      line
        .trim()
        .replace(/^\|/, "")
        .replace(/\|$/, "")
        .split("|")
        .map((cell) => cell.trim());

    const headers = parseRow(headerLine);

    nodes.push(
      <div key={`tbl-${key}`} className="my-4 overflow-x-auto rounded-xl border border-slate-200 shadow-xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-slate-100/90 text-slate-900 border-b border-slate-200">
            <tr>
              {headers.map((h, i) => (
                <th key={i} className="px-4 py-2.5 font-black uppercase tracking-wider">
                  {formatInlineFormatting(h)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {dataLines.map((row, rIdx) => {
              const cells = parseRow(row);
              return (
                <tr key={rIdx} className="hover:bg-slate-50/70 transition-colors">
                  {cells.map((c, cIdx) => (
                    <td key={cIdx} className="px-4 py-2.5 text-slate-700 font-medium">
                      {formatInlineFormatting(c)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
    tableBuffer = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Handle Fenced Code Blocks ```
    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        nodes.push(
          <CodeBlock
            key={`code-${i}`}
            code={codeBuffer.join("\n")}
            language={codeLanguage}
          />
        );
        codeBuffer = [];
        codeLanguage = "";
        inCodeBlock = false;
      } else {
        flushList(`${i}`);
        flushTable(`${i}`);
        inCodeBlock = true;
        codeLanguage = line.trim().replace(/^```/, "").trim() || "plaintext";
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    // Handle Display Math Blocks $$ ... $$ or \[ ... \] or \begin{...}
    const trimmedLine = line.trim();
    if (
      (trimmedLine.startsWith("$$") && trimmedLine.endsWith("$$") && trimmedLine.length > 4) ||
      (trimmedLine.startsWith("\\[") && trimmedLine.endsWith("\\]")) ||
      trimmedLine.startsWith("\\begin{")
    ) {
      flushList(`${i}`);
      flushTable(`${i}`);
      const rawMath = trimmedLine
        .replace(/^\$\$/, "")
        .replace(/\$\$$/, "")
        .replace(/^\\\[/, "")
        .replace(/\\\]$/, "");
      nodes.push(<MathDisplay key={`mathdisp-${i}`} math={rawMath} />);
      continue;
    }

    // Handle Standalone Pure Math Line (without prose words)
    if (
      isPureMathLine(trimmedLine) &&
      !trimmedLine.startsWith("|") &&
      !trimmedLine.startsWith("#") &&
      !trimmedLine.startsWith(">")
    ) {
      flushList(`${i}`);
      flushTable(`${i}`);
      nodes.push(<MathDisplay key={`mathdisp-raw-${i}`} math={trimmedLine} />);
      continue;
    }

    // Handle Table Rows | Cell | Cell |
    if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
      flushList(`${i}`);
      tableBuffer.push(line);
      continue;
    } else if (tableBuffer.length > 0) {
      flushTable(`${i}`);
    }

    // Handle Lists
    const ulMatch = line.match(/^[\*\-\+]\s+(.+)/);
    const olMatch = line.match(/^\d+\.\s+(.+)/);

    if (ulMatch) {
      if (!listBuffer || listBuffer.type !== "ul") {
        flushList(`${i}`);
        listBuffer = { type: "ul", items: [] };
      }
      listBuffer.items.push(ulMatch[1]);
      continue;
    } else if (olMatch) {
      if (!listBuffer || listBuffer.type !== "ol") {
        flushList(`${i}`);
        listBuffer = { type: "ol", items: [] };
      }
      listBuffer.items.push(olMatch[1]);
      continue;
    } else if (listBuffer) {
      flushList(`${i}`);
    }

    // Handle Headings (H1 - H5)
    if (line.startsWith("##### ")) {
      nodes.push(
        <h5 key={i} className="text-xs font-black text-[#023047] mt-3 mb-1 tracking-tight">
          {formatInlineFormatting(line.slice(6))}
        </h5>
      );
      continue;
    }
    if (line.startsWith("#### ")) {
      nodes.push(
        <h4 key={i} className="text-xs font-black text-[#023047] mt-3 mb-1.5 tracking-tight uppercase">
          {formatInlineFormatting(line.slice(5))}
        </h4>
      );
      continue;
    }
    if (line.startsWith("### ")) {
      nodes.push(
        <h3 key={i} className="text-sm font-black text-[#023047] mt-4 mb-2 tracking-tight">
          {formatInlineFormatting(line.slice(4))}
        </h3>
      );
      continue;
    }
    if (line.startsWith("## ")) {
      nodes.push(
        <h2 key={i} className="text-base font-black text-[#023047] mt-5 mb-2 tracking-tight border-b border-slate-200 pb-1">
          {formatInlineFormatting(line.slice(3))}
        </h2>
      );
      continue;
    }
    if (line.startsWith("# ")) {
      nodes.push(
        <h1 key={i} className="text-lg font-black text-[#023047] mt-6 mb-3 tracking-tight">
          {formatInlineFormatting(line.slice(2))}
        </h1>
      );
      continue;
    }

    // Handle Callouts
    if (line.trim().startsWith("> [!NOTE]") || line.trim().startsWith("> [!IMPORTANT]")) {
      const calloutText = line.replace(/^>\s*\[!(NOTE|IMPORTANT)\]\s*/i, "");
      nodes.push(
        <div key={i} className="my-3 p-3.5 bg-[#219EBC]/10 border-l-4 border-[#219EBC] rounded-r-xl flex items-start gap-2.5 text-xs text-[#023047]">
          <Info className="w-4 h-4 text-[#219EBC] shrink-0 mt-0.5" />
          <div className="font-medium">{formatInlineFormatting(calloutText)}</div>
        </div>
      );
      continue;
    }

    if (line.trim().startsWith("> [!WARNING]") || line.trim().startsWith("> [!CAUTION]")) {
      const calloutText = line.replace(/^>\s*\[!(WARNING|CAUTION)\]\s*/i, "");
      nodes.push(
        <div key={i} className="my-3 p-3.5 bg-amber-50 border-l-4 border-amber-500 rounded-r-xl flex items-start gap-2.5 text-xs text-amber-900">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="font-medium">{formatInlineFormatting(calloutText)}</div>
        </div>
      );
      continue;
    }

    // Handle Standard Blockquotes
    if (line.startsWith("> ")) {
      nodes.push(
        <blockquote key={i} className="pl-4 border-l-3 border-[#219EBC] italic text-slate-600 text-xs my-2">
          {formatInlineFormatting(line.slice(2))}
        </blockquote>
      );
      continue;
    }

    if (!line.trim()) {
      continue;
    }

    // Standard Paragraph
    nodes.push(
      <p key={i} className="text-slate-800 text-sm leading-relaxed">
        {formatInlineFormatting(line)}
      </p>
    );
  }

  flushList("end");
  flushTable("end");

  return nodes;
}

// Format Inline Elements: **bold**, *italic*, `code`, and KaTeX inline math ($...$ / \(...\))
function formatInlineFormatting(text: string): React.ReactNode {
  if (!text) return null;
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let keyIdx = 0;

  while (remaining.length > 0) {
    // 1. Inline Math $...$ or $$...$$ or \(...\)
    const mathMatch =
      remaining.match(/^(\$\$|\$)(.+?)\1/) ||
      remaining.match(/^\\\((.+?)\\\)/);

    if (mathMatch) {
      const rawMath = mathMatch[2] || mathMatch[1];
      parts.push(<MathInline key={`mathinline-${keyIdx++}`} math={rawMath} />);
      remaining = remaining.slice(mathMatch[0].length);
      continue;
    }

    // 2. Fenced Inline Code `code` (If inner content is pure LaTeX math, render as MathInline!)
    const codeMatch = remaining.match(/^`([^`]+)`/);
    if (codeMatch) {
      const innerContent = codeMatch[1];
      if (isMathExpression(innerContent) && !innerContent.includes(";") && !innerContent.includes("=")) {
        parts.push(<MathInline key={`mathinline-code-${keyIdx++}`} math={innerContent} />);
      } else {
        parts.push(
          <code
            key={`code-${keyIdx++}`}
            className="px-1.5 py-0.5 bg-slate-100 text-slate-900 border border-slate-200/80 font-mono text-xs rounded-[6px]"
          >
            {innerContent}
          </code>
        );
      }
      remaining = remaining.slice(codeMatch[0].length);
      continue;
    }

    // 3. Bold **text** -> Recursively format inner content to extract inline math!
    const boldMatch = remaining.match(/^\*\*([^\*]+)\*\*/);
    if (boldMatch) {
      parts.push(
        <strong key={`bold-${keyIdx++}`} className="font-extrabold text-slate-950">
          {formatInlineFormatting(boldMatch[1])}
        </strong>
      );
      remaining = remaining.slice(boldMatch[0].length);
      continue;
    }

    // 4. Italic *text* -> Recursively format inner content to extract inline math!
    const italicMatch = remaining.match(/^\*([^\*]+)\*/);
    if (italicMatch) {
      parts.push(
        <em key={`italic-${keyIdx++}`} className="italic text-slate-800">
          {formatInlineFormatting(italicMatch[1])}
        </em>
      );
      remaining = remaining.slice(italicMatch[0].length);
      continue;
    }

    // Normal text slice
    const nextSpecial = remaining.search(/[`\*\$]/);
    if (nextSpecial === -1) {
      parts.push(remaining);
      break;
    } else if (nextSpecial > 0) {
      parts.push(remaining.slice(0, nextSpecial));
      remaining = remaining.slice(nextSpecial);
    } else {
      parts.push(remaining[0]);
      remaining = remaining.slice(1);
    }
  }

  return <>{parts}</>;
}

// Fenced Computer Code Block Component with Copy Button
const CodeBlock: React.FC<{ code: string; language: string }> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3.5 rounded-[12px] bg-[#023047] text-slate-100 overflow-hidden border border-[#03405e] shadow-md">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#011e2d] border-b border-[#03405e] text-xs font-mono text-slate-400">
        <span className="font-bold text-[#8ECAE6] uppercase tracking-wider">{language || "code"}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-extrabold text-[#8ECAE6] hover:text-white hover:bg-[#03405e] rounded-[6px] transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Code</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <pre className="p-4 overflow-x-auto text-xs font-mono leading-relaxed text-slate-200 selection:bg-[#219EBC]/40">
        <code>{code}</code>
      </pre>
    </div>
  );
};
