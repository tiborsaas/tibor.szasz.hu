"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { db } from "@/lib/db";
import { AuthGuard } from "./components/AuthGuard";

function PostList() {
    const router = useRouter();
    const { isLoading, error, data } = db.useQuery({
        blog: { $: { order: { serverCreatedAt: "desc" } } },
    });

    async function handleDelete(id: string, title: string) {
        if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
        await db.transact(db.tx.blog[id].delete());
    }

    if (isLoading) {
        return <p className="text-gray-400">Loading posts…</p>;
    }

    if (error) {
        return <p className="text-red-500">Error: {error.message}</p>;
    }

    const posts = data?.blog ?? [];

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Blog Posts</h1>
                <Link
                    href="/cms/posts/new"
                    className="bg-black text-white px-4 py-2 rounded font-medium text-sm hover:bg-gray-800 transition-colors"
                >
                    + New post
                </Link>
            </div>

            {posts.length === 0 ? (
                <div className="text-center py-24 text-gray-400">
                    <p className="text-lg">No posts yet.</p>
                    <Link href="/cms/posts/new" className="text-black underline mt-2 block">
                        Create your first post
                    </Link>
                </div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
                    {posts.map((post) => (
                        <div
                            key={post.id}
                            className="flex items-start gap-4 px-5 py-4 hover:bg-gray-50"
                        >
                            {post.cover_image && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={post.cover_image}
                                    alt=""
                                    className="w-16 h-12 rounded object-cover flex-shrink-0"
                                />
                            )}
                            <div className="flex-1 min-w-0">
                                <Link
                                    href={`/cms/posts/${post.id}`}
                                    className="font-semibold text-base hover:underline block truncate"
                                >
                                    {post.title}
                                </Link>
                                <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                                    <span>{format(new Date(post.created_at), "MMM d, yyyy")}</span>
                                    {post.slug && (
                                        <>
                                            <span>·</span>
                                            <span className="font-mono text-xs truncate">/post/{post.slug}</span>
                                        </>
                                    )}
                                    {post.tags && (
                                        <>
                                            <span>·</span>
                                            <span>{post.tags}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <Link
                                    href={`/post/${post.slug}`}
                                    target="_blank"
                                    className="text-xs text-gray-400 hover:text-black"
                                >
                                    View ↗
                                </Link>
                                <Link
                                    href={`/cms/posts/${post.id}`}
                                    className="text-xs px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(post.id, post.title)}
                                    className="text-xs px-3 py-1 border border-red-200 text-red-500 rounded hover:bg-red-50 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function CmsPage() {
    return (
        <AuthGuard>
            <PostList />
        </AuthGuard>
    );
}
