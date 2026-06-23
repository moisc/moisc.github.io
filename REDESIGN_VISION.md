# 🎨 Complete Website Redesign - Ultra Vision

## 🎯 Design Philosophy

**"Engineering Clarity"**
- Clean, minimal, professional
- Let the work speak for itself
- Bold typography for hierarchy
- Generous whitespace
- Your MC. blue as strategic accent (not everywhere)
- Modern but timeless

---

## 🏗️ New Site Structure (9 Pages Reimagined)

### **Tier 1: Core Portfolio (High Priority)**

#### 1. **Homepage (index.html)** - The Hub
**New Approach:** Clean, scannable, bento-grid layout

**Sections:**
```
┌─────────────────────────────────────┐
│  HERO (Full Screen)                 │
│  • Name (HUGE, bold)                │
│  • "Mechanical Engineer"            │
│  • One-line tagline                 │
│  • Two buttons: Projects | Contact  │
└─────────────────────────────────────┘

┌──────────────┬──────────────┬────────┐
│ Quick Stats  │              │        │
│ (Not %s!)    │  Featured    │  About │
│ • 5 Projects │  Project     │  Quick │
│ • 3 Research │  Image       │  Bio   │
│ • Cal Poly   │  (Large)     │  Blurb │
└──────────────┴──────────────┴────────┘

┌─────────────────────────────────────┐
│  BENTO GRID - All Projects          │
│  (4-6 cards, different sizes)       │
│                                     │
│  ┌───┬───┐  ┌─────┐  ┌───┐        │
│  │ 1 │ 2 │  │  3  │  │ 4 │        │
│  ├───┴───┤  │     │  ├───┤        │
│  │   5   │  └─────┘  │ 6 │        │
│  └───────┘           └───┘         │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  SKILLS (Simple Grid)                │
│  • Icon + Name only                 │
│  • No bars, no percentages          │
│  • Clean, scannable                 │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  CONTACT (Minimal)                   │
│  • Email, LinkedIn, Phone           │
│  • Simple form                      │
│  • Resume download                  │
└─────────────────────────────────────┘
```

#### 2-5. **Project Pages (K2, Nina, Autoprint, Fire Hose)**
**New Template:** Consistent, clean, story-focused

```
┌─────────────────────────────────────┐
│  HERO IMAGE (Full width, tall)      │
│  • Project name overlaid            │
│  • Role & company                   │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  OVERVIEW (Two columns)              │
│  Left: Problem statement            │
│  Right: Solution summary            │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  METRICS (Concrete, not %)           │
│  • "Reduced costs by $12K"          │
│  • "200+ sensors deployed"          │
│  • "Tested by Cal Fire"             │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  PROCESS (Timeline/Steps)            │
│  1. Research → 2. Design → 3. Test  │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  IMAGE GALLERY (Grid)                │
│  • Large, high-quality photos       │
│  • CAD renders                      │
│  • Prototypes                       │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  TECHNICAL DETAILS                   │
│  • Tools used                       │
│  • Technologies                     │
│  • Methodologies                    │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  OUTCOMES                            │
│  • What was achieved                │
│  • Impact                           │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  NEXT PROJECT                        │
│  • Simple card linking to next      │
└─────────────────────────────────────┘
```

### **Tier 2: Utility Pages**

#### 6. **Shop Page** - Keep or Remove?
**Options:**
- A) Keep as merch/side business
- B) Remove if not active
- C) Simplify to "Support My Work" page

#### 7. **Goals Page** - Repurpose
**New idea:** "Journey" or "Timeline" page
- Visual timeline of career
- Education → Projects → Current role
- Future goals

#### 8. **Ben Stirling** - Archive or Remove?
**Options:**
- A) Keep if relevant project
- B) Move to archived projects
- C) Remove entirely

#### 9. **Test Page** - Remove
- Development page, shouldn't be public

---

## 🎨 New Design System

### **Color Palette**

**Primary:** Mostly Black & White
```
Background: #FFFFFF (light) / #0A0A0A (dark)
Text: #0A0A0A (light) / #FAFAFA (dark)
Gray: #6B7280 (muted text)
```

**Accent:** Your MC. Blue (Strategic Use Only)
```
Primary Blue: #1E40AF (your brand)
Use for:
- CTA buttons
- Links
- Project category tags
- Active states
- NOT backgrounds
```

**Never Use:**
- Gradients (too 2020)
- Multiple colors (confusing)
- Percentage badges (feels gimmicky)

### **Typography**

**System:**
```css
/* Headings */
H1: 72px / 900 weight (Hero only)
H2: 48px / 800 weight (Section titles)
H3: 32px / 700 weight (Subsections)
H4: 24px / 600 weight (Cards)
H5: 20px / 600 weight (Small headings)

/* Body */
Body: 18px / 400 weight (Readable!)
Small: 16px / 400 weight
Caption: 14px / 400 weight
```

**Fonts:**
- **Primary:** Inter (clean, modern, professional)
- **Optional Accent:** Space Grotesk (for name/hero)
- **Never:** More than 2 fonts

### **Spacing**

**The 8px Grid:**
```
4px  - Tiny gaps
8px  - Small spacing
16px - Default gap
24px - Medium spacing
32px - Section padding
48px - Large spacing
64px - Section breaks
96px - Major breaks
```

**Generous Whitespace:**
- Don't be afraid of empty space
- Let content breathe
- Mobile: 24px padding minimum
- Desktop: 80px+ padding on sides

### **Layout System**

**Bento Grid** (Modern, flexible)
```
┌──────┬──────┬──────┐
│  1   │  2   │  3   │  Standard 3-column
├──────┴──────┼──────┤
│      4      │  5   │  Varied sizes
├──────┬──────┴──────┤
│  6   │      7      │  Creates visual interest
└──────┴─────────────┘
```

**Benefits:**
- Modern, 2026 aesthetic
- Flexible for different content
- Great for projects showcase
- Mobile-friendly (stacks naturally)
- Visually interesting without being busy

### **Components**

**Cards (New Style):**
```
Border: None or 1px subtle
Shadow: Subtle (0 2px 8px rgba(0,0,0,0.04))
Radius: 12px (modern, not too round)
Padding: 32px
Hover: Lift 4px + deeper shadow
```

**Buttons (Simplified):**
```
Primary: Blue background, white text, 48px height
Secondary: White background, blue border, 48px height
Ghost: No background, blue text, 48px height
Rounded: 8px (not fully rounded)
```

**Images:**
```
Aspect Ratio: Maintain (no squishing)
Radius: 8px (slight rounding)
Hover: Subtle zoom (1.02x, not 1.05x)
Loading: Blur-up effect
```

---

## 🎯 What Makes It "Attractive But Simple"

### ✅ **Do:**
1. **Large, bold typography** - Hierarchy through size
2. **Generous whitespace** - Let it breathe
3. **High-quality photos** - Big, clear project images
4. **Consistent spacing** - 8px grid system
5. **Subtle animations** - Smooth, not flashy
6. **Clear CTAs** - Obvious next actions
7. **Readable text** - 18px minimum, good line-height
8. **One accent color** - Blue, used strategically

### ❌ **Don't:**
1. **Gradients** - Dated, distracting
2. **Multiple colors** - Confusing brand
3. **Percentage badges** - Feels gimmicky
4. **Busy backgrounds** - Keep it clean
5. **Tiny text** - Hard to read
6. **Too many animations** - Distracting
7. **Cramped layouts** - Needs breathing room
8. **Inconsistent spacing** - Looks unprofessional

---

## 🏆 Inspiration Examples (What We're Going For)

**Style Reference:**
- **Linear.app** - Clean, modern, great typography
- **Stripe.com** - Minimal, professional, clear hierarchy
- **Apple.com** - Whitespace, photography, simple
- **Vercel.com** - Developer-focused, clean, modern
- **Notion.so** - Simple, scannable, clear

**Engineering Portfolios:**
- **brittanychiang.com** - Developer, clean grid
- **jacekjeznach.com** - Minimal, strong typography
- **bruno-simon.com** - Creative but organized

---

## 🔄 Proposed New Metrics (Instead of %s)

**Replace percentage banner with:**

### **Impact Highlights** (Concrete, Specific)
```
┌────────────────────────────────────────────┐
│  Real Achievements (Not Percentages)       │
├────────────────────────────────────────────┤
│                                            │
│  💰 Saved $20K+ in costs                   │
│  🔬 200+ IoT sensors deployed              │
│  🏆 Patented 3D printing innovation       │
│  🔥 Tested by Cal Fire professionals       │
│  🎓 Cal Poly Class of 2025                 │
│                                            │
└────────────────────────────────────────────┘
```

**Why Better:**
- Concrete and believable
- Tells actual story
- More impressive than percentages
- Easy to scan
- Memorable

**Alternative: Timeline**
```
2025  → Innoflight (Current)
2024  → Cal Poly Research
2023  → Nina Labs
2023  → K2 Systems
2020  → Autoprint Founder
```

---

## 🎨 New Hero Section (Homepage)

**Current:** Generic blue background, standard layout

**New Vision:**
```
Full screen, centered, minimal

─────────────────────────────────────────────

              MOIS COHEN

        Mechanical Engineer

    Designing systems that solve real problems—
    from wildfire equipment to aerospace innovation.

        [View Projects]  [Get In Touch]

─────────────────────────────────────────────

Clean white background (light mode)
Black background (dark mode)
Name in 72px+, super bold
One-liner that tells your story
Two clear CTAs
Scroll indicator at bottom
```

---

## 📱 Mobile-First Approach

**All layouts stack beautifully on mobile:**

Desktop (3 columns):
```
┌────┬────┬────┐
│ 1  │ 2  │ 3  │
└────┴────┴────┘
```

Mobile (1 column):
```
┌────┐
│ 1  │
├────┤
│ 2  │
├────┤
│ 3  │
└────┘
```

**Mobile Specific:**
- Minimum 24px padding on sides
- Touch targets 48px minimum
- Hamburger menu (clean animation)
- Readable text (18px+)
- Easy to scroll

---

## ⚡ Performance & Polish

**Fast:**
- Minimal JavaScript
- Optimized images (WebP)
- CSS for animations (GPU-accelerated)
- Lazy loading
- No heavy frameworks

**Smooth:**
- 60fps animations
- Instant page loads
- Smooth scrolling
- No jank
- Progressive enhancement

**Accessible:**
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Screen reader friendly
- High contrast mode

---

## 🎯 Redesign Priority

### **Phase A: Core Redesign** (Most Important)
1. New homepage layout (bento grid)
2. New project page template
3. New design system (typography, colors, spacing)
4. Remove percentage banner
5. Add concrete achievements

### **Phase B: Project Pages**
6. Apply new template to all 4 project pages
7. Enhance with better images
8. Add process/timeline sections

### **Phase C: Cleanup**
9. Decide on shop/goals/ben-stirling/test pages
10. Final polish
11. Performance optimization

---

## 💡 Key Decisions Needed From You:

1. **Shop page** - Keep, simplify, or remove?
2. **Goals page** - Repurpose to timeline or remove?
3. **Ben Stirling page** - Relevant or archive?
4. **Test page** - Remove? (Should be removed)
5. **Metrics** - Which achievements to highlight?
6. **About Me** - Write a compelling one-liner?
7. **Hero style** - Minimal clean or something bold?

---

## 🚀 Implementation Approach

**Option 1: Full Rebuild** (Recommended)
- Start fresh with new design
- Migrate content to new structure
- Modern, clean codebase
- ~20-30k tokens

**Option 2: Gradual Evolution**
- Update homepage first
- Then project pages
- Then utilities
- ~15-20k tokens

**Option 3: Hybrid**
- Keep structure, refresh design
- New components, same pages
- Faster but less dramatic
- ~10-15k tokens

---

## 🎨 Visual Mockup (Text)

### New Homepage Hero:
```
────────────────────────────────────────

                                    [☰]

        M O I S   C O H E N

      Mechanical Engineer

  Building systems that matter—from
  wildfire safety to aerospace innovation.

     [Projects]    [Contact]

            ↓

────────────────────────────────────────
```

### New Projects Section:
```
────────────────────────────────────────

         Recent Projects

┌──────────┬─────────┬──────────┐
│          │  Nina   │          │
│  K2      │  Labs   │ Autoprint│
│ Systems  │         │          │
│  [img]   │ [img]   │  [img]   │
└──────────┴─────────┴──────────┘
┌──────────────────┬────────────┐
│   Fire Hose      │   More     │
│   Clamp [img]    │  Coming... │
└──────────────────┴────────────┘

────────────────────────────────────────
```

**Clean, scannable, modern.**

---

## 🎯 Bottom Line

**What makes a portfolio "attractive but simple":**

1. ✅ **Bold typography** - Size creates hierarchy
2. ✅ **Whitespace** - Let content breathe
3. ✅ **Quality photos** - Show real work
4. ✅ **One accent color** - MC. blue, strategic use
5. ✅ **Consistent spacing** - 8px grid
6. ✅ **Clear structure** - Easy to navigate
7. ✅ **Fast & smooth** - No jank
8. ✅ **Mobile perfect** - Works everywhere

**Remove:**
- ❌ Percentage banners (gimmicky)
- ❌ Gradients (dated)
- ❌ Multiple colors (confusing)
- ❌ Tiny text (hard to read)
- ❌ Cluttered layouts (overwhelming)

---

**Ready to implement this vision?**

Tell me which approach you prefer and I'll rebuild your entire site to be:
- ✨ Attractive (modern, clean, professional)
- 🎯 Simple (minimal, scannable, clear)
- 💪 Effective (showcases your work)
- 📱 Perfect on all devices

We have **~80k tokens** left - plenty to rebuild everything!
