"use client";

import { useEffect, useRef, useState } from "react";
import { useCart, type CartItem } from "@/components/cart/CartContext";

export default function AddToCartButton({
  product,
  quantity = 1,
  variant = "gold",
  className = "",
}: {
  product: Omit<CartItem, "quantity">;
  quantity?: number;
  variant?: "gold" | "dark";
  className?: string;
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(timer.current), []);

  function onClick() {
    add(product, quantity);
    setAdded(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 1500);
  }

  const base = variant === "dark" ? "btn-dark" : "btn-gold";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-live="polite"
      className={`${base} ${className}`}
    >
      {added ? "Added ✓" : "Add to Cart"}
    </button>
  );
}
