# 🚀 Quick Start Guide

## View Your New Website

1. **Local Preview:**
   ```bash
   cd "/Users/moiscohen/Local Documents/Portfolio Website/moisc.github.io"
   python3 -m http.server 8000
   ```
   Then open: `http://localhost:8000`

2. **Deploy to GitHub Pages:**
   ```bash
   git add .
   git commit -m "Complete ULTIMATE REDESIGN transformation"
   git push origin main
   ```
   Your site will be live at: `https://moisc.github.io`

## What's New

### 🎨 Bold New Design
- **96px hero typography** - "MOIS COHEN" in massive bold font
- **Bento grid layout** - All 6 projects visible on homepage
- **Monochrome + MC. blue** - Professional color scheme
- **Dark mode** - Works perfectly across all pages
- **Mobile-first** - Responsive on all devices

### 📄 Pages Transformed
- ✅ **Homepage** (`/index.html`) - Complete rebuild with bento grid
- ✅ **Autoprint** (`/autoprint/`) - $11K raised, clean template
- ✅ **K2 Systems** (`/k2-systems/`) - 50% testing time cut
- ✅ **Nina Labs** (`/ninalabs/`) - 80% pour accuracy
- ✅ **Fire Hose Clamp** (`/firehoseclamp/`) - Protected IP notice

### 🎯 Key Features
- Scroll animations (fade in, slide up)
- Back-to-top button (appears after scrolling)
- Theme toggle (light/dark mode)
- Mobile hamburger menu
- Contact form (Formspree)
- Stats bar with real metrics
- Image galleries with hover zoom

## Customization

### Update Content

**Change your name or title:**
```html
<!-- Edit index.html line 115-120 -->
<h1 class="hero-title">
    YOUR NAME HERE
</h1>
<h2>Your Title</h2>
```

**Update stats:**
```html
<!-- Edit index.html around line 145 -->
<div class="stat">
    <span class="stat__value">$20K+</span>
    <span class="stat__label">Cost Saved</span>
</div>
```

**Add/remove projects:**
```html
<!-- Edit the bento-grid section in index.html around line 175 -->
<div class="bento-item span-8">
    <div class="card">
        <!-- Your project content -->
    </div>
</div>
```

### Change Colors

**Edit design tokens:**
```css
/* File: /assets/css/variables.css line 16 */
--mc-blue: #1E40AF;  /* Change to your brand color */
```

**Change to gradient accent (not recommended):**
```css
/* Add to variables.css */
--accent: linear-gradient(90deg, #1E40AF, #3b82f6);
```

### Typography

**Make hero bigger/smaller:**
```css
/* File: /assets/css/variables.css line 31 */
--font-size-hero: 6rem; /* 96px - increase or decrease */
```

**Change font:**
```html
<!-- Edit index.html head section -->
<link href="https://fonts.googleapis.com/css2?family=YOUR-FONT:wght@400;600;700;800;900&display=swap" rel="stylesheet">
```

```css
/* Then update variables.css line 22 */
--font-primary: 'YOUR-FONT', sans-serif;
```

## Maintenance

### Add New Project

1. **Create folder:** `/your-project-name/`
2. **Copy template:** Use `/autoprint/index.html` as starting point
3. **Update content:** Change title, images, metrics, description
4. **Add to homepage:** Add new card in bento grid section

**Example:**
```html
<!-- Add to index.html bento grid -->
<div class="bento-item span-4">
    <a href="/your-project-name/" class="card-link">
        <div class="card">
            <div class="card__image">
                <img src="/your-project-name/image.jpg" alt="Project">
            </div>
            <span class="card__category">Category</span>
            <h3 class="card__title">Project Name</h3>
            <p class="card__description">Description here</p>
            <div class="card__tags">
                <span class="tag">Tech</span>
            </div>
        </div>
    </a>
</div>
```

### Update Resume

**Method 1 - Replace PDF:**
1. Rename new resume: `Mois Cohen Resume 2026.pdf`
2. Replace existing file in root directory
3. Git commit and push

**Method 2 - Update links:**
```bash
# Find all resume links
grep -r "Mois Cohen Resume 2026.pdf" .

# Update to new filename
# Edit index.html, autoprint/index.html, k2-systems/index.html, ninalabs/index.html
```

### Add Contact Method

```html
<!-- Add to index.html contact section around line 397 -->
<a href="https://your-social-link" style="...">
    <i class="fab fa-your-icon" style="..."></i>
    <h4>Platform Name</h4>
    <p style="...">@yourhandle</p>
</a>
```

## Testing Checklist

Before deploying:
- [ ] View on desktop (Chrome, Firefox, Safari)
- [ ] View on mobile (iPhone, Android)
- [ ] Test dark mode toggle
- [ ] Test mobile menu hamburger
- [ ] Click all project links
- [ ] Test contact form submission
- [ ] Verify all images load
- [ ] Check resume download works
- [ ] Test back-to-top button
- [ ] Verify smooth scrolling works

## Browser Support

### Fully Supported:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android 10+)

### Features Degrade Gracefully:
- CSS Grid → Flexbox fallback
- Custom properties → Default colors
- Backdrop filter → Solid background
- Smooth scroll → Instant scroll

## Performance Tips

### Optimize Images:
```bash
# Install ImageMagick
brew install imagemagick

# Convert to WebP (smaller file size)
convert your-image.jpg -quality 85 your-image.webp

# Resize large images
convert large-image.jpg -resize 1200x your-image.jpg
```

### Lighthouse Score Goals:
- Performance: 95+
- Accessibility: 100
- Best Practices: 100
- SEO: 100

## Troubleshooting

**Dark mode not working:**
- Clear localStorage: `localStorage.removeItem('theme')`
- Check theme-universal.js is loading
- Verify data-theme attribute exists on `<html>`

**Mobile menu stuck open:**
- Check for JavaScript errors in console
- Verify mobile-menu-toggle class exists
- Clear browser cache

**Images not loading:**
- Check file paths are correct (case-sensitive)
- Verify images exist in folders
- Check for URL encoding (%20 for spaces)

**Bento grid looks wrong:**
- Check browser supports CSS Grid
- Verify all span classes are correct
- Check for conflicting CSS

## Support

**Documentation:**
- [REDESIGN_COMPLETE.md](REDESIGN_COMPLETE.md) - Full redesign details
- [ULTIMATE_REDESIGN.md](ULTIMATE_REDESIGN.md) - Original design vision

**Key Files:**
- `/assets/css/variables.css` - Design tokens
- `/assets/css/components.css` - All components
- `/assets/js/main.js` - All JavaScript
- `/index.html` - Homepage

**Need Help?**
1. Check browser console for errors (F12)
2. Review REDESIGN_COMPLETE.md for technical details
3. Inspect element to see applied styles

---

**Your portfolio is ready to launch. Make them remember the name: MC.** 🚀
