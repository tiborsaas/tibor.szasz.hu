import Link from "next/link";
import { serverDb } from "@/lib/server-db";
import { SystemStatus } from "../../components/SystemStatus";

function formatDate(timestamp: number): string {
  const d = new Date(timestamp);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

function estimateReadTime(body: string): number {
  const words = body.length / 5;
  return Math.max(1, Math.ceil(words / 200));
}

export default async function ArchivePage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const { tag: activeTag } = await searchParams;

  const data = await serverDb.query({
    blog: {
      $: { order: { serverCreatedAt: "desc" } },
    },
  });

  let posts = data.blog ?? [];
  if (activeTag) {
    posts = posts.filter(
      (p) => p.tags?.toLowerCase() === activeTag.toLowerCase()
    );
  }

  // Group posts by year
  const grouped: Record<string, typeof posts> = {};
  posts.forEach((post) => {
    const year = new Date(Number(post.created_at)).getFullYear().toString();
    if (!grouped[year]) grouped[year] = [];
    grouped[year].push(post);
  });

  const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="py-16">
      <header className="mb-20">
        <h1 className="font-display text-5xl md:text-7xl mb-4">Archive</h1>
        <p className="font-mono text-sm text-offwhite-dim">
          Complete transmission log — {posts.length} entries
          {activeTag && (
            <>
              {" "}
              &mdash; filtered by{" "}
              <span className="text-accent">[{activeTag}]</span>{" "}
              <Link
                href="/blog"
                className="text-offwhite-dim underline hover:text-accent ml-1"
              >
                ✕ clear
              </Link>
            </>
          )}
        </p>
      </header>

      {years.map((year) => (
        <section key={year} className="mb-16">
          <div className="flex items-center gap-2 mb-6 font-mono text-xs text-offwhite-dim">
            <span className="text-accent">▸</span>
            <span>{year}</span>
            <span className="flex-1 border-t border-border-subtle mx-2" />
            <span>{String(grouped[year].length).padStart(2, "0")}</span>
          </div>

          <div className="flex flex-col">
            {grouped[year].map((post) => {
              const readTime = estimateReadTime(post.body);
              return (
                <div
                  key={post.id}
                  className="relative feed-row group flex flex-col md:flex-row md:items-baseline gap-1 md:gap-4 py-4 px-3 -mx-3"
                >
                  <Link href={`/post/${post.slug}`} className="absolute inset-0 z-0" aria-label={post.title} />
                  <span className="font-mono text-xs text-offwhite-dim whitespace-nowrap shrink-0">
                    {formatDate(Number(post.created_at))}
                  </span>

                  <span className="font-display text-lg md:text-xl flex-1 group-hover:text-accent transition-colors leading-tight">
                    {post.title}
                  </span>

                  {post.tags && (
                    <Link
                      href={`/blog?tag=${encodeURIComponent(post.tags)}`}
                      className="relative z-10 font-mono text-xs text-accent opacity-50 whitespace-nowrap hidden md:inline hover:opacity-100 transition-opacity"
                    >
                      [{post.tags}]
                    </Link>
                  )}

                  <span className="font-mono text-xs text-offwhite-dim whitespace-nowrap shrink-0 hidden sm:inline">
                    {String(readTime).padStart(2, "0")} MIN
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      ))}

      {years.length === 0 && (
        <p className="font-mono text-sm text-offwhite-dim py-16 text-center">
          No transmissions found.
        </p>
      )}

      <SystemStatus />
    </div>
  );
}
