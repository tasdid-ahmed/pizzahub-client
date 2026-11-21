import { requireRole } from "@/lib/session";

export default async function CustomerOverviewPage() {
  const user = await requireRole("customer");
  return (
    <div className="p-8">
      <h1 className="text-3xl font-black">Customer dashboard</h1>
      <p className="mt-2 text-muted-foreground">Welcome, {user.name}. The full dashboard arrives in later phases.</p>
    </div>
  );
}