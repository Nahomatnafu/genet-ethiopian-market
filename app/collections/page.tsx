import type { Metadata } from "next";
import { getCollections } from "@/lib/collections";
import CollectionCard from "@/components/CollectionCard";
import FadeIn from "@/components/FadeIn";

export const metadata: Metadata = {
  title: "Collections",
  description:
    "Browse traditional Ethiopian and Eritrean clothing, family matching outfits, and authentic groceries at Genet Ethiopian Market in Wheaton, MD.",
};

// Collections are edited at runtime via /admin, so never statically cache
export const dynamic = "force-dynamic";

export default async function CollectionsPage() {
  const collections = await getCollections();

  return (
    <div className="mx-auto max-w-6xl px-5 py-20">
      <FadeIn>
        <p className="text-xs uppercase tracking-widest2 text-gold">
          The Lookbook
        </p>
        <h1 className="mt-4 font-serif text-4xl text-forest sm:text-5xl">
          Our Collections
        </h1>
        <div className="gold-rule mt-6" />
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-ink/60">
          Explore our curated collections — from traditional clothing to
          authentic Ethiopian and Eritrean foods. Visit the store, call, or
          message us on Instagram to inquire about any piece.
        </p>
      </FadeIn>

      <div className="mt-14 grid gap-6 sm:grid-cols-2">
        {collections.map((collection, i) => (
          <FadeIn key={collection.id}>
            <CollectionCard collection={collection} priority={i < 2} />
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
