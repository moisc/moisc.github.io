# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the homepage to a Swiss Precision + Warm Editorial aesthetic: deep navy + white palette, Inter headlines + Space Mono body, numbered project list rows, no dark mode, no decorative fluff.

**Architecture:** Rewrite all 5 CSS files in-place, restructure `index.html` to match new section layouts, and strip `main.js` of removed features (dark mode, typing animation, parallax, skill bars, card tilt). No new files created. Project detail pages are out of scope.

**Tech Stack:** Vanilla HTML/CSS/JS. Google Fonts (Inter + Space Mono — already loaded). No build step. Open in browser to verify.

**Spec:** `docs/superpowers/specs/2026-03-20-portfolio-redesign-design.md`

---

## File Map

| File | Action | What changes |
|------|--------|-------------|
| `assets/css/variables.css` | Rewrite | New color tokens, remove dark mode block, confirm Space Mono var |
| `assets/css/base.css` | Rewrite | Remove dark mode body transition, update typography classes |
| `assets/css/navigation.css` | Rewrite | New sticky nav — no mobile menu, no theme toggle |
| `assets/css/components.css` | Rewrite | Project-row component, tags, buttons; remove bento grid + old card system |
| `assets/css/sections.css` | Rewrite | Hero, about, projects, skills, contact, footer — all new |
| `index.html` | Rewrite | New section structure matching spec; remove dark mode toggle, mobile menu |
| `assets/js/main.js` | Modify | Remove: initTheme, initTypingAnimation, initParallaxEffects, initSkillsProgressBars, initHoverEffects (card tilt). Keep: initNavigation (simplified), initScrollProgress, initIntersectionObserver, initSmoothScrolling, initFormHandling, initCounterAnimations, initBackToTop |
| `assets/js/theme-universal.js` | Modify | Remove all logic — replace with empty stub so the script tag doesn't error |

---

## Task 1: Update CSS variables

**Files:**
- Modify: `assets/css/variables.css`

- [ ] **Step 1: Replace the entire file with updated tokens**

```css
/*
 * Portfolio Redesign — Design Tokens
 * Swiss Precision + Warm Editorial
 * Palette: Deep Navy + White. No dark mode.
 */

:root {
    /* ── Colors ── */
    --color-bg:         #FAFAFA;
    --color-bg-tint:    #F5F8FC;
    --color-border:     #E8EEF4;
    --color-navy:       #1E3A5F;
    --color-navy-tint:  #E8EEF4;
    --color-text:       #0a0a0a;
    --color-muted:      #555555;
    --color-subtle:     #999999;
    --color-faint:      #BBBBBB;

    /* ── Typography ── */
    --font-sans:    'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    --font-mono:    'Space Mono', 'Courier New', monospace;

    /* ── Type scale ── */
    --text-hero:    72px;
    --text-xl:      32px;
    --text-lg:      24px;
    --text-md:      16px;
    --text-sm:      14px;
    --text-xs:      12px;
    --text-2xs:     11px;
    --text-3xs:     10px;

    /* ── Spacing (8px grid) ── */
    --space-4:   4px;
    --space-8:   8px;
    --space-12:  12px;
    --space-16:  16px;
    --space-20:  20px;
    --space-24:  24px;
    --space-32:  32px;
    --space-40:  40px;
    --space-48:  48px;
    --space-64:  64px;
    --space-96:  96px;

    /* ── Layout ── */
    --max-width:    1200px;
    --page-padding: 48px;
    --nav-height:   64px;

    /* ── Borders ── */
    --border:       1px solid var(--color-border);

    /* ── Transitions ── */
    --transition:   150ms cubic-bezier(0.4, 0, 0.2, 1);
}

@media (max-width: 768px) {
    :root {
        --text-hero:    48px;
        --text-xl:      24px;
        --page-padding: 20px;
    }
}

@media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
    }
}
```

- [ ] **Step 2: Open `index.html` in a browser and confirm the page doesn't throw CSS errors (can look broken — that's fine for now)**

- [ ] **Step 3: Commit**

```bash
git add assets/css/variables.css
git commit -m "redesign: update CSS design tokens"
```

---

## Task 2: Rewrite base.css

**Files:**
- Modify: `assets/css/base.css`

- [ ] **Step 1: Replace the entire file**

```css
/*
 * Base — Reset & Typography Foundation
 */

*, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html {
    font-size: 16px;
    scroll-behavior: smooth;
    scroll-padding-top: calc(var(--nav-height) + var(--space-16));
}

body {
    font-family: var(--font-sans);
    font-size: var(--text-sm);
    line-height: 1.6;
    color: var(--color-text);
    background-color: var(--color-bg);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

img { display: block; max-width: 100%; }
a { color: inherit; text-decoration: none; }
button { cursor: pointer; border: none; background: none; font: inherit; }
ul, ol { list-style: none; }

/* ── Accessibility ── */
.sr-only {
    position: absolute;
    width: 1px; height: 1px;
    padding: 0; margin: -1px;
    overflow: hidden; clip: rect(0,0,0,0);
    white-space: nowrap; border: 0;
}

.skip-to-main {
    position: absolute;
    top: -100%;
    left: var(--space-16);
    background: var(--color-navy);
    color: #fff;
    padding: var(--space-8) var(--space-16);
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    z-index: 9999;
}
.skip-to-main:focus { top: var(--space-8); }

/* ── Scroll progress bar ── */
.scroll-progress {
    position: fixed;
    top: 0; left: 0;
    height: 2px;
    width: 0%;
    background: var(--color-navy);
    z-index: 9999;
    transition: width 0.1s linear;
}

/* ── Back to top ── */
.back-to-top {
    position: fixed;
    bottom: var(--space-32);
    right: var(--space-32);
    width: 40px; height: 40px;
    background: var(--color-navy);
    color: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--transition);
    z-index: 500;
}
.back-to-top.visible {
    opacity: 1;
    pointer-events: auto;
}

/* ── Fade-in animation (triggered by IntersectionObserver) ── */
.animate-on-scroll {
    opacity: 0;
    transform: translateY(16px);
    transition: opacity 0.5s ease, transform 0.5s ease;
}
.animate-on-scroll.visible {
    opacity: 1;
    transform: none;
}

/* ── Container ── */
.container {
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 0 var(--page-padding);
}
```

- [ ] **Step 2: Verify in browser — page should still render (possibly broken layout, no errors)**

- [ ] **Step 3: Commit**

```bash
git add assets/css/base.css
git commit -m "redesign: rewrite base styles"
```

---

## Task 3: Rewrite navigation.css

**Files:**
- Modify: `assets/css/navigation.css`

- [ ] **Step 1: Replace the entire file**

```css
/*
 * Navigation — Sticky top bar
 */

.navbar {
    position: sticky;
    top: 0;
    z-index: 200;
    height: var(--nav-height);
    background: var(--color-bg);
    border-bottom: var(--border);
    display: flex;
    align-items: center;
    padding: 0 var(--page-padding);
    justify-content: space-between;
}

/* Brand: MC. */
.navbar__brand {
    font-family: var(--font-sans);
    font-weight: 900;
    font-size: 16px;
    letter-spacing: -0.5px;
    color: var(--color-text);
    text-decoration: none;
}
.navbar__brand .dot {
    color: var(--color-navy);
}

/* Nav links */
.navbar__nav {
    display: flex;
    gap: var(--space-32);
    align-items: center;
}

.navbar__link {
    font-family: var(--font-mono);
    font-size: var(--text-2xs);
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--color-subtle);
    text-decoration: none;
    transition: color var(--transition);
}
.navbar__link:hover {
    color: var(--color-text);
}
```

- [ ] **Step 2: Update `index.html` navbar HTML to match — replace the existing `<nav>` block with:**

```html
<nav class="navbar" id="navbar">
    <a href="/" class="navbar__brand">MC<span class="dot">.</span></a>
    <div class="navbar__nav">
        <a href="#projects" class="navbar__link">Projects</a>
        <a href="/blog/" class="navbar__link">Blog</a>
        <a href="#contact" class="navbar__link">Contact</a>
        <a href="https://raw.githubusercontent.com/moisc/moisc.github.io/main/Mois Cohen Resume 2026.pdf"
           class="navbar__link" download="Mois Cohen Resume 2026.pdf">Resume</a>
    </div>
</nav>
```

Also remove the `<!-- Mobile Menu Overlay -->` div entirely from `index.html`.

- [ ] **Step 3: Verify in browser — nav bar should be visible and correct**

- [ ] **Step 4: Commit**

```bash
git add assets/css/navigation.css index.html
git commit -m "redesign: rewrite navigation"
```

---

## Task 4: Rewrite components.css

**Files:**
- Modify: `assets/css/components.css`

- [ ] **Step 1: Replace the entire file**

```css
/*
 * Components — Project rows, tags, buttons, badges
 */

/* ── Section layout helper ── */
.section {
    padding: var(--space-64) var(--page-padding);
    border-bottom: var(--border);
}

.section--tinted {
    background: var(--color-bg-tint);
}

/* Two-column layout: label left, content right */
.two-col {
    display: grid;
    grid-template-columns: 160px 1fr;
    gap: var(--space-64);
    align-items: start;
}

@media (max-width: 768px) {
    .two-col {
        grid-template-columns: 1fr;
        gap: var(--space-32);
    }
}

/* ── Section label (small uppercase mono) ── */
.section-label {
    font-family: var(--font-mono);
    font-size: var(--text-3xs);
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--color-navy);
    padding-top: var(--space-4); /* optical alignment with content */
}

/* ── Section title ── */
.section-title {
    font-family: var(--font-sans);
    font-size: var(--text-xl);
    font-weight: 800;
    letter-spacing: -0.5px;
    color: var(--color-text);
}

/* ── Tag badge (e.g. CAPSTONE, RESEARCH) ── */
.tag {
    display: inline-block;
    font-family: var(--font-mono);
    font-size: var(--text-3xs);
    letter-spacing: 0.5px;
    background: var(--color-navy-tint);
    color: var(--color-navy);
    padding: 3px 8px;
    white-space: nowrap;
}

/* ── Project list ── */
.project-list {
    display: flex;
    flex-direction: column;
}

.project-row {
    display: grid;
    grid-template-columns: 36px 1fr auto 80px 20px;
    align-items: center;
    gap: var(--space-20);
    padding: var(--space-20) 0;
    border-top: var(--border);
    text-decoration: none;
    color: var(--color-text);
    transition: background var(--transition);
}

/* Extend hover bg to full width by using negative margins trick */
.project-row:hover {
    background: var(--color-bg-tint);
    margin: 0 calc(-1 * var(--page-padding));
    padding-left: var(--page-padding);
    padding-right: var(--page-padding);
}

.project-row:hover .project-row__arrow {
    opacity: 1;
}

.project-row__num {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--color-faint);
}

.project-row__name {
    font-family: var(--font-sans);
    font-size: var(--text-md);
    font-weight: 700;
    margin-bottom: var(--space-4);
}

.project-row__cat {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--color-muted);
}

.project-row__year {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--color-faint);
    text-align: right;
}

.project-row__arrow {
    font-size: 16px;
    color: var(--color-navy);
    opacity: 0;
    transition: opacity var(--transition);
}

/* Non-linked project row (no detail page) */
.project-row--no-link {
    cursor: default;
}
.project-row--no-link:hover .project-row__arrow {
    opacity: 0;
}

/* ── Skill groups ── */
.skill-groups {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-32);
}

.skill-group__title {
    font-family: var(--font-mono);
    font-size: var(--text-3xs);
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--color-navy);
    margin-bottom: var(--space-12);
}

.skill-group__list {
    display: flex;
    flex-direction: column;
    gap: var(--space-8);
}

.skill-item {
    font-family: var(--font-sans);
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--color-text);
    display: flex;
    align-items: center;
    gap: var(--space-8);
}
.skill-item::before {
    content: '';
    display: inline-block;
    width: 4px; height: 4px;
    background: var(--color-navy);
    border-radius: 50%;
    flex-shrink: 0;
}

/* ── Contact links ── */
.contact-link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-16) 0;
    border-bottom: var(--border);
    text-decoration: none;
    color: var(--color-text);
    transition: background var(--transition);
}
.contact-link:hover {
    padding-left: var(--space-8);
}
.contact-link__label {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    letter-spacing: 1px;
    color: var(--color-subtle);
    margin-bottom: var(--space-4);
}
.contact-link__value {
    font-family: var(--font-sans);
    font-size: var(--text-sm);
    font-weight: 600;
}
.contact-link__arrow {
    font-size: 18px;
    color: var(--color-navy);
}
```

- [ ] **Step 2: Verify no CSS parse errors (open browser devtools console)**

- [ ] **Step 3: Commit**

```bash
git add assets/css/components.css
git commit -m "redesign: rewrite component styles"
```

---

## Task 5: Rewrite sections.css

**Files:**
- Modify: `assets/css/sections.css`

- [ ] **Step 1: Replace the entire file**

```css
/*
 * Sections — Hero, About, Projects, Skills, Contact, Footer
 */

/* ── HERO ── */
.hero {
    padding: var(--space-64) var(--page-padding) var(--space-48);
    border-bottom: var(--border);
}

.hero__label {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--color-navy);
    margin-bottom: var(--space-16);
}

.hero__name {
    font-family: var(--font-sans);
    font-size: var(--text-hero);
    font-weight: 800;
    letter-spacing: -2px;
    line-height: 1;
    color: var(--color-text);
    margin-bottom: var(--space-20);
}

.hero__bio {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    line-height: 1.75;
    color: var(--color-muted);
    max-width: 520px;
}

/* Stats bar */
.hero__stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    border-top: var(--border);
    margin-top: var(--space-40);
    padding-top: var(--space-20);
    gap: var(--space-24);
}

@media (max-width: 768px) {
    .hero__stats {
        grid-template-columns: 1fr 1fr;
    }
}

.hero__stat {
    padding-right: var(--space-24);
    border-right: var(--border);
}
.hero__stat:last-child {
    border-right: none;
    padding-right: 0;
}

.hero__stat-label {
    font-family: var(--font-mono);
    font-size: var(--text-3xs);
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--color-faint);
    margin-bottom: var(--space-8);
}

.hero__stat-value {
    font-family: var(--font-sans);
    font-size: 15px;
    font-weight: 700;
    color: var(--color-text);
    margin-bottom: var(--space-4);
}

.hero__stat-sub {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--color-subtle);
}

/* ── ABOUT ── */
.about {
    /* Uses .section and .two-col from components */
}

.about__text p {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    line-height: 1.8;
    color: var(--color-muted);
    margin-bottom: var(--space-16);
}
.about__text p:last-child { margin-bottom: 0; }

.about__text strong {
    color: var(--color-text);
    font-weight: 700;
}

/* ── PROJECTS ── */
.projects__header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: var(--space-32);
}

.projects__count {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    letter-spacing: 1px;
    color: var(--color-subtle);
}

/* ── SKILLS ── */
.skills {
    /* Uses .section.section--tinted and .two-col */
}

/* ── CONTACT ── */
.contact {
    /* Uses .section */
}

.contact__grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-64);
    align-items: start;
}

@media (max-width: 768px) {
    .contact__grid {
        grid-template-columns: 1fr;
        gap: var(--space-40);
    }
}

.contact__title {
    font-family: var(--font-sans);
    font-size: 40px;
    font-weight: 800;
    letter-spacing: -1px;
    line-height: 1.1;
    margin-bottom: var(--space-16);
}

.contact__sub {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    line-height: 1.7;
    color: var(--color-subtle);
}

/* ── FOOTER ── */
.footer {
    padding: var(--space-24) var(--page-padding);
    border-top: var(--border);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.footer__brand {
    font-family: var(--font-sans);
    font-weight: 900;
    font-size: 14px;
}
.footer__brand .dot { color: var(--color-navy); }

.footer__mono {
    font-family: var(--font-mono);
    font-size: var(--text-3xs);
    letter-spacing: 1px;
    color: var(--color-faint);
}
```

- [ ] **Step 2: Verify no parse errors**

- [ ] **Step 3: Commit**

```bash
git add assets/css/sections.css
git commit -m "redesign: rewrite section styles"
```

---

## Task 6: Rewrite index.html body content

This is the largest task. Replace everything inside `<body>` (keeping `<head>` intact, except removing theme-color meta and theme-universal script).

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Update `<head>` — remove theme meta and theme script**

Remove this line from `<head>`:
```html
<meta name="theme-color" content="#1E40AF">
```

Remove this line from `<head>`:
```html
<script src="/assets/js/theme-universal.js"></script>
```

- [ ] **Step 2: Replace `<body>` content with the new structure**

```html
<body>
    <a href="#main" class="skip-to-main">Skip to main content</a>
    <div class="scroll-progress" id="scroll-progress"></div>

    <!-- Navigation -->
    <nav class="navbar" id="navbar">
        <a href="/" class="navbar__brand">MC<span class="dot">.</span></a>
        <div class="navbar__nav">
            <a href="#projects" class="navbar__link">Projects</a>
            <a href="/blog/" class="navbar__link">Blog</a>
            <a href="#contact" class="navbar__link">Contact</a>
            <a href="https://raw.githubusercontent.com/moisc/moisc.github.io/main/Mois Cohen Resume 2026.pdf"
               class="navbar__link" download="Mois Cohen Resume 2026.pdf">Resume</a>
        </div>
    </nav>

    <main id="main">

        <!-- Hero -->
        <section class="hero" id="hero">
            <div class="hero__label">Mechanical Engineer — EIT</div>
            <h1 class="hero__name">Mois Cohen</h1>
            <p class="hero__bio">Building systems that solve real problems — from wildfire safety to aerospace innovation. Currently at Innoflight.</p>
            <div class="hero__stats">
                <div class="hero__stat">
                    <div class="hero__stat-label">Current Role</div>
                    <div class="hero__stat-value">Innoflight</div>
                    <div class="hero__stat-sub">Mechanical Eng. I · Nov 2025</div>
                </div>
                <div class="hero__stat">
                    <div class="hero__stat-label">Education</div>
                    <div class="hero__stat-value">Cal Poly SLO</div>
                    <div class="hero__stat-sub">B.S. Mechanical Eng. · 2025</div>
                </div>
                <div class="hero__stat">
                    <div class="hero__stat-label">Notable</div>
                    <div class="hero__stat-value">Autoprint</div>
                    <div class="hero__stat-sub">Co-Founder · $11K Kickstarter</div>
                </div>
                <div class="hero__stat">
                    <div class="hero__stat-label">Specialties</div>
                    <div class="hero__stat-value">CAD / FEA</div>
                    <div class="hero__stat-sub">Thermal · SolidWorks · MATLAB</div>
                </div>
            </div>
        </section>

        <!-- About -->
        <section class="section" id="about">
            <div class="two-col">
                <div class="section-label">About</div>
                <div class="about__text animate-on-scroll">
                    <p>I'm a mechanical engineer who believes <strong>engineering should solve real problems</strong>, not just theoretical ones.</p>
                    <p>My journey started with Autoprint — co-founded a startup, raised $11K on Kickstarter, filed a provisional patent, and shipped real products. That experience taught me the gap between "it works in CAD" and "it works in the real world."</p>
                    <p>At Cal Poly, I deployed 200+ IoT sensors to reduce campus energy consumption by 15%. At K2 Systems and Nina Labs, I cut testing time in half and delivered measurable results. Now at Innoflight, applying that same mindset to aerospace systems.</p>
                </div>
            </div>
        </section>

        <!-- Projects -->
        <section class="section" id="projects">
            <div class="projects__header">
                <h2 class="section-title">Projects</h2>
                <span class="projects__count">5 WORKS</span>
            </div>
            <div class="project-list">
                <div class="project-row project-row--no-link">
                    <span class="project-row__num">01</span>
                    <div>
                        <div class="project-row__name">Innoflight — Aerospace Systems</div>
                        <div class="project-row__cat">Thermal Analysis · CAD Design · Satellite Systems</div>
                    </div>
                    <span class="tag">CURRENT</span>
                    <span class="project-row__year">2025 – now</span>
                    <span class="project-row__arrow">→</span>
                </div>
                <a href="/firehoseclamp/" class="project-row">
                    <span class="project-row__num">02</span>
                    <div>
                        <div class="project-row__name">Wildland Fire Hose Clamp</div>
                        <div class="project-row__cat">SolidWorks · FEA · GD&amp;T · Cal Fire Validated</div>
                    </div>
                    <span class="tag">CAPSTONE</span>
                    <span class="project-row__year">2024 – 2025</span>
                    <span class="project-row__arrow">→</span>
                </a>
                <div class="project-row project-row--no-link">
                    <span class="project-row__num">03</span>
                    <div>
                        <div class="project-row__name">Cal Poly Energy Systems Research</div>
                        <div class="project-row__cat">IoT · HVAC Analysis · MATLAB · 200+ Sensors</div>
                    </div>
                    <span class="tag">RESEARCH</span>
                    <span class="project-row__year">2024 – 2025</span>
                    <span class="project-row__arrow">→</span>
                </div>
                <a href="/autoprint/" class="project-row">
                    <span class="project-row__num">04</span>
                    <div>
                        <div class="project-row__name">Autoprint — 3D Printing Startup</div>
                        <div class="project-row__cat">Product Design · Kickstarter · Provisional Patent</div>
                    </div>
                    <span class="tag">STARTUP</span>
                    <span class="project-row__year">2022 – 2023</span>
                    <span class="project-row__arrow">→</span>
                </a>
                <a href="/k2-systems/" class="project-row">
                    <span class="project-row__num">05</span>
                    <div>
                        <div class="project-row__name">K2 Systems — Solar Racking</div>
                        <div class="project-row__cat">Testing · CAD · Process Improvement</div>
                    </div>
                    <span class="tag">INTERNSHIP</span>
                    <span class="project-row__year">Summer 2024</span>
                    <span class="project-row__arrow">→</span>
                </a>
            </div>
        </section>

        <!-- Skills -->
        <section class="section section--tinted" id="skills">
            <div class="two-col">
                <div class="section-label">Skills</div>
                <div class="skill-groups animate-on-scroll">
                    <div>
                        <div class="skill-group__title">Design &amp; Analysis</div>
                        <div class="skill-group__list">
                            <div class="skill-item">SolidWorks</div>
                            <div class="skill-item">FEA / Simulation</div>
                            <div class="skill-item">GD&amp;T</div>
                            <div class="skill-item">Thermal Analysis</div>
                        </div>
                    </div>
                    <div>
                        <div class="skill-group__title">Programming</div>
                        <div class="skill-group__list">
                            <div class="skill-item">MATLAB</div>
                            <div class="skill-item">Python</div>
                            <div class="skill-item">LabVIEW</div>
                        </div>
                    </div>
                    <div>
                        <div class="skill-group__title">Manufacturing</div>
                        <div class="skill-group__list">
                            <div class="skill-item">Machining</div>
                            <div class="skill-item">3D Printing</div>
                            <div class="skill-item">Sheet Metal</div>
                        </div>
                    </div>
                    <div>
                        <div class="skill-group__title">Systems</div>
                        <div class="skill-group__list">
                            <div class="skill-item">IoT / Sensors</div>
                            <div class="skill-item">HVAC Systems</div>
                            <div class="skill-item">Aerospace</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Contact -->
        <section class="section" id="contact">
            <div class="contact__grid">
                <div class="animate-on-scroll">
                    <h2 class="contact__title">Let's work<br>together.</h2>
                    <p class="contact__sub">Open to interesting problems in aerospace, thermal systems, or product development.</p>
                </div>
                <div class="animate-on-scroll">
                    <a href="mailto:mois.cohen787@gmail.com" class="contact-link">
                        <div>
                            <div class="contact-link__label">Email</div>
                            <div class="contact-link__value">mois.cohen787@gmail.com</div>
                        </div>
                        <span class="contact-link__arrow">→</span>
                    </a>
                    <a href="https://www.linkedin.com/in/moiscohen/" target="_blank" rel="noopener" class="contact-link">
                        <div>
                            <div class="contact-link__label">LinkedIn</div>
                            <div class="contact-link__value">linkedin.com/in/moiscohen</div>
                        </div>
                        <span class="contact-link__arrow">→</span>
                    </a>
                    <a href="https://raw.githubusercontent.com/moisc/moisc.github.io/main/Mois Cohen Resume 2026.pdf"
                       download="Mois Cohen Resume 2026.pdf" class="contact-link">
                        <div>
                            <div class="contact-link__label">Resume</div>
                            <div class="contact-link__value">Download PDF</div>
                        </div>
                        <span class="contact-link__arrow">→</span>
                    </a>
                </div>
            </div>
        </section>

    </main>

    <!-- Footer -->
    <footer class="footer">
        <span class="footer__brand">MC<span class="dot">.</span></span>
        <span class="footer__mono">Mois Cohen · Mechanical Engineer · San Diego, CA</span>
    </footer>

    <button class="back-to-top" id="back-to-top" aria-label="Back to top">↑</button>

    <script src="/assets/js/main.js"></script>
</body>
```

- [ ] **Step 3: Open in browser — the page should look roughly correct at this point**

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "redesign: rewrite homepage HTML structure"
```

---

## Task 7: Update main.js — remove dead features

**Files:**
- Modify: `assets/js/main.js`
- Modify: `assets/js/theme-universal.js`

- [ ] **Step 1: Replace `assets/js/theme-universal.js` with an empty stub**

```js
// Theme system removed in redesign — light mode only.
```

- [ ] **Step 2: In `assets/js/main.js`, replace the `DOMContentLoaded` initializer with the stripped version**

Find this block (lines ~7–20):
```js
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initTheme();
    initScrollProgress();
    initTypingAnimation();
    initIntersectionObserver();
    initFormHandling();
    initSmoothScrolling();
    initParallaxEffects();
    initSkillsProgressBars();
    initCounterAnimations();
    initHoverEffects();
    initBackToTop();
});
```

Replace with:
```js
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initScrollProgress();
    initIntersectionObserver();
    initSmoothScrolling();
    initCounterAnimations();
    initBackToTop();
    // initFormHandling kept in file but not called — no form in HTML yet
});
```

- [ ] **Step 3: Delete the following functions entirely from `main.js`:**
  - `initTheme()` — dark mode toggle
  - `initTypingAnimation()` — cycling hero subtitle
  - `initParallaxEffects()` — hero parallax on scroll
  - `initSkillsProgressBars()` — animates skill bar widths
  - `initHoverEffects()` — delete the entire function. It handles card tilt (`.card` elements no longer exist), floating animation, and button hover lift. None of these are needed — CSS handles hover states now.

- [ ] **Step 4: Update `initNavigation()` — remove mobile menu and theme toggle references**

The simplified `initNavigation` should only do:
1. Navbar scroll shadow: add/remove a class on `#navbar` on scroll
2. Active nav link highlighting based on scroll position

Remove: mobile toggle logic, escape key handler for mobile menu, theme toggle click.

Replace the entire `initNavigation` function with:
```js
function initNavigation() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    window.addEventListener('scroll', throttle(function() {
        navbar.style.boxShadow = window.scrollY > 0
            ? '0 1px 0 #E8EEF4'
            : 'none';
    }, 100));
}
```

- [ ] **Step 5: Verify in browser — scroll, nav links, back-to-top, and fade-in animations all work**

- [ ] **Step 6: Commit**

```bash
git add assets/js/main.js assets/js/theme-universal.js
git commit -m "redesign: strip removed features from main.js"
```

---

## Task 8: Visual QA pass

- [ ] **Step 1: Open `index.html` in browser. Check each section:**
  - Nav: sticky, MC. with navy dot, mono links
  - Hero: large name, stat bar with 4 columns separated by borders
  - About: two-column, monospace body text
  - Projects: numbered rows, hover effect, tags, correct links on rows 02/04/05
  - Skills: tinted bg, 2×2 skill groups with navy dots
  - Contact: two-column, 3 link rows with arrows
  - Footer: MC. + mono tagline

- [ ] **Step 2: Check for obvious layout breakage at ~375px width (mobile)**

- [ ] **Step 3: Fix any visual issues found, then commit**

```bash
git add assets/css/variables.css assets/css/base.css assets/css/navigation.css assets/css/components.css assets/css/sections.css index.html assets/js/main.js
git commit -m "redesign: visual QA fixes"
```

---

## Task 9: Update meta tags and theme color

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Update `<meta name="theme-color">` value (add it back with navy)**

In `<head>`, add:
```html
<meta name="theme-color" content="#1E3A5F">
```

- [ ] **Step 2: Commit**

```bash
git add index.html
git commit -m "redesign: update theme-color meta to navy"
```
