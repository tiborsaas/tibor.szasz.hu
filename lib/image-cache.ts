import fs from "fs";
import path from "path";
import crypto from "crypto";

const CACHE_DIR = "/tmp/image-cache";
const INDEX_FILE = path.join(CACHE_DIR, "index.json");

type CacheEntry = { hash: string; contentType: string };
/** Maps InstantDB file ID → cached content hash + content-type. */
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

/** Returns the proxy URL for a given InstantDB file ID, for use in <img src>. */
export function cachedImageUrl(fileId: string): string {
    return `/api/image?id=${encodeURIComponent(fileId)}`;
}

/**
 * Returns cached image data for the given InstantDB file ID, or null on miss.
 * Removes stale index entries whose cached file has been evicted from /tmp.
 */
export async function getCachedImage(
    fileId: string
): Promise<{ data: Buffer; contentType: string } | null> {
    ensureCacheDir();
    const index = readIndex();
    const entry = index[fileId];
    if (entry) {
        const filePath = path.join(CACHE_DIR, entry.hash);
        if (fs.existsSync(filePath)) {
            return { data: fs.readFileSync(filePath), contentType: entry.contentType };
        }
        // Stale entry — file was cleared from /tmp; remove it so we re-fetch below.
        delete index[fileId];
        writeIndex(index);
    }
    return null;
}

/**
 * Downloads the image from the given upstream URL, stores it on disk keyed by
 * its SHA-256 content hash, records the file ID → hash mapping in the index,
 * and returns the image data.
 */
export async function fetchAndCacheImage(
    fileId: string,
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
        // Use 'wx' flag to avoid overwriting if another request races to write the same file.
        try {
            fs.writeFileSync(filePath, data, { flag: "wx" });
        } catch (err: unknown) {
            // EEXIST means another concurrent request already wrote it — that's fine.
            if ((err as NodeJS.ErrnoException).code !== "EEXIST") throw err;
        }
    }

    const index = readIndex();
    index[fileId] = { hash, contentType };
    writeIndex(index);

    return { data, contentType };
}
