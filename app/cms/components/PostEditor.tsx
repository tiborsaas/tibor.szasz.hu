"use client";

import { useMemo, useCallback, useState } from "react";
import YooptaEditor, {
    createYooptaEditor,
    YooptaContentValue,
    buildBlockData,
    generateId,
    Blocks,
    Marks,
    useYooptaEditor,
} from "@yoopta/editor";
import Paragraph from "@yoopta/paragraph";
import { HeadingOne, HeadingTwo, HeadingThree } from "@yoopta/headings";
import Blockquote from "@yoopta/blockquote";
import { BulletedList, NumberedList, TodoList } from "@yoopta/lists";
import { Code, CodeGroup } from "@yoopta/code";
import LinkPlugin from "@yoopta/link";
import { LinkCommands } from "@yoopta/link";
import Image from "@yoopta/image";
import Embed from "@yoopta/embed";
import { Bold, Italic, CodeMark, Underline, Strike, Highlight } from "@yoopta/marks";
import { FloatingToolbar, FloatingBlockActions, SlashCommandMenu } from "@yoopta/ui";
import { applyTheme } from "@yoopta/themes-shadcn";
import { db } from "@/lib/db";

async function uploadImage(file: File) {
    const path = `blog/${Date.now()}-${file.name}`;
    await db.storage.uploadFile(path, file);
    const url = await db.storage.getDownloadUrl(path);
    return { src: url as string, alt: file.name, id: path };
}

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
    LinkPlugin,
    Image.extend({ options: { upload: uploadImage } }),
    Embed,
]);

const marks = [Bold, Italic, CodeMark, Underline, Strike, Highlight];

function LinkButton() {
    const editor = useYooptaEditor();
    const [showInput, setShowInput] = useState(false);
    const [url, setUrl] = useState("");

    const onSubmit = useCallback(() => {
        if (!url) return;
        const slate = Blocks.getBlockSlate(editor, {});
        if (slate?.selection) {
            LinkCommands.insertLink(editor, {
                slate,
                props: { url, target: "_blank", rel: "noopener noreferrer" },
            });
        }
        setUrl("");
        setShowInput(false);
    }, [editor, url]);

    if (showInput) {
        return (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                <input
                    type="url"
                    placeholder="https://…"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") { e.preventDefault(); onSubmit(); }
                        if (e.key === "Escape") { setShowInput(false); setUrl(""); }
                    }}
                    autoFocus
                    style={{ width: 160, padding: "2px 4px", fontSize: 12, border: "1px solid #ccc", borderRadius: 3 }}
                />
                <FloatingToolbar.Button onClick={onSubmit} title="Apply">
                    ✓
                </FloatingToolbar.Button>
            </span>
        );
    }

    return (
        <FloatingToolbar.Button
            onClick={() => setShowInput(true)}
            aria-label="Link"
            title="Link"
        >
            🔗
        </FloatingToolbar.Button>
    );
}

function ToolbarButtons() {
    const editor = useYooptaEditor();

    const onToggleMark = useCallback(
        (type: string) => () => {
            Marks.toggle(editor, { type });
        },
        [editor],
    );

    const onToggleBlock = useCallback(
        (type: string) => () => {
            Blocks.toggleBlock(editor, type);
        },
        [editor],
    );

    return (
        <FloatingToolbar>
            <FloatingToolbar.Content>
                <FloatingToolbar.Group>
                    <FloatingToolbar.Button
                        onClick={onToggleMark("bold")}
                        aria-label="Bold"
                        title="Bold"
                    >
                        <strong>B</strong>
                    </FloatingToolbar.Button>
                    <FloatingToolbar.Button
                        onClick={onToggleMark("italic")}
                        aria-label="Italic"
                        title="Italic"
                    >
                        <em>I</em>
                    </FloatingToolbar.Button>
                    <LinkButton />
                </FloatingToolbar.Group>
                <FloatingToolbar.Separator />
                <FloatingToolbar.Group>
                    <FloatingToolbar.Button
                        onClick={onToggleBlock("HeadingTwo")}
                        aria-label="Heading 2"
                        title="Heading 2"
                    >
                        H2
                    </FloatingToolbar.Button>
                    <FloatingToolbar.Button
                        onClick={onToggleBlock("BulletedList")}
                        aria-label="Bulleted list"
                        title="Bulleted list"
                    >
                        • List
                    </FloatingToolbar.Button>
                </FloatingToolbar.Group>
            </FloatingToolbar.Content>
        </FloatingToolbar>
    );
}

function emptyValue(): YooptaContentValue {
    const blockId = generateId();
    return {
        [blockId]: buildBlockData({
            id: blockId,
            type: "Paragraph",
            value: [
                {
                    id: generateId(),
                    type: "paragraph",
                    children: [{ text: "" }],
                },
            ],
            meta: { order: 0, depth: 0 },
        }),
    };
}

interface PostEditorProps {
    initialValue?: string;
    onChange: (value: string) => void;
}

export function PostEditor({ initialValue, onChange }: PostEditorProps) {
    const editor = useMemo(() => {
        let value: YooptaContentValue | undefined;
        if (initialValue) {
            try {
                const parsed = JSON.parse(initialValue);
                if (parsed && Object.keys(parsed).length > 0) {
                    value = parsed;
                }
            } catch {
                /* ignore bad JSON */
            }
        }
        if (!value) {
            value = emptyValue();
        }
        return createYooptaEditor({ plugins, marks, value });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="border border-gray-200 rounded-lg bg-white min-h-[400px] p-4">
            <YooptaEditor
                editor={editor}
                onChange={(val) => onChange(JSON.stringify(val))}
                placeholder="Type / to open the block menu…"
                autoFocus
            >
                <ToolbarButtons />
                <FloatingBlockActions />
                <SlashCommandMenu>
                    {({ items }: { items: Array<{ id: string; title: string }> }) => (
                        <SlashCommandMenu.Content>
                            <SlashCommandMenu.Input placeholder="Filter blocks…" />
                            <SlashCommandMenu.List>
                                {items.map((item) => (
                                    <SlashCommandMenu.Item key={item.id} value={item.id} title={item.title}>
                                        {item.title}
                                    </SlashCommandMenu.Item>
                                ))}
                                <SlashCommandMenu.Empty>No results</SlashCommandMenu.Empty>
                            </SlashCommandMenu.List>
                        </SlashCommandMenu.Content>
                    )}
                </SlashCommandMenu>
            </YooptaEditor>
        </div>
    );
}
