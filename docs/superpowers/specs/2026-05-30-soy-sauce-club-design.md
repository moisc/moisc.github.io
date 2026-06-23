# Soy Sauce Club — Website Design Spec
Date: 2026-05-30

## Overview

A redesigned website for the Soy Sauce Club of Cal Poly SLO, hosted at `moisc.github.io/soy-sauce-club`. Single-page, mobile-first, cinematic scroll layout. Dark Umami aesthetic: black background, amber/gold accents (#c8860a), warm cream text (#e8d5b0).

## Context

The existing site (`assets/Soy Sauce Club_files/Soy Sauce Club.html`) is a bare HTML file with no styling. All media assets (member GIFs, logos) already exist in `assets/Soy Sauce Club_files/`.

## Visual Design

**Aesthetic:** Dark Umami
- Background: `#060606`
- Accent: `#c8860a` (amber/soy sauce gold)
- Text primary: `#e8d5b0` (warm cream)
- Text secondary: `#7a6a52`
- Muted: `#555` / `#3a2e1e`
- Section borders: `#c8860a22`

**Typography:**
- Headings/display: system-ui, sans-serif, uppercase, heavy weight
- Body/editorial: Georgia, serif
- Labels: 8–10px, letter-spacing 3–5px, uppercase, system-ui

**Layout:** Cinematic Flow — no sticky nav, single uninterrupted vertical scroll. Sections separated by subtle borders and spacing, not hard breaks.

## Page Structure (top to bottom)

### 1. Hero
- Full viewport height
- Radial gradient: `#1a0e00` at top center fading to `#060606`
- Japanese script: 醤油クラブ (small, letter-spaced, amber)
- Club name: massive display type, 3 lines (Soy / Sauce / Club), uppercase
- Thin amber divider line
- Subtext: "Cal Poly San Luis Obispo" — small, very muted
- CTA link: "@soy.sauce.club" — bordered amber button linking to Instagram
- Scroll indicator: vertical amber line fading to transparent, "scroll" label

### 2. About / Origin Story
- Section label: "ORIGIN STORY" with amber line extending right
- Pull quote: *"We need to spread the love."*
- Body prose: the origin story in two paragraphs
  - Para 1: Benjamin pranked Avi with 100lbs of russet potatoes → Avi retaliated with a 5-gallon Kikkoman bucket → they founded a club
  - Para 2: The bucket holds 1,200 servings — enough for the average 4-person Japanese family for a full year
- Badge: "Proudly Kikkoman Full Sodium" — dark bordered chip with amber text

### 3. Officers / Members
- Section label: "OFFICERS"
- 2-column grid on mobile, same on desktop
- Benjamin (Co-founder & Visionary) — spans full width, horizontal card layout
- Avi (President) — half width
- Oren (Treasurer & Secretary) — half width
- Mika (Vice President) — half width
- Odelia (Outreach Manager) — half width
- Dr. BenShea (Faculty Advisor) — spans full width, horizontal card layout
- Each card: amber top-border accent, circular GIF photo, role label (amber, tiny), name, short bio
- Existing GIF/JPG assets used: `avi_intro.gif`, `oren_intro.gif`, `benjamin_intro.gif`, `mika_intro.gif`, `odelia_intro.gif`, `benshea_intro.jpg`

### 4. Events
- Section label: "EVENTS"
- Single event card: Ladle a Lad
  - Date/location: "April 29 · Dexter Lawn · Cal Poly SLO"
  - Event name: large uppercase display type
  - Body: 2-sentence description
  - Bullet details: 3 activities (mason jar guessing game, pin a sprout, win 5-gallon bucket)
  - Subtle watermark text rotated vertically on right edge

### 5. Gallery
- Section label: "GALLERY"
- 2-column grid, square aspect ratio cells
- Currently placeholder; user can drop in event photos
- Note text: "Add your event photos here"

### 6. Social / Join
- Radial gradient at bottom (mirror of hero)
- Centered layout
- Tagline: *"Stay in the soy sauce loop."*
- Sub-label: "Follow · Connect · Join"
- Instagram button: bordered amber, links to `https://instagram.com/soy.sauce.club`
- Footer: "Soy Sauce Club of Cal Poly SLO · Proudly Kikkoman" — very muted

## File Structure

```
moisc.github.io/
  soy-sauce-club/
    index.html          ← single self-contained HTML file (inline CSS + JS)
  assets/
    Soy Sauce Club_files/   ← existing assets (GIFs, logos) referenced by relative path
```

The page is a single self-contained `index.html` with all CSS inlined in a `<style>` block. No build step, no dependencies. Images referenced via relative path `../assets/Soy Sauce Club_files/`.

## Implementation Notes

- Mobile-first. Max-width ~480px centered, no fixed desktop breakpoints needed (cinematic layout scales naturally).
- Minimal vanilla JS: use `IntersectionObserver` to fade sections in as they scroll into view (opacity 0 → 1, translateY 20px → 0). No other JS needed.
- No nav bar. No anchor links needed.
- Gallery section: static grid, no lightbox required for MVP.
- Cal Poly (`calpoly.png`) and SSC (`ssc.png`) logos appear in the footer, small, muted, side by side.
