# Wedding invitation

An animated wedding-invitation page that runs fully offline: open `index.html` in a browser, no server needed.

## Customising

Everything is set in **`config.js`**. It holds a single JSON object; edit it and reload the page.

| Block | What it controls |
|---|---|
| `couple` | Bride and groom names, which name comes first (`"order": "bride-first"` or `"groom-first"`), optional `monogram` such as `"F&R"` (otherwise taken from the first letters) |
| `event` | Heading, start and end (`YYYY-MM-DDTHH:MM`, venue's local time), `utcOffset` (for example `"+05:30"`), time-zone name and label, calendar title and reminder text |
| `invitation` | Bismillah line and the three opening lines |
| `venue` | Short and full name, place, address lines, `lat` and `lng` (used for directions and the live map), optional `mapsUrl` and `mapImage` (the static map shown before the live map loads) |
| `hosts`, `wishes` | Names and relations; set `"wishes": null` to hide that block |
| `sections` | Headings and texts of the verse, countdown, venue, blessing and closing sections |
| `share` | Share title and text, plus the "Save as Image" file and its download name |
| `colors` | Every colour on the page; the first group is the main palette, the rest are the gold-foil and accent shades |

Text values can use placeholders: `{bride} {groom} {first} {second} {weekday} {day} {month} {year} {date} {dateShort} {time} {timeEnd} {timeRange} {venue} {place} {title} {subtitle}`.

The wax seal, the envelope monogram and the favicon are drawn from the couple's initials automatically.

### Updating the "Save as Image" picture

`invitation.jpg` is a snapshot of the card. After changing names, date or venue, recreate it:

```bash
npm install --no-save playwright
npx playwright install chromium
node tools/render-invitation.js
```

## Files

- `config.js`: all settings
- `invite.js`: applies the settings to the page
- `app.*.js`: animations, countdown, calendar, map, music
- `offline-assets.js`: lets the WebGL effects and music work when the page is opened from disk (`file://`); does nothing when served over http(s)
- `a/`: images, fonts, music
- `tools/render-invitation.js`: regenerates `invitation.jpg`

Social link previews (WhatsApp and similar) read the static `<meta>` tags in `index.html` without running scripts; edit those tags too if previews matter.

## Deploying

The site is static: import the repository into Vercel (or any static host) with no build command and the project root as the output directory. Every push to `main` redeploys.
