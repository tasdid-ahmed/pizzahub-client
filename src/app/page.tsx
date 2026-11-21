"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";

export default function Home() {
  const { data: session } = authClient.useSession();
  const [result, setResult] = useState("");

  async function callMe() {
    try {
      setResult(JSON.stringify(await apiFetch("/me"), null, 2));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed");
    }
  }

  return (
    <main className="mx-auto max-w-xl space-y-4 p-10">
      <h1 className="text-3xl font-bold">PizzaHub setup check</h1>
      <p>{session ? `Signed in as ${session.user.email}` : "Signed out"}</p>
      <div className="flex gap-3">
        <Button onClick={() => authClient.signIn.social({ provider: "google", callbackURL: "/" })}>Google sign in</Button>
        <Button variant="outline" onClick={callMe}>Call /api/me</Button>
        <Button variant="ghost" onClick={() => authClient.signOut()}>Sign out</Button>
      </div>
      <pre className="rounded-lg bg-muted p-4 text-sm">{result}</pre>
    </main>
  );
}