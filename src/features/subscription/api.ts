import { apiFetch } from "@/lib/api";

export interface SubscriptionStatus {
  plan: "free" | "premium";
  expiresAt: string | null;
  cancelAtPeriodEnd: boolean;
  canCancel: boolean;
  priceUsd: number;
  freeLimit: number;
}

export const subscriptionApi = {
  get: () => apiFetch<{ data: SubscriptionStatus }>("/subscription"),
  checkout: () => apiFetch<{ data: { url: string } }>("/subscription/checkout", { method: "POST" }),
  cancel: () => apiFetch<{ message?: string; data: SubscriptionStatus }>("/subscription/cancel", { method: "POST" }),
};