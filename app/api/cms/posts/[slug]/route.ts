import { NextRequest, NextResponse } from "next/server";
import { getPostBySlug, savePost, deletePost } from "@/lib/posts";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const post = await getPostBySlug(slug, true);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    return NextResponse.json({ post });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const body = await request.json();
    if (!body.title || !body.title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    if (!body.slug || !body.slug.trim()) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const saved = await savePost({
      originalSlug: slug,
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt,
      tags: body.tags,
      coverImage: body.cover_image_id || body.coverImage || body.cover_image,
      body: body.body,
      createdAt: body.created_at || body.createdAt,
      published: body.published ?? true,
    });

    return NextResponse.json({ success: true, post: saved });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const success = await deletePost(slug);
    if (!success) {
      return NextResponse.json({ error: "Post not found or could not be deleted" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
