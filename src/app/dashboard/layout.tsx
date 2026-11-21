import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requireUser } from "@/lib/session";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  return (
    <DashboardShell user={{ name: user.name, email: user.email, image: user.image, role: user.role }}>
      {children}
    </DashboardShell>
  );
}