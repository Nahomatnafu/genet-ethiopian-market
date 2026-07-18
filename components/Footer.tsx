import { site } from "@/lib/site";
import { InstagramIcon } from "@/components/Nav";
import LogoMark from "@/components/LogoMark";
import MapEmbed from "@/components/MapEmbed";

export default function Footer() {
  return (
    <footer className="bg-forest-deep text-cream">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <LogoMark className="h-11 w-11 flex-none text-gold" />
            <div>
              <p className="font-serif text-2xl">Genet</p>
              <p className="mt-1 text-[0.65rem] uppercase tracking-widest2 text-gold">
                Ethiopian Market
              </p>
            </div>
          </div>
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-cream/70">
            Traditional Ethiopian &amp; Eritrean clothing, family matching
            sets, and authentic foods — in the heart of Wheaton, Maryland.
          </p>
          <a
            href={site.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 text-sm text-gold transition-opacity hover:opacity-70"
          >
            <InstagramIcon className="h-4 w-4" />
            {site.instagramHandle}
          </a>
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-widest2 text-gold">
            Visit Us
          </h3>
          <div className="gold-rule mt-3" />
          <address className="mt-6 text-sm not-italic leading-relaxed text-cream/70">
            {site.address}
          </address>
          <a
            href={site.phoneHref}
            className="mt-3 block text-sm text-cream transition-colors hover:text-gold"
          >
            {site.phone}
          </a>
          <ul className="mt-6 space-y-1 text-sm text-cream/70">
            {site.hours.map((h) => (
              <li key={h.days} className="flex justify-between gap-6">
                <span>{h.days}</span>
                <span>{h.time}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-widest2 text-gold">
            Find Us
          </h3>
          <div className="gold-rule mt-3" />
          <div className="mt-6 overflow-hidden">
            <MapEmbed className="h-48 w-full" />
          </div>
        </div>
      </div>

      <div className="border-t border-gold/20">
        <p className="mx-auto max-w-6xl px-5 py-6 text-xs text-cream/50">
          © {new Date().getFullYear()} {site.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
