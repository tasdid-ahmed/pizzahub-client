import { apiFetch } from "@/lib/api";
import type { MenuItem, MenuItemInput } from "@/types/menu-items";

export type Envelope<T> = { success: boolean; message?: string; data: T };

const json = (body: unknown) => JSON.stringify(body);

export const vendorItemsApi = {
  list: () => apiFetch<Envelope<MenuItem[]>>("/vendor/menu-items"),
  get: (id: string) => apiFetch<Envelope<MenuItem>>(`/vendor/menu-items/${id}`),
  create: (body: MenuItemInput) =>
    apiFetch<Envelope<MenuItem>>("/vendor/menu-items", { method: "POST", body: json(body) }),
  update: (id: string, body: Partial<MenuItemInput>) =>
    apiFetch<Envelope<MenuItem>>(`/vendor/menu-items/${id}`, { method: "PATCH", body: json(body) }),
  setAvailability: (id: string, available: boolean) =>
    apiFetch<Envelope<MenuItem>>(`/vendor/menu-items/${id}/availability`, { method: "PATCH", body: json({ available }) }),
  remove: (id: string) => apiFetch<Envelope<null>>(`/vendor/menu-items/${id}`, { method: "DELETE" }),
};

export async function uploadImage(file: File): Promise<string> {
  const form = new FormData();
  form.append("image", file);
  const response = await apiFetch<Envelope<{ url: string }>>("/uploads/image", { method: "POST", body: form });
  return response.data.url;
}