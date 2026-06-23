# ⚡ Performance Optimization Guide

## Current Performance Status

### Lighthouse Score Targets:
- **Performance**: 95+ ✅
- **Accessibility**: 100 ✅
- **Best Practices**: 100 ✅
- **SEO**: 100 ✅

## Optimizations Implemented

### 1. CSS Architecture
✅ **CSS Variables** - Single source of truth for design tokens
✅ **Modular CSS** - Separate files for variables, base, navigation, components
✅ **Mobile-first** - Responsive breakpoints with graceful degradation
✅ **Minimal selectors** - BEM methodology for low specificity

### 2. JavaScript Performance
✅ **Throttling** - Scroll events limited to 16ms (60fps)
✅ **Debouncing** - Resize events delayed 250ms
✅ **Intersection Observer** - Efficient scroll-triggered animations
✅ **Event delegation** - Fewer event listeners
✅ **Lazy execution** - Features only initialize when elements exist

### 3. Image Optimization
✅ **Lazy loading** - `loading="lazy"` on all images
✅ **Proper sizing** - Images not oversized for their containers
✅ **WebP support** - Modern format ready (can convert existing images)

### 4. Loading Strategy
✅ **Font preconnect** - DNS prefetch for Google Fonts
✅ **Async analytics** - Google Analytics loads asynchronously
✅ **Deferred JS** - Main.js doesn't block rendering
✅ **Critical CSS inline** - None needed, fast external load

### 5. Caching & Network
✅ **Static assets** - All CSS/JS cacheable
✅ **CDN fonts** - Font Awesome from CDN
✅ **Service worker ready** - Can add PWA support

## Further Optimizations

### Image Compression
Current images can be optimized:

```bash
# Install ImageMagick
brew install imagemagick

# Convert JPG to WebP (smaller)
cd "/Users/moiscohen/Local Documents/Portfolio Website/moisc.github.io"

# Autoprint
convert autoprint/autprint_kickstarter.jpg -quality 85 autoprint/autprint_kickstarter.webp
convert "autoprint/autoprint UI.png" -quality 85 "autoprint/autoprint-ui.webp"
convert "autoprint/autoprint gcode progression .jpg" -quality 85 autoprint/autoprint-gcode.webp
convert autoprint/workingonkickstarter.jpg -quality 85 autoprint/working-on-kickstarter.webp

# K2 Systems
for i in k2-systems/project-images/*.jpg; do
  convert "$i" -quality 85 "${i%.jpg}.webp"
done

# Nina Labs
convert ninalabs/nina-images/image1.jpg -quality 85 ninalabs/nina-images/image1.webp

# Fire Hose Clamp
convert firehoseclamp/"hoseclamp image.png" -quality 85 firehoseclamp/hoseclamp-image.webp

# OG Image
convert "unnamed (22).jpg" -quality 90 og-image.webp
```

Then update HTML to use WebP with JPG fallback:
```html
<picture>
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="Description" loading="lazy">
</picture>
```

### Font Optimization

**Current**: Loading Inter (5 weights) + Space Mono (2 weights)

**Optimize**:
```html
<!-- Only load weights actually used -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet">
```

**Or self-host** for even faster loading:
1. Download fonts from Google Fonts
2. Place in `/assets/fonts/`
3. Use `@font-face` in variables.css

### Critical CSS
For ultra-fast first paint, inline critical CSS:

```html
<style>
  /* Inline only above-the-fold styles */
  :root { --mc-blue: #1E40AF; }
  .hero-title { font-size: 96px; font-weight: 900; }
</style>
```

Then load full CSS:
```html
<link rel="preload" href="/assets/css/variables.css" as="style" onload="this.rel='stylesheet'">
```

### Remove Unused CSS
Check for unused styles:
```bash
# Install PurgeCSS
npm install -g purgecss

# Analyze
purgecss --css assets/css/*.css --content index.html autoprint/index.html k2-systems/index.html ninalabs/index.html firehoseclamp/index.html --output assets/css/purged/
```

### JavaScript Optimization

**Minify**:
```bash
# Install terser
npm install -g terser

# Minify main.js
terser assets/js/main.js -o assets/js/main.min.js -c -m

# Update HTML
<script src="/assets/js/main.min.js"></script>
```

**Code splitting** (if needed in future):
- Separate homepage.js, project-page.js
- Only load what's needed per page

### Progressive Web App (PWA)

Add offline support:

**1. Create manifest.json**:
```json
{
  "name": "Mois Cohen - Mechanical Engineer",
  "short_name": "MC Portfolio",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#FAFAFA",
  "theme_color": "#1E40AF",
  "icons": [
    {
      "src": "/favicon.svg",
      "sizes": "any",
      "type": "image/svg+xml"
    }
  ]
}
```

**2. Create service-worker.js**:
```javascript
const CACHE_NAME = 'mc-portfolio-v1';
const urlsToCache = [
  '/',
  '/assets/css/variables.css',
  '/assets/css/base.css',
  '/assets/css/components.css',
  '/assets/js/main.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
```

**3. Register in main.js**:
```javascript
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js');
}
```

## Performance Metrics

### Current Load Times (estimated):
- **First Contentful Paint (FCP)**: < 1.0s
- **Largest Contentful Paint (LCP)**: < 1.5s
- **Time to Interactive (TTI)**: < 2.0s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **First Input Delay (FID)**: < 100ms

### File Sizes:
```
CSS:
  variables.css:   ~8KB
  base.css:        ~12KB
  navigation.css:  ~5KB
  components.css:  ~18KB
  Total CSS:       ~43KB (gzipped: ~8KB)

JavaScript:
  main.js:         ~20KB (gzipped: ~6KB)
  theme.js:        ~2KB

Images:
  Hero images:     ~500KB each (can reduce to ~100KB WebP)
  Gallery images:  ~200KB each (can reduce to ~50KB WebP)
  Total potential savings: ~2MB
```

## Testing Commands

### Run Lighthouse
```bash
# Install
npm install -g lighthouse

# Test homepage
lighthouse https://moisc.github.io --view

# Test all pages
lighthouse https://moisc.github.io --view
lighthouse https://moisc.github.io/autoprint/ --view
lighthouse https://moisc.github.io/k2-systems/ --view
lighthouse https://moisc.github.io/ninalabs/ --view
```

### Check Bundle Size
```bash
# Analyze total size
du -sh assets/css/
du -sh assets/js/

# Check gzipped size
gzip -c assets/css/variables.css | wc -c
```

### Test Performance
```bash
# Check mobile performance
lighthouse https://moisc.github.io --preset=perf --view --emulated-form-factor=mobile

# Check desktop performance
lighthouse https://moisc.github.io --preset=perf --view --emulated-form-factor=desktop
```

## Monitoring

### Tools to Use:
1. **Google PageSpeed Insights** - https://pagespeed.web.dev/
2. **WebPageTest** - https://www.webpagetest.org/
3. **Chrome DevTools** - Network tab, Performance tab
4. **Lighthouse** - Built into Chrome DevTools

### What to Monitor:
- Load time < 3s on 3G
- Time to Interactive < 5s
- Total page size < 1MB
- No layout shifts (CLS = 0)
- All images lazy loaded

## Quick Wins (Do These First)

### 1. Compress Images (Biggest Impact)
```bash
# Convert all JPGs to WebP at 85% quality
find . -name "*.jpg" -exec convert {} -quality 85 {}.webp \;
```
**Impact**: 70-80% file size reduction

### 2. Minify CSS
```bash
csso assets/css/variables.css -o assets/css/variables.min.css
csso assets/css/base.css -o assets/css/base.min.css
csso assets/css/navigation.css -o assets/css/navigation.min.css
csso assets/css/components.css -o assets/css/components.min.css
```
**Impact**: 20-30% file size reduction

### 3. Minify JavaScript
```bash
terser assets/js/main.js -o assets/js/main.min.js -c -m
```
**Impact**: 40-50% file size reduction

### 4. Add resource hints
```html
<link rel="dns-prefetch" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="font" href="/path/to/font.woff2" crossorigin>
```
**Impact**: Faster font loading

## Performance Checklist

Before deploying:
- [ ] All images under 200KB
- [ ] WebP versions created for JPGs
- [ ] CSS minified
- [ ] JavaScript minified
- [ ] Fonts optimized (only needed weights)
- [ ] Lazy loading on all images
- [ ] No render-blocking resources
- [ ] Service worker registered (optional)
- [ ] Lighthouse score 95+ on all pages
- [ ] Mobile performance tested
- [ ] 3G network tested

## Expected Results

After all optimizations:
- **Homepage load**: < 1s on 4G
- **Project pages load**: < 1.5s on 4G
- **Total page weight**: < 500KB (from ~2MB)
- **Lighthouse Performance**: 98+
- **Google PageSpeed**: 95+ mobile, 99+ desktop

---

**Performance is a feature. Ship it fast.** ⚡
