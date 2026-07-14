import { NextRequest, NextResponse } from "next/server";
import { deleteCollection, renameCollection } from "@/lib/collections";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { name } = await request.json().catch(() => ({ name: "" }));
  if (typeof name !== "string" || !name.trim()) {
    return NextResponse.json(
      { error: "Collection name is required" },
      { status: 400 }
    );
  }
  const updated = await renameCollection(params.id, name);
  if (!updated) {
    return NextResponse.json({ error: "Collection not found" }, { status: 404 });
  }
  return NextResponse.json(updated);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const deleted = await deleteCollection(params.id);
  if (!deleted) {
    return NextResponse.json({ error: "Collection not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
