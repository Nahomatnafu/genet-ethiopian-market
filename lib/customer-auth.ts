// Customer session handling — separate from the /admin session in lib/auth.ts.
// A session cookie holds `<userId>.<hmac>`, signed with SESSION_SECRET (falling
// back to ADMIN_PASSWORD so it works out of the box). Read the current shopper
// with getCurrentUser() from any server component or route handler.
import { cookies } from "next/headers";
import { findById, toPublicUser, type PublicUser } from "@/lib/users";

export const CUSTOMER_COOKIE = "genet_customer_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function secret(): string {
  return process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD || "";
}

async function sign(userId: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`customer:${userId}`)
  );
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function createSessionToken(userId: string): Promise<string> {
  return `${userId}.${await sign(userId)}`;
}

// Constant-ish check: the userId is only trusted after its signature matches.
async function verifyToken(token: string | undefined): Promise<string | null> {
  if (!token || !secret()) return null;
  const idx = token.lastIndexOf(".");
  if (idx <= 0) return null;
  const userId = token.slice(0, idx);
  const signature = token.slice(idx + 1);
  const expected = await sign(userId);
  return signature === expected ? userId : null;
}

export async function getCurrentUser(): Promise<PublicUser | null> {
  const token = cookies().get(CUSTOMER_COOKIE)?.value;
  const userId = await verifyToken(token);
  if (!userId) return null;
  const user = await findById(userId);
  return user ? toPublicUser(user) : null;
}
