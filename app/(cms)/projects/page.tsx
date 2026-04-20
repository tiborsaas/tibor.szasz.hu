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

/** Micrographic: modular project-grid symbol */
function ProjectGlyph() {
    return (
        <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className="inline-block opacity-60"
        >
            <rect x="0" y="0" width="6" height="6" stroke="#00FF41" strokeWidth="0.75" />
            <rect x="8" y="0" width="6" height="6" stroke="#00FF41" strokeWidth="0.75" />
            <rect x="0" y="8" width="6" height="6" stroke="#00FF41" strokeWidth="0.75" />
            <rect x="8" y="8" width="6" height="6" fill="#00FF41" fillOpacity="0.35" stroke="#00FF41" strokeWidth="0.75" />
        </svg>
    );
}

export default async function ProjectsPage() {
    const data = await serverDb.query({
        blog: {
            $: { order: { serverCreatedAt: "desc" } },
        },
    });

    const posts = (data.blog ?? []).filter(
        (p) => p.tags?.toLowerCase() === "projects"
    );

    return (
        <div className="py-16">
            <header className="mb-20">
                {/* Micrographic marker row */}
                <div className="flex items-center gap-2 mb-4 font-mono text-xs text-offwhite-dim opacity-50" aria-hidden="true">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <span key={i} style={{ display: "inline-block", width: 2, height: i % 4 === 0 ? 10 : i % 3 === 0 ? 6 : 4, background: "#00FF41", opacity: i % 5 === 0 ? 0.8 : 0.3 }} />
                    ))}
                </div>
                <h1 className="font-display text-5xl md:text-7xl mb-4 flex items-center gap-4">
                    <ProjectGlyph />
                    Projects
                </h1>
                <p className="font-mono text-sm text-offwhite-dim">
                    Things built, shipped, and iterated — {posts.length}{" "}
                    {posts.length === 1 ? "entry" : "entries"}
                </p>
            </header>

            {posts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border-subtle border border-border-subtle">
                    {posts.map((post, idx) => {
                        const readTime = estimateReadTime(post.body);
                        return (
                            <Link
                                key={post.id}
                                href={`/post/${post.slug}`}
                                className="group relative bg-ink p-6 hover:bg-accent-muted transition-colors duration-300 scanline-hover"
                            >
                                {/* Micrographic: index number watermark */}
                                <span
                                    className="absolute top-4 right-4 font-mono text-xs text-offwhite-dim opacity-20 select-none"
                                    aria-hidden="true"
                                >
                                    {String(idx + 1).padStart(2, "0")}
                                </span>

                                {/* Corner bracket */}
                                <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-accent opacity-0 group-hover:opacity-60 transition-opacity" aria-hidden="true" />

                                {/* Cover image strip */}
                                {post.cover_image && (
                                    <div className="mb-4 overflow-hidden h-32 border border-border-subtle">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={post.cover_image}
                                            alt={`Cover for ${post.title}`}
                                            className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                                        />
                                    </div>
                                )}

                                {!post.cover_image && (
                                    <div className="mb-4 h-32 micro-grid-bg border border-border-subtle flex items-center justify-center">
                                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true" className="opacity-15">
                                            <rect x="1" y="1" width="38" height="38" stroke="#00FF41" strokeWidth="0.5" />
                                            <rect x="8" y="8" width="24" height="24" stroke="#00FF41" strokeWidth="0.5" />
                                            <line x1="20" y1="0" x2="20" y2="40" stroke="#00FF41" strokeWidth="0.25" />
                                            <line x1="0" y1="20" x2="40" y2="20" stroke="#00FF41" strokeWidth="0.25" />
                                        </svg>
                                    </div>
                                )}

                                <div className="font-mono text-xs text-offwhite-dim mb-2">
                                    {formatDate(Number(post.created_at))}
                                </div>

                                <h2 className="font-display text-xl md:text-2xl leading-tight mb-3 group-hover:text-accent transition-colors">
                                    {post.title}
                                </h2>

                                <div className="font-mono text-xs text-offwhite-dim flex items-center justify-between mt-auto pt-3 border-t border-border-subtle">
                                    <span>READ_TIME // {String(readTime).padStart(2, "0")} MIN</span>
                                    <span className="text-accent opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            ) : (
                <div className="py-24 text-center">
                    <div className="font-mono text-xs text-offwhite-dim mb-6 opacity-40" aria-hidden="true">
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="mx-auto mb-4">
                            <rect x="1" y="1" width="30" height="30" stroke="#00FF41" strokeWidth="0.5" strokeDasharray="3 3" />
                            <line x1="16" y1="0" x2="16" y2="32" stroke="#00FF41" strokeWidth="0.5" opacity="0.4" />
                            <line x1="0" y1="16" x2="32" y2="16" stroke="#00FF41" strokeWidth="0.5" opacity="0.4" />
                        </svg>
                    </div>
                    <p className="font-mono text-sm text-offwhite-dim">
                        ERR: NO_PROJECTS_FOUND
                    </p>
                    <p className="font-mono text-xs text-offwhite-dim mt-2 opacity-50">
                        Tag blog posts with &ldquo;Projects&rdquo; to display them here.
                    </p>
                </div>
            )}

            <SystemStatus />
        </div>
    );
}
