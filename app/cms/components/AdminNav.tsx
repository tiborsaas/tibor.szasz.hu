"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AdminNav() {
  const pathname = usePathname();

  const linkClass = (active: boolean) =>
    `px-3 py-1 rounded text-sm font-medium transition-colors ${
      active ? "bg-black text-white" : "text-gray-600 hover:text-black"
    }`;

  const isPostsActive =
    pathname === "/cms" ||
    pathname.startsWith("/cms/posts");
  const isMediaActive = pathname.startsWith("/cms/media");

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <nav className="flex items-center gap-1">
        <span className="font-bold mr-4 text-black">Admin</span>
        <Link href="/cms" className={linkClass(isPostsActive)}>
          Posts
        </Link>
        <Link href="/cms/media" className={linkClass(isMediaActive)}>
          Media
        </Link>
      </nav>
      <div className="flex items-center gap-3">
        <Link
          href="/blog"
          target="_blank"
          className="text-sm text-gray-500 hover:text-black"
        >
          View blog ↗
        </Link>
      </div>
    </header>
  );
}
