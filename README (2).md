# ZION LED USA — WordPress → Next.js Migration

## Quick Start (3 commands)

```bash
pip install requests beautifulsoup4 Pillow tqdm rich
python zionled_scraper.py
python setup_nextjs.py
```

---

## Phase Plan

### Phase 1 — Scrape (Day 1)
```bash
# Basic (no API keys needed)
python zionled_scraper.py

# Full data with pricing & stock (if client gives WooCommerce API keys)
python zionled_scraper.py --wc-key ck_xxx --wc-secret cs_xxx
```
Output: `data/` folder with all products, categories, images, pages as JSON + WebP images.

### Phase 2 — Scaffold Next.js (Day 1)
```bash
python setup_nextjs.py
cd zionled-nextjs
npm install
cp ../data/export.json src/data/export.json
cp -r ../data/images_optimized public/images
npm run dev
```

### Phase 3 — Build UI Components (Days 2–5)
Port the client HTML (`zionledusa-redesign.html`) section by section:
1. `HeroSection.tsx` — Three.js canvas + animated text
2. `ProductsSection.tsx` — Filter tabs + card grid ✅ (scaffolded)
3. `CategoryGrid.tsx` — Shop by category
4. `StatsSection.tsx` — Animated counters
5. `WhyUsSection.tsx` — Feature cards
6. `Navbar.tsx` ✅ (scaffolded)
7. `Footer.tsx`

### Phase 4 — Image Pipeline (Day 3)
Upload `data/images_optimized/` to Cloudinary, then update image URLs:
```bash
# Install Cloudinary CLI
npm install -g cloudinary-cli
cld config -u cloudinary://API_KEY:API_SECRET@CLOUD_NAME
cld upload "data/images_optimized/**/*" --folder zionled
```

### Phase 5 — SEO & Performance (Day 5–6)
- All product pages use `generateStaticParams()` → pre-built at deploy time
- `next/image` handles WebP conversion, lazy load, blur placeholders
- Metadata API for per-page `<title>` and `<meta description>`
- Add `sitemap.ts` (Next.js 15 built-in)
- Add `robots.ts`

### Phase 6 — Deploy (Day 7)
```bash
npm run build
# Push to GitHub, connect to Vercel
# vercel --prod
```

---

## Project Structure

```
zionled-nextjs/
├── src/
│   ├── app/
│   │   ├── layout.tsx          ← Root layout, fonts, metadata
│   │   ├── page.tsx            ← Homepage
│   │   ├── products/
│   │   │   ├── page.tsx        ← All products listing
│   │   │   └── [slug]/
│   │   │       └── page.tsx    ← Individual product (SSG)
│   │   ├── category/
│   │   │   └── [slug]/
│   │   │       └── page.tsx    ← Category page (SSG)
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── sitemap.ts          ← Auto sitemap
│   │   └── robots.ts
│   ├── components/
│   │   ├── sections/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── ProductsSection.tsx ✅
│   │   │   ├── StatsSection.tsx
│   │   │   ├── TrustRow.tsx
│   │   │   └── WhyUsSection.tsx
│   │   ├── Navbar.tsx ✅
│   │   ├── Footer.tsx
│   │   └── ui/
│   │       ├── ProductCard.tsx
│   │       └── CategoryCard.tsx
│   ├── lib/
│   │   └── data.ts ✅          ← Query helpers
│   ├── types/
│   │   └── product.ts ✅       ← TypeScript types
│   └── data/
│       └── export.json         ← Paste from scraper output
├── public/
│   └── images/                 ← WebP product images
├── next.config.ts ✅
├── tailwind.config.ts ✅
└── tsconfig.json ✅
```

---

## Image Strategy

| Stage       | Tool         | What it does                          |
|-------------|--------------|---------------------------------------|
| Scrape      | Pillow       | Download + convert to WebP locally    |
| Development | next/image   | Serves from public/images with lazy load |
| Production  | Cloudinary   | Global CDN, auto-resize, auto-format  |
| Caching     | Cloudflare   | Edge cache in front of everything     |

In Next.js, use `next/image` like this:
```tsx
<Image
  src={product.images[0].url}
  alt={product.name}
  fill
  className="object-contain"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,/9j/4AAQ..."  // tiny base64
  priority={isAboveFold}  // true only for first visible images
/>
```

---

## WooCommerce API Keys (get from client)

`WP Admin → WooCommerce → Settings → Advanced → REST API → Add Key`
- Permissions: Read
- Give the generated `ck_...` and `cs_...` to the scraper

---

## Key Next.js 15 Features Used

- `generateStaticParams()` — pre-builds every product/category page at build time
- `next/font/google` — loads Rajdhani + Exo 2 with zero layout shift  
- `next/image` — automatic WebP, lazy loading, `fill` layout
- Metadata API — per-page SEO titles and descriptions
- Server Components by default — product pages render on server, zero JS bundle for product data
- ISR (Incremental Static Regeneration) — `revalidate: 3600` for hourly updates
