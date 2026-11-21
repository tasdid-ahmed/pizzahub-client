import { requireRole } from "@/lib/session";

export default async function AdminOverviewPage() {
  const user = await requireRole("admin");
  return (
    <div className="p-8">
      <h1 className="text-3xl font-black">Admin dashboard</h1>
      <p className="mt-2 text-muted-foreground">Welcome, {user.name}. The full dashboard arrives in later phases.</p>
    </div>
  );
}