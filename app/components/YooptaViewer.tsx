"use client";

import { useMemo } from "react";
import YooptaEditor, { createYooptaEditor, YooptaContentValue } from "@yoopta/editor";
import Paragraph from "@yoopta/paragraph";
import { HeadingOne, HeadingTwo, HeadingThree } from "@yoopta/headings";
import Blockquote from "@yoopta/blockquote";
import { BulletedList, NumberedList, TodoList } from "@yoopta/lists";
import { Code, CodeGroup } from "@yoopta/code";
import Link from "@yoopta/link";
import Image from "@yoopta/image";
import Video from "@yoopta/video";
import Embed from "@yoopta/embed";
import { Bold, Italic, CodeMark, Underline, Strike, Highlight } from "@yoopta/marks";
import { applyTheme } from "@yoopta/themes-shadcn";

const plugins = applyTheme([
    Paragraph,
    HeadingOne,
    HeadingTwo,
    HeadingThree,
    Blockquote,
    BulletedList,
    NumberedList,
    TodoList,
    Code,
    CodeGroup,
    Link,
    Image.extend({ options: { upload: async () => ({ id: "", src: "" }) } }),
    Video,
    Embed,
]);

const marks = [Bold, Italic, CodeMark, Underline, Strike, Highlight];

export function YooptaViewer({ body }: { body: string }) {
    let value: YooptaContentValue | undefined;
    try {
        value = JSON.parse(body);
    } catch {
        value = undefined;
    }

    const editor = useMemo(
        () => createYooptaEditor({ plugins, marks, value, readOnly: true }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    if (!value) {
        return <p className="text-gray-400 italic">No content</p>;
    }

    return <YooptaEditor editor={editor} />;
}
