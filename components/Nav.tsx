"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { useCart } from "@/components/cart/CartContext";
import LogoMark from "@/components/LogoMark";
import type { PublicUser } from "@/lib/users";

const links = [
  { href: "/", label: "Home" },
  { href: "/collections", label: "Shop" },
  { href: "/visit", label: "Visit Us" },
];

export default function Nav({ user }: { user: PublicUser | null }) {
  const pathname = usePathname();
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-gold/20 bg-forest-deep/95 text-cream backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="group flex items-center gap-3">
          <LogoMark className="h-9 w-9 flex-none text-gold" />
          <span>
            <span className="font-serif text-2xl tracking-wide text-cream">
              Genet
            </span>
            <span className="ml-2 hidden text-[0.65rem] uppercase tracking-widest2 text-gold sm:inline">
              Ethiopian Market
            </span>
          </span>
        </Link>

        <ul className="hidden items-center gap-10 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                className="link-gold text-xs uppercase tracking-widest2"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href={user ? "/account" : "/login"}
              aria-current={pathname === "/account" ? "page" : undefined}
              className="link-gold text-xs uppercase tracking-widest2"
            >
              {user ? "Account" : "Sign In"}
            </Link>
          </li>
          <li>
            <Link
              href="/cart"
              aria-label={`Cart, ${count} ${count === 1 ? "item" : "items"}`}
              className="relative flex items-center text-cream transition-colors hover:text-gold"
            >
              <CartIcon />
              {count > 0 && (
                <span className="absolute -right-2.5 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[0.6rem] font-medium text-forest-deep">
                  {count}
                </span>
              )}
            </Link>
          </li>
          <li>
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-gold transition-opacity hover:opacity-70"
            >
              <InstagramIcon />
            </a>
          </li>
        </ul>

        {/* Cart stays reachable on mobile, grouped with the menu toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <Link
            href="/cart"
            aria-label={`Cart, ${count} ${count === 1 ? "item" : "items"}`}
            className="relative flex items-center text-cream"
          >
            <CartIcon />
            {count > 0 && (
              <span className="absolute -right-2.5 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[0.6rem] font-medium text-forest-deep">
                {count}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5"
          >
            <span
              className={`h-px w-6 bg-gold transition-transform ${open ? "translate-y-[3.5px] rotate-45" : ""}`}
            />
            <span
              className={`h-px w-6 bg-gold transition-transform ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`}
            />
          </button>
        </div>
      </nav>

      {open && (
        <ul className="border-t border-gold/20 px-5 pb-6 pt-2 md:hidden">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                className="block py-3 text-sm uppercase tracking-widest2"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href={user ? "/account" : "/login"}
              aria-current={pathname === "/account" ? "page" : undefined}
              className="block py-3 text-sm uppercase tracking-widest2"
            >
              {user ? "Account" : "Sign In"}
            </Link>
          </li>
          <li>
            <Link
              href="/cart"
              className="block py-3 text-sm uppercase tracking-widest2"
            >
              Cart{count > 0 ? ` (${count})` : ""}
            </Link>
          </li>
          <li>
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="block py-3 text-sm uppercase tracking-widest2 text-gold"
            >
              Instagram
            </a>
          </li>
        </ul>
      )}
    </header>
  );
}

export function InstagramIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function CartIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M6 6h15l-1.5 9h-12z" />
      <path d="M6 6L5 3H3" />
      <circle cx="9" cy="19" r="1.4" />
      <circle cx="17" cy="19" r="1.4" />
    </svg>
  );
}
