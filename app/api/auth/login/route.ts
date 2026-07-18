import { NextRequest, NextResponse } from "next/server";
import { findByEmail, toPublicUser, verifyPassword } from "@/lib/users";
import {
  CUSTOMER_COOKIE,
  SESSION_MAX_AGE,
  createSessionToken,
} from "@/lib/customer-auth";

export async function POST(request: NextRequest) {
  const { email, password } = await request
    .json()
    .catch(() => ({ email: "", password: "" }));

  const user = email ? await findByEmail(email) : undefined;
  if (!user || !(await verifyPassword(user, password ?? ""))) {
    return NextResponse.json(
      { error: "Incorrect email or password" },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ user: toPublicUser(user) });
  response.cookies.set(CUSTOMER_COOKIE, await createSessionToken(user.id), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return response;
}

// Logout — clear the session cookie.
export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(CUSTOMER_COOKIE, "", { path: "/", maxAge: 0 });
  return response;
}
