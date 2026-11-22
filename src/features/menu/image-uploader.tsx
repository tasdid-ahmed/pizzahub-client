"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { MAX_IMAGE_MB, MAX_IMAGES } from "@/lib/constants";
import { uploadImage } from "./api";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function ImageUploader({
  value,
  onChange,
  disabled,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (files.length === 0) return;

    const room = Math.max(MAX_IMAGES - value.length, 0);
    if (files.length > room) toast.error(`You can add ${room} more image${room === 1 ? "" : "s"}`);

    setUploading(true);
    const uploaded: string[] = [];
    for (const file of files.slice(0, room)) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        toast.error(`${file.name}: only JPG, PNG or WebP images are allowed`);
        continue;
      }
      if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
        toast.error(`${file.name} is larger than ${MAX_IMAGE_MB} MB`);
        continue;
      }
      try {
        uploaded.push(await uploadImage(file));
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Image upload failed");
      }
    }
    setUploading(false);
    if (uploaded.length > 0) onChange([...value, ...uploaded]);
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {value.map((url, index) => (
          <div
            key={url}
            className="relative aspect-[4/3] overflow-hidden rounded-lg border-2 border-[color:var(--hard)] bg-muted"
          >
            <Image src={url} alt={`Menu item image ${index + 1}`} fill sizes="160px" className="object-cover" />
            {index === 0 && (
              <span className="absolute left-1 top-1 rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
                Cover
              </span>
            )}
            <button
              type="button"
              aria-label="Remove image"
              disabled={disabled || uploading}
              onClick={() => onChange(value.filter((item) => item !== url))}
              className="absolute right-1 top-1 flex size-6 items-center justify-center rounded-full bg-background/90 text-foreground shadow hover:bg-background"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ))}
        {value.length < MAX_IMAGES && (
          <button
            type="button"
            disabled={disabled || uploading}
            onClick={() => inputRef.current?.click()}
            className="flex aspect-[4/3] flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-border text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-60"
          >
            {uploading ? <Loader2 className="size-5 animate-spin" /> : <ImagePlus className="size-5" />}
            {uploading ? "Uploading..." : "Add image"}
          </button>
        )}
      </div>
      <input ref={inputRef} type="file" accept={ACCEPTED_TYPES.join(",")} multiple className="sr-only" onChange={handleFiles} />
      <p className="text-xs text-muted-foreground">
        Up to {MAX_IMAGES} images, JPG, PNG or WebP, {MAX_IMAGE_MB} MB each. The first image is the cover.
      </p>
    </div>
  );
}