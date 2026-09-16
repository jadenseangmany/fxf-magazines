# friends x friends — design specs

These specs are set in stone for the current build. Update this file first if the visual system should change later.

## Purpose

A handwriting-led magazine and community center for long-distance friends.

The site is a **landing page**, an **about page**, and a **magazine / catalogs** experience. Monthly issues can be uploaded as PDFs and read like a physical magazine. People who receive the update can talk to one another in a comment thread on that issue.

## Voice and look

- Handwriting, minimal, Japanese chic: lots of empty space, black ink on paper, thin line art.
- Scrapbook artwork: doodles sit off-grid around the content, not locked to a rigid system.
- No heavy chrome, cards, or shadows except the book itself and the comment frame.
- Paper field is white. Ink is near-black. Placeholder photos and unpublished covers are flat grey.

## Type

Load from Google Fonts via `next/font`.

| Role | Face | Size | Where it is used |
| --- | --- | --- | --- |
| Display | **Mali** | **40px** | Site title `friends x friends`, page titles |
| Hand | **Schoolbell** | **24px** | Nav, section heads, month labels, small asides |
| Body | **DM Sans** | **18px** | Paragraphs, bios, comments, forms |

Do not introduce a fourth family. Smaller sizes are allowed only for captions, timestamps, and form chrome (14px). Labels such as `mbti:` stay DM Sans.

## Color

| Token | Hex | Use |
| --- | --- | --- |
| Paper | `#FFFFFF` | Page background |
| Ink | `#111111` | Type and line art |
| Quiet | `#6B6B6B` | Timestamps, placeholder labels |
| Fill | `#D9D9D9` | Photo and cover placeholders |
| Reply | `#EEE9FF` | Nested comment bubbles |
| Send | `#6D5EFC` | Comment send button only |

## Pages

In the order of the source frames:

1. **Home** `/` — this month’s magazine, short manifesto, what we do.
2. **About** `/about` — `meet our lil team`, three portraits, doodle portraits, origin note.
3. **Catalog 1** `/catalogs` — `wanna look @ our catalogs?` Horizontal rail of monthly covers.
4. **Catalog 2** `/catalogs/[slug]` — one issue: magazine reader on the left, comment thread on the right.

Nav (every page, Schoolbell 24, centered under the title):

`home` · `about` · `catalogs` · `suggestions`

`suggestions` is in the source nav and lives at `/suggestions` as a small notes inbox.

## Doodles

Source files live in `/doodles` and are served from `/public/doodles`.

| Page | Folder | Files |
| --- | --- | --- |
| Home | `doodles/home` | character, button, doggie, sailboat, hari clips, star-1, star-2, stars, matcha |
| Shared | `doodles` | sparkle-1, sparkle-2 |
| About | `doodles/about` | team portraits, apple, hearts, bow, stars |
| Catalog 1 | `doodles/catalog-1` | duck (`Group 14`), matcha |
| Catalog 2 | `doodles/catalog-2` | rabbits, stars |

Tiny sparkle bursts around titles use the sparkle PNGs.

## Magazine

- Issues are listed **newest first**.
- Catalog 1 is a **horizontal** cover rail. Coming-soon issues are outlined with a hand-drawn border. Published issues are grey covers and link into Catalog 2.
- Catalog 2 is the reading room for one month. The zine sits small beside the comments until you click it.
- Clicking the zine **centers it and enlarges it** so both pages of a spread can be read.
- Opened, it is a real book: **left page and right page**, spine in the middle. Turning a page is a **page-flip**, not a slide.
- The first time the enlarged zine is opened, the **cover turns** like opening a magazine, then you move through spreads.
- A **comment section** belongs to each magazine upload. On desktop it sits beside the book, matching the Catalog 2 frame; on small screens it stacks under the book. Comments persist in **Vercel Blob** (one file per note) when `BLOB_READ_WRITE_TOKEN` is set.
- Anyone can upload a monthly PDF from `/upload`. From an issue page, **edit this issue** can change the note, the question of the month, or replace the PDF. Pages are converted to JPEGs in the browser, then stored in **Vercel Blob**. The catalog (`magazines.json`) and comments live in Blob too when `BLOB_READ_WRITE_TOKEN` is set. Without the token, local uploads still write to `public/magazines/` and `data/`. The original PDF is not kept.

## Layout notes from the frames

- Content column is narrow and centered. Doodles occupy the margins.
- Logo is always `friends x friends` in Mali 40, centered.
- Grey rectangles are standing in for photography and covers until real art is dropped in.
- Body copy stays lowercase and conversational.

## Out of scope for later

Accounts, moderation tools, and a hosted database are not part of this spec. Comments persist in Vercel Blob when the token is set, otherwise `data/comments.json` on the local machine.
