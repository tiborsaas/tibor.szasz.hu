import Link from "next/link";
import { YooptaViewer } from "@/app/components/YooptaViewer";
import { serverDb } from "@/lib/server-db";
import { SystemStatus } from "@/app/components/SystemStatus";

function formatDate(timestamp: number): string {
  const d = new Date(timestamp);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

function estimateReadTime(body: string): number {
  const words = body.length / 5;
  return Math.max(1, Math.ceil(words / 200));
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await serverDb.query({
    blog: {
      $: { where: { slug } },
    },
  });

  const post = data.blog?.[0];

  if (!post) {
    return (
      <div className="py-32 text-center">
        <p className="font-mono text-sm text-offwhite-dim mb-4">
          ERR: POST_NOT_FOUND
        </p>
        <Link
          href="/"
          className="font-mono text-sm text-accent hover:underline"
        >
          [Return to Index]
        </Link>
      </div>
    );
  }

  const readTime = estimateReadTime(post.body);

  return (
    <article className="py-16">
      {/* Meta header */}
      <div className="font-mono text-xs text-offwhite-dim mb-8 flex flex-wrap gap-4">
        <span>{formatDate(Number(post.created_at))}</span>
        <span className="text-border-subtle">|</span>
        <span>READ_TIME // {String(readTime).padStart(2, "0")} MIN</span>
        {post.tags && (
          <>
            <span className="text-border-subtle">|</span>
            <Link
              href={`/blog?tag=${encodeURIComponent(post.tags)}`}
              className="text-accent opacity-60 hover:opacity-100 transition-opacity"
            >
              [{post.tags}]
            </Link>
          </>
        )}
      </div>

      {/* Title */}
      <h1 className="font-display text-4xl md:text-6xl leading-tight mb-12">
        {post.title}
      </h1>

      {/* Hero image - constrained to 40vh with brutalist offset */}
      {post.cover_image && (
        <div className="mb-16 relative">
          <div className="border border-border-subtle overflow-hidden max-h-[40vh]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.cover_image}
              alt={`Cover image for ${post.title}`}
              className="w-full object-cover max-h-[40vh]"
            />
          </div>
          {/* Brutalist offset shadow */}
          <div className="absolute inset-0 translate-x-2 translate-y-2 border border-accent opacity-20 -z-10" />
        </div>
      )}

      {/* Body */}
      <div className="max-w-2xl mx-auto post-body">
        <div className="prose prose-lg prose-brutalist font-body">
          <YooptaViewer body={post.body} />
        </div>
      </div>

      {/* End marker */}
      <div className="max-w-2xl mx-auto mt-16 pt-8 border-t border-border-subtle">
        <div className="font-mono text-xs text-offwhite-dim flex justify-between">
          <span>EOF</span>
          <Link href="/" className="text-accent hover:underline">
            [Return to Index]
          </Link>
        </div>
      </div>

      <SystemStatus />
    </article>
  );
}
