import { redirect } from "next/navigation";
import { dashboardPathFor } from "@/lib/constants";
import { requireUser } from "@/lib/session";

export default async function DashboardIndexPage() {
  const user = await requireUser("/dashboard");
  redirect(dashboardPathFor(user.role));
}