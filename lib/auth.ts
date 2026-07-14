// Session auth for the hidden /admin area. A single shared password
// (ADMIN_PASSWORD env var) maps to a deterministic HMAC token stored in an
// httpOnly cookie. Uses Web Crypto so the same code runs in edge middleware
// and Node route handlers.

export const ADMIN_COOKIE = "genet_admin_session";

export async function sessionToken(): Promise<string | null> {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode("genet-admin-session-v1")
  );
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function isValidSession(
  cookieValue: string | undefined
): Promise<boolean> {
  if (!cookieValue) return false;
  const token = await sessionToken();
  return token !== null && cookieValue === token;
}
