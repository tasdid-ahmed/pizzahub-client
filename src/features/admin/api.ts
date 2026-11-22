import { apiFetch } from "@/lib/api";
import type { AdminItem, AdminOverview, AdminUser, AdminUserDetails } from "@/types/admin";

type Envelope<T> = { success: boolean; message?: string; data: T };

export const adminApi = {
  overview: () => apiFetch<Envelope<AdminOverview>>("/admin/overview"),
  user: (id: string) => apiFetch<Envelope<AdminUserDetails>>(`/admin/users/${id}`),
  blockUser: (id: string, blocked: boolean) =>
    apiFetch<Envelope<AdminUser>>(`/admin/users/${id}/block`, { method: "PATCH", body: JSON.stringify({ blocked }) }),
  setItemStatus: (id: string, status: "approved" | "rejected" | "inactive") =>
    apiFetch<Envelope<AdminItem>>(`/admin/menu-items/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
  deleteItem: (id: string) => apiFetch<Envelope<null>>(`/admin/menu-items/${id}`, { method: "DELETE" }),
};