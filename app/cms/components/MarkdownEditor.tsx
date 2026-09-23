"use client";

import { useState, useRef } from "react";
import { marked } from "marked";

interface MarkdownEditorProps {
  value: string;
  onChange: (val: string) => void;
}

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function insertFormat(before: string, after: string = "", defaultText: string = "") {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const current = textarea.value;
    const selected = current.substring(start, end) || defaultText;

    const replacement = `${before}${selected}${after}`;
    const nextValue = current.substring(0, start) + replacement + current.substring(end);
    onChange(nextValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selected.length
      );
    }, 0);
  }

  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const charCount = value.length;
  const previewHtml = marked.parse(value || "") as string;

  return (
    <div className="border border-gray-200 rounded-lg bg-white overflow-hidden flex flex-col">
      {/* Top action bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-gray-200 bg-gray-50 px-3 py-2 gap-2">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab("write")}
            className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
              activeTab === "write"
                ? "bg-white text-black shadow-sm border border-gray-200"
                : "text-gray-600 hover:text-black"
            }`}
          >
            Write
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
              activeTab === "preview"
                ? "bg-white text-black shadow-sm border border-gray-200"
                : "text-gray-600 hover:text-black"
            }`}
          >
            Preview
          </button>
        </div>

        {activeTab === "write" && (
          <div className="flex items-center flex-wrap gap-1 text-gray-700">
            <button
              type="button"
              onClick={() => insertFormat("**", "**", "bold text")}
              className="px-2 py-1 rounded hover:bg-gray-200 text-xs font-bold"
              title="Bold"
            >
              B
            </button>
            <button
              type="button"
              onClick={() => insertFormat("*", "*", "italic text")}
              className="px-2 py-1 rounded hover:bg-gray-200 text-xs italic font-serif"
              title="Italic"
            >
              I
            </button>
            <span className="text-gray-300 mx-0.5">|</span>
            <button
              type="button"
              onClick={() => insertFormat("## ", "", "Heading 2")}
              className="px-2 py-1 rounded hover:bg-gray-200 text-xs font-semibold"
              title="Heading 2"
            >
              H2
            </button>
            <button
              type="button"
              onClick={() => insertFormat("### ", "", "Heading 3")}
              className="px-2 py-1 rounded hover:bg-gray-200 text-xs font-semibold"
              title="Heading 3"
            >
              H3
            </button>
            <span className="text-gray-300 mx-0.5">|</span>
            <button
              type="button"
              onClick={() => insertFormat("> ", "", "Quote")}
              className="px-2 py-1 rounded hover:bg-gray-200 text-xs"
              title="Quote"
            >
              &rdquo;
            </button>
            <button
              type="button"
              onClick={() => insertFormat("- ", "", "List item")}
              className="px-2 py-1 rounded hover:bg-gray-200 text-xs"
              title="Bullet List"
            >
              • List
            </button>
            <button
              type="button"
              onClick={() => insertFormat("1. ", "", "List item")}
              className="px-2 py-1 rounded hover:bg-gray-200 text-xs"
              title="Numbered List"
            >
              1. List
            </button>
            <span className="text-gray-300 mx-0.5">|</span>
            <button
              type="button"
              onClick={() => insertFormat("```\n", "\n```", "code")}
              className="px-2 py-1 rounded hover:bg-gray-200 text-xs font-mono"
              title="Code block"
            >
              {"{ }"}
            </button>
            <button
              type="button"
              onClick={() => insertFormat("[", "](https://example.com)", "link text")}
              className="px-2 py-1 rounded hover:bg-gray-200 text-xs"
              title="Link"
            >
              🔗
            </button>
            <button
              type="button"
              onClick={() => insertFormat("![", "](/uploads/image.png)", "alt text")}
              className="px-2 py-1 rounded hover:bg-gray-200 text-xs"
              title="Image"
            >
              🖼
            </button>
          </div>
        )}
      </div>

      {/* Editor Content Area */}
      {activeTab === "write" ? (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Write transmission in Markdown format..."
          rows={18}
          className="w-full p-4 font-mono text-sm leading-relaxed border-none focus:outline-none resize-y min-h-[380px]"
        />
      ) : (
        <div className="p-6 min-h-[380px] prose max-w-none text-gray-800 overflow-y-auto">
          {value.trim() ? (
            <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
          ) : (
            <p className="text-gray-400 italic">No content to preview.</p>
          )}
        </div>
      )}

      {/* Footer info bar */}
      <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/50 px-4 py-2 font-mono text-xs text-gray-400">
        <span>Markdown format</span>
        <div className="flex gap-4">
          <span>{wordCount} words</span>
          <span>{charCount} characters</span>
        </div>
      </div>
    </div>
  );
}
