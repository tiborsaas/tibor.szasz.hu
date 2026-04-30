import { NextRequest, NextResponse } from "next/server";
import { isAllowedImageUrl, getCachedImage, fetchAndCacheImage } from "@/lib/image-cache";

export async function GET(request: NextRequest) {
    const url = request.nextUrl.searchParams.get("url");

    if (!url) {
        return new NextResponse("Missing url parameter", { status: 400 });
    }

    if (!isAllowedImageUrl(url)) {
        return new NextResponse("Invalid image URL", { status: 400 });
    }

    try {
        let image = await getCachedImage(url);
        if (!image) {
            image = await fetchAndCacheImage(url);
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
