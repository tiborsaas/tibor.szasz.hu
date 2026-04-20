import Link from "next/link";
import { serverDb } from "@/lib/server-db";
import { SystemStatus } from "../components/SystemStatus";

function estimateReadTime(body: string): number {
  const words = body.length / 5;
  return Math.max(1, Math.ceil(words / 200));
}

function formatDate(timestamp: number): string {
  const d = new Date(timestamp);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

/** Tiny decorative tick bar used as a micrographic accent */
function MicroTicks({ count = 12 }: { count?: number }) {
  return (
    <span className="micro-ticks hidden sm:flex" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} />
      ))}
    </span>
  );
}

export default async function Page() {
  const data = await serverDb.query({
    blog: {
      $: { order: { serverCreatedAt: "desc" }, limit: 8 },
    },
  });

  const allPosts = data.blog ?? [];
  const featuredPost = allPosts[0] ?? null;
  const posts = allPosts.slice(1, 8);

  return (
    <div className="py-16">
      {/* Header */}
      <header className="mb-20 micro-bracket-tl">
        {/* Micrographic: tiny coordinate marker */}
        <div className="font-mono text-xs text-offwhite-dim opacity-40 mb-3 flex items-center gap-3" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="8" cy="8" r="1" fill="#00FF41" />
            <circle cx="8" cy="8" r="4" stroke="#00FF41" strokeWidth="0.5" strokeDasharray="2 2" />
            <circle cx="8" cy="8" r="7" stroke="#00FF41" strokeWidth="0.5" opacity="0.4" />
            <line x1="8" y1="0" x2="8" y2="3" stroke="#00FF41" strokeWidth="0.5" />
            <line x1="8" y1="13" x2="8" y2="16" stroke="#00FF41" strokeWidth="0.5" />
            <line x1="0" y1="8" x2="3" y2="8" stroke="#00FF41" strokeWidth="0.5" />
            <line x1="13" y1="8" x2="16" y2="8" stroke="#00FF41" strokeWidth="0.5" />
          </svg>
          <span>47.4979° N · 19.0402° E</span>
          <MicroTicks count={8} />
        </div>
        <h1 className="font-display text-5xl md:text-7xl mb-4">
          Tibor Szász
        </h1>
        <p className="font-mono text-sm text-offwhite-dim max-w-lg leading-relaxed">
          Engineer / Founder / Artist / Musician / Toolmaker
        </p>
      </header>

      {/* Featured latest post — two-column layout */}
      {featuredPost && (
        <section className="mb-20">
          <div className="flex items-center gap-2 mb-6 font-mono text-xs text-offwhite-dim">
            {/* Micrographic: small signal icon */}
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
              <rect x="0" y="4" width="2" height="4" fill="#00FF41" />
              <rect x="3" y="2" width="2" height="6" fill="#00FF41" opacity="0.7" />
              <rect x="6" y="0" width="2" height="8" fill="#00FF41" opacity="0.4" />
            </svg>
            <span className="uppercase tracking-widest">Latest Transmission</span>
            <span className="flex-1 border-t border-border-subtle mx-2" />
            <span className="text-accent opacity-60">FEATURED</span>
          </div>

          <div className="relative group grid grid-cols-1 md:grid-cols-2 gap-0 border border-border-subtle hover:border-accent transition-colors duration-300 scanline-hover">
            <Link href={`/post/${featuredPost.slug}`} className="absolute inset-0 z-0" aria-label={featuredPost.title} />
            {/* Image column */}
            <div className="relative overflow-hidden micro-grid-bg min-h-[220px] md:min-h-[280px] bg-ink-light">
              {featuredPost.cover_image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={featuredPost.cover_image}
                  alt={`Cover for ${featuredPost.title}`}
                  className="w-full h-full object-cover absolute inset-0 opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center micro-grid-bg">
                  {/* Micrographic placeholder: concentric squares */}
                  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="opacity-20">
                    <rect x="2" y="2" width="60" height="60" stroke="#00FF41" strokeWidth="0.5" />
                    <rect x="12" y="12" width="40" height="40" stroke="#00FF41" strokeWidth="0.5" />
                    <rect x="22" y="22" width="20" height="20" stroke="#00FF41" strokeWidth="0.5" />
                    <rect x="29" y="29" width="6" height="6" fill="#00FF41" opacity="0.6" />
                    <line x1="32" y1="0" x2="32" y2="64" stroke="#00FF41" strokeWidth="0.25" opacity="0.4" />
                    <line x1="0" y1="32" x2="64" y2="32" stroke="#00FF41" strokeWidth="0.25" opacity="0.4" />
                  </svg>
                </div>
              )}
              {/* Corner micro-bracket */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-accent opacity-60" aria-hidden="true" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-accent opacity-60" aria-hidden="true" />
            </div>

            {/* Content column */}
            <div className="p-6 md:p-8 flex flex-col justify-between border-t md:border-t-0 md:border-l border-border-subtle group-hover:border-accent transition-colors duration-300">
              <div>
                <div className="font-mono text-xs text-offwhite-dim mb-3 flex items-center gap-3">
                  <span>{formatDate(Number(featuredPost.created_at))}</span>
                  {featuredPost.tags && (
                    <Link
                      href={`/blog?tag=${encodeURIComponent(featuredPost.tags)}`}
                      className="relative z-10 text-accent opacity-60 hover:opacity-100 transition-opacity"
                    >
                      [{featuredPost.tags}]
                    </Link>
                  )}
                </div>
                <h2 className="font-display text-2xl md:text-3xl leading-tight mb-4 group-hover:text-accent transition-colors">
                  {featuredPost.title}
                </h2>
                {featuredPost.excerpt && (
                  <p className="font-body text-sm text-offwhite-dim leading-relaxed line-clamp-3">
                    {featuredPost.excerpt}
                  </p>
                )}
              </div>

              <div className="font-mono text-xs text-offwhite-dim mt-6 flex items-center justify-between">
                <span>READ_TIME // {String(estimateReadTime(featuredPost.body)).padStart(2, "0")} MIN</span>
                <span className="text-accent group-hover:translate-x-1 transition-transform inline-block">→</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* The Feed */}
      <section>
        <div className="flex items-center gap-2 mb-8 font-mono text-xs text-offwhite-dim">
          <span className="text-accent">▸</span>
          <span className="uppercase tracking-widest">
            Latest Transmissions
          </span>
          <span className="flex-1 border-t border-border-subtle mx-2" />
          <MicroTicks count={10} />
          <span className="ml-2">{String(posts.length).padStart(2, "0")} entries</span>
        </div>

        <div className="flex flex-col">
          {posts.map((post) => {
            const readTime = estimateReadTime(post.body);
            return (
              <div
                key={post.id}
                className="relative feed-row group flex flex-col md:flex-row md:items-baseline gap-1 md:gap-4 py-5 px-3 -mx-3"
              >
                <Link href={`/post/${post.slug}`} className="absolute inset-0 z-0" aria-label={post.title} />
                {/* Date + Tag — own line on mobile, inline on md+ */}
                <span className="font-mono text-xs text-offwhite-dim whitespace-nowrap shrink-0 flex items-center gap-2">
                  {formatDate(Number(post.created_at))}
                  {post.tags && (
                    <Link
                      href={`/blog?tag=${encodeURIComponent(post.tags)}`}
                      className="relative z-10 text-accent opacity-60 hover:opacity-100 transition-opacity"
                    >
                      [{post.tags}]
                    </Link>
                  )}
                </span>

                {/* Title */}
                <span className="font-display text-xl md:text-2xl flex-1 group-hover:text-accent transition-colors leading-tight">
                  {post.title}
                </span>

                {/* Read time — hidden on mobile */}
                <span className="font-mono text-xs text-offwhite-dim whitespace-nowrap shrink-0 hidden sm:inline">
                  READ_TIME // {String(readTime).padStart(2, "0")} MIN
                </span>
              </div>
            );
          })}
        </div>

        {posts.length === 0 && !featuredPost && (
          <p className="font-mono text-sm text-offwhite-dim py-16 text-center">
            No transmissions found.
          </p>
        )}
      </section>

      <SystemStatus />
    </div>
  );
}
