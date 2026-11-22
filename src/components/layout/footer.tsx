import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { Logo } from "@/components/shared/logo";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Browse Menu" },
  { href: "/sign-in", label: "Sign In" },
  { href: "/sign-up", label: "Sign Up" },
];

const SOCIAL = [
  { label: "X", href: "https://x.com", icon: FaXTwitter },
  { label: "Facebook", href: "https://facebook.com", icon: FaFacebookF },
  { label: "Instagram", href: "https://instagram.com", icon: FaInstagram },
  { label: "LinkedIn", href: "https://linkedin.com", icon: FaLinkedinIn },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t-2 border-[color:var(--hard)] bg-sidebar text-sidebar-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm text-sidebar-foreground/80">
            PizzaHub connects you with local pizza shops. Browse menus, order in a few taps and get hot, fresh pizza
            delivered to your door.
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="mb-3 text-lg font-bold">Explore</h2>
          <ul className="space-y-2 text-sm">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sidebar-foreground/80 hover:text-sidebar-foreground hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="mb-3 text-lg font-bold">Contact</h2>
          <ul className="space-y-2 text-sm text-sidebar-foreground/80">
            <li className="flex items-center gap-2"><Mail className="size-4" aria-hidden /> support@pizzahub.example</li>
            <li className="flex items-center gap-2"><Phone className="size-4" aria-hidden /> +880 1700-000000</li>
            <li className="flex items-center gap-2"><MapPin className="size-4" aria-hidden /> House 12, Road 5, Banani, Dhaka</li>
          </ul>
          <div className="mt-5 flex gap-3">
            {SOCIAL.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`PizzaHub on ${label}`}
                className="flex size-9 items-center justify-center rounded-full border border-sidebar-border transition-colors hover:bg-sidebar-primary"
              >
                <Icon className="size-4" aria-hidden />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-sidebar-border py-4 text-center text-xs text-sidebar-foreground/70">
        © {new Date().getFullYear()} PizzaHub. All rights reserved.
      </div>
    </footer>
  );
}