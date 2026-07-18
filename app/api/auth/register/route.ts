import { NextRequest, NextResponse } from "next/server";
import { createUser, findByEmail, toPublicUser } from "@/lib/users";
import {
  CUSTOMER_COOKIE,
  SESSION_MAX_AGE,
  createSessionToken,
} from "@/lib/customer-auth";

export async function POST(request: NextRequest) {
  const { email, name, password } = await request
    .json()
    .catch(() => ({ email: "", name: "", password: "" }));

  if (!email?.trim() || !name?.trim() || !password) {
    return NextResponse.json(
      { error: "Name, email, and password are all required" },
      { status: 400 }
    );
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
    return NextResponse.json(
      { error: "Please enter a valid email address" },
      { status: 400 }
    );
  }
  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters" },
      { status: 400 }
    );
  }
  if (await findByEmail(email)) {
    return NextResponse.json(
      { error: "An account with that email already exists" },
      { status: 409 }
    );
  }

  const user = await createUser({ email, name, password });
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
