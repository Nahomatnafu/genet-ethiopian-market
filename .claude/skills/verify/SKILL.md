---
name: verify
description: Build, launch, and drive the Genet Ethiopian Market Next.js site to verify changes end-to-end.
---

# Verifying this project

Next.js 14 App Router site; all shop pages are `force-dynamic` and read `data/collections.json` per request, so data edits show up without a rebuild.

## Launch

- The owner usually has `npm run dev` running on **port 3000** — check `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/` first and verify against it if up (it hot-reloads code changes).
- **Gotcha:** `npm run build` / `next start` share the `.next` directory with a running dev server and clobber each other — routes 500 with mixed manifests. Don't run `next start` while the dev server is up; verify against the dev server instead.
- Cold launch: `npm run build` then `npx next start -p <port>` (only when no dev server is running).

## Drive

- Pages: `/`, `/collections`, `/collections/<slug>` (slugs live in `data/collections.json`), `/product/<photo-id>`, `/visit`.
- Prices/names come from `data/collections.json` photos (`name`, `price`, optional `compareAt` → struck-through "was" price in `components/ProductGrid.tsx` and `app/product/[id]/page.tsx`).
- Checkout probe: `POST /api/checkout` with `{name,email,address,items:[{productId,quantity}]}` — server re-prices from the catalog and ignores client prices; unknown ids are dropped. Orders append to `data/orders.json` — **delete your test order afterwards** (filter by returned `orderId`).
- Favicon: `/icon.svg` should return `image/svg+xml`; the logo mark is `components/LogoMark.tsx` (grep homepage HTML for `M24 4 L44 24` to confirm nav+footer render it).
