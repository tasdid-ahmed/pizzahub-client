"use client";

import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import type { PageMeta } from "@/types/menu-items";

type Envelope<T> = { success: boolean; data: T; meta?: PageMeta };
type State<T> = { key: string; data: T | null; meta: PageMeta | null; error: string | null };

/** Fetches an authenticated list endpoint and refetches whenever the params change. */
export function usePagedQuery<T>(path: string, params: Record<string, string | number | undefined>) {
  const search = new URLSearchParams();
  for (const [name, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") search.set(name, String(value));
  }
  const url = `${path}?${search.toString()}`;
  const [version, setVersion] = useState(0);
  const requestKey = `${url}#${version}`;
  const [state, setState] = useState<State<T>>({ key: "", data: null, meta: null, error: null });

  useEffect(() => {
    let current = true;
    apiFetch<Envelope<T>>(url)
      .then((response) => {
        if (current) setState({ key: requestKey, data: response.data, meta: response.meta ?? null, error: null });
      })
      .catch((err) => {
        if (current) {
          setState((prev) => ({
            ...prev,
            key: requestKey,
            error: err instanceof Error ? err.message : "Could not load data",
          }));
        }
      });
    return () => {
      current = false;
    };
  }, [url, requestKey]);

  const loading = state.key !== requestKey;
  const reload = useCallback(() => setVersion((v) => v + 1), []);
  const setData = useCallback(
    (updater: (current: T) => T) => setState((prev) => (prev.data ? { ...prev, data: updater(prev.data) } : prev)),
    [],
  );

  return { data: state.data, meta: state.meta, loading, error: loading ? null : state.error, reload, setData };
}