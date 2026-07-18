// Server-side, fs-backed view over collections. Every photo is a product: its id
// is the photo id, its image is the photo url, and its price lives on the photo.
// This is the seam the storefront's server components/routes talk to. Pure,
// client-safe helpers (the Product type, formatPrice, name derivation) live in
// lib/product-types.ts so client components can import them without bundling fs.
import { getCollections, type Collection } from "@/lib/collections";
import { toProduct, type Product } from "@/lib/product-types";

// Re-export the client-safe helpers so existing server imports keep working.
export {
  productName,
  formatPrice,
  type Product,
} from "@/lib/product-types";

export async function getAllProducts(): Promise<Product[]> {
  const collections = await getCollections();
  return collections.flatMap((c) => c.photos.map((p) => toProduct(c, p)));
}

export async function getProductById(
  id: string
): Promise<Product | undefined> {
  const collections = await getCollections();
  for (const c of collections) {
    const photo = c.photos.find((p) => p.id === id);
    if (photo) return toProduct(c, photo);
  }
  return undefined;
}

// Build the products for a single collection without a second disk read.
export function productsForCollection(collection: Collection): Product[] {
  return collection.photos.map((p) => toProduct(collection, p));
}
