"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice, type Product } from "@/lib/product-types";
import AddToCartButton from "@/components/AddToCartButton";

export default function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <p className="py-24 text-center text-sm uppercase tracking-widest2 text-ink/40">
        Products coming soon
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <div key={product.id} className="group flex flex-col">
          <Link
            href={`/product/${product.id}`}
            className="relative block aspect-[4/5] overflow-hidden bg-forest/5"
            aria-label={`View ${product.name}`}
          >
            <Image
              src={product.image}
              alt={product.alt || product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </Link>
          <div className="mt-4 flex flex-1 flex-col">
            <div className="flex items-baseline justify-between gap-3">
              <Link
                href={`/product/${product.id}`}
                className="font-serif text-lg text-forest link-gold"
              >
                {product.name}
              </Link>
              <span className="flex-none font-serif text-lg text-gold">
                {formatPrice(product.price)}
              </span>
            </div>
            <div className="mt-4">
              <AddToCartButton
                product={{
                  productId: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.image,
                }}
                variant="dark"
                className="w-full !px-5 !py-2.5 text-center"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
