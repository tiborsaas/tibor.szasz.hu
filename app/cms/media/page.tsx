"use client";

import { useState } from "react";
import { db } from "@/lib/db";
import { AuthGuard } from "../components/AuthGuard";

function MediaManager() {
    const [uploading, setUploading] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const { isLoading, error, data } = db.useQuery({
        $files: {
            $: { order: { serverCreatedAt: "desc" } },
        },
    });

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        setUploading(true);
        try {
            for (const file of Array.from(files)) {
                const path = `blog/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
                await db.storage.uploadFile(path, file, {
                    contentType: file.type,
                });
            }
        } catch (err: any) {
            alert("Upload failed: " + (err?.message ?? "Unknown error"));
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    }

    async function handleDelete(id: string, path: string) {
        if (!confirm(`Delete "${path}"?`)) return;
        await db.transact(db.tx.$files[id].delete());
    }

    function handleCopy(url: string, id: string) {
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    }

    const images = data?.$files ?? [];

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Media Library</h1>
                <label className="cursor-pointer bg-black text-white px-4 py-2 rounded font-medium text-sm hover:bg-gray-800 transition-colors">
                    {uploading ? "Uploading…" : "+ Upload images"}
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleUpload}
                        disabled={uploading}
                        className="hidden"
                    />
                </label>
            </div>

            {isLoading && <p className="text-gray-400">Loading…</p>}
            {error && <p className="text-red-500">Error: {error.message}</p>}

            {!isLoading && images.length === 0 && (
                <div className="text-center py-24 text-gray-400">
                    <p>No images uploaded yet.</p>
                </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {images.map((img) => (
                    <div
                        key={img.id}
                        className="group relative border border-gray-200 rounded-lg overflow-hidden bg-white"
                    >
                        {img.url && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={img.url}
                                alt={img.path}
                                className="w-full h-32 object-cover"
                            />
                        )}
                        <div className="p-2">
                            <p className="text-xs text-gray-500 truncate" title={img.path}>
                                {img.path.replace(/^blog\/\d+-/, "")}
                            </p>
                        </div>
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                            <button
                                onClick={() => img.url && handleCopy(img.url, img.id)}
                                className="bg-white text-black text-xs px-2 py-1 rounded font-medium hover:bg-gray-100"
                            >
                                {copiedId === img.id ? "Copied!" : "Copy URL"}
                            </button>
                            <button
                                onClick={() => handleDelete(img.id, img.path)}
                                className="bg-red-500 text-white text-xs px-2 py-1 rounded font-medium hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function MediaPage() {
    return (
        <AuthGuard>
            <MediaManager />
        </AuthGuard>
    );
}
