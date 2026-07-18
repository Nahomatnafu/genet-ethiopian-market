import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductById, formatPrice } from "@/lib/products";
import AddToCartButton from "@/components/AddToCartButton";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const product = await getProductById(params.id);
  return {
    title: product ? product.name : "Product",
    description: product
      ? `${product.name} — ${formatPrice(product.price)} at Genet Ethiopian Market, Wheaton, MD.`
      : undefined,
  };
}

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProductById(params.id);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-6xl px-5 py-20">
      <Link
        href={`/collections/${product.collectionSlug}`}
        className="link-gold text-xs uppercase tracking-widest2 text-ink/60"
      >
        &larr; {product.collectionName}
      </Link>

      <div className="mt-8 grid gap-10 md:grid-cols-2">
        <div className="relative aspect-[4/5] overflow-hidden bg-forest/5">
          <Image
            src={product.image}
            alt={product.alt || product.name}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col">
          <p className="text-xs uppercase tracking-widest2 text-gold">
            {product.collectionName}
          </p>
          <h1 className="mt-4 font-serif text-4xl text-forest">
            {product.name}
          </h1>
          <div className="gold-rule mt-6" />
          <p className="mt-6 flex items-baseline gap-3">
            <span className="font-serif text-3xl text-gold">
              {formatPrice(product.price)}
            </span>
            {product.compareAt && (
              <span className="text-lg text-ink/40 line-through">
                {formatPrice(product.compareAt)}
              </span>
            )}
          </p>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-ink/60">
            A handpicked piece from our {product.collectionName.toLowerCase()}.
            Add it to your cart to check out online, or{" "}
            <a
              href={site.phoneHref}
              className="text-forest underline decoration-gold underline-offset-4"
            >
              call us
            </a>{" "}
            to arrange in-store pickup.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <AddToCartButton
              product={{
                productId: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
              }}
              className="text-center"
            />
            <Link href="/cart" className="btn-dark text-center">
              View Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
