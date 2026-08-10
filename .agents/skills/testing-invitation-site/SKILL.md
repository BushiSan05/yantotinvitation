---
name: testing-invitation-site
description: How to run and test the yantotinvitation static invitation site locally, including viewport-emulated layout measurement, the tap-to-open envelope flow, and safe RSVP testing against the live Supabase DB.
---

# Testing the yantotinvitation site

## Running it
Pure static site, no build step:
```bash
cd /path/to/yantotinvitation && python3 -m http.server 8080
```
Open http://localhost:8080/.

## Reaching the UI states
- The page opens on a full-screen envelope overlay (`#envelopeOverlay`). One click anywhere on it runs `openEnvelope()` (script.js): flap/letter animation starts at 300ms, the card is revealed and the overlay hidden at ~1350ms, overlay `display:none` at ~2000ms. Wait ~2.5s after the click before measuring the card.
- The reveal is one-shot per page load; reload (`location.reload()`) to get the envelope back.
- Clicking the card body toggles `.card-container.flipped` (front = photo slideshow, back = details + RSVP form + video).
- Do not click inside `.rsvp-form` / `.guest-list` when you want to flip — those areas are excluded from the flip handler.

## Viewport / breakpoint testing
Breakpoints live in style.css: `min-width:768px`, `max-width:400px`, `max-width:360px`. Card geometry is in `:root` (`--card-width/--card-height/--card-padding/--card-radius`).

Use CDP `Emulation.setDeviceMetricsOverride` over the existing Chrome debug port (default 29229) rather than resizing the window. Pass the `scale` parameter (e.g. 0.9) when the emulated height exceeds the real viewport, so the whole page is visible on screen for a recording; `getBoundingClientRect()` still reports true emulated CSS px. A small websocket helper (python `websockets` package is preinstalled) that sends `Emulation.setDeviceMetricsOverride` / `Runtime.evaluate` is enough.

For layout-equivalence assertions, prefer measuring `getBoundingClientRect()` before/after the transition and rendering a fixed-position result panel into the page (`position:fixed; z-index:99999`) so the numbers appear in the screenshots/recording instead of only in tool output.

Known-fragile area: `.envelope` and `.card-container` must keep the *same* outer box and padding, because both are flex children that get shrunk on short viewports — sizing the envelope to "card size minus padding" silently diverges once shrinking kicks in (below ~530px CSS height). Always include a short/landscape viewport (e.g. 740x420, 390x600, 390x500) when touching envelope or card geometry, not just the width breakpoints.

## RSVP testing against live Supabase
`script.js` lines 2-3 contain the Supabase URL and anon key (checked into the repo — no secret needed). RSVP rows go to the live `rsvp` table shared with the real invitation.
- Always use a throwaway name prefixed `__test__`.
- Validation order in `submitRSVP()`: empty name -> "Missing Name"; empty message -> "Missing Message"; name < 2 chars -> "Invalid Name"; name > 50 chars -> "Invalid Name". Alerts are in-page modals (`#alertModal`), not native `alert()`.
- The `rsvp` table has columns `id, name, attendance, message` only (no `created_at` — selecting it 400s).
- Anon DELETE is currently permitted, so clean up:
  `curl -X DELETE "$SUPABASE_URL/rest/v1/rsvp?id=eq.<id>" -H "apikey: <anon key>" -H "Authorization: Bearer <anon key>"` (expect HTTP 204).
  That missing RLS is a known finding; do not try to fix it as part of a UI test.

## Devin Secrets Needed
None — the Supabase anon key is committed in `script.js`.
