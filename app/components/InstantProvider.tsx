"use client";

import { db } from "@/lib/db";
import { type User } from "@instantdb/react";
import { InstantSuspenseProvider } from "@instantdb/react/nextjs";

export function InstantProvider({
    children,
    user,
}: {
    children: React.ReactNode;
    user: User | null;
}) {
    return (
        <InstantSuspenseProvider user={user} db={db}>
            {children}
        </InstantSuspenseProvider>
    );
}
