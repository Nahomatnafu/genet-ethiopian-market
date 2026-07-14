import type { Metadata } from "next";
import { site } from "@/lib/site";
import MapEmbed from "@/components/MapEmbed";
import FadeIn from "@/components/FadeIn";
import { InstagramIcon } from "@/components/Nav";

export const metadata: Metadata = {
  title: "Visit Us",
  description: `Visit Genet Ethiopian Market at ${site.address}. Ethiopian and Eritrean traditional clothing and groceries. Call ${site.phone}.`,
};

export default function VisitPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-20">
      <FadeIn>
        <p className="text-xs uppercase tracking-widest2 text-gold">
          Wheaton, Maryland
        </p>
        <h1 className="mt-4 font-serif text-4xl text-forest sm:text-5xl">
          Visit the Market
        </h1>
        <div className="gold-rule mt-6" />
      </FadeIn>

      <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_1.2fr]">
        <FadeIn>
          <div className="space-y-10">
            <div>
              <h2 className="text-xs uppercase tracking-widest2 text-gold">
                Address
              </h2>
              <address className="mt-3 text-lg not-italic leading-relaxed text-ink">
                {site.address}
              </address>
              <a
                href={site.mapsDirectionsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-dark mt-5"
              >
                Get Directions
              </a>
            </div>

            <div>
              <h2 className="text-xs uppercase tracking-widest2 text-gold">
                Phone
              </h2>
              <a
                href={site.phoneHref}
                className="mt-3 block text-lg text-ink transition-colors hover:text-gold"
              >
                {site.phone}
              </a>
              <p className="mt-1 text-sm text-ink/50">
                Tap to call — ask about custom family matching orders.
              </p>
            </div>

            <div>
              <h2 className="text-xs uppercase tracking-widest2 text-gold">
                Hours
              </h2>
              <table className="mt-3 w-full max-w-sm text-sm">
                <tbody>
                  {site.hours.map((h) => (
                    <tr key={h.days} className="border-b border-forest/10">
                      <td className="py-3 text-ink">{h.days}</td>
                      <td className="py-3 text-right text-ink/60">{h.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div>
              <h2 className="text-xs uppercase tracking-widest2 text-gold">
                Instagram
              </h2>
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 text-lg text-ink transition-colors hover:text-gold"
              >
                <InstagramIcon className="h-5 w-5 text-gold" />
                {site.instagramHandle}
              </a>
              <p className="mt-1 text-sm text-ink/50">
                DM us to order or ask about new arrivals.
              </p>
            </div>
          </div>
        </FadeIn>

        <FadeIn>
          <MapEmbed className="h-[28rem] w-full lg:h-full lg:min-h-[32rem]" />
        </FadeIn>
      </div>
    </div>
  );
}
