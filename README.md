# MC. Portfolio - Mois Cohen

> **Bold. Minimal. Engineering Precision.**

A modern mechanical engineering portfolio built with bold minimalism, featuring 96px hero typography, bento grid layout, and monochrome design with strategic MC. blue accents.

## 🚀 Quick Start

```bash
# Preview locally
cd "/Users/moiscohen/Local Documents/Portfolio Website/moisc.github.io"
python3 -m http.server 8000
# Open http://localhost:8000

# Deploy to GitHub Pages
git add .
git commit -m "Update portfolio"
git push origin main
# Live at https://moisc.github.io
```

## 📂 Project Structure

```
moisc.github.io/
├── index.html              # Homepage (bento grid, hero, projects)
├── autoprint/              # Autoprint Inc. project page
├── k2-systems/             # K2 Systems internship page
├── ninalabs/               # Nina Labs project page
├── firehoseclamp/          # Fire Hose Clamp (protected IP)
├── assets/
│   ├── css/
│   │   ├── variables.css   # Design tokens (colors, typography, spacing)
│   │   ├── base.css        # Foundation styles, typography, reset
│   │   ├── navigation.css  # Navbar, mobile menu, theme toggle
│   │   └── components.css  # Buttons, cards, grids, forms
│   └── js/
│       ├── main.js         # All interactivity, animations
│       └── theme-universal.js  # Dark mode system
├── sitemap.xml             # SEO sitemap
├── robots.txt              # Search engine directives
└── docs/
    ├── REDESIGN_COMPLETE.md    # Full technical documentation
    ├── QUICK_START.md          # User guide
    ├── PERFORMANCE.md          # Optimization guide
    └── DEPLOY.md               # Deployment checklist
```

## 🎨 Design System

### Colors
- **Primary**: `#0A0A0A` (Black)
- **Secondary**: `#FAFAFA` (White)
- **Accent**: `#1E40AF` (MC. Blue) - Used sparingly for CTAs

### Typography
```
Hero:   96px / 900 weight (mobile: 48px)
H1:     72px / 800 weight (mobile: 36px)
H2:     48px / 700 weight (mobile: 28px)
H3:     32px / 600 weight (mobile: 24px)
H4:     24px / 600 weight
Body:   18px / 400 weight (mobile: 16px)
Small:  14px / 400 weight
```

### Spacing
8px grid system:
`4px → 8px → 16px → 24px → 32px → 48px → 64px → 96px → 128px`

## ✨ Features

### Homepage
- **Bold 96px Hero** - "MOIS COHEN" in massive typography
- **Stats Bar** - Real metrics ($20K+ saved, 200+ sensors, Patent, Cal Fire)
- **Bento Grid** - All 6 projects visible at once
- **3-Column Skills** - Simple, scannable list
- **Contact Form** - Formspree integration

### Project Pages
- Consistent template structure
- Hero image/video
- Impact metrics (3 concrete numbers)
- Challenge vs Solution layout
- Image galleries
- Technical details with tags

### Dark Mode
- Toggle in navigation
- Persists across pages (localStorage)
- Smooth transitions
- Works flawlessly on all pages

### Responsive Design
- Mobile-first approach
- Breakpoints: 768px (mobile), 1024px (tablet), 1200px+ (desktop)
- Bento grid adapts: 12 columns → 6 columns → 1 column
- Hamburger menu on mobile
- Touch-friendly buttons (56px height)

### Performance
- Lighthouse Performance: 95+
- Lazy loading on all images
- Throttled scroll events (60fps)
- Minimal JavaScript (~20KB)
- Modular CSS (~43KB)

### SEO
- JSON-LD structured data
- Sitemap.xml
- Robots.txt
- OG tags for social sharing
- Semantic HTML
- Proper heading hierarchy

### Accessibility
- WCAG 2.1 compliant
- Keyboard navigation
- Focus visible states
- Skip to main content
- ARIA labels
- Screen reader friendly
- Color contrast 4.5:1+

## 📄 Pages

### Main Pages
1. **Homepage** (`/`) - Portfolio overview with all projects
2. **Autoprint** (`/autoprint/`) - $11K raised on Kickstarter, 125 backers
3. **K2 Systems** (`/k2-systems/`) - 50% testing time cut, $15K savings
4. **Nina Labs** (`/ninalabs/`) - 80% pour accuracy improvement
5. **Fire Hose Clamp** (`/firehoseclamp/`) - Protected IP notice

### Utility Pages
- `/sitemap.xml` - SEO sitemap
- `/robots.txt` - Search engine directives
- `/favicon.svg` - MC. logo favicon

## 🛠️ Tech Stack

### Core
- **HTML5** - Semantic markup
- **CSS3** - CSS Variables, Grid, Flexbox
- **Vanilla JavaScript** - No frameworks

### External Services
- **GitHub Pages** - Hosting
- **Google Fonts** - Inter (primary), Space Mono (mono)
- **Font Awesome** - Icons
- **Formspree** - Contact form
- **Google Analytics** - Traffic tracking

## 📱 Browser Support

### Fully Supported
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- iOS Safari 14+
- Chrome Mobile (Android 10+)

### Graceful Degradation
- CSS Grid → Flexbox fallback
- Custom properties → Default colors
- Backdrop filter → Solid background

## 🎯 Key Metrics

### Current
- **Total Pages**: 5 (1 homepage + 4 projects)
- **CSS Size**: ~43KB (gzipped: ~8KB)
- **JS Size**: ~20KB (gzipped: ~6KB)
- **Lighthouse**: 95+ across all metrics

### Goals
- **Load Time**: <1s on 4G
- **First Contentful Paint**: <1.0s
- **Largest Contentful Paint**: <1.5s
- **Cumulative Layout Shift**: <0.1

## 📝 Documentation

- **[REDESIGN_COMPLETE.md](REDESIGN_COMPLETE.md)** - Full technical breakdown of the redesign
- **[QUICK_START.md](QUICK_START.md)** - How to use, customize, and maintain
- **[PERFORMANCE.md](PERFORMANCE.md)** - Optimization techniques and benchmarks
- **[DEPLOY.md](DEPLOY.md)** - Complete deployment checklist

## 🔄 Workflow

### Making Changes
```bash
# 1. Edit files locally
code index.html  # or any file

# 2. Preview changes
python3 -m http.server 8000

# 3. Test in browser
open http://localhost:8000

# 4. Commit and deploy
git add .
git commit -m "Description of changes"
git push origin main

# 5. Verify live site (wait 2-5 min)
open https://moisc.github.io
```

### Adding New Project
1. Create folder: `/project-name/`
2. Copy template from `/autoprint/index.html`
3. Update content, images, metrics
4. Add card to homepage bento grid
5. Test and deploy

### Updating Resume
1. Replace `Mois Cohen Resume 2026.pdf` in root
2. Update all download links if filename changes
3. Commit and push

## 🐛 Troubleshooting

### Dark Mode Not Working
```javascript
// Clear localStorage and reload
localStorage.removeItem('theme');
location.reload();
```

### Mobile Menu Stuck
Check for JavaScript errors in console (F12)

### Images Not Loading
- Verify file paths (case-sensitive)
- Check file exists in correct folder
- Clear browser cache

### CSS Not Applying
- Check file paths in HTML
- Clear browser cache
- Verify CSS files uploaded to GitHub

## 📧 Contact

- **Email**: mois.cohen787@gmail.com
- **Phone**: (858) 668-9347
- **LinkedIn**: [linkedin.com/in/moiscohen](https://www.linkedin.com/in/moiscohen/)
- **Portfolio**: [moisc.github.io](https://moisc.github.io)

## 📜 License

© 2026 Mois Cohen. All rights reserved.

---

**Built with engineering precision. Designed to stand out.** - MC.
