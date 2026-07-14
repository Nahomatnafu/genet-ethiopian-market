import { NextRequest, NextResponse } from "next/server";
import { addPhoto, saveUpload } from "@/lib/collections";

// Accepts either a multipart form with one or more image `files`, or a JSON
// body { url, alt } to add a photo by external URL (stock / Cloudinary).
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const { url, alt } = await request.json().catch(() => ({}));
    if (typeof url !== "string" || !url.trim()) {
      return NextResponse.json({ error: "Photo URL is required" }, { status: 400 });
    }
    const photo = await addPhoto(params.id, {
      url: url.trim(),
      alt: typeof alt === "string" ? alt : "",
    });
    if (!photo) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 });
    }
    return NextResponse.json(photo, { status: 201 });
  }

  const form = await request.formData();
  const files = form
    .getAll("files")
    .filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length === 0) {
    return NextResponse.json({ error: "No files provided" }, { status: 400 });
  }

  const created = [];
  for (const file of files) {
    const saved = await saveUpload(file);
    if ("error" in saved) {
      return NextResponse.json({ error: saved.error }, { status: 400 });
    }
    const photo = await addPhoto(params.id, {
      url: saved.url,
      alt: file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "),
    });
    if (!photo) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 });
    }
    created.push(photo);
  }
  return NextResponse.json(created, { status: 201 });
}
