"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import type { Collection } from "@/lib/collections";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [collections, setCollections] = useState<Collection[] | null>(null);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    const res = await fetch("/api/admin/collections", { cache: "no-store" });
    if (res.status === 401) {
      router.replace("/admin");
      return;
    }
    setCollections(await res.json());
  }, [router]);

  useEffect(() => {
    reload();
  }, [reload]);

  async function handle(action: () => Promise<Response>) {
    setError("");
    const res = await action();
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong");
    }
    await reload();
  }

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.replace("/admin");
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest2 text-gold">Admin</p>
          <h1 className="mt-2 font-serif text-3xl text-forest">
            Manage Collections
          </h1>
        </div>
        <button
          type="button"
          onClick={logout}
          className="text-xs uppercase tracking-widest2 text-ink/50 underline underline-offset-4 hover:text-ink"
        >
          Sign Out
        </button>
      </div>
      <div className="gold-rule mt-5" />

      {error && (
        <p className="mt-6 border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      )}

      <NewCollectionForm onCreate={(name) =>
        handle(() =>
          fetch("/api/admin/collections", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name }),
          })
        )
      } />

      {collections === null ? (
        <p className="mt-10 text-sm text-ink/50">Loading…</p>
      ) : collections.length === 0 ? (
        <p className="mt-10 text-sm text-ink/50">
          No collections yet — create one above.
        </p>
      ) : (
        <div className="mt-10 space-y-12">
          {collections.map((collection) => (
            <CollectionEditor
              key={collection.id}
              collection={collection}
              onRename={(name) =>
                handle(() =>
                  fetch(`/api/admin/collections/${collection.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name }),
                  })
                )
              }
              onDelete={() =>
                handle(() =>
                  fetch(`/api/admin/collections/${collection.id}`, {
                    method: "DELETE",
                  })
                )
              }
              onUpload={(files) => {
                const form = new FormData();
                Array.from(files).forEach((f) => form.append("files", f));
                return handle(() =>
                  fetch(`/api/admin/collections/${collection.id}/photos`, {
                    method: "POST",
                    body: form,
                  })
                );
              }}
              onDeletePhoto={(photoId) =>
                handle(() =>
                  fetch(
                    `/api/admin/collections/${collection.id}/photos/${photoId}`,
                    { method: "DELETE" }
                  )
                )
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

function NewCollectionForm({
  onCreate,
}: {
  onCreate: (name: string) => Promise<void>;
}) {
  const [name, setName] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    await onCreate(name);
    setName("");
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 flex max-w-md gap-3">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="New collection name"
        className="flex-1 border border-forest/20 bg-white px-4 py-2.5 text-sm text-ink outline-none focus:border-gold"
      />
      <button type="submit" className="btn-dark !px-5 !py-2.5">
        Create
      </button>
    </form>
  );
}

function CollectionEditor({
  collection,
  onRename,
  onDelete,
  onUpload,
  onDeletePhoto,
}: {
  collection: Collection;
  onRename: (name: string) => Promise<void>;
  onDelete: () => Promise<void>;
  onUpload: (files: FileList) => Promise<void>;
  onDeletePhoto: (photoId: string) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(collection.name);
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  async function submitRename(e: FormEvent) {
    e.preventDefault();
    if (name.trim() && name.trim() !== collection.name) {
      await onRename(name);
    }
    setEditing(false);
  }

  return (
    <section className="border border-forest/10 bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {editing ? (
          <form onSubmit={submitRename} className="flex flex-1 gap-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              className="flex-1 border border-forest/20 px-3 py-1.5 font-serif text-xl text-forest outline-none focus:border-gold"
            />
            <button type="submit" className="text-xs uppercase tracking-widest2 text-gold">
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setName(collection.name);
                setEditing(false);
              }}
              className="text-xs uppercase tracking-widest2 text-ink/40"
            >
              Cancel
            </button>
          </form>
        ) : (
          <h2 className="font-serif text-xl text-forest">
            {collection.name}
            <span className="ml-3 text-xs font-sans uppercase tracking-widest2 text-ink/40">
              /{collection.slug}
            </span>
          </h2>
        )}

        {!editing && (
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="text-xs uppercase tracking-widest2 text-ink/50 hover:text-ink"
            >
              Rename
            </button>
            <button
              type="button"
              onClick={() => {
                if (
                  confirm(
                    `Delete "${collection.name}" and all ${collection.photos.length} of its photos? This cannot be undone.`
                  )
                ) {
                  onDelete();
                }
              }}
              className="text-xs uppercase tracking-widest2 text-red-700/70 hover:text-red-700"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6">
        {collection.photos.map((photo) => (
          <div key={photo.id} className="group relative aspect-square bg-forest/5">
            <Image
              src={photo.url}
              alt={photo.alt}
              fill
              sizes="(max-width: 640px) 50vw, 16vw"
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => onDeletePhoto(photo.id)}
              aria-label="Delete photo"
              className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center bg-forest-deep/80 text-lg leading-none text-cream opacity-0 transition-opacity hover:bg-red-700 group-hover:opacity-100"
            >
              &times;
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          disabled={uploading}
          className="flex aspect-square flex-col items-center justify-center border border-dashed border-forest/30 text-ink/40 transition-colors hover:border-gold hover:text-gold disabled:opacity-50"
        >
          <span className="text-3xl font-light leading-none">+</span>
          <span className="mt-1 text-[0.6rem] uppercase tracking-widest2">
            {uploading ? "Uploading…" : "Add Photos"}
          </span>
        </button>
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={async (e) => {
            if (!e.target.files?.length) return;
            setUploading(true);
            await onUpload(e.target.files);
            setUploading(false);
            e.target.value = "";
          }}
        />
      </div>
    </section>
  );
}
