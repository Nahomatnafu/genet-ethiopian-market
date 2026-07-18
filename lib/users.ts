// JSON-file-backed customer accounts. Separate from the single shared /admin
// password (lib/auth.ts) — these are real per-shopper accounts. Passwords are
// stored as PBKDF2 hashes with a per-user salt via Web Crypto.
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

export type User = {
  id: string;
  email: string;
  name: string;
  salt: string;
  passwordHash: string;
  createdAt: string;
};

// Safe-to-expose subset (never leak salt/hash to the client).
export type PublicUser = Pick<User, "id" | "email" | "name" | "createdAt">;

const DATA_PATH = path.join(process.cwd(), "data", "users.json");
const PBKDF2_ITERATIONS = 100_000;

async function readAll(): Promise<User[]> {
  try {
    const raw = await fs.readFile(DATA_PATH, "utf-8");
    return JSON.parse(raw) as User[];
  } catch {
    return [];
  }
}

async function writeAll(users: User[]): Promise<void> {
  await fs.writeFile(DATA_PATH, JSON.stringify(users, null, 2) + "\n", "utf-8");
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hashPassword(password: string, saltHex: string): Promise<string> {
  const salt = Uint8Array.from(
    saltHex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
  );
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
    key,
    256
  );
  return toHex(bits);
}

export function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
  };
}

export async function findByEmail(email: string): Promise<User | undefined> {
  const normalized = email.trim().toLowerCase();
  return (await readAll()).find((u) => u.email === normalized);
}

export async function findById(id: string): Promise<User | undefined> {
  return (await readAll()).find((u) => u.id === id);
}

export async function createUser(input: {
  email: string;
  name: string;
  password: string;
}): Promise<User> {
  const users = await readAll();
  const saltHex = toHex(crypto.getRandomValues(new Uint8Array(16)).buffer);
  const user: User = {
    id: randomUUID(),
    email: input.email.trim().toLowerCase(),
    name: input.name.trim(),
    salt: saltHex,
    passwordHash: await hashPassword(input.password, saltHex),
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  await writeAll(users);
  return user;
}

export async function verifyPassword(
  user: User,
  password: string
): Promise<boolean> {
  const hash = await hashPassword(password, user.salt);
  return hash === user.passwordHash;
}
