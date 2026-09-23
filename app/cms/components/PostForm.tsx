"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ImagePicker } from "./ImagePicker";
import { MarkdownEditor } from "./MarkdownEditor";

function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function tsToDatetimeLocal(ts?: number | string): string {
  if (!ts) return "";
  const d = new Date(ts);
  if (isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

interface PostFormProps {
  initialData?: {
    id?: string;
    title: string;
    slug: string;
    excerpt?: string;
    tags?: string;
    cover_image?: string;
    cover_image_id?: string;
    body: string;
    created_at?: number | string;
    published?: boolean;
  };
}

export function PostForm({ initialData }: PostFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;
  const originalSlug = initialData?.slug ?? "";

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? "");
  const [tags, setTags] = useState(initialData?.tags ?? "");
  const [coverImage, setCoverImage] = useState(initialData?.cover_image ?? initialData?.cover_image_id ?? "");
  const [body, setBody] = useState(initialData?.body ?? "");
  const [createdAt, setCreatedAt] = useState(tsToDatetimeLocal(initialData?.created_at));
  const [saving, setSaving] = useState(false);
  const [slugEdited, setSlugEdited] = useState(isEditing);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugEdited) {
      setSlug(slugify(value));
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return alert("Title is required.");
    if (!slug.trim()) return alert("Slug is required.");

    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        slug: slug.trim(),
        excerpt: excerpt.trim(),
        tags: tags.trim(),
        coverImage,
        body,
        createdAt: createdAt ? new Date(createdAt).toISOString() : new Date().toISOString(),
      };

      const url = isEditing ? `/api/cms/posts/${encodeURIComponent(originalSlug)}` : "/api/cms/posts";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Save failed");
      }

      router.push("/cms");
      router.refresh();
    } catch (err: any) {
      alert("Save failed: " + (err?.message ?? "Unknown error"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <form id="post-form" onSubmit={handleSave}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/cms"
              className="text-sm text-gray-500 hover:text-black"
            >
              ← Posts
            </Link>
            <h1 className="text-2xl font-bold">
              {isEditing ? "Edit post" : "New post"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {isEditing && (
              <Link
                href={`/post/${slug}`}
                target="_blank"
                className="text-sm text-gray-400 hover:text-black"
              >
                View ↗
              </Link>
            )}
            <button
              type="submit"
              disabled={saving}
              className="bg-black text-white px-5 py-2 rounded font-medium text-sm hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {saving ? "Saving…" : isEditing ? "Save changes" : "Publish"}
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col gap-5 mb-5">
          {/* Title */}
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-700">Title *</span>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
              className="border border-gray-300 rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="My awesome post"
            />
          </label>

          {/* Slug */}
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-700">Slug *</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">/post/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setSlugEdited(true);
                }}
                required
                className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="my-awesome-post"
              />
            </div>
          </label>

          {/* Excerpt */}
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-700">Excerpt</span>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
              placeholder="A short summary shown on the blog list page…"
            />
          </label>

          {/* Tags */}
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-700">Tags</span>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="comma, separated, tags"
            />
          </label>

          {/* Created at */}
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-700">Date</span>
            <input
              type="datetime-local"
              value={createdAt}
              onChange={(e) => setCreatedAt(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </label>

          {/* Cover image */}
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-700">Cover image</span>
            <ImagePicker value={coverImage} onChange={setCoverImage} />
          </div>
        </div>

        {/* Body editor */}
        <div className="flex flex-col gap-1 mb-5">
          <span className="text-sm font-medium text-gray-700">Body (Markdown) *</span>
          <MarkdownEditor value={body} onChange={setBody} />
        </div>

        <div className="flex justify-end mb-12">
          <button
            type="submit"
            disabled={saving}
            className="bg-black text-white px-5 py-2 rounded font-medium text-sm hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving…" : isEditing ? "Save changes" : "Publish"}
          </button>
        </div>
      </form>
    </div>
  );
}
