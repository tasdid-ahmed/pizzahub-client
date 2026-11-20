import { betterAuth } from "better-auth";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { jwt } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { db } from "./mongodb";
import { PASSWORD_MESSAGE, PASSWORD_REGEX, PROTECTED_USER_FIELDS, SIGNUP_ROLES } from "./constants";

const baseURL = process.env.BETTER_AUTH_URL;
if (!baseURL) throw new Error("BETTER_AUTH_URL is not set");

export const auth = betterAuth({
  baseURL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(db),
  trustedOrigins: [baseURL],
  emailAndPassword: { enabled: true, minPasswordLength: 6, autoSignIn: true },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  user: {
    additionalFields: {
      // The only client-writable extra field, and only at sign-up (checked in the hooks below).
      role: { type: "string", required: false, input: true },
      roleSelected: { type: "boolean", required: false, defaultValue: false, input: false },
      isBlocked: { type: "boolean", required: false, defaultValue: false, input: false },
      businessName: { type: "string", required: false, input: false },
      subscriptionPlan: { type: "string", required: false, defaultValue: "free", input: false },
      subscriptionExpiresAt: { type: "date", required: false, input: false },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          // Email sign-up sends a validated role. Google sign-up sends none: default to the
          // least-privileged role and require the one-time role choice screen.
          const role = (user as { role?: unknown }).role;
          const chosen = role === "vendor" || role === "customer";
          return { data: { ...user, role: chosen ? role : "customer", roleSelected: chosen } };
        },
      },
    },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      const body = (ctx.body ?? {}) as Record<string, unknown>;

      if (ctx.path === "/sign-up/email") {
        if (!PASSWORD_REGEX.test(String(body.password ?? ""))) {
          throw new APIError("BAD_REQUEST", { message: PASSWORD_MESSAGE });
        }
        if (!SIGNUP_ROLES.includes(body.role as (typeof SIGNUP_ROLES)[number])) {
          throw new APIError("BAD_REQUEST", { message: "Please choose Customer or Vendor as your account role" });
        }
      }

      if (ctx.path === "/update-user" && PROTECTED_USER_FIELDS.some((field) => field in body)) {
        throw new APIError("FORBIDDEN", { message: "You are not allowed to change that field" });
      }
    }),
  },
  plugins: [jwt({ jwt: { issuer: baseURL, audience: baseURL, expirationTime: "15m" } }), nextCookies()],
});