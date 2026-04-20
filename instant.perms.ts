import type { InstantRules } from "@instantdb/react";

const rules = {
    // Public blog posts: anyone can read, only authenticated users can write
    blog: {
        allow: {
            view: "true",
            create: "isLoggedIn",
            update: "isLoggedIn",
            delete: "isLoggedIn",
        },
        bind: ["isLoggedIn", "auth.id != null"],
    },
    // Storage: authenticated users can upload/view; anyone can view (for serving images)
    $files: {
        allow: {
            view: "true",
            create: "isLoggedIn",
            update: "isLoggedIn",
            delete: "isLoggedIn",
        },
        bind: ["isLoggedIn", "auth.id != null"],
    },
} satisfies InstantRules;

export default rules;
