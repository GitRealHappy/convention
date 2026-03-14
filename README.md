# Creator Economy Convention — Landing Page

The official landing page for **The Creator Economy Convention**, hosted by The Living Internet Alliance.

**Event Details:**
- **Dates:** June 5–7, 2026
- **Venue:** Sheraton Vancouver Airport Hotel, Vancouver, BC
- **Capacity:** 600 attendees

## Overview

A three-day in-person event bringing together creators, coaches, and educators to learn from 13+ keynote speakers with a combined 3.5M+ followers. Headlined by Dan Koe.

## Tech Stack

- **HTML/CSS/JS** — Static site, no build step required
- **Stripe** — Payment processing via embedded buy buttons
- **GitHub Pages** — Hosting (see `CNAME` for custom domain)

## File Structure

```
index.html        # Main landing page
styles.css        # All styles
script.js         # Interactivity (accordion, modals, scroll behavior)
community/        # Clean route for the community page
contest/          # Clean route for the contest page
networking-guide/ # Clean route for the networking guide
party/            # Clean route for the after-party page
locked/           # Clean route for gated content
university/       # Clean route for university redirect page
777/              # Clean route for the special page
404.html          # Custom 404 page
assets/           # Images, video, icons
  speaker-icons/  # Speaker headshots
  sponsors/       # Sponsor logos
  party-photos/   # Event photos
  items/          # Misc icons
```

## Local Development

Open `index.html` in a browser for the homepage. For testing clean URLs, use a local server.

For live reload during development:
```bash
npx serve .
```

## Deployment

Pushes to `main` automatically deploy via GitHub Pages.

---

*The Living Internet Alliance — Creators, Coaches, and Educators working on their personal brands.*
