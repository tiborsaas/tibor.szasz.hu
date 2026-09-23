"use client";

import { useState, useEffect } from "react";

interface ImageItem {
  id: string;
  name: string;
  url: string;
  path: string;
}

interface ImagePickerProps {
  value?: string;
  onChange: (url: string) => void;
}

export function ImagePicker({ value, onChange }: ImagePickerProps) {
  const [uploading, setUploading] = useState(false);
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);

  async function loadLibrary() {
    setLoadingImages(true);
    try {
      const res = await fetch("/api/cms/media");
      const data = await res.json();
      if (data.files) {
        setImages(data.files);
      }
    } catch (err) {
      console.error("Failed to load media:", err);
    } finally {
      setLoadingImages(false);
    }
  }

  useEffect(() => {
    if (open) {
      loadLibrary();
    }
  }, [open]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/cms/media", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.files && data.files[0]) {
        const uploaded = data.files[0];
        onChange(uploaded.url);
        setOpen(false);
        loadLibrary();
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

  return (
    <div className="flex flex-col gap-2">
      {value && (
        <div className="relative w-48 h-28 rounded overflow-hidden border border-gray-200 bg-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Cover preview"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-1 right-1 bg-black bg-opacity-60 text-white text-xs rounded px-1.5 py-0.5 hover:bg-opacity-90"
          >
            Remove
          </button>
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="text-sm px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
        >
          {open ? "Close picker" : "Pick from library"}
        </button>
        <label className="text-sm px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-100 transition-colors cursor-pointer">
          {uploading ? "Uploading…" : "Upload new"}
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {open && (
        <div className="border border-gray-200 rounded-lg bg-white p-3 mt-1">
          {loadingImages ? (
            <p className="text-sm text-gray-400">Loading library…</p>
          ) : images.length === 0 ? (
            <p className="text-sm text-gray-400">No images in library yet. Upload one above.</p>
          ) : (
            <div className="grid grid-cols-4 gap-2 max-h-60 overflow-y-auto">
              {images.map((img) => (
                <button
                  type="button"
                  key={img.id}
                  onClick={() => {
                    onChange(img.url);
                    setOpen(false);
                  }}
                  className={`relative rounded overflow-hidden border-2 transition-all ${
                    value === img.url
                      ? "border-black"
                      : "border-transparent hover:border-gray-400"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt={img.name}
                    className="w-full h-16 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
