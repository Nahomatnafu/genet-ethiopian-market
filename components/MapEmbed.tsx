import { site } from "@/lib/site";

export default function MapEmbed({ className = "h-96 w-full" }: { className?: string }) {
  return (
    <iframe
      src={site.mapsEmbedSrc}
      className={className}
      style={{ border: 0, filter: "grayscale(0.4)" }}
      loading="lazy"
      allowFullScreen
      referrerPolicy="no-referrer-when-downgrade"
      title={`Map showing ${site.name} at ${site.address}`}
    />
  );
}
