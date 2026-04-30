import { NextRequest, NextResponse } from "next/server";
import { getCachedImage, fetchAndCacheImage } from "@/lib/image-cache";
import { serverDb } from "@/lib/server-db";

export async function GET(request: NextRequest) {
    const fileId = request.nextUrl.searchParams.get("id");

    if (!fileId) {
        return new NextResponse("Missing id parameter", { status: 400 });
    }

    // Resolve the upstream URL from the InstantDB file record.
    const data = await serverDb.query({
        $files: { $: { where: { id: fileId } } },
    });
    const file = (data.$files as Array<{ id: string; url?: string }>)?.[0];

    if (!file?.url) {
        return new NextResponse("File not found", { status: 404 });
    }

    try {
        let image = await getCachedImage(fileId);
        if (!image) {
            image = await fetchAndCacheImage(fileId, file.url as string);
        }

        return new NextResponse(image.data, {
            headers: {
                "Content-Type": image.contentType,
                "Cache-Control": "public, max-age=31536000, immutable",
            },
        });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return new NextResponse("Failed to fetch image: " + message, { status: 502 });
    }
}
