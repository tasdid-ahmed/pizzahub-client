import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthCard } from "@/features/auth/auth-card";
import { SignInForm } from "@/features/auth/sign-in-form";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = { title: "Sign in" };

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ callbackUrl?: string }> }) {
  if (await getCurrentUser()) redirect("/dashboard");
  const { callbackUrl } = await searchParams;

  return (
    <AuthCard title="Welcome back" description="Sign in to order pizza or manage your restaurant.">
      <SignInForm callbackUrl={callbackUrl} />
    </AuthCard>
  );
}