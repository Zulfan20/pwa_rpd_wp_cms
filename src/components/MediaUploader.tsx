"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type Props = {
  onUpload: (url: string) => void;
  accept?: string;
  folder?: string;
  bucketName?: string;
  initialUrl?: string;
};

export default function MediaUploader({
  onUpload,
  accept = "image/*",
  folder = "program-banners",
  bucketName,
  initialUrl,
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | undefined>(initialUrl);
  const resolvedBucket = bucketName || process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "cms-images";

  const handleFile = async (file: File | null) => {
    if (!file) return;
    setUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const fileName = `${Date.now()}-${safeName}${fileExt ? "" : ".bin"}`;
      const objectPath = `${folder}/${fileName}`;

      const { data, error } = await supabase.storage.from(resolvedBucket).upload(objectPath, file, {
        cacheControl: "3600",
        upsert: true,
      });

      if (error) throw error;

      const { data: publicData } = supabase.storage.from(resolvedBucket).getPublicUrl(data.path);
      const publicUrl = publicData.publicUrl;
      if (!publicUrl) {
        throw new Error("Failed to build public URL for uploaded image.");
      }

      setPreview(publicUrl);
      onUpload(publicUrl);
    } catch (e: unknown) {
      console.error("Upload error", e);
      const message = e instanceof Error ? e.message : "Unknown upload error";

      if (message.toLowerCase().includes("bucket not found")) {
        alert(
          `Upload failed: bucket "${resolvedBucket}" was not found. Create this bucket in Supabase Storage, or set NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET to an existing bucket.`
        );
      } else if (message.toLowerCase().includes("row-level security") || message.toLowerCase().includes("new row violates")) {
        alert(
          `Upload blocked by Storage RLS. Run supabase/cms_admin_access_setup.sql in Supabase SQL Editor, and confirm your user exists in public.admin_users with is_active=true.`
        );
      } else {
        alert(`Upload failed: ${message}`);
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <input
          type="file"
          accept={accept}
          onChange={(e) => handleFile(e.target.files ? e.target.files[0] : null)}
          className="text-white/60"
        />
        <span className="text-xs text-white/60">{uploading ? "Uploading..." : "Select an image to upload"}</span>
      </div>
      <p className="text-xs text-white/40">Bucket: {resolvedBucket}</p>

      {preview && (
        <div className="w-40 h-40 bg-white/5 rounded-md overflow-hidden">
          <img src={preview} alt="preview" className="w-full h-full object-cover" />
        </div>
      )}
    </div>
  );
}
