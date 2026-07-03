# Scent · Perfume Collection

A mobile-friendly web app to browse well-known perfumes and organise them into
two lists:

- **Wishlist** — fragrances you want
- **Collection** — fragrances you already own

Each perfume has an illustrated visual, main accords, a full **notes pyramid**
(top / heart / base) and the **occasions** it suits. Search by name or brand and
filter by gender or occasion. Your two lists are saved locally in your browser
(no account needed) and persist across reloads.

## Requirements

- [Node.js](https://nodejs.org) 18+ (LTS recommended)

## Getting started

Open a terminal in this folder and run:

```bash
npm install     # first time only
npm run dev      # start the app in development
```

Then open the URL it prints (default http://localhost:5173) in your browser.
On a phone, open that address while on the same Wi-Fi network.

## Build for production

```bash
npm run build    # outputs a static site to ./dist
npm run preview  # preview the production build locally
```

The contents of `dist/` can be hosted for free on services like Netlify,
Vercel, or GitHub Pages.

## Images

Each perfume shows a real product photo, loaded from Fragrantica's image CDN via
the perfume's Fragrantica ID in [`src/data/fragranticaIds.js`](src/data/fragranticaIds.js).
This provides one clean bottle shot per perfume (72 of 73 have one; the rest fall
back to a generated placeholder). No free source offers separate
bottle-only / box-only photos, so the detail page shows a gallery that adapts to
however many images exist.

To use your own photos — including the ideal three shots (bottle + box, bottle
only, box only) — add an `images` array to a perfume in
[`src/data/perfumes.js`](src/data/perfumes.js); it takes priority over the
Fragrantica image:

```js
images: [
  '/images/bleu-de-chanel/1.jpg', // bottle + box
  '/images/bleu-de-chanel/2.jpg', // bottle only
  '/images/bleu-de-chanel/3.jpg', // box only
]
```

Put the files under `public/images/...` and they'll be served from those paths.
Any missing or broken image gracefully falls back to the illustrated placeholder.

## Adding or editing perfumes

All fragrance data lives in [`src/data/perfumes.js`](src/data/perfumes.js).
Append a new object with the same shape to add a perfume (optionally add its
Fragrantica ID to [`src/data/fragranticaIds.js`](src/data/fragranticaIds.js) for
a photo, or give it an `images` array of your own).

## Project structure

```
src/
  data/          perfume dataset + occasion/gender vocabulary
  context/        wishlist & collection state (persisted to localStorage)
  hooks/          useLocalStorage
  components/     cards, grid, nav, tags, notes pyramid, toggles, image
  pages/          Discover, Wishlist, Collection, PerfumeDetail
  styles/         global.css (theme via CSS variables)
```
