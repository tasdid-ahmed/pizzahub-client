"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, Menu, Settings, X } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/shared/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { ROLES, dashboardPathFor, type Role } from "@/lib/constants";
import { cn } from "@/lib/utils";

export type NavUser = { name: string; email: string; image: string | null; role: Role };

const ROLE_LINKS: Record<Role, { href: string; label: string }> = {
  customer: { href: "/dashboard/customer/orders", label: "My Orders" },
  vendor: { href: "/dashboard/vendor/menu-items", label: "My Menu" },
  admin: { href: "/dashboard/admin/users", label: "Manage Users" },
};

function toNavUser(user: { name: string; email: string; image?: string | null; role?: unknown }): NavUser {
  return {
    name: user.name,
    email: user.email,
    image: user.image ?? null,
    role: ROLES.find((role) => role === user.role) ?? "customer",
  };
}

export function Navbar({ initialUser }: { initialUser: NavUser | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { data, isPending } = authClient.useSession();

  // The server-rendered user avoids a flash on first load; after that the live session wins,
  // so the navbar updates instantly on sign-in and sign-out.
  const user: NavUser | null = isPending ? initialUser : data ? toNavUser(data.user) : null;

  const links = [
    { href: "/", label: "Home" },
    { href: "/menu", label: "Browse Menu" },
    ...(user ? [ROLE_LINKS[user.role]] : []),
  ];

  const linkClass = (href: string) =>
    cn(
      "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
      (href === "/" ? pathname === "/" : pathname.startsWith(href)) && "bg-accent text-primary",
    );

  async function handleSignOut() {
    setOpen(false);
    await authClient.signOut();
    toast.success("Signed out successfully");
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" aria-label="PizzaHub home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass(link.href)}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button type="button" className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">
                  <Avatar className="size-9 border-2 border-[color:var(--hard)]">
                    {user.image && <AvatarImage src={user.image} alt={user.name} />}
                    <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="hidden max-w-32 truncate text-sm font-medium lg:inline">{user.name}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <p className="truncate font-semibold">{user.name}</p>
                  <p className="truncate text-xs font-normal text-muted-foreground">{user.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={dashboardPathFor(user.role)}>
                    <LayoutDashboard /> Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`${dashboardPathFor(user.role)}/profile`}>
                    <Settings /> Profile Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={handleSignOut}>
                  <LogOut /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button asChild variant="outline" size="sm">
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X /> : <Menu />}
        </Button>
      </div>

      {open && (
        <div className="border-t bg-background px-4 pb-4 pt-2 md:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {links.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className={linkClass(link.href)}>
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link href={dashboardPathFor(user.role)} onClick={() => setOpen(false)} className={linkClass("/dashboard")}>
                  Dashboard
                </Link>
                <Link href={`${dashboardPathFor(user.role)}/profile`} onClick={() => setOpen(false)} className={linkClass("/profile")}>
                  Profile Settings
                </Link>
                <button type="button" onClick={handleSignOut} className="rounded-md px-3 py-2 text-left text-sm font-medium hover:bg-accent">
                  Logout
                </button>
              </>
            ) : (
              <div className="mt-2 flex gap-2">
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/sign-in" onClick={() => setOpen(false)}>Sign In</Link>
                </Button>
                <Button asChild className="flex-1">
                  <Link href="/sign-up" onClick={() => setOpen(false)}>Sign Up</Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}