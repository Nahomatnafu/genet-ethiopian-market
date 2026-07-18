import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/customer-auth";
import { getProductById } from "@/lib/products";
import { createOrder, type OrderItem } from "@/lib/orders";

type IncomingItem = { productId: string; quantity: number };

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const { name, email, address } = body ?? {};
  const incoming: IncomingItem[] = Array.isArray(body?.items) ? body.items : [];

  if (!name?.trim() || !email?.trim() || !address?.trim()) {
    return NextResponse.json(
      { error: "Name, email, and shipping address are required" },
      { status: 400 }
    );
  }
  if (incoming.length === 0) {
    return NextResponse.json({ error: "Your cart is empty" }, { status: 400 });
  }

  // Re-price every line from the server-side catalog — never trust the client's
  // prices — and drop anything that no longer exists.
  const items: OrderItem[] = [];
  for (const line of incoming) {
    const product = await getProductById(line.productId);
    const quantity = Math.max(1, Math.floor(Number(line.quantity) || 0));
    if (!product) continue;
    items.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.image,
    });
  }

  if (items.length === 0) {
    return NextResponse.json(
      { error: "None of the items in your cart are available anymore" },
      { status: 400 }
    );
  }

  const user = await getCurrentUser();
  const order = await createOrder({
    userId: user?.id ?? null,
    email,
    name,
    address,
    items,
  });

  return NextResponse.json({ orderId: order.id });
}
