# ZION LED USA

Next.js storefront for `zionledusa.com`, backed by the real scraped catalog in `data/export.json`.

## Repo Layout

- `zionled-nextjs/`: Next.js app
- `data/`: real scraped catalog data and source assets

## Local Run

```bash
cd zionled-nextjs
npm install
npm run dev
```

## Production Build

```bash
cd zionled-nextjs
npm run build
```

## Vercel Deployment

Use this repo as the source, then set the Vercel project Root Directory to:

```bash
zionled-nextjs
```

Notes:

- `zionled-nextjs/vercel.json` is included.
- The app resolves `export.json` from either `zionled-nextjs/data/export.json` or the repo-level `data/export.json`.
- Node version is pinned through `zionled-nextjs/package.json` to `20.x`.

## Data

Real source data is committed in:

```bash
data/export.json
```

For deployment safety, the same export is also copied to:

```bash
zionled-nextjs/data/export.json
```
