import Image from "next/image";
import Link from "next/link";
import type { Collection } from "@/lib/collections";

export default function CollectionCard({
  collection,
  priority = false,
}: {
  collection: Collection;
  priority?: boolean;
}) {
  const cover = collection.photos[0];
  return (
    <Link
      href={`/collections/${collection.slug}`}
      className="group relative block aspect-[4/5] overflow-hidden bg-forest"
    >
      {cover ? (
        <Image
          src={cover.url}
          alt={cover.alt || collection.name}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full items-center justify-center text-cream/40">
          <span className="text-xs uppercase tracking-widest2">No photos yet</span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/90 via-forest-deep/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-8">
        <div className="gold-rule mb-4 transition-all duration-500 group-hover:w-24" />
        <h3 className="font-serif text-2xl text-cream">{collection.name}</h3>
        <p className="mt-2 text-[0.65rem] uppercase tracking-widest2 text-gold">
          {collection.photos.length}{" "}
          {collection.photos.length === 1 ? "photo" : "photos"} — View
          Collection
        </p>
      </div>
    </Link>
  );
}
