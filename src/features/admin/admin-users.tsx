"use client";

import { useEffect, useState } from "react";
import { Eye, Loader2, ShieldBan, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { DataTable, Td, Th } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { usePagedQuery } from "@/hooks/use-paged-query";
import type { AdminUser, AdminUserDetails } from "@/types/admin";
import { adminApi } from "./api";

function UserDetailsDialog({ id, onClose }: { id: string | null; onClose: () => void }) {
  const [details, setDetails] = useState<AdminUserDetails | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!id) return;
    let current = true;
    adminApi
      .user(id)
      .then((response) => {
        if (current) setDetails(response.data);
      })
      .catch(() => {
        if (current) setFailed(true);
      });
    return () => {
      current = false;
      setDetails(null);
      setFailed(false);
    };
  }, [id]);

  const shown = details?.id === id ? details : null;

  return (
    <Dialog open={id !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{shown?.name ?? "User details"}</DialogTitle>
          <DialogDescription>{shown?.email}</DialogDescription>
        </DialogHeader>
        {failed ? (
          <p className="text-sm text-destructive">Could not load this user.</p>
        ) : !shown ? (
          <div className="space-y-3">
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-5 w-1/3" />
          </div>
        ) : (
          <dl className="grid grid-cols-[8rem_1fr] gap-x-4 gap-y-2 text-sm">
            <dt className="text-muted-foreground">Role</dt>
            <dd className="capitalize">{shown.role}</dd>
            <dt className="text-muted-foreground">Account</dt>
            <dd>
              <StatusBadge status={shown.isBlocked ? "rejected" : "active"} className="[&]:normal-case" />{" "}
              {shown.isBlocked ? "Blocked" : "Active"}
            </dd>
            {shown.role === "vendor" && (
              <>
                <dt className="text-muted-foreground">Business</dt>
                <dd>{shown.businessName ?? "Not set"}</dd>
                <dt className="text-muted-foreground">Plan</dt>
                <dd className="capitalize">{shown.subscriptionPlan}</dd>
              </>
            )}
            <dt className="text-muted-foreground">Joined</dt>
            <dd>{shown.createdAt ? new Date(shown.createdAt).toLocaleDateString() : "Unknown"}</dd>
            {Object.keys(shown.stats).length > 0 && (
              <>
                <dt className="text-muted-foreground">{shown.role === "vendor" ? "Menu items" : "Orders"}</dt>
                <dd>
                  {Object.entries(shown.stats)
                    .map(([status, count]) => `${count} ${status}`)
                    .join(", ")}
                </dd>
              </>
            )}
          </dl>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function AdminUsers() {
  const [search, setSearch] = useState("");
  const [q, setQ] = useState("");
  const [role, setRole] = useState("all");
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState<string | null>(null);
  const [target, setTarget] = useState<AdminUser | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setQ(search.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, meta, loading, error, setData } = usePagedQuery<AdminUser[]>("/admin/users", {
    q,
    role: role === "all" ? undefined : role,
    page,
    limit: 10,
  });

  async function confirmToggle() {
    if (!target) return;
    const next = !target.isBlocked;
    setBusy(true);
    try {
      const response = await adminApi.blockUser(target.id, next);
      setData((list) => list.map((user) => (user.id === target.id ? response.data : user)));
      toast.success(next ? "User blocked" : "User unblocked");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update this user");
    } finally {
      setBusy(false);
      setTarget(null);
    }
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-[1fr_12rem]">
        <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name or email" aria-label="Search users" />
        <Select value={role} onValueChange={(value) => { setRole(value); setPage(1); }}>
          <SelectTrigger className="w-full" aria-label="Filter by role">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            <SelectItem value="customer">Customers</SelectItem>
            <SelectItem value="vendor">Vendors</SelectItem>
            <SelectItem value="admin">Admins</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error ? (
        <EmptyState title="Could not load users" description={error} />
      ) : !data ? (
        <Skeleton className="h-64 rounded-xl" />
      ) : data.length === 0 ? (
        <EmptyState title="No users found" description="Try a different search or role filter." />
      ) : (
        <div className={loading ? "opacity-60 transition-opacity" : "transition-opacity"}>
          <DataTable>
            <thead>
              <tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Role</Th>
                <Th>Plan</Th>
                <Th>Status</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody>
              {data.map((user) => (
                <tr key={user.id}>
                  <Td className="font-medium">{user.name}</Td>
                  <Td className="text-muted-foreground">{user.email}</Td>
                  <Td className="capitalize">{user.role}</Td>
                  <Td className="capitalize">{user.role === "vendor" ? user.subscriptionPlan : "-"}</Td>
                  <Td>
                    <StatusBadge status={user.isBlocked ? "rejected" : "active"} />
                  </Td>
                  <Td>
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => setViewing(user.id)}>
                        <Eye /> View
                      </Button>
                      {user.role !== "admin" && (
                        <Button size="sm" variant={user.isBlocked ? "outline" : "destructive"} onClick={() => setTarget(user)}>
                          {user.isBlocked ? <ShieldCheck /> : <ShieldBan />}
                          {user.isBlocked ? "Unblock" : "Block"}
                        </Button>
                      )}
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </DataTable>
          <PaginationControls meta={meta} onChange={setPage} />
        </div>
      )}

      <UserDetailsDialog id={viewing} onClose={() => setViewing(null)} />

      <AlertDialog open={target !== null} onOpenChange={(open) => !open && setTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{target?.isBlocked ? "Unblock this user?" : "Block this user?"}</AlertDialogTitle>
            <AlertDialogDescription>
              {target?.isBlocked
                ? `${target?.name} will be able to use PizzaHub again.`
                : `${target?.name} will immediately lose access to protected features, including ordering and their dashboard.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmToggle} disabled={busy}>
              {busy && <Loader2 className="animate-spin" />}
              {target?.isBlocked ? "Unblock" : "Block"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}