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
party.html        # After-party page
community.html    # Community info page
locked.html       # Gated content page
777.html          # Special page
404.html          # Custom 404 page
assets/           # Images, video, icons
  speaker-icons/  # Speaker headshots
  sponsors/       # Sponsor logos
  party-photos/   # Event photos
  items/          # Misc icons
```

## Local Development

Open `index.html` in a browser. No server required for basic viewing.

For live reload during development:
```bash
npx serve .
```

## Deployment

Pushes to `main` automatically deploy via GitHub Pages.

---

*The Living Internet Alliance — Creators, Coaches, and Educators working on their personal brands.*
