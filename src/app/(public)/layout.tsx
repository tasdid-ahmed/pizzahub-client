import { Navbar } from "@/components/layout/navbar";
import { getCurrentUser } from "@/lib/session";
import { Footer } from "@/components/layout/footer";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar
        initialUser={user ? { name: user.name, email: user.email, image: user.image, role: user.role } : null}
      />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}