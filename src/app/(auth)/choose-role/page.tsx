import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthCard } from "@/features/auth/auth-card";
import { RoleChoiceForm } from "@/features/auth/role-choice-form";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = { title: "Choose your account type" };

export default async function ChooseRolePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");
  if (user.isBlocked) redirect("/blocked");
  if (user.roleSelected) redirect("/dashboard");

  return (
    <AuthCard
      title={`Welcome, ${user.name.split(" ")[0]}!`}
      description="Tell us how you'll use PizzaHub. This can't be changed later."
    >
      <RoleChoiceForm />
    </AuthCard>
  );
}