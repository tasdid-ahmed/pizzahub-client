import { z } from "zod";

export const profileFormSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(60, "Name is too long"),
  businessName: z
    .string()
    .trim()
    .max(80, "Business name is too long")
    .refine((value) => value === "" || value.length >= 2, "Business name must be at least 2 characters"),
  image: z.string(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;