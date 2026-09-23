"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";

interface PostItem {
  id: string;
  slug: string;
  title: string;
  created_at: number;
  tags?: string;
  cover_image?: string;
}

export default function CmsPage() {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadPosts() {
    setLoading(true);
    try {
      const res = await fetch("/api/cms/posts");
      const data = await res.json();
      if (data.posts) {
        setPosts(data.posts);
      } else {
        setError(data.error || "Failed to load posts");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load posts");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPosts();
  }, []);

  async function handleDelete(slug: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/cms/posts/${encodeURIComponent(slug)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setPosts((prev) => prev.filter((p) => p.slug !== slug));
      } else {
        alert("Delete failed: " + (data.error || "Unknown error"));
      }
    } catch (err: any) {
      alert("Delete failed: " + err.message);
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Blog Posts</h1>
        <Link
          href="/cms/posts/new"
          className="bg-black text-white px-4 py-2 rounded font-medium text-sm hover:bg-gray-800 transition-colors"
        >
          + New post
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading posts…</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : posts.length === 0 ? (
        <div className="text-center py-24 text-gray-400 bg-white border border-gray-200 rounded-lg">
          <p className="text-lg">No posts yet.</p>
          <Link href="/cms/posts/new" className="text-black underline mt-2 block">
            Create your first post
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
          {posts.map((post) => (
            <div
              key={post.slug}
              className="flex items-start gap-4 px-5 py-4 hover:bg-gray-50 transition-colors"
            >
              {post.cover_image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.cover_image}
                  alt=""
                  className="w-16 h-12 rounded object-cover flex-shrink-0 bg-gray-100"
                />
              )}
              <div className="flex-1 min-w-0">
                <Link
                  href={`/cms/posts/${encodeURIComponent(post.slug)}`}
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
                      <span className="text-xs text-gray-600">[{post.tags}]</span>
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
                  href={`/cms/posts/${encodeURIComponent(post.slug)}`}
                  className="text-xs px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(post.slug, post.title)}
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
