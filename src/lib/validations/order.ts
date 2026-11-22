import { z } from "zod";

export const orderFormSchema = z.object({
  deliveryDate: z
    .string()
    .min(1, "Choose a delivery date")
    .refine((value) => value >= new Date().toLocaleDateString("en-CA"), "Delivery date can't be in the past"),
  deliveryAddress: z.string().trim().min(10, "Please enter a full delivery address").max(200, "Address is too long"),
  message: z.string().trim().max(300, "Message is too long"),
});

export type OrderFormValues = z.infer<typeof orderFormSchema>;