import fs from "fs";
import path from "path";
import matter from "gray-matter";

const POSTS_DIR = path.join(/*turbopackIgnore: true*/ process.cwd(), "content/posts");

export interface Post {
  id: string;
  slug: string;
  title: string;
  date: string;
  created_at: number;
  updated_at?: number;
  excerpt?: string;
  tags?: string;
  cover_image?: string;
  cover_image_id?: string;
  body: string;
  published: boolean;
  filePath: string;
  folderName?: string;
}

function ensurePostsDir() {
  if (!fs.existsSync(POSTS_DIR)) {
    fs.mkdirSync(POSTS_DIR, { recursive: true });
  }
}

function resolveAssetUrl(rawUrl: string, folderName?: string): string {
  if (!rawUrl) return "";
  if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://") || rawUrl.startsWith("/")) {
    return rawUrl;
  }
  const cleanPath = rawUrl.replace(/^\.\//, "");
  if (folderName) {
    return `/api/content-media/${folderName}/${cleanPath}`;
  }
  return `/${cleanPath}`;
}

function resolveBodyAssets(body: string, folderName?: string): string {
  if (!folderName || !body) return body;
  // Rewrite markdown images: ![alt](./images/...) or ![alt](images/...) or ![alt](hero.png)
  return body.replace(/!\[([^\]]*)\]\((?!https?:\/\/|\/)(?:\.\/)?([^)]+)\)/g, (match, alt, assetPath) => {
    return `![${alt}](/api/content-media/${folderName}/${assetPath})`;
  });
}

function extractDateFromDir(name: string): string | null {
  const match = name.match(/^(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : null;
}

function parsePostFile(fullPath: string, folderName?: string): Post | null {
  try {
    const raw = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(raw);

    const baseName = path.basename(fullPath, path.extname(fullPath));
    const fallbackName = folderName || baseName;
    const dateFromFolder = folderName ? extractDateFromDir(folderName) : null;

    let slug = data.slug;
    if (!slug) {
      slug = fallbackName.replace(/^\d{4}-\d{2}-\d{2}-/, "");
    }

    const title = data.title || slug;
    const dateStr = data.date ? (typeof data.date === "string" ? data.date : new Date(data.date).toISOString().split("T")[0]) : (dateFromFolder || "2024-01-01");
    const createdAt = new Date(data.created_at || dateStr).getTime() || Date.now();
    const updatedAt = data.updated_at ? new Date(data.updated_at).getTime() : undefined;

    const rawHero = data.hero || data.coverImage || data.cover_image || data.cover_image_id;
    const coverUrl = rawHero ? resolveAssetUrl(rawHero, folderName) : undefined;

    let tags = data.tags;
    if (Array.isArray(tags)) {
      tags = tags.join(", ");
    }

    return {
      id: slug,
      slug,
      title,
      date: dateStr,
      created_at: createdAt,
      updated_at: updatedAt,
      excerpt: data.excerpt ? String(data.excerpt).trim() : undefined,
      tags: tags ? String(tags).trim() : undefined,
      cover_image: coverUrl,
      cover_image_id: coverUrl,
      body: content.trim(),
      published: data.published !== false && data.draft !== true,
      filePath: path.relative(POSTS_DIR, fullPath),
      folderName,
    };
  } catch (err) {
    console.error(`Failed to parse post at ${fullPath}:`, err);
    return null;
  }
}

export async function getAllPosts(includeUnpublished = false): Promise<Post[]> {
  ensurePostsDir();
  const entries = fs.readdirSync(POSTS_DIR);
  const posts: Post[] = [];

  for (const entry of entries) {
    const fullPath = path.join(POSTS_DIR, entry);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      const files = fs.readdirSync(fullPath);
      const targetFile = files.find((f) => f === "index.md" || f === "index.mdx" || f === "content.md")
        || files.find((f) => f.endsWith(".md") || f.endsWith(".mdx"));
      if (targetFile) {
        const post = parsePostFile(path.join(fullPath, targetFile), entry);
        if (post && (includeUnpublished || post.published)) {
          posts.push(post);
        }
      }
    } else if (entry.endsWith(".md") || entry.endsWith(".mdx")) {
      const post = parsePostFile(fullPath);
      if (post && (includeUnpublished || post.published)) {
        posts.push(post);
      }
    }
  }

  // Sort descending by created_at
  posts.sort((a, b) => b.created_at - a.created_at);
  return posts;
}

export async function getPostBySlug(slug: string, includeUnpublished = true): Promise<Post | null> {
  const posts = await getAllPosts(includeUnpublished);
  const post = posts.find((p) => p.slug === slug || p.id === slug || p.folderName === slug);
  if (!post) return null;

  // Resolve body relative assets for the specific post
  return {
    ...post,
    body: resolveBodyAssets(post.body, post.folderName),
  };
}

export interface SavePostInput {
  id?: string;
  originalSlug?: string;
  title: string;
  slug: string;
  excerpt?: string;
  tags?: string;
  coverImage?: string;
  cover_image?: string;
  body: string;
  createdAt?: string | number;
  published?: boolean;
}

export async function savePost(input: SavePostInput): Promise<Post> {
  ensurePostsDir();

  const slug = input.slug.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "-").replace(/-+/g, "-");
  const dateObj = input.createdAt ? new Date(input.createdAt) : new Date();
  const dateStr = dateObj.toISOString().split("T")[0];
  const createdAtMs = dateObj.getTime();

  const frontmatterData: Record<string, any> = {
    title: input.title.trim(),
    slug,
    date: dateStr,
    published: input.published ?? true,
  };

  if (input.excerpt?.trim()) {
    frontmatterData.excerpt = input.excerpt.trim();
  }
  if (input.tags?.trim()) {
    frontmatterData.tags = input.tags.trim();
  }
  const cover = input.coverImage || input.cover_image;
  if (cover?.trim()) {
    frontmatterData.hero = cover.trim();
  }
  frontmatterData.updated_at = Date.now();

  const fileContent = matter.stringify(input.body || "", frontmatterData);

  // Check if updating existing post
  const existingPosts = await getAllPosts(true);
  const targetSlug = input.originalSlug || input.id || slug;
  const existing = existingPosts.find((p) => p.slug === targetSlug || p.id === targetSlug);

  let targetPath = path.join(POSTS_DIR, `${slug}.md`);

  if (existing) {
    const existingFullPath = path.join(POSTS_DIR, existing.filePath);
    if (existing.folderName) {
      // It lives inside a folder (e.g. content/posts/[folder]/index.md)
      targetPath = existingFullPath;
    } else {
      // Flat file
      if (existing.slug !== slug && fs.existsSync(existingFullPath)) {
        fs.unlinkSync(existingFullPath);
      }
      targetPath = path.join(POSTS_DIR, `${slug}.md`);
    }
  }

  fs.writeFileSync(targetPath, fileContent, "utf8");

  const saved = parsePostFile(targetPath, existing?.folderName);
  if (!saved) throw new Error("Failed to parse saved post");
  return saved;
}

export async function deletePost(slug: string): Promise<boolean> {
  const existingPosts = await getAllPosts(true);
  const existing = existingPosts.find((p) => p.slug === slug || p.id === slug || p.folderName === slug);
  if (!existing) return false;

  const fullPath = path.join(POSTS_DIR, existing.filePath);
  if (existing.folderName) {
    const folderPath = path.join(POSTS_DIR, existing.folderName);
    if (fs.existsSync(folderPath)) {
      fs.rmSync(folderPath, { recursive: true, force: true });
      return true;
    }
  } else if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
    return true;
  }
  return false;
}
