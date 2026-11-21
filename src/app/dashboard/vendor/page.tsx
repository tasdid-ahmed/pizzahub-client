import { requireRole } from "@/lib/session";

export default async function VendorOverviewPage() {
  const user = await requireRole("vendor");
  return (
    <div className="p-8">
      <h1 className="text-3xl font-black">Vendor dashboard</h1>
      <p className="mt-2 text-muted-foreground">Welcome, {user.name}. The full dashboard arrives in later phases.</p>
    </div>
  );
}