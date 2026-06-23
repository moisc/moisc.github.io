# 🚀 Deployment Checklist

## Pre-Deployment Testing

### ✅ Visual Testing
- [ ] Homepage displays correctly
  - [ ] Hero section with 96px typography
  - [ ] Stats bar shows all 4 metrics
  - [ ] Bento grid shows all 6 projects
  - [ ] Skills section (3 columns)
  - [ ] Contact form visible and styled
- [ ] Project pages display correctly
  - [ ] Autoprint page loads
  - [ ] K2 Systems page loads
  - [ ] Nina Labs page loads
  - [ ] Fire Hose Clamp (protected) page loads
- [ ] Navigation works
  - [ ] Desktop nav links work
  - [ ] Mobile hamburger menu opens/closes
  - [ ] Theme toggle switches light/dark
  - [ ] All anchor links scroll smoothly
- [ ] Footer displays on all pages
- [ ] Back-to-top button appears after scrolling

### ✅ Responsive Testing
- [ ] Desktop (1920x1080) - Full bento grid, large typography
- [ ] Laptop (1440x900) - Adjusted bento grid
- [ ] Tablet (768x1024) - 6-column grid
- [ ] Mobile (375x667) - Single column stacking
- [ ] All grids stack properly on mobile
- [ ] Typography scales down appropriately
- [ ] Images don't overflow containers
- [ ] Buttons are touch-friendly (56px+)

### ✅ Dark Mode Testing
- [ ] Toggle switches between light/dark
- [ ] Choice persists on page reload
- [ ] Works on all pages (homepage + 4 projects)
- [ ] All text readable in both modes
- [ ] MC. blue accent visible in both modes
- [ ] Images look good in both modes
- [ ] No flash of wrong theme on load

### ✅ Functionality Testing
- [ ] All project links navigate correctly
  - [ ] /autoprint/ works
  - [ ] /k2-systems/ works
  - [ ] /ninalabs/ works
  - [ ] /firehoseclamp/ works
- [ ] Resume download works
  - [ ] "Mois Cohen Resume 2026.pdf" downloads
- [ ] Contact form works
  - [ ] Email field validates
  - [ ] Form submits to Formspree
  - [ ] Success message appears
- [ ] External links work
  - [ ] LinkedIn opens in new tab
  - [ ] Kickstarter link (Autoprint) works
  - [ ] Email links open mail client
  - [ ] Phone link works on mobile
- [ ] Back button returns to homepage
  - [ ] From each project page

### ✅ Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### ✅ Performance Testing
- [ ] Lighthouse Performance 95+
  - [ ] Homepage
  - [ ] Autoprint
  - [ ] K2 Systems
  - [ ] Nina Labs
  - [ ] Fire Hose Clamp
- [ ] Lighthouse Accessibility 100
- [ ] Lighthouse Best Practices 100
- [ ] Lighthouse SEO 100
- [ ] PageSpeed Insights 90+ (mobile)
- [ ] PageSpeed Insights 95+ (desktop)
- [ ] All images have alt text
- [ ] No console errors
- [ ] No console warnings (important ones)

### ✅ SEO Testing
- [ ] Title tags unique on each page
- [ ] Meta descriptions on all pages
- [ ] OG images set correctly
- [ ] Twitter cards configured
- [ ] sitemap.xml accessible
- [ ] robots.txt accessible
- [ ] Structured data (JSON-LD) on homepage
- [ ] All images have alt text
- [ ] Heading hierarchy correct (H1 → H2 → H3)
- [ ] No broken links

### ✅ Accessibility Testing
- [ ] Keyboard navigation works
  - [ ] Tab through all interactive elements
  - [ ] Enter/Space activates buttons/links
  - [ ] Escape closes mobile menu
- [ ] Focus visible on all interactive elements
- [ ] Skip to main content link works
- [ ] Screen reader friendly
  - [ ] Alt text on images
  - [ ] ARIA labels on buttons
  - [ ] Semantic HTML structure
- [ ] Color contrast ratio 4.5:1+ (text)
- [ ] Color contrast ratio 3:1+ (UI elements)
- [ ] No animations for users who prefer reduced motion

## Deployment Steps

### 1. Final Code Review
```bash
cd "/Users/moiscohen/Local Documents/Portfolio Website/moisc.github.io"

# Check for console.logs
grep -r "console.log" assets/js/

# Check for TODOs
grep -r "TODO" .

# Check for placeholder text
grep -ri "lorem ipsum" .
grep -ri "placeholder" .
```

### 2. Git Commit
```bash
# Check status
git status

# Add all changes
git add .

# Commit with message
git commit -m "Complete ULTIMATE REDESIGN - Bold minimalist portfolio

- New design system with monochrome + MC. blue accent
- 96px hero typography for impact
- Bento grid layout showing all 6 projects
- Consistent project page templates
- Dark mode across all pages
- Mobile-first responsive design
- SEO optimizations (JSON-LD, sitemap, robots.txt)
- Performance enhancements
- Accessibility improvements (WCAG 2.1)

Ready to stand out. 🔥"

# Push to GitHub
git push origin main
```

### 3. Verify Deployment
Wait 2-5 minutes, then check:
```bash
# Open in browser
open https://moisc.github.io
```

- [ ] Site loads at https://moisc.github.io
- [ ] No 404 errors
- [ ] All pages accessible
- [ ] Images loading correctly
- [ ] CSS applied properly
- [ ] JavaScript working
- [ ] Forms functional

### 4. Post-Deployment Testing
- [ ] Test on actual mobile device
- [ ] Share link to someone, have them test
- [ ] Check Google Search Console
  - [ ] Submit sitemap
  - [ ] Request indexing
- [ ] Check Google Analytics
  - [ ] Verify tracking code works
  - [ ] Events tracking (form submissions, clicks)

### 5. Social Media Verification
Test social sharing:
- [ ] LinkedIn post preview shows correct OG image
- [ ] Twitter card displays properly
- [ ] Facebook link preview works

```bash
# Test OG tags
curl -I https://moisc.github.io | grep -i content-type

# Validate OG tags online:
# https://www.opengraph.xyz/
# https://cards-dev.twitter.com/validator
```

## Post-Deployment Optimization

### Week 1
- [ ] Monitor Google Analytics for errors
- [ ] Check for broken links
- [ ] Gather initial feedback
- [ ] Fix any reported issues
- [ ] Submit to Google Search Console
- [ ] Submit to Bing Webmaster Tools

### Week 2
- [ ] Run Lighthouse on live site
- [ ] Optimize images if needed (WebP conversion)
- [ ] Monitor page load times
- [ ] Check mobile usability in Search Console

### Month 1
- [ ] Review analytics
  - [ ] Page views
  - [ ] Bounce rate
  - [ ] Time on site
  - [ ] Most visited projects
- [ ] Optimize based on data
- [ ] Update content if needed
- [ ] Check for 404s in Search Console

## Rollback Plan

If something breaks:

### Quick Rollback
```bash
# Revert last commit
git revert HEAD

# Push
git push origin main
```

### Full Rollback to Specific Commit
```bash
# Find commit hash
git log --oneline

# Reset to that commit
git reset --hard <commit-hash>

# Force push
git push -f origin main
```

### Backup Current Version
```bash
# Before deploying, create backup branch
git checkout -b backup-pre-redesign
git push origin backup-pre-redesign

# Then deploy from main
git checkout main
```

## Domain Setup (Optional)

If using custom domain:

### 1. Buy Domain
- Recommended: Namecheap, Google Domains, Cloudflare

### 2. Configure DNS
Add CNAME record:
```
www.yourdomain.com → moisc.github.io
```

Add A records for apex domain:
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

### 3. Enable in GitHub
- Settings → Pages
- Custom domain: `yourdomain.com`
- Enforce HTTPS: ✅

### 4. Update sitemap.xml
Replace `https://moisc.github.io` with `https://yourdomain.com`

### 5. Update all absolute URLs
- OG tags
- Canonical URLs
- sitemap.xml

## Success Metrics

After deployment, track:

### Traffic
- **Unique visitors**: Target 100+ in first month
- **Page views**: Target 500+ in first month
- **Avg. session duration**: Target 2+ minutes
- **Bounce rate**: Target <50%

### Engagement
- **Contact form submissions**: Track conversions
- **Resume downloads**: Track downloads
- **Project page views**: Which projects get most traffic

### Technical
- **Lighthouse Performance**: Maintain 95+
- **Core Web Vitals**: All green
- **Mobile usability**: No issues
- **SEO**: Ranking for "Mois Cohen mechanical engineer"

### Social
- **LinkedIn profile views**: Increase after launch
- **Link shares**: Track who shares your portfolio
- **Referrals**: Where traffic comes from

## Maintenance Schedule

### Weekly
- [ ] Check for broken links
- [ ] Monitor analytics
- [ ] Respond to contact form submissions

### Monthly
- [ ] Update resume if needed
- [ ] Review and update project descriptions
- [ ] Check for security updates (dependencies)
- [ ] Backup site content

### Quarterly
- [ ] Add new projects if completed
- [ ] Update skills section
- [ ] Refresh content
- [ ] Run full Lighthouse audit

### Annually
- [ ] Major content review
- [ ] Design refresh (if needed)
- [ ] Update copyright year in footer
- [ ] Review and optimize performance

## Emergency Contacts

### Issues with:
- **GitHub Pages**: https://www.githubstatus.com/
- **Google Analytics**: https://status.google.com/
- **Formspree**: https://status.formspree.io/
- **Font Awesome CDN**: https://www.cdnplanet.com/
- **Google Fonts**: https://fonts.google.com/

### Quick Fixes:
- Site down: Check GitHub Pages status
- Forms not working: Check Formspree quota
- Fonts not loading: Check CDN status
- Images not loading: Check file paths (case-sensitive)
- Dark mode broken: Clear localStorage

---

## Final Pre-Launch Checklist

- [ ] All tests passed ✅
- [ ] No console errors ✅
- [ ] Performance optimized ✅
- [ ] SEO configured ✅
- [ ] Analytics working ✅
- [ ] Content reviewed ✅
- [ ] Links tested ✅
- [ ] Mobile tested ✅
- [ ] Dark mode tested ✅
- [ ] Backup created ✅

**Ready to deploy? Let's go.** 🚀

```bash
git push origin main
```

**Your portfolio is live. Time to stand out.** - MC.
