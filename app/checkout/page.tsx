"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { useCart } from "@/components/cart/CartContext";
import { formatPrice } from "@/lib/product-types";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clear } = useCart();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Prefill from the signed-in shopper, if any.
  useEffect(() => {
    let active = true;
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (!active || !data.user) return;
        setLoggedIn(true);
        setName((v) => v || data.user.name || "");
        setEmail((v) => v || data.user.email || "");
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        address,
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
      }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong");
      setBusy(false);
      return;
    }
    const { orderId } = await res.json();
    clear();
    router.push(`/checkout/success?order=${orderId}`);
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md px-5 py-24 text-center">
        <p className="text-xs uppercase tracking-widest2 text-gold">Checkout</p>
        <h1 className="mt-4 font-serif text-4xl text-forest">Your cart is empty</h1>
        <div className="gold-rule mx-auto mt-6" />
        <Link href="/collections" className="btn-dark mt-8 inline-block">
          Browse Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-20">
      <p className="text-xs uppercase tracking-widest2 text-gold">Checkout</p>
      <h1 className="mt-4 font-serif text-4xl text-forest sm:text-5xl">
        Complete Your Order
      </h1>
      <div className="gold-rule mt-6" />

      {!loggedIn && (
        <p className="mt-6 text-sm text-ink/60">
          Checking out as a guest.{" "}
          <Link
            href="/login?next=/checkout"
            className="text-forest underline decoration-gold underline-offset-4"
          >
            Sign in
          </Link>{" "}
          to save this order to your account.
        </p>
      )}

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_20rem]">
        <form onSubmit={onSubmit} className="space-y-5">
          {error && (
            <p className="border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </p>
          )}
          <label className="block">
            <span className="text-xs uppercase tracking-widest2 text-ink/60">
              Full Name
            </span>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full border border-forest/20 bg-white px-4 py-2.5 text-sm text-ink outline-none focus:border-gold"
            />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-widest2 text-ink/60">
              Email
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full border border-forest/20 bg-white px-4 py-2.5 text-sm text-ink outline-none focus:border-gold"
            />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-widest2 text-ink/60">
              Shipping Address
            </span>
            <textarea
              required
              rows={4}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Street, city, state, ZIP"
              className="mt-2 w-full resize-none border border-forest/20 bg-white px-4 py-2.5 text-sm text-ink outline-none focus:border-gold"
            />
          </label>
          <button
            type="submit"
            disabled={busy}
            className="btn-gold w-full disabled:opacity-50"
          >
            {busy ? "Placing Order…" : "Place Order"}
          </button>
          <p className="text-center text-xs text-ink/40">
            This is a demo store — no payment is taken and no card is charged.
          </p>
        </form>

        <aside className="h-fit border border-forest/10 bg-white p-6">
          <h2 className="font-serif text-xl text-forest">Order Summary</h2>
          <div className="gold-rule mt-4" />
          <ul className="mt-6 space-y-4">
            {items.map((item) => (
              <li key={item.productId} className="flex items-center gap-3">
                <div className="relative h-14 w-12 flex-none overflow-hidden bg-forest/5">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-ink">{item.name}</p>
                  <p className="text-xs text-ink/50">Qty {item.quantity}</p>
                </div>
                <span className="text-sm text-ink/70">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex justify-between border-t border-forest/10 pt-4 font-serif text-lg text-forest">
            <span>Total</span>
            <span className="text-gold">{formatPrice(subtotal)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
