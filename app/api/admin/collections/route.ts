import { NextRequest, NextResponse } from "next/server";
import { createCollection, getCollections } from "@/lib/collections";

export async function GET() {
  return NextResponse.json(await getCollections());
}

export async function POST(request: NextRequest) {
  const { name } = await request.json().catch(() => ({ name: "" }));
  if (typeof name !== "string" || !name.trim()) {
    return NextResponse.json(
      { error: "Collection name is required" },
      { status: 400 }
    );
  }
  return NextResponse.json(await createCollection(name), { status: 201 });
}
