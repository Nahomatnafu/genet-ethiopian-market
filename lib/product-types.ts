// Client-safe product helpers: the Product shape plus pure formatting/derivation
// utilities. Kept free of any `fs`/server-only imports (the type-only import of
// Collection/Photo is erased at compile time) so client components can use these
// without pulling the data layer into the browser bundle. The fs-backed data
// functions live in lib/products.ts.
import type { Collection, Photo } from "@/lib/collections";

export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  alt: string;
  collectionSlug: string;
  collectionName: string;
};

// Derive a display name from the owning collection, e.g. a photo in
// "Women Dresses Collection" becomes "Women Dresses — Piece 3".
export function productName(collection: Collection, photo: Photo): string {
  const base = collection.name.replace(/\s*collection\s*$/i, "").trim();
  return `${base} — Piece ${photo.order + 1}`;
}

export function toProduct(collection: Collection, photo: Photo): Product {
  return {
    id: photo.id,
    name: productName(collection, photo),
    price: photo.price,
    image: photo.url,
    alt: photo.alt,
    collectionSlug: collection.slug,
    collectionName: collection.name,
  };
}

export function formatPrice(n: number): string {
  return `$${n}`;
}
