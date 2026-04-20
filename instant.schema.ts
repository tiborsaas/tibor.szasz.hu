// Docs: https://www.instantdb.com/docs/modeling-data

import { i } from "@instantdb/react";

const _schema = i.schema({
    entities: {
        "$files": i.entity({
            "path": i.string().unique().indexed(),
            "url": i.string().optional(),
        }),
        "$users": i.entity({
            "email": i.string().unique().indexed().optional(),
            "imageURL": i.string().optional(),
            "type": i.string().optional(),
        }),
        "blog": i.entity({
            "body": i.string(),
            "cover_image": i.string().optional(),
            "created_at": i.date(),
            "excerpt": i.string().optional(),
            "slug": i.string().unique().indexed(),
            "tags": i.string().indexed().optional(),
            "title": i.string().indexed(),
            "updated_at": i.date().optional(),
        }),
    },
    links: {
        "$usersLinkedPrimaryUser": {
            "forward": {
                "on": "$users",
                "has": "one",
                "label": "linkedPrimaryUser",
                "onDelete": "cascade",
            },
            "reverse": {
                "on": "$users",
                "has": "many",
                "label": "linkedGuestUsers",
            },
        },
    },
    rooms: {},
});

// This helps TypeScript display nicer intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
