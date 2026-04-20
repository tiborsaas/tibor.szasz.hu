"use client";

import { use } from "react";
import { db } from "@/lib/db";
import { AuthGuard } from "../../components/AuthGuard";
import { PostForm } from "../../components/PostForm";

function EditPostInner({ id }: { id: string }) {
    const { isLoading, error, data } = db.useQuery({
        blog: { $: { where: { id } } },
    });

    if (isLoading) {
        return <p className="text-gray-400">Loading…</p>;
    }

    if (error) {
        return <p className="text-red-500">Error: {error.message}</p>;
    }

    const post = data?.blog?.[0];

    if (!post) {
        return <p className="text-gray-500">Post not found.</p>;
    }

    return (
        <PostForm
            initialData={{
                id: post.id,
                title: post.title,
                slug: post.slug,
                excerpt: post.excerpt,
                tags: post.tags,
                cover_image: post.cover_image,
                body: post.body,
                created_at: typeof post.created_at === "number" ? post.created_at : undefined,
            }}
        />
    );
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    return (
        <AuthGuard>
            <EditPostInner id={id} />
        </AuthGuard>
    );
}
