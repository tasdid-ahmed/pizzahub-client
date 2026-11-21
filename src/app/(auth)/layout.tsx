import Link from "next/link";
import { Logo } from "@/components/shared/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="gingham flex min-h-screen flex-col items-center px-4 py-8">
      <Link href="/" aria-label="PizzaHub home" className="mb-8">
        <Logo />
      </Link>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}