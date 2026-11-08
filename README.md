# Red Devil Rebuild

The website for [Red Devil Rebuild](https://www.reddevilrebuild.com), a Manchester United podcast by Pratyush and Delwyn.

It's a static site built with [Astro](https://astro.build/) and hosted on Cloudflare Workers. Bootstrap handles most of the styling. There's no server or database: every page is generated from `public/videos.json` and `public/podcast.xml` at build time.

The show started as Takeover United Pod, so older show notes and video titles use that name. They're left as they were published.

## Running it locally

You'll need Node.js 22.23.4 or later.

```bash
npm install
npm run dev
```

The service worker only exists in a full build, so `npm run dev` logs a failed registration in the console. That's harmless. To test the service worker or anything else that depends on Cloudflare, build the site and serve it with Wrangler:

```bash
npm run build
npx wrangler dev
```

If a page looks out of date after you've run a full build locally, the service worker from that build may still be serving cached files. Unregister it and clear the site's storage in your browser's developer tools.

## Adding content

### New podcast episode

An episode needs an entry in both files. The slug and GUID link them together.

**1. Add it to `public/podcast.xml`**, at the end of the existing entries. Set `<link>` to the episode's page.

```xml
<item>
    <itunes:episodeType>full</itunes:episodeType>
    <itunes:season>3</itunes:season>
    <itunes:episode>3</itunes:episode>
    <title>Episode title</title>
    <description><![CDATA[Show notes. Basic HTML such as links and line breaks is fine.]]></description>
    <enclosure url="https://dts.podtrac.com/redirect.mp3/episodes.reddevilrebuild.com/2026-11-19.mp3" type="audio/mpeg" length="87086908"/>
    <guid isPermaLink="false">A-NEW-UNIQUE-ID</guid>
    <link>https://www.reddevilrebuild.com/episodes/short-version-of-the-title</link>
    <pubDate>Thu, 19 Nov 2026 22:00:00 +0530</pubDate>
    <itunes:duration>2176</itunes:duration>
    <itunes:explicit>false</itunes:explicit>
</item>
```

`<pubDate>` is the date the episode was **recorded**. `<itunes:season>` counts up from 1 for the 2024-25 season, and `<itunes:episode>` starts again at 1 each season.

**2. Add it to the top of `public/videos.json`**, using the same GUID.

```json
{
    "id": "YouTube video ID",
    "title": "Title as it appears on YouTube",
    "season": "2026",
    "date": "2026-11-20",
    "categories": ["podcast"],
    "slug": "short-version-of-the-title",
    "guid": "A-NEW-UNIQUE-ID"
}
```

`date` is the date the video was **published** on YouTube, so it's usually a day or two after the recording date. The episode page shows this date and uses this title.

`season` is the year the football season starts, so `"2026"` appears on the site as "Season 2026-27". The homepage has a tab for each season.

Only entries with `podcast` in `categories` need `slug` and `guid`.

The newest podcast entry appears in the latest episode section at the top of the homepage, so nothing else needs changing there.

### Slugs

Slugs become permanent URLs, so don't change one after it's published.

A slug is a short version of the episode title in lowercase, with words separated by hyphens. Drop filler words and punctuation, and shorten long names where the meaning stays clear.

| Title | Slug |
|---|---|
| Can Michael Carrick TURN AROUND Manchester United's Fortunes? | `can-carrick-turn-around-uniteds-fortunes` |
| Do We Like Manchester United's Transfers? | `do-we-like-uniteds-transfers` |

### Shorts, predictions and clips

Add an entry to the top of `public/videos.json` with no `slug` or `guid`. Leave `season` empty, as these pages don't have season tabs.

```json
{
    "id": "YouTube video ID",
    "title": "Title as it appears on YouTube",
    "season": "",
    "date": "2026-11-21",
    "categories": ["short"]
}
```

| Category | Page |
|---|---|
| `podcast` | `/` |
| `short` | `/shorts` |
| `prediction` | `/predictions` |
| `clip` | `/clips` |

A video can have more than one category. Predictions are shorts too, so they use `["short", "prediction"]` and appear on both pages.

### Build checks

`src/data/videos.js` checks the data on every build.

**The build stops if:**

- a podcast entry has a missing, invalid or duplicate slug
- a podcast entry's GUID isn't in the feed
- two videos share the same ID

**The build log shows a warning if:**

- a video is dated before its recording date
- a feed entry's `<link>` doesn't match its episode page
- a feed entry has no matching video

Warnings don't stop the site from deploying, so check the log after adding an episode.

Thumbnails aren't checked. They load from YouTube using each video's ID, and YouTube doesn't guarantee a `maxresdefault` image for every upload, so look at the card after adding a video.

## How it's organized

```
public/                  Served as is
  podcast.xml            Podcast RSS feed, edited by hand
  videos.json            All videos, newest first
  manifest.json          Web app manifest
  fonts/, img/           Fonts, icons and images
src/
  assets/logos/          Page logos, resized at build time
  components/            Hero, navbar, footer, cards, season tabs, latest episode and icons
  data/
    icons.js             SVG icons
    pages.js             Settings for each list page
    videos.js            Reads the videos and feed, checks them, and labels seasons
  layouts/Layout.astro   Shared page layout and meta tags
  pages/
    [...slug].astro      Generates the list pages from pages.js
    episodes/[slug].astro  Generates a page for each episode
    404.astro            Not found page
    sitemap.xml.js       Generates the sitemap
  scripts/
    custom.js            Theme toggle, video players, seasons and pagination
    sw.js                Service worker
  styles/styles.css      Site styles
```

### Common changes

- **Page title, description or items per page:** edit `src/data/pages.js`. `description` is the text in the hero, and `metaDescription` is what appears in search results.
- **New list page:** add an entry to `src/data/pages.js` with a new category, then add it to the links in `src/components/Navbar.astro` and to `urlsToCache` in `src/scripts/sw.js`.
- **New icon:** add its SVG to `src/data/icons.js`, then use `<Icon name="your-icon" />`.
- **How seasons are labeled:** edit `seasonLabel` in `src/data/videos.js`. The season tabs, latest episode section and episode pages all use it.

### Service worker

Edit `src/scripts/sw.js`. The build minifies it to `/sw.min.js`, and that URL must not change, because returning visitors' browsers check it for updates.

Change `CACHE_NAME` in `sw.js` when you need to clear visitors' old caches. Pages are fetched from the network first, and other files come from the cache first.

## Deployment

Cloudflare Workers Builds deploys from this repository, using `npm run build` and the settings in `wrangler.jsonc`.

| Branch | What happens |
|---|---|
| `main` | Deploys to the live site |
| Any other branch | Builds a Cloudflare preview for testing |

Small changes go straight to `main`. For a bigger change, push it to a separate branch first, check the preview, then fast-forward `main` to it. A fast-forward only works if `main` has no commits the branch lacks.

```bash
git switch main
git merge --ff-only your-branch
git push origin main
```

If a deploy goes wrong, roll back to the previous version from the Worker's Deployments page in Cloudflare.

## Commit messages

Episode, video and dependency commits follow this pattern:

```text
Add 2026-11-05 episode to website and podcast RSS
Add 2026-11-21 short to website
Upgrade node dependencies
```

The date in an episode commit is the recording date from `<pubDate>`.

Other commits use a short summary in the imperative, such as `Add episode pages and build-time video checks`.
