"use client";

import { useEffect, useState } from "react";

function getDateStamp() {
    const now = new Date();
    return `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")}`;
}

function getLocalTime() {
    return new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
}

export function SystemStatus() {
    const [time, setTime] = useState<string>("");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        setTime(getLocalTime());
        const interval = setInterval(() => setTime(getLocalTime()), 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <footer className="border-t border-border-subtle mt-32">
            <div className="py-8 font-mono text-xs text-offwhite-dim">
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-accent">■</span>
                    <span className="uppercase tracking-widest">System.Status</span>
                    <span className="flex-1 border-t border-border-subtle mx-2" />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-8 mb-6">
                    <span>LOC: Budapest, HU</span>
                    <span className="hidden sm:inline text-border-subtle">|</span>
                    <span>DATE: {getDateStamp()}</span>
                    <span className="hidden sm:inline text-border-subtle">|</span>
                    <span>LOCAL: {mounted ? time : "--:--"}</span>
                    <span className="hidden sm:inline text-border-subtle">|</span>
                    <span>
                        SIGNAL: <span className="text-accent">ACTIVE</span>
                    </span>
                </div>

                <div className="flex flex-wrap gap-6">
                    <a
                        href="https://github.com/tiborsaas"
                        className="hover:text-accent transition-colors"
                    >
                        [GitHub]
                    </a>
                    <a
                        href="https://www.linkedin.com/in/tiborszasz/"
                        className="hover:text-accent transition-colors"
                    >
                        [LinkedIn]
                    </a>
                    <a
                        href="https://twitter.com/tiborsaas"
                        className="hover:text-accent transition-colors"
                    >
                        [X]
                    </a>
                    <a
                        href="https://mastodon.social/@tiborsaas"
                        rel="me"
                        className="hover:text-accent transition-colors"
                    >
                        [Mastodon]
                    </a>
                    <a
                        href="mailto:tibor@szasz.hu"
                        className="hover:text-accent transition-colors"
                    >
                        [@]
                    </a>
                </div>
            </div>
        </footer>
    );
}
