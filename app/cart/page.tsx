"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart/CartContext";
import { formatPrice } from "@/lib/product-types";

export default function CartPage() {
  const { items, subtotal, setQty, remove } = useCart();

  return (
    <div className="mx-auto max-w-5xl px-5 py-20">
      <p className="text-xs uppercase tracking-widest2 text-gold">Your Cart</p>
      <h1 className="mt-4 font-serif text-4xl text-forest sm:text-5xl">
        Shopping Cart
      </h1>
      <div className="gold-rule mt-6" />

      {items.length === 0 ? (
        <div className="mt-12">
          <p className="text-sm text-ink/60">Your cart is empty.</p>
          <Link href="/collections" className="btn-dark mt-6 inline-block">
            Browse Collections
          </Link>
        </div>
      ) : (
        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_20rem]">
          <ul className="divide-y divide-forest/10 border-y border-forest/10">
            {items.map((item) => (
              <li key={item.productId} className="flex gap-5 py-6">
                <Link
                  href={`/product/${item.productId}`}
                  className="relative h-28 w-24 flex-none overflow-hidden bg-forest/5"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between gap-3">
                    <Link
                      href={`/product/${item.productId}`}
                      className="font-serif text-lg text-forest link-gold"
                    >
                      {item.name}
                    </Link>
                    <span className="font-serif text-lg text-gold">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-ink/50">
                    {formatPrice(item.price)} each
                  </p>
                  <div className="mt-auto flex items-center gap-4 pt-4">
                    <div className="flex items-center border border-forest/20">
                      <button
                        type="button"
                        onClick={() => setQty(item.productId, item.quantity - 1)}
                        aria-label="Decrease quantity"
                        className="px-3 py-1.5 text-lg leading-none text-ink/60 hover:text-forest"
                      >
                        −
                      </button>
                      <span className="min-w-8 text-center text-sm text-ink">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQty(item.productId, item.quantity + 1)}
                        aria-label="Increase quantity"
                        className="px-3 py-1.5 text-lg leading-none text-ink/60 hover:text-forest"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(item.productId)}
                      className="text-xs uppercase tracking-widest2 text-red-700/70 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <aside className="h-fit border border-forest/10 bg-white p-6">
            <h2 className="font-serif text-xl text-forest">Order Summary</h2>
            <div className="gold-rule mt-4" />
            <div className="mt-6 flex justify-between text-sm text-ink/70">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <p className="mt-2 text-xs text-ink/40">
              Shipping &amp; taxes calculated at checkout.
            </p>
            <Link href="/checkout" className="btn-gold mt-6 block w-full text-center">
              Proceed to Checkout
            </Link>
            <Link
              href="/collections"
              className="mt-4 block text-center text-xs uppercase tracking-widest2 text-ink/50 underline underline-offset-4 hover:text-ink"
            >
              Continue Shopping
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
