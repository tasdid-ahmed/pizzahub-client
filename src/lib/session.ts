import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";
import { ROLES, dashboardPathFor, type Role } from "./constants";

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: Role;
  roleSelected: boolean;
  isBlocked: boolean;
};

/** Read once per request (React cache), straight from Better Auth + the database. */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const user = session.user as typeof session.user & {
    role?: string | null;
    roleSelected?: boolean | null;
    isBlocked?: boolean | null;
  };

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image ?? null,
    role: ROLES.find((role) => role === user.role) ?? "customer",
    roleSelected: user.roleSelected === true,
    isBlocked: user.isBlocked === true,
  };
});

/** Logged in, not blocked, role chosen. Otherwise redirects. */
export async function requireUser(callbackUrl?: string): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect(callbackUrl ? `/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/sign-in");
  }
  if (user.isBlocked) redirect("/blocked");
  if (!user.roleSelected) redirect("/choose-role");
  return user;
}

export async function requireRole(role: Role): Promise<CurrentUser> {
  const user = await requireUser();
  if (user.role !== role) redirect(dashboardPathFor(user.role));
  return user;
}