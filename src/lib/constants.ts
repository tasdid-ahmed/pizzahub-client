export const ROLES = ["customer", "vendor", "admin"] as const;
export type Role = (typeof ROLES)[number];

// Roles a person may pick at sign-up. Admin is never self-assignable.
export const SIGNUP_ROLES = ["customer", "vendor"] as const;

export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
export const PASSWORD_MESSAGE =
  "Password must be at least 6 characters and include an uppercase and a lowercase letter";

// User fields that only the server may change (never via Better Auth's update-user).
export const PROTECTED_USER_FIELDS = [
  "role",
  "roleSelected",
  "isBlocked",
  "businessName",
  "subscriptionPlan",
  "subscriptionExpiresAt",
] as const;

export type SignupRole = (typeof SIGNUP_ROLES)[number];

export const dashboardPathFor = (role: Role) => `/dashboard/${role}`;

export const MENU_CATEGORIES = [
  { value: "classic", label: "Classic Pizzas" },
  { value: "vegetarian", label: "Vegetarian Pizzas" },
  { value: "meat-lovers", label: "Meat Lovers" },
  { value: "specialty", label: "Specialty / Gourmet Pizzas" },
  { value: "sides", label: "Sides & Appetizers" },
  { value: "beverages-desserts", label: "Beverages & Desserts" },
] as const;

export type MenuCategory = (typeof MENU_CATEGORIES)[number]["value"];
export const CATEGORY_VALUES = MENU_CATEGORIES.map((c) => c.value) as [MenuCategory, ...MenuCategory[]];
export const categoryLabel = (value: string) => MENU_CATEGORIES.find((c) => c.value === value)?.label ?? value;

export const CURRENCY_SYMBOL = "$";
export const formatPrice = (amount: number) => `${CURRENCY_SYMBOL}${amount.toFixed(2)}`;

export const FREE_PLAN_ITEM_LIMIT = 3;
export const MAX_IMAGES = 4;
export const MAX_IMAGE_MB = 2;