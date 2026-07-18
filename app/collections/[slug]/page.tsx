import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCollectionBySlug } from "@/lib/collections";
import { productsForCollection } from "@/lib/products";
import ProductGrid from "@/components/ProductGrid";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const collection = await getCollectionBySlug(params.slug);
  return {
    title: collection ? collection.name : "Collection",
    description: collection
      ? `${collection.name} at Genet Ethiopian Market — Ethiopian and Eritrean traditional clothing and groceries in Wheaton, MD.`
      : undefined,
  };
}

export default async function CollectionDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const collection = await getCollectionBySlug(params.slug);
  if (!collection) notFound();

  const products = productsForCollection(collection);

  return (
    <div className="mx-auto max-w-6xl px-5 py-20">
      <Link
        href="/collections"
        className="link-gold text-xs uppercase tracking-widest2 text-ink/60"
      >
        &larr; All Collections
      </Link>
      <h1 className="mt-6 font-serif text-4xl text-forest sm:text-5xl">
        {collection.name}
      </h1>
      <div className="gold-rule mt-6" />
      <p className="mt-6 max-w-xl text-sm leading-relaxed text-ink/60">
        Add pieces to your cart and check out online, or visit us in store. Call{" "}
        <a href={site.phoneHref} className="text-forest underline decoration-gold underline-offset-4">
          {site.phone}
        </a>{" "}
        with any questions.
      </p>

      <div className="mt-14">
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
