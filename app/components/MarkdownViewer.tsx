import { marked } from "marked";

interface MarkdownViewerProps {
  content: string;
}

marked.setOptions({
  gfm: true,
  breaks: true,
});

export function MarkdownViewer({ content }: MarkdownViewerProps) {
  if (!content) {
    return <p className="text-offwhite-dim italic">No transmission content.</p>;
  }

  // Parse markdown to HTML synchronously
  const html = marked.parse(content) as string;

  return (
    <div
      className="markdown-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
