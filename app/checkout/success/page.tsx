import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getOrder, orderNumber } from "@/lib/orders";
import { formatPrice } from "@/lib/products";

export const metadata: Metadata = { title: "Order Confirmed" };

export const dynamic = "force-dynamic";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { order?: string };
}) {
  const order = searchParams.order
    ? await getOrder(searchParams.order)
    : undefined;

  if (!order) {
    return (
      <div className="mx-auto max-w-md px-5 py-24 text-center">
        <h1 className="font-serif text-4xl text-forest">Order not found</h1>
        <div className="gold-rule mx-auto mt-6" />
        <Link href="/collections" className="btn-dark mt-8 inline-block">
          Browse Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-20">
      <div className="text-center">
        <p className="text-xs uppercase tracking-widest2 text-gold">
          Thank You
        </p>
        <h1 className="mt-4 font-serif text-4xl text-forest sm:text-5xl">
          Order Confirmed
        </h1>
        <div className="gold-rule mx-auto mt-6" />
        <p className="mt-6 text-sm leading-relaxed text-ink/60">
          Thanks, {order.name.split(" ")[0]}! Your order{" "}
          <span className="font-medium text-forest">
            #{orderNumber(order)}
          </span>{" "}
          is confirmed. A confirmation will be sent to{" "}
          <span className="text-forest">{order.email}</span>.
        </p>
      </div>

      <section className="mt-12 border border-forest/10 bg-white p-6">
        <h2 className="font-serif text-xl text-forest">Order Details</h2>
        <div className="gold-rule mt-4" />
        <ul className="mt-6 space-y-4">
          {order.items.map((item) => (
            <li key={item.productId} className="flex items-center gap-4">
              <div className="relative h-16 w-14 flex-none overflow-hidden bg-forest/5">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm text-ink">{item.name}</p>
                <p className="text-xs text-ink/50">
                  {formatPrice(item.price)} × {item.quantity}
                </p>
              </div>
              <span className="text-sm text-ink/70">
                {formatPrice(item.price * item.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex justify-between border-t border-forest/10 pt-4 font-serif text-lg text-forest">
          <span>Total</span>
          <span className="text-gold">{formatPrice(order.total)}</span>
        </div>
        <div className="mt-6 border-t border-forest/10 pt-4 text-sm text-ink/60">
          <p className="text-xs uppercase tracking-widest2 text-ink/40">
            Shipping To
          </p>
          <p className="mt-2 whitespace-pre-line">{order.address}</p>
        </div>
      </section>

      <div className="mt-10 text-center">
        <Link href="/collections" className="btn-dark inline-block">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
