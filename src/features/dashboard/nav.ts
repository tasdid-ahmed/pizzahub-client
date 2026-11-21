import {
  ClipboardList,
  Crown,
  LayoutDashboard,
  PlusCircle,
  ReceiptText,
  Settings,
  ShoppingBag,
  Users,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import type { Role } from "@/lib/constants";

export type NavItem = { href: string; label: string; icon: LucideIcon; exact?: boolean };

export const DASHBOARD_NAV: Record<Role, NavItem[]> = {
  vendor: [
    { href: "/dashboard/vendor", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/vendor/menu-items", label: "My Menu Items", icon: UtensilsCrossed, exact: true },
    { href: "/dashboard/vendor/menu-items/new", label: "Add Menu Item", icon: PlusCircle },
    { href: "/dashboard/vendor/orders", label: "Customer Orders", icon: ClipboardList },
    { href: "/dashboard/vendor/subscription", label: "Subscription", icon: Crown },
    { href: "/dashboard/vendor/profile", label: "Profile Settings", icon: Settings },
  ],
  customer: [
    { href: "/dashboard/customer", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/customer/orders", label: "My Orders", icon: ShoppingBag },
    { href: "/dashboard/customer/profile", label: "Profile Settings", icon: Settings },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/admin/users", label: "Manage Users", icon: Users },
    { href: "/dashboard/admin/menu-items", label: "Manage Menu Items", icon: UtensilsCrossed },
    { href: "/dashboard/admin/transactions", label: "Transactions", icon: ReceiptText },
    { href: "/dashboard/admin/profile", label: "Profile Settings", icon: Settings },
  ],
};