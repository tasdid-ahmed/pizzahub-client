export type OrderStatus = "pending" | "accepted" | "rejected" | "cancelled";

export interface Order {
  id: string;
  itemId: string;
  item: { name: string; image: string; price: number };
  deliveryDate: string; // YYYY-MM-DD
  deliveryAddress: string;
  message: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  vendor?: { id: string; name: string; email: string };
  customer?: { id: string; name: string; email: string };
}