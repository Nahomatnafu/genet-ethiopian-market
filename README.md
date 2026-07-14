# Genet Ethiopian Market

Lookbook-style website for Genet Ethiopian Market (Wheaton, MD) — Ethiopian & Eritrean traditional clothing, family matching sets, and authentic groceries. Built with Next.js (App Router, TypeScript) and Tailwind CSS.

## Running locally

```bash
npm install
cp .env.local.example .env.local   # set ADMIN_PASSWORD
npm run dev
```

Open http://localhost:3000.

## Pages

- `/` — Home (hero, pillars, featured collections, our story, Instagram teaser, testimonials)
- `/collections` — all collections; `/collections/[slug]` — photo grid with lightbox
- `/visit` — map, hours, phone, Instagram
- `/admin` — hidden, password-gated admin (not linked from the site). Create/rename/delete collections and add/remove photos.

## How photo collections work

Collection data lives in `data/collections.json`; photos uploaded via the admin are stored in `public/uploads/` (gitignored). All reads/writes go through `lib/collections.ts` — this is the single seam to swap for a **Cloudinary**-backed store later. Note: file-based storage works in dev/self-hosted environments but not on serverless hosts like Vercel (read-only filesystem) — move to Cloudinary before deploying there.

## Placeholder content to replace before launch

- All Unsplash stock photos (seeded in `data/collections.json`, hero image in `app/page.tsx`) — replace via the admin panel / with client photography
- Testimonials in `app/page.tsx` — marked `[PLACEHOLDER — REPLACE WITH REAL REVIEW]`
- "Our Story" paragraph in `app/page.tsx` — replace with the owner's own words
- Sunday hours in `lib/site.ts` — confirm with the owner
