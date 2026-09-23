"use client";

import { use, useEffect, useState } from "react";
import { PostForm } from "../../components/PostForm";

interface PostData {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  tags?: string;
  cover_image?: string;
  cover_image_id?: string;
  body: string;
  created_at?: number;
}

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPost() {
      try {
        const res = await fetch(`/api/cms/posts/${encodeURIComponent(id)}`);
        const data = await res.json();
        if (data.post) {
          setPost(data.post);
        } else {
          setError(data.error || "Post not found");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load post");
      } finally {
        setLoading(false);
      }
    }
    loadPost();
  }, [id]);

  if (loading) {
    return <p className="text-gray-400 p-6">Loading transmission…</p>;
  }

  if (error || !post) {
    return <p className="text-red-500 p-6">Error: {error || "Post not found"}</p>;
  }

  return <PostForm initialData={post} />;
}
