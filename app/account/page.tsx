import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getCurrentUser } from "@/lib/customer-auth";
import { getOrdersByUser, orderNumber } from "@/lib/orders";
import { formatPrice } from "@/lib/products";
import SignOutButton from "@/components/SignOutButton";

export const metadata: Metadata = { title: "My Account" };

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-5 py-24 text-center">
        <p className="text-xs uppercase tracking-widest2 text-gold">My Account</p>
        <h1 className="mt-4 font-serif text-4xl text-forest">Sign In</h1>
        <div className="gold-rule mx-auto mt-6" />
        <p className="mt-6 text-sm leading-relaxed text-ink/60">
          Sign in to view your order history, or create an account to get started.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/login" className="btn-dark">
            Sign In
          </Link>
          <Link href="/register" className="btn-gold">
            Create Account
          </Link>
        </div>
      </div>
    );
  }

  const orders = await getOrdersByUser(user.id);

  return (
    <div className="mx-auto max-w-4xl px-5 py-20">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest2 text-gold">My Account</p>
          <h1 className="mt-3 font-serif text-4xl text-forest">
            Hello, {user.name}
          </h1>
          <p className="mt-2 text-sm text-ink/50">{user.email}</p>
        </div>
        <SignOutButton />
      </div>
      <div className="gold-rule mt-6" />

      <h2 className="mt-12 font-serif text-2xl text-forest">Order History</h2>
      {orders.length === 0 ? (
        <p className="mt-6 text-sm text-ink/60">
          You haven&apos;t placed any orders yet.{" "}
          <Link
            href="/collections"
            className="text-forest underline decoration-gold underline-offset-4"
          >
            Start shopping
          </Link>
          .
        </p>
      ) : (
        <div className="mt-6 space-y-6">
          {orders.map((order) => (
            <section key={order.id} className="border border-forest/10 bg-white p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-forest/10 pb-4">
                <div>
                  <p className="font-serif text-lg text-forest">
                    Order #{orderNumber(order)}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-widest2 text-ink/40">
                    {new Date(order.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <p className="font-serif text-xl text-gold">
                  {formatPrice(order.total)}
                </p>
              </div>
              <ul className="mt-4 space-y-3">
                {order.items.map((item) => (
                  <li key={item.productId} className="flex items-center gap-4">
                    <div className="relative h-14 w-14 flex-none overflow-hidden bg-forest/5">
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
                    <p className="text-sm text-ink/70">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
