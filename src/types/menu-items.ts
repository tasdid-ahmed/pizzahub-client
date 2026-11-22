import type { MenuCategory } from "@/lib/constants";

export type ItemStatus = "pending" | "approved" | "rejected" | "inactive";

export interface MenuItem {
  id: string;
  vendorId: string;
  itemName: string;
  category: MenuCategory;
  description: string;
  price: number;
  location: string;
  images: string[];
  status: ItemStatus;
  createdAt: string;
  updatedAt: string;
}

export interface MenuItemInput {
  itemName: string;
  category: MenuCategory;
  description: string;
  price: number;
  location: string;
  images: string[];
}

export interface PublicMenuItem {
  id: string;
  itemName: string;
  category: MenuCategory;
  description: string;
  price: number;
  location: string;
  images: string[];
  status: ItemStatus;
  createdAt: string;
  vendor: { id: string; name: string; image: string | null; isPremium: boolean };
}

export interface PageMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}