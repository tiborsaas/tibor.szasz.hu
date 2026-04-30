import fs from "fs";
import path from "path";
import crypto from "crypto";

const CACHE_DIR = "/tmp/image-cache";
const INDEX_FILE = path.join(CACHE_DIR, "index.json");

const ALLOWED_HOST = "instant-storage.s3.us-east-2.amazonaws.com";

type CacheEntry = { hash: string; contentType: string };
type CacheIndex = Record<string, CacheEntry>;

function ensureCacheDir(): void {
    if (!fs.existsSync(CACHE_DIR)) {
        fs.mkdirSync(CACHE_DIR, { recursive: true });
    }
}

function readIndex(): CacheIndex {
    try {
        return JSON.parse(fs.readFileSync(INDEX_FILE, "utf-8")) as CacheIndex;
    } catch {
        return {};
    }
}

function writeIndex(index: CacheIndex): void {
    fs.writeFileSync(INDEX_FILE, JSON.stringify(index));
}

/** Returns true if the URL is a permitted InstantDB storage URL. */
export function isAllowedImageUrl(url: string): boolean {
    try {
        const parsed = new URL(url);
        return parsed.protocol === "https:" && parsed.hostname === ALLOWED_HOST;
    } catch {
        return false;
    }
}

/** Returns the proxy URL for a given image URL, to be used in <img src>. */
export function cachedImageUrl(url: string): string {
    return `/api/image?url=${encodeURIComponent(url)}`;
}

/**
 * Returns the cached image data for the given URL, or null on a cache miss.
 * Removes stale index entries where the cached file has been deleted.
 */
export async function getCachedImage(
    url: string
): Promise<{ data: Buffer; contentType: string } | null> {
    ensureCacheDir();
    const index = readIndex();
    const entry = index[url];
    if (entry) {
        const filePath = path.join(CACHE_DIR, entry.hash);
        if (fs.existsSync(filePath)) {
            return { data: fs.readFileSync(filePath), contentType: entry.contentType };
        }
        // Stale entry — file was cleared from /tmp; remove it and re-fetch below.
        delete index[url];
        writeIndex(index);
    }
    return null;
}

/**
 * Downloads the image, stores it on disk keyed by its SHA-256 content hash,
 * updates the URL→hash index, and returns the image data.
 */
export async function fetchAndCacheImage(
    url: string
): Promise<{ data: Buffer; contentType: string }> {
    ensureCacheDir();

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Upstream fetch failed: ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type") ?? "image/jpeg";
    const arrayBuffer = await response.arrayBuffer();
    const data = Buffer.from(arrayBuffer);

    const hash = crypto.createHash("sha256").update(data).digest("hex");
    const filePath = path.join(CACHE_DIR, hash);

    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, data);
    }

    const index = readIndex();
    index[url] = { hash, contentType };
    writeIndex(index);

    return { data, contentType };
}
