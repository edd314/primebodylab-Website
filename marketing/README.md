# Campaign ad graphics

Ready-to-post images for the seasonal promo calendar, generated straight from
`src/content/campaigns.ts` — the same content that drives the site's
`PromoBanner`. The copy can't drift between the website and the social posts
because they're read from the same file.

## What's here

- `templates/ad.html` — the visual template (brand colors, fonts, layout).
- `fonts/` — Fraunces and Inter, downloaded once so rendering never depends
  on a live internet connection or Google's font CDN.
- `assets/logo-mark.png` — the faint background watermark.
- `generate.ts` — renders a campaign into finished PNGs.
- `output/<campaign-id>/` — the generated images, ready to download and post.

## Regenerating

```
npx tsx marketing/generate.ts <campaign-id>   # one campaign
npx tsx marketing/generate.ts --all           # every campaign
```

Each campaign produces 4 files:

| File | Size | Use |
| --- | --- | --- |
| `feed-de.png` / `feed-en.png` | 1080×1080 | IG/Facebook feed post |
| `story-de.png` / `story-en.png` | 1080×1920 | IG/FB story, reel cover |

Campaign ids match `id` in `src/content/campaigns.ts` (e.g. `valentine`,
`muttertag`, `black-friday`). Run `--all` any time the copy in that file
changes to refresh every image.

## Adding a new campaign

Add an entry to `src/content/campaigns.ts` (it's Zod-validated, same as
every other content file on the site), then run `generate.ts` for it. No
changes needed here — the template is generic across all campaigns.
