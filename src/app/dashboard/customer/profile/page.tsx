import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { ProfileSettings } from "@/features/profile/profile-settings";
import { requireRole } from "@/lib/session";

export const metadata: Metadata = { title: "Profile Settings" };

export default async function CustomerProfilePage() {
  await requireRole("customer");
  return (
    <>
      <PageHeader title="Profile Settings" description="Update your name and photo." />
      <ProfileSettings />
    </>
  );
}