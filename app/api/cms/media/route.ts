import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const UPLOADS_DIR = path.resolve(/*turbopackIgnore: true*/ process.cwd(), "public/uploads");

function ensureUploadsDir() {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
}

export async function GET() {
  ensureUploadsDir();
  try {
    const files = fs.readdirSync(UPLOADS_DIR);
    const mediaList = files
      .filter((file) => !file.startsWith("."))
      .map((file) => {
        const fullPath = path.join(UPLOADS_DIR, file);
        const stat = fs.statSync(fullPath);
        return {
          id: file,
          name: file,
          url: `/uploads/${file}`,
          path: file,
          size: stat.size,
          createdAt: stat.mtimeMs,
        };
      })
      .sort((a, b) => b.createdAt - a.createdAt);

    return NextResponse.json({ files: mediaList });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  ensureUploadsDir();
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      // Also check single 'file'
      const singleFile = formData.get("file") as File;
      if (singleFile) files.push(singleFile);
    }

    if (files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const uploaded = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const filename = `${Date.now()}-${safeName}`;
      const filePath = path.join(UPLOADS_DIR, filename);

      fs.writeFileSync(filePath, buffer);

      uploaded.push({
        id: filename,
        name: file.name,
        url: `/uploads/${filename}`,
        path: filename,
        size: buffer.length,
      });
    }

    return NextResponse.json({ success: true, files: uploaded });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  ensureUploadsDir();
  try {
    const { searchParams } = new URL(request.url);
    let target = searchParams.get("path") || searchParams.get("id");

    if (!target) {
      try {
        const body = await request.json();
        target = body.path || body.id;
      } catch {
        // Body was empty
      }
    }

    if (!target) {
      return NextResponse.json({ error: "No path or id provided" }, { status: 400 });
    }

    // Sanitize filename to prevent directory traversal
    const safeFilename = path.basename(target);
    const targetFile = path.join(UPLOADS_DIR, safeFilename);

    if (fs.existsSync(targetFile)) {
      fs.unlinkSync(targetFile);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "File not found" }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
