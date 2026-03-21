# Portfolio Redesign — Design Spec
**Date:** 2026-03-20
**Status:** Approved

---

## Problem

The current site looks generic — "AI-generated portfolio" aesthetic. Centered full-screen hero, bento card grid, blue accent color, Inter everywhere, dark mode toggle. The goal is a redesign that reads as designed-by-a-human: Swiss precision meets warm editorial.

---

## Design Decisions

### Visual Direction
Swiss Precision + Warm Editorial hybrid. Structured grid, strong typography hierarchy, every element earns its place. Not cold/corporate — warm, human, intentional.

### Color Palette
- Background: `#FAFAFA` (near-white)
- Text: `#0a0a0a` (near-black)
- Accent: `#1E3A5F` (deep navy — replaces the current bootstrap blue `#1E40AF`)
- Secondary bg: `#E8EEF4` (light navy tint for tags, hover states)
- Borders: `#E8EEF4`
- No dark mode.

### Brand
`MC.` stays. The dot is `#1E3A5F` navy. This matches printed business cards and should not change.

### Typography
- **Headlines / names / section titles:** Inter (800 weight, tight letter-spacing)
- **Labels, body text, captions, categories, stats:** Space Mono (already loaded)
- No other font families.
- Body text minimum 13px, preferably 14–15px for readability. Labels 10–12px with letter-spacing.

### Dark Mode
Removed entirely. Light mode only.

---

## Page Sections (Homepage)

### 1. Navigation
- Sticky, `64px` height, `1px` bottom border `#E8EEF4`
- Left: `MC.` brand (Inter 900, navy dot)
- Right: `Projects · Blog · Contact · Resume` — Space Mono, 11px, `letter-spacing: 1.5px`, uppercase, muted color
- No hamburger/mobile overlay needed for initial pass (can add later)

### 2. Hero
- **No full-screen splash.** Hero lives above the fold but is not full-viewport-height.
- Layout: label → big name → bio → stats bar
- `Mechanical Engineer — EIT` label: Space Mono, 12px, navy, uppercase, `letter-spacing: 1.5px`
- `Mois Cohen`: Inter 800, ~72px, `letter-spacing: -2px`
- Bio sentence: Space Mono, 14px, muted, max-width ~520px, line-height 1.75
- Stats bar: 4-column grid, separated by `1px` vertical borders, each stat has a Space Mono label + Inter value + Space Mono sub-value
  - Stat 1: Current Role → Innoflight / Mechanical Eng. I
  - Stat 2: Education → Cal Poly SLO / B.S. Mech Eng · 2025
  - Stat 3: Notable → Autoprint / Co-Founder · $11K
  - Stat 4: Specialties → CAD / FEA / Thermal · SolidWorks

### 3. About
- Two-column layout: left = `About` section label (Space Mono, uppercase, navy), right = prose
- Prose in Space Mono, 14px, line-height 1.8, muted color
- No giant "About" heading — the label is small and structural
- 3 paragraphs as currently written

### 4. Projects
- **List format, not bento grid.**
- Section header: `Projects` (Inter 800, 28–32px) + `5 WORKS` count (Space Mono, right-aligned, muted)
- Each project is a horizontal row:
  - `01` number (Space Mono, muted)
  - Project name (Inter 700, 15px) + category tags below (Space Mono, 12px, muted)
  - Type tag badge (Space Mono, 10px, navy bg-tint, navy text)
  - Year range (Space Mono, muted, right-aligned)
  - Arrow `→` appears on hover (navy)
- Row hover: subtle `#F5F8FC` background, arrow appears
- Clickable rows link to project detail pages where they exist
- Projects:
  1. Innoflight — Aerospace Systems · CURRENT · 2025–now
  2. Wildland Fire Hose Clamp · CAPSTONE · 2024–25 → `/firehoseclamp/`
  3. Cal Poly Energy Systems Research · RESEARCH · 2024–25
  4. Autoprint — 3D Printing Startup · STARTUP · 2022–23 → `/autoprint/`
  5. K2 Systems — Solar Racking · INTERNSHIP · Summer 2024 → `/k2-systems/`

### 5. Skills
- Two-column layout (same as About): label left, content right
- Content: 4-group grid (2×2), each group has a Space Mono uppercase title + bulleted skill list
- Groups: Design & Analysis · Programming · Manufacturing · Systems
- **No progress bars.**
- Bullet: small `4px` navy dot

### 6. Contact
- Two-column: left = bold statement, right = link list
- Statement: `Let's work together.` (Inter 800, ~40px, `letter-spacing: -1px`)
- Sub-copy: Space Mono, 13px, muted
- Link list: 3 rows (Email, LinkedIn, Resume), each with Space Mono label + Inter value + `→` arrow
- Each row separated by `1px` border
- **No contact form.** Direct links only.

### 7. Footer
- Single row: `MC.` brand left, Space Mono tagline right (`Mois Cohen · Mechanical Engineer · San Diego, CA`)
- `1px` top border

---

## CSS Architecture

Preserve existing 5-file structure:
- `variables.css` — update color tokens, remove dark mode block, update font vars
- `base.css` — update resets/typography base, remove dark mode animations
- `navigation.css` — rewrite navbar (remove mobile menu for now)
- `components.css` — rewrite card → project-row, keep button system, update tags/badges
- `sections.css` — rewrite all section styles

Keep `main.js` but remove: typing animation, dark mode toggle, card tilt, parallax. Keep: scroll progress, smooth scrolling, intersection observer for fade-in, back-to-top, form handling (Formspree, even though form is removed — keep for future).

---

## Out of Scope

- Project detail pages (`/firehoseclamp/`, `/autoprint/`, `/k2-systems/`, `/ninalabs/`) — these get a separate pass after homepage is done
- Blog section redesign
- Mobile responsive pass (do after desktop is solid)
- Any new content or copy changes
