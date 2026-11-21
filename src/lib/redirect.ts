/** Only allow same-site relative paths, to prevent open redirects via ?callbackUrl=. */
export function safeRedirect(target?: string | null, fallback = "/dashboard") {
  if (!target || !target.startsWith("/") || target.startsWith("//") || target.includes("\\")) {
    return fallback;
  }
  return target;
}