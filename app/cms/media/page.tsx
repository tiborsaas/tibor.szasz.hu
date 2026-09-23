"use client";

import { useState, useEffect } from "react";

interface MediaItem {
  id: string;
  name: string;
  url: string;
  path: string;
  size: number;
}

export default function MediaPage() {
  const [images, setImages] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadMedia() {
    setLoading(true);
    try {
      const res = await fetch("/api/cms/media");
      const data = await res.json();
      if (data.files) {
        setImages(data.files);
      } else {
        setError(data.error || "Failed to load media");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load media");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMedia();
  }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const formData = new FormData();
      for (const file of Array.from(files)) {
        formData.append("files", file);
      }

      const res = await fetch("/api/cms/media", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        loadMedia();
      } else {
        alert("Upload failed: " + (data.error || "Unknown error"));
      }
    } catch (err: any) {
      alert("Upload failed: " + (err?.message ?? "Unknown error"));
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      const res = await fetch(`/api/cms/media?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setImages((prev) => prev.filter((img) => img.id !== id));
      } else {
        alert("Delete failed: " + (data.error || "Unknown error"));
      }
    } catch (err: any) {
      alert("Delete failed: " + err.message);
    }
  }

  function handleCopy(url: string, id: string) {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="max-w-6xl mx-auto">
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

      {loading && <p className="text-gray-400">Loading…</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && images.length === 0 && (
        <div className="text-center py-24 text-gray-400 bg-white border border-gray-200 rounded-lg">
          <p>No images uploaded yet.</p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {images.map((img) => (
          <div
            key={img.id}
            className="group relative border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.url}
              alt={img.name}
              className="w-full h-32 object-cover bg-gray-50"
            />
            <div className="p-2">
              <p className="text-xs text-gray-600 truncate font-mono" title={img.name}>
                {img.name}
              </p>
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
              <button
                onClick={() => handleCopy(img.url, img.id)}
                className="bg-white text-black text-xs px-2.5 py-1 rounded font-medium hover:bg-gray-100 transition-colors"
              >
                {copiedId === img.id ? "Copied!" : "Copy URL"}
              </button>
              <button
                onClick={() => handleDelete(img.id, img.name)}
                className="bg-red-500 text-white text-xs px-2.5 py-1 rounded font-medium hover:bg-red-600 transition-colors"
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
