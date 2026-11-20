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