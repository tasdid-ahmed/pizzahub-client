"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Globe, LogOut, Menu, X } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/shared/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DASHBOARD_NAV, type NavItem } from "@/features/dashboard/nav";
import { authClient } from "@/lib/auth-client";
import type { Role } from "@/lib/constants";
import { cn } from "@/lib/utils";

type ShellUser = { name: string; email: string; image: string | null; role: Role };

export function DashboardShell({ user, children }: { user: ShellUser; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const items = DASHBOARD_NAV[user.role];

  const isActive = (item: NavItem) => (item.exact ? pathname === item.href : pathname.startsWith(item.href));

  async function handleSignOut() {
    await authClient.signOut();
    toast.success("Signed out successfully");
    router.push("/");
    router.refresh();
  }

  const sidebar = (
    <div className="flex h-full flex-col gap-6 p-4">
      <Link href="/" aria-label="PizzaHub home" className="px-2 pt-2">
        <Logo />
      </Link>

      <nav className="flex flex-1 flex-col gap-1" aria-label="Dashboard">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              isActive(item)
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            )}
          >
            <item.icon className="size-4" aria-hidden />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="space-y-3 border-t border-sidebar-border pt-4">
        <div className="flex items-center gap-3 px-2">
          <Avatar className="size-9">
            {user.image && <AvatarImage src={user.image} alt={user.name} />}
            <AvatarFallback className="text-foreground">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{user.name}</p>
            <p className="text-xs capitalize text-sidebar-foreground/70">{user.role}</p>
          </div>
        </div>
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-sidebar-accent"
          onClick={() => setOpen(false)}
        >
          <Globe className="size-4" aria-hidden /> Back to website
        </Link>
        <button
          type="button"
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-sidebar-accent"
        >
          <LogOut className="size-4" aria-hidden /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[17rem_minmax(0,1fr)]">
      <aside className="sticky top-0 hidden h-screen bg-sidebar text-sidebar-foreground lg:block">{sidebar}</aside>

      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background/95 px-4 backdrop-blur lg:hidden">
        <Link href="/" aria-label="PizzaHub home">
          <Logo />
        </Link>
        <Button variant="ghost" size="icon" aria-label="Open menu" onClick={() => setOpen(true)}>
          <Menu />
        </Button>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" aria-label="Close menu" className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-sidebar text-sidebar-foreground shadow-xl">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Close menu"
              className="absolute right-2 top-2 text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={() => setOpen(false)}
            >
              <X />
            </Button>
            {sidebar}
          </aside>
        </div>
      )}

      <main className="min-w-0 p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}