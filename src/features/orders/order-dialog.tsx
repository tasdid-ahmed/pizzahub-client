"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiFetch } from "@/lib/api";
import { formatPrice } from "@/lib/constants";
import { orderFormSchema, type OrderFormValues } from "@/lib/validations/order";
import type { PublicMenuItem } from "@/types/menu-items";

export function OrderDialog({
  item,
  open,
  onOpenChange,
}: {
  item: PublicMenuItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const today = new Date().toLocaleDateString("en-CA");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: { deliveryDate: "", deliveryAddress: "", message: "" },
  });

  async function onSubmit(values: OrderFormValues) {
    try {
      await apiFetch("/orders", { method: "POST", body: JSON.stringify({ itemId: item.id, ...values }) });
      toast.success("Order placed! The restaurant will review it shortly.");
      reset();
      onOpenChange(false);
      router.push("/dashboard/customer/orders");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not place your order. Please try again.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Place your order</DialogTitle>
          <DialogDescription>
            {item.itemName} · {formatPrice(item.price)} · from {item.vendor.name}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="deliveryDate">Delivery date</Label>
            <Input id="deliveryDate" type="date" min={today} {...register("deliveryDate")} />
            {errors.deliveryDate && <p role="alert" className="text-sm text-destructive">{errors.deliveryDate.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="deliveryAddress">Delivery address</Label>
            <Textarea id="deliveryAddress" rows={2} placeholder="House, road, area, city" {...register("deliveryAddress")} />
            {errors.deliveryAddress && <p role="alert" className="text-sm text-destructive">{errors.deliveryAddress.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Special instructions (optional)</Label>
            <Textarea id="message" rows={2} placeholder="Extra cheese, ring the bell, no onions..." {...register("message")} />
            {errors.message && <p role="alert" className="text-sm text-destructive">{errors.message.message}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="animate-spin" />}
            Confirm order
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}