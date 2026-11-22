import { z } from "zod";
import { CATEGORY_VALUES, MAX_IMAGES } from "../constants";

export const menuItemFormSchema = z.object({
  itemName: z.string().trim().min(3, "Name must be at least 3 characters").max(80, "Name is too long"),
  category: z.enum(CATEGORY_VALUES, { error: "Choose a category" }),
  description: z.string().trim().min(10, "Description must be at least 10 characters").max(1000, "Description is too long"),
  price: z
    .string()
    .trim()
    .regex(/^\d{1,6}(\.\d{1,2})?$/, "Enter a valid price, for example 12.50")
    .refine((value) => Number(value) > 0, "Price must be greater than 0"),
  location: z.string().trim().min(2, "Location is required").max(80, "Location is too long"),
  images: z.array(z.string()).min(1, "Upload at least one image").max(MAX_IMAGES),
});

export type MenuItemFormValues = z.infer<typeof menuItemFormSchema>;