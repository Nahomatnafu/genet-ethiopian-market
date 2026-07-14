import Image from "next/image";
import Link from "next/link";
import { getCollections } from "@/lib/collections";
import { site } from "@/lib/site";
import CollectionCard from "@/components/CollectionCard";
import FadeIn from "@/components/FadeIn";
import { InstagramIcon } from "@/components/Nav";

export const dynamic = "force-dynamic";

// [PLACEHOLDER] Stock hero image — replace with a styled photo of traditional
// clothing from the client's photoshoot.
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=80";

const pillars = [
  {
    title: "Traditional Clothing",
    text: "Habesha kemis, netela, and cultural garments for women, men, and children.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="h-8 w-8" aria-hidden="true">
        <path d="M12 3l-2 2-4 1.5L7.5 10v11h9V10l1.5-3.5L14 5l-2-2z" />
        <path d="M10 3c0 1.1.9 2 2 2s2-.9 2-2" />
      </svg>
    ),
  },
  {
    title: "Family Matching Sets",
    text: "Coordinated outfits for weddings, bridal parties, graduations, and holidays.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="h-8 w-8" aria-hidden="true">
        <circle cx="8" cy="7" r="2.5" />
        <circle cx="16" cy="7" r="2.5" />
        <path d="M4 20v-3a4 4 0 014-4h0a4 4 0 014 4v3M12 20v-3a4 4 0 014-4h0a4 4 0 014 4v3" />
      </svg>
    ),
  },
  {
    title: "Authentic Ethiopian Foods",
    text: "Fresh injera, berbere, teff, shiro, and traditional coffee ware.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="h-8 w-8" aria-hidden="true">
        <path d="M7 21c0-4 -2-5 -2-9a7 7 0 0114 0c0 4-2 5-2 9" />
        <path d="M9 12a3 3 0 006 0" />
        <path d="M5 21h14" />
      </svg>
    ),
  },
];

// [PLACEHOLDER — REPLACE WITH REAL REVIEWS] Copy 3–5 real quotes from the
// Google Business Profile or Instagram before launch.
const testimonials = [
  {
    quote:
      "[PLACEHOLDER — REPLACE WITH REAL REVIEW] Beautiful selection of traditional dresses and the family matching sets made our wedding unforgettable.",
    name: "Customer Name",
  },
  {
    quote:
      "[PLACEHOLDER — REPLACE WITH REAL REVIEW] The freshest injera in the area and every spice I need for home cooking.",
    name: "Customer Name",
  },
  {
    quote:
      "[PLACEHOLDER — REPLACE WITH REAL REVIEW] Warm, welcoming service — they helped us coordinate outfits for our whole family for Meskel.",
    name: "Customer Name",
  },
];

export default async function Home() {
  const collections = await getCollections();
  const instagramThumbs = collections
    .flatMap((c) => c.photos)
    .slice(0, 6);

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden bg-forest-deep">
        <Image
          src={HERO_IMAGE}
          alt="[PLACEHOLDER] Traditional Ethiopian clothing styled elegantly"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-deep/40 via-forest-deep/60 to-forest-deep" />
        <div className="relative z-10 mx-auto max-w-3xl px-5 text-center">
          <div className="gold-rule mx-auto" />
          <h1 className="mt-8 font-serif text-4xl leading-tight text-cream sm:text-6xl">
            Timeless Ethiopian &amp; Eritrean Tradition
          </h1>
          <p className="mt-6 text-sm uppercase tracking-widest2 text-gold">
            Clothing · Family Sets · Authentic Foods
          </p>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-cream/70">
            A boutique market in Wheaton, Maryland — traditional garments and
            authentic foods for every celebration.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/collections" className="btn-gold">
              Explore the Collections
            </Link>
            <Link
              href="/visit"
              className="inline-block border border-cream/40 px-8 py-3 text-xs uppercase tracking-widest2 text-cream transition-colors duration-300 hover:border-cream hover:bg-cream hover:text-forest-deep"
            >
              Visit the Market
            </Link>
          </div>
        </div>
      </section>

      {/* Three pillars */}
      <section className="border-b border-forest/10 bg-cream">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 md:grid-cols-3">
          {pillars.map((pillar) => (
            <FadeIn key={pillar.title} className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center text-gold">
                {pillar.icon}
              </div>
              <h2 className="mt-4 font-serif text-xl text-forest">
                {pillar.title}
              </h2>
              <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-ink/60">
                {pillar.text}
              </p>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Featured collections */}
      <section className="mx-auto max-w-6xl px-5 py-24">
        <FadeIn className="text-center">
          <p className="text-xs uppercase tracking-widest2 text-gold">
            The Lookbook
          </p>
          <h2 className="mt-4 font-serif text-3xl text-forest sm:text-4xl">
            Featured Collections
          </h2>
          <div className="gold-rule mx-auto mt-6" />
        </FadeIn>
        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {collections.slice(0, 4).map((collection) => (
            <FadeIn key={collection.id}>
              <CollectionCard collection={collection} />
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Our story */}
      <section className="bg-forest text-cream">
        <div className="mx-auto max-w-3xl px-5 py-24 text-center">
          <FadeIn>
            <p className="text-xs uppercase tracking-widest2 text-gold">
              Our Story
            </p>
            <h2 className="mt-4 font-serif text-3xl sm:text-4xl">
              Rooted in Tradition
            </h2>
            <div className="gold-rule mx-auto mt-6" />
            {/* [PLACEHOLDER — replace with the owner's own story and photo] */}
            <p className="mt-8 leading-loose text-cream/70">
              Genet Ethiopian Market was founded to bring the beauty of
              Ethiopian and Eritrean culture to our community — from
              hand-embroidered traditional garments to the spices and injera
              that make a house smell like home. Whether you are dressing a
              wedding party, celebrating a graduation, or cooking a family
              meal, we are honored to be part of your story.
            </p>
            <p className="mt-6 text-xs uppercase tracking-widest2 text-cream/40">
              [Placeholder — to be replaced with the owner&apos;s own words]
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Instagram teaser */}
      <section className="mx-auto max-w-6xl px-5 py-24">
        <FadeIn className="text-center">
          <p className="text-xs uppercase tracking-widest2 text-gold">
            Follow Along
          </p>
          <h2 className="mt-4 font-serif text-3xl text-forest sm:text-4xl">
            {site.instagramHandle}
          </h2>
          <div className="gold-rule mx-auto mt-6" />
        </FadeIn>
        <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {instagramThumbs.map((photo) => (
            <a
              key={photo.id}
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block aspect-square overflow-hidden bg-forest"
              aria-label={`See more on Instagram ${site.instagramHandle}`}
            >
              <Image
                src={photo.url}
                alt={photo.alt}
                fill
                sizes="(max-width: 640px) 50vw, 16vw"
                className="object-cover transition-all duration-500 group-hover:scale-105 group-hover:opacity-80"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <InstagramIcon className="h-6 w-6 text-cream drop-shadow" />
              </div>
            </a>
          ))}
        </div>
        <FadeIn className="mt-10 text-center">
          <a
            href={site.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-dark"
          >
            Follow on Instagram
          </a>
        </FadeIn>
      </section>

      {/* Testimonials */}
      <section className="bg-cream pb-24">
        <div className="mx-auto max-w-6xl px-5">
          <FadeIn className="text-center">
            <p className="text-xs uppercase tracking-widest2 text-gold">
              Kind Words
            </p>
            <h2 className="mt-4 font-serif text-3xl text-forest sm:text-4xl">
              From Our Customers
            </h2>
            <div className="gold-rule mx-auto mt-6" />
          </FadeIn>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <FadeIn key={i}>
                <figure className="flex h-full flex-col bg-forest p-8 text-cream">
                  <span className="font-serif text-5xl leading-none text-gold" aria-hidden="true">
                    &ldquo;
                  </span>
                  <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-cream/80">
                    {t.quote}
                  </blockquote>
                  <figcaption className="mt-6">
                    <span className="text-gold" aria-label="5 star rating">
                      ★★★★★
                    </span>
                    <p className="mt-2 text-xs uppercase tracking-widest2 text-cream/60">
                      {t.name}
                    </p>
                  </figcaption>
                </figure>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
