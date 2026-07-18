import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/customer-auth";

// Returns the signed-in shopper (or null) for client components that need to
// prefill forms or reflect auth state.
export async function GET() {
  const user = await getCurrentUser();
  return NextResponse.json({ user });
}
