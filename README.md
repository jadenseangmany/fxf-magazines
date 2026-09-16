# friends x friends

A handwriting-led magazine and community site. Design rules live in [DESIGN.md](./DESIGN.md).

## Pages

- `/` home
- `/about` about
- `/catalogs` catalog 1 — monthly covers, newest first, horizontal rail
- `/catalogs/[slug]` catalog 2 — book-style PDF reader + comments
- `/suggestions` idea inbox
- `/upload` add a monthly PDF (anyone)

## Local

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Vercel Blob

Uploads go to Vercel Blob once `BLOB_READ_WRITE_TOKEN` is in the environment (Hobby is free within its 1 GB cap).

1. Deploy or link this repo on [Vercel](https://vercel.com).
2. In the project: **Storage → Create Database → Blob**. Set access to **Public**, and include the **Development** environment.
3. Pull the token locally:

```bash
npx vercel env pull .env.local
```

Or copy `BLOB_READ_WRITE_TOKEN` from the Blob store into `.env.local`. Restart `npm run dev` after that. Without the token, uploads still save on this computer only.
