import type { MenuCategory } from "@/lib/constants";
import type { ItemStatus } from "@/types/menu-items";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: "customer" | "vendor" | "admin";
  isBlocked: boolean;
  businessName: string | null;
  subscriptionPlan: "free" | "premium";
  subscriptionExpiresAt: string | null;
  createdAt: string | null;
}

export interface AdminUserDetails extends AdminUser {
  stats: Record<string, number>;
}

export interface AdminItem {
  id: string;
  itemName: string;
  category: MenuCategory;
  description: string;
  price: number;
  location: string;
  images: string[];
  status: ItemStatus;
  createdAt: string;
  updatedAt: string;
  vendor: { id: string; name: string; email: string };
}

export interface AdminTransaction {
  id: string;
  vendor: { id: string; name: string; email: string };
  plan: string;
  amount: number;
  currency: string;
  status: string;
  stripeSessionId: string | null;
  createdAt: string;
}

export interface AdminOverview {
  totalUsers: number;
  totalVendors: number;
  totalCustomers: number;
  totalMenuItems: number;
  pendingMenuItems: number;
  totalTransactions: number;
  itemsByStatus: Record<string, number>;
}