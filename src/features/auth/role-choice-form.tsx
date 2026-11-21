"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import type { SignupRole } from "@/lib/constants";
import { RolePicker } from "./role-picker";

export function RoleChoiceForm() {
  const [role, setRole] = useState<SignupRole>("customer");
  const [loading, setLoading] = useState(false);

  async function handleContinue() {
    setLoading(true);
    try {
      await apiFetch("/me/role", { method: "POST", body: JSON.stringify({ role }) });
      toast.success("Account type saved");
      // Full navigation so the session and navbar reload with the new role.
      window.location.assign("/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save your choice");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <RolePicker value={role} onChange={setRole} disabled={loading} />
      <Button className="w-full" onClick={handleContinue} disabled={loading}>
        {loading && <Loader2 className="animate-spin" />}
        Continue
      </Button>
    </div>
  );
}