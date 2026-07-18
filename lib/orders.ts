// JSON-file-backed order store. Checkout is simulated — placing an order writes
// a record here (no payment is taken). Orders may belong to a logged-in shopper
// (userId set) or a guest (userId null).
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

export type OrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

export type Order = {
  id: string;
  userId: string | null;
  email: string;
  name: string;
  address: string;
  items: OrderItem[];
  total: number;
  createdAt: string;
};

const DATA_PATH = path.join(process.cwd(), "data", "orders.json");

async function readAll(): Promise<Order[]> {
  try {
    const raw = await fs.readFile(DATA_PATH, "utf-8");
    return JSON.parse(raw) as Order[];
  } catch {
    return [];
  }
}

async function writeAll(orders: Order[]): Promise<void> {
  await fs.writeFile(DATA_PATH, JSON.stringify(orders, null, 2) + "\n", "utf-8");
}

// Short, human-facing order number derived from the uuid.
export function orderNumber(order: Order): string {
  return order.id.slice(0, 8).toUpperCase();
}

export async function createOrder(input: {
  userId: string | null;
  email: string;
  name: string;
  address: string;
  items: OrderItem[];
}): Promise<Order> {
  const orders = await readAll();
  const total = input.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const order: Order = {
    id: randomUUID(),
    userId: input.userId,
    email: input.email.trim(),
    name: input.name.trim(),
    address: input.address.trim(),
    items: input.items,
    total,
    createdAt: new Date().toISOString(),
  };
  orders.push(order);
  await writeAll(orders);
  return order;
}

export async function getOrder(id: string): Promise<Order | undefined> {
  return (await readAll()).find((o) => o.id === id);
}

export async function getOrdersByUser(userId: string): Promise<Order[]> {
  return (await readAll())
    .filter((o) => o.userId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
