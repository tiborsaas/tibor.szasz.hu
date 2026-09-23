import { NextRequest, NextResponse } from "next/server";
import { getAllPosts, savePost } from "@/lib/posts";

export async function GET() {
  try {
    const posts = await getAllPosts(true);
    return NextResponse.json({ posts });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.title || !body.title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    if (!body.slug || !body.slug.trim()) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const saved = await savePost({
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
