"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { uploadImage } from "@/features/menu/api";
import { apiFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { MAX_IMAGE_MB, type Role } from "@/lib/constants";
import { profileFormSchema, type ProfileFormValues } from "@/lib/validations/profile";

interface Profile {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: Role;
  businessName: string | null;
}

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

function ProfileFormInner({ profile }: { profile: Profile }) {
  const router = useRouter();
  const { refetch } = authClient.useSession();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: { name: profile.name, businessName: profile.businessName ?? "", image: profile.image ?? "" },
  });
  const image = watch("image");
  const name = watch("name");

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Only JPG, PNG or WebP images are allowed");
      return;
    }
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      toast.error(`Image must be ${MAX_IMAGE_MB} MB or smaller`);
      return;
    }
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setValue("image", url, { shouldDirty: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Image upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(values: ProfileFormValues) {
    const body: Record<string, string> = { name: values.name, image: values.image };
    if (profile.role === "vendor") body.businessName = values.businessName;
    try {
      await apiFetch("/me", { method: "PATCH", body: JSON.stringify(body) });
      toast.success("Profile updated");
      reset(values);
      await refetch(); // refresh the navbar's client-side session
      router.refresh(); // refresh server-rendered layouts (sidebar, navbar)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update your profile");
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="max-w-2xl space-y-6 rounded-xl border-2 border-[color:var(--hard)] bg-card p-6 shadow-[4px_4px_0_0_var(--hard)] sm:p-8"
    >
      <div className="flex flex-wrap items-center gap-5">
        <Avatar className="size-20 border-2 border-[color:var(--hard)]">
          {image && <AvatarImage src={image} alt={name} />}
          <AvatarFallback className="text-2xl">{(name || profile.name).charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" disabled={uploading || isSubmitting} onClick={() => fileRef.current?.click()}>
              {uploading ? <Loader2 className="animate-spin" /> : <Camera />}
              {uploading ? "Uploading..." : "Change photo"}
            </Button>
            {image && (
              <Button type="button" variant="ghost" size="sm" disabled={uploading || isSubmitting} onClick={() => setValue("image", "", { shouldDirty: true })}>
                <Trash2 /> Remove
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">JPG, PNG or WebP, up to {MAX_IMAGE_MB} MB. Optional.</p>
        </div>
        <input ref={fileRef} type="file" accept={ACCEPTED_TYPES.join(",")} className="sr-only" onChange={handleFile} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Full name</Label>
        <Input id="name" autoComplete="name" {...register("name")} />
        {errors.name && <p role="alert" className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      {profile.role === "vendor" && (
        <div className="space-y-2">
          <Label htmlFor="businessName">Restaurant / business name</Label>
          <Input id="businessName" placeholder="e.g. Slice & Co. Banani" {...register("businessName")} />
          <p className="text-xs text-muted-foreground">Shown to customers on your menu items.</p>
          {errors.businessName && <p role="alert" className="text-sm text-destructive">{errors.businessName.message}</p>}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={profile.email} readOnly disabled />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Account role</Label>
          <Input id="role" value={profile.role} readOnly disabled className="capitalize" />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">Your email and account role can&apos;t be changed here.</p>

      <Button type="submit" disabled={isSubmitting || uploading || !isDirty}>
        {isSubmitting && <Loader2 className="animate-spin" />}
        Save changes
      </Button>
    </form>
  );
}

export function ProfileSettings() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let current = true;
    apiFetch<{ data: Profile }>("/me/profile")
      .then((response) => {
        if (current) setProfile(response.data);
      })
      .catch((err) => {
        if (current) setError(err instanceof Error ? err.message : "Could not load your profile");
      });
    return () => {
      current = false;
    };
  }, []);

  if (error) return <p className="max-w-2xl rounded-xl border-2 border-border bg-card p-8 text-center">{error}</p>;
  if (!profile) {
    return (
      <div className="max-w-2xl space-y-4 rounded-xl border-2 border-border bg-card p-8">
        <Skeleton className="size-20 rounded-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }
  return <ProfileFormInner profile={profile} />;
}