import { NextRequest, NextResponse } from "next/server";
import { removePhoto } from "@/lib/collections";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string; photoId: string } }
) {
  const removed = await removePhoto(params.id, params.photoId);
  if (!removed) {
    return NextResponse.json({ error: "Photo not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
