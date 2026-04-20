import { init } from "@instantdb/admin";
import schema from "@/instant.schema";

// Server-only admin DB instance.
// Blog posts are publicly readable so we use asUser({ guest: true }) —
// no admin token required.
const adminDb = init({
    appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID!,
    schema,
});

export const serverDb = adminDb.asUser({ guest: true });
