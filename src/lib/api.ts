import { authClient } from "./auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");
if (!API_URL) throw new Error("NEXT_PUBLIC_API_URL is not set");

export class ApiRequestError extends Error {
  constructor(
    public status: number,
    message: string,
    public code = "ERROR",
    public details?: unknown,
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

type ApiOptions = RequestInit & { auth?: boolean };

/** Browser-side fetch helper. Attaches a fresh Better Auth JWT unless `auth: false`. */
export async function apiFetch<T>(path: string, { auth = true, ...init }: ApiOptions = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (auth) {
    const { data, error } = await authClient.token();
    if (error || !data?.token) {
      throw new ApiRequestError(401, "Please sign in to continue", "UNAUTHENTICATED");
    }
    headers.set("Authorization", `Bearer ${data.token}`);
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}/api${path}`, { ...init, headers, cache: "no-store" });
  } catch {
    throw new ApiRequestError(0, "Cannot reach the server. Please check your connection.", "NETWORK_ERROR");
  }

  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiRequestError(response.status, body?.message ?? "Request failed", body?.code, body?.details);
  }
  return body as T;
}