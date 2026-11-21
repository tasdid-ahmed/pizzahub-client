"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path fill="#4285F4" d="M23.64 12.2c0-.82-.07-1.6-.21-2.36H12v4.47h6.52a5.57 5.57 0 0 1-2.42 3.66v3.04h3.9c2.28-2.1 3.64-5.19 3.64-8.81z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.9l-3.9-3.04c-1.08.72-2.46 1.15-4.04 1.15-3.11 0-5.75-2.1-6.69-4.93H1.28v3.1A12 12 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.31 14.28A7.2 7.2 0 0 1 4.93 12c0-.79.14-1.56.38-2.28v-3.1H1.28A12 12 0 0 0 0 12c0 1.94.46 3.77 1.28 5.38l4.03-3.1z" />
      <path fill="#EA4335" d="M12 4.75c1.76 0 3.34.6 4.58 1.79l3.44-3.44C17.95 1.19 15.23 0 12 0A12 12 0 0 0 1.28 6.62l4.03 3.1C6.25 6.85 8.89 4.75 12 4.75z" />
    </svg>
  );
}

export function GoogleButton({ callbackUrl, label }: { callbackUrl: string; label: string }) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: callbackUrl,
      errorCallbackURL: "/sign-in",
    });
    if (error) {
      toast.error(error.message ?? "Google sign-in failed. Please try again.");
      setLoading(false);
    }
  }

  return (
    <Button type="button" variant="outline" className="w-full" onClick={handleClick} disabled={loading}>
      {loading ? <Loader2 className="animate-spin" /> : <GoogleIcon />}
      {label}
    </Button>
  );
}