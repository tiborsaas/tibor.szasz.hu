"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { id as instantId } from "@instantdb/react";
import { db } from "@/lib/db";
import { ImagePicker } from "./ImagePicker";

const PostEditor = dynamic(
    () => import("./PostEditor").then((m) => ({ default: m.PostEditor })),
    {
        ssr: false,
        loading: () => (
            <div className="border border-gray-200 rounded-lg bg-white min-h-[400px] p-4 flex items-center justify-center text-gray-400 text-sm">
                Loading editor…
            </div>
        ),
    }
);

function slugify(str: string) {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function tsToDatetimeLocal(ts?: number): string {
    if (!ts) return "";
    const d = new Date(ts);
    // Format as YYYY-MM-DDTHH:mm (datetime-local format)
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

interface PostFormProps {
    initialData?: {
        id: string;
        title: string;
        slug: string;
        excerpt?: string;
        tags?: string;
        cover_image?: string;
        body: string;
        created_at?: number;
    };
}

export function PostForm({ initialData }: PostFormProps) {
    const router = useRouter();
    const isEditing = !!initialData;

    const [title, setTitle] = useState(initialData?.title ?? "");
    const [slug, setSlug] = useState(initialData?.slug ?? "");
    const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? "");
    const [tags, setTags] = useState(initialData?.tags ?? "");
    const [coverImage, setCoverImage] = useState(initialData?.cover_image ?? "");
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
        if (!body.trim() || body === "{}") return alert("Body is required.");

        setSaving(true);
        try {
            const postId = initialData?.id ?? instantId();
            const updates: Record<string, any> = {
                title: title.trim(),
                slug: slug.trim(),
                excerpt: excerpt.trim(),
                tags: tags.trim(),
                cover_image: coverImage,
                body,
                updated_at: Date.now(),
            };

            if (isEditing && createdAt) {
                updates.created_at = new Date(createdAt).getTime();
            } else if (!isEditing) {
                updates.created_at = createdAt ? new Date(createdAt).getTime() : Date.now();
            }

            await db.transact(db.tx.blog[postId].update(updates));
            router.push("/cms");
        } catch (err: any) {
            alert("Save failed: " + (err?.message ?? "Unknown error"));
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="max-w-4xl">
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
                        <span className="text-sm font-medium text-gray-700">Created at</span>
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
            </form>

            {/* Body editor — kept outside the form so Yoopta's internal buttons
                don't accidentally trigger form submission */}
            <div className="flex flex-col gap-1 mb-5">
                <span className="text-sm font-medium text-gray-700">Body *</span>
                <PostEditor
                    key={initialData?.id ?? "new"}
                    initialValue={body}
                    onChange={setBody}
                />
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    form="post-form"
                    disabled={saving}
                    className="bg-black text-white px-5 py-2 rounded font-medium text-sm hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                    {saving ? "Saving…" : isEditing ? "Save changes" : "Publish"}
                </button>
            </div>
        </div>
    );
}
