// JSON-file-backed store for photo collections. This module is the single
// seam to replace with a Cloudinary-backed implementation later — the UI and
// API routes only ever talk to these helpers.
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

export type Photo = {
  id: string;
  url: string;
  alt: string;
  order: number;
  // Price in dollars (may include cents). Every photo is a sellable product;
  // see lib/products.ts.
  price: number;
  // Display name for the product. Falls back to a derived
  // "<Collection> — Piece N" name when absent (admin uploads don't set it).
  name?: string;
  // Original ("was") price shown struck through next to the sale price.
  compareAt?: number;
};

// Random whole-dollar price in the $50–$250 range, assigned once when a photo
// is added so prices stay stable across renders.
export function randomPrice(): number {
  return Math.floor(Math.random() * 201) + 50;
}

export type Collection = {
  id: string;
  slug: string;
  name: string;
  photos: Photo[];
};

const DATA_PATH = path.join(process.cwd(), "data", "collections.json");
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

async function readAll(): Promise<Collection[]> {
  const raw = await fs.readFile(DATA_PATH, "utf-8");
  return JSON.parse(raw) as Collection[];
}

async function writeAll(collections: Collection[]): Promise<void> {
  await fs.writeFile(DATA_PATH, JSON.stringify(collections, null, 2), "utf-8");
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function uniqueSlug(name: string, collections: Collection[], exceptId?: string): string {
  const base = slugify(name) || "collection";
  let slug = base;
  let n = 2;
  while (collections.some((c) => c.slug === slug && c.id !== exceptId)) {
    slug = `${base}-${n++}`;
  }
  return slug;
}

export async function getCollections(): Promise<Collection[]> {
  return readAll();
}

export async function getCollectionBySlug(
  slug: string
): Promise<Collection | undefined> {
  return (await readAll()).find((c) => c.slug === slug);
}

export async function createCollection(name: string): Promise<Collection> {
  const collections = await readAll();
  const collection: Collection = {
    id: randomUUID(),
    slug: uniqueSlug(name, collections),
    name: name.trim(),
    photos: [],
  };
  collections.push(collection);
  await writeAll(collections);
  return collection;
}

export async function renameCollection(
  id: string,
  name: string
): Promise<Collection | undefined> {
  const collections = await readAll();
  const collection = collections.find((c) => c.id === id);
  if (!collection) return undefined;
  collection.name = name.trim();
  collection.slug = uniqueSlug(name, collections, id);
  await writeAll(collections);
  return collection;
}

export async function deleteCollection(id: string): Promise<boolean> {
  const collections = await readAll();
  const collection = collections.find((c) => c.id === id);
  if (!collection) return false;
  await Promise.all(collection.photos.map((p) => deleteUploadedFile(p.url)));
  await writeAll(collections.filter((c) => c.id !== id));
  return true;
}

export async function addPhoto(
  collectionId: string,
  photo: { url: string; alt: string }
): Promise<Photo | undefined> {
  const collections = await readAll();
  const collection = collections.find((c) => c.id === collectionId);
  if (!collection) return undefined;
  const created: Photo = {
    id: randomUUID(),
    url: photo.url,
    alt: photo.alt,
    order: collection.photos.length,
    price: randomPrice(),
  };
  collection.photos.push(created);
  await writeAll(collections);
  return created;
}

export async function removePhoto(
  collectionId: string,
  photoId: string
): Promise<boolean> {
  const collections = await readAll();
  const collection = collections.find((c) => c.id === collectionId);
  if (!collection) return false;
  const photo = collection.photos.find((p) => p.id === photoId);
  if (!photo) return false;
  await deleteUploadedFile(photo.url);
  collection.photos = collection.photos
    .filter((p) => p.id !== photoId)
    .map((p, i) => ({ ...p, order: i }));
  await writeAll(collections);
  return true;
}

export async function saveUpload(
  file: File
): Promise<{ url: string } | { error: string }> {
  const ext = path.extname(file.name).toLowerCase();
  if (![".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"].includes(ext)) {
    return { error: "Unsupported file type" };
  }
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  const filename = `${randomUUID()}${ext}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(UPLOADS_DIR, filename), bytes);
  return { url: `/uploads/${filename}` };
}

async function deleteUploadedFile(url: string): Promise<void> {
  if (!url.startsWith("/uploads/")) return; // external (stock/Cloudinary) URL
  const filename = path.basename(url);
  try {
    await fs.unlink(path.join(UPLOADS_DIR, filename));
  } catch {
    // File already gone — nothing to clean up
  }
}
