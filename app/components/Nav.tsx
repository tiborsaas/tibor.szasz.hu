import Link from "next/link";

export function Nav() {
    return (
        <nav className="flex items-center justify-between py-6 border-b border-border-subtle">
            <Link
                href="/"
                className="font-mono text-sm font-normal tracking-wider text-offwhite hover:text-accent transition-colors"
                style={{ fontFamily: "var(--font-jetbrains), 'Courier New', monospace" }}
            >
                TS://
            </Link>
            <div className="flex gap-6 sm:gap-8 font-mono text-sm">
                <Link
                    href="/"
                    className="text-offwhite-dim hover:text-accent transition-colors"
                >
                    [Index]
                </Link>
                <Link
                    href="/blog"
                    className="text-offwhite-dim hover:text-accent transition-colors"
                >
                    [Archive]
                </Link>
                <Link
                    href="/projects"
                    className="text-offwhite-dim hover:text-accent transition-colors"
                >
                    [Projects]
                </Link>
            </div>
        </nav>
    );
}
