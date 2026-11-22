"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MENU_CATEGORIES } from "@/lib/constants";
import { menuItemFormSchema, type MenuItemFormValues } from "@/lib/validations/menu-item";
import type { MenuItem } from "@/types/menu-items";
import { vendorItemsApi } from "./api";
import { ImageUploader } from "./image-uploader";

function FieldError({ message }: { message?: string }) {
  return message ? (
    <p role="alert" className="text-sm text-destructive">
      {message}
    </p>
  ) : null;
}

export function MenuItemForm({ item }: { item?: MenuItem }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<MenuItemFormValues>({
    resolver: zodResolver(menuItemFormSchema),
    defaultValues: {
      itemName: item?.itemName ?? "",
      category: item?.category,
      description: item?.description ?? "",
      price: item ? String(item.price) : "",
      location: item?.location ?? "",
      images: item?.images ?? [],
    },
  });
  const category = watch("category");
  const images = watch("images");

  async function onSubmit(values: MenuItemFormValues) {
    const body = {
      itemName: values.itemName,
      category: values.category,
      description: values.description,
      price: Number(values.price),
      location: values.location,
      images: values.images,
    };
    try {
      if (item) {
        const response = await vendorItemsApi.update(item.id, body);
        toast.success(
          response.data.status !== item.status
            ? "Saved. Your changes were sent for admin review."
            : "Menu item updated",
        );
      } else {
        await vendorItemsApi.create(body);
        toast.success("Menu item submitted for admin review");
      }
      router.push("/dashboard/vendor/menu-items");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="max-w-3xl space-y-5 rounded-xl border-2 border-[color:var(--hard)] bg-card p-6 shadow-[4px_4px_0_0_var(--hard)] sm:p-8"
    >
      {item && (
        <p className="rounded-lg bg-accent px-3 py-2 text-sm">
          Changing the name, description, images or category sends this item back to admin review.
        </p>
      )}

      <div className="space-y-2">
        <Label htmlFor="itemName">Item name</Label>
        <Input id="itemName" placeholder="e.g. Smoky BBQ Chicken Pizza" {...register("itemName")} />
        <FieldError message={errors.itemName?.message} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={category}
            onValueChange={(next) => setValue("category", next as MenuItemFormValues["category"], { shouldValidate: true })}
          >
            <SelectTrigger id="category" className="w-full">
              <SelectValue placeholder="Choose a category" />
            </SelectTrigger>
            <SelectContent>
              {MENU_CATEGORIES.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError message={errors.category?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input id="price" inputMode="decimal" placeholder="12.50" {...register("price")} />
          <FieldError message={errors.price?.message} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location (area / city)</Label>
        <Input id="location" placeholder="e.g. Banani, Dhaka" {...register("location")} />
        <FieldError message={errors.location?.message} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" rows={4} placeholder="Describe the toppings, size and what makes it special." {...register("description")} />
        <FieldError message={errors.description?.message} />
      </div>

      <div className="space-y-2">
        <Label>Images</Label>
        <ImageUploader
          value={images}
          onChange={(urls) => setValue("images", urls, { shouldValidate: true })}
          disabled={isSubmitting}
        />
        <FieldError message={errors.images?.message} />
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="animate-spin" />}
          {item ? "Save changes" : "Submit for review"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/dashboard/vendor/menu-items")} disabled={isSubmitting}>
          Cancel
        </Button>
      </div>
    </form>
  );
}