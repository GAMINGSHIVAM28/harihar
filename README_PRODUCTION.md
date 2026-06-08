# HARIHAR WHOLESALE PHARMACY - PRODUCTION DEPLOYMENT GUIDE

**Status:** Complete Setup Instructions | **Target Hosting:** GitHub Pages + Custom Domain
**Last Updated:** January 2025 | **Audience:** Deployment Engineers, DevOps

---

## 🚀 Quick Start (5 Minutes)

For experienced developers who want to go live immediately:

### 1. Clone & Configure
```bash
git clone https://github.com/[username]/medical-store-website.git
cd medical-store-website
# Update config.json with your details
nano js/config.json
```

### 2. GitHub Pages Setup
```bash
# Ensure main branch is default
git branch -M main
git push -u origin main

# In GitHub: Settings → Pages → Source: main (root) → Save
```

### 3. Go Live
- **URL:** https://[username].github.io/medical-store-website
- **Domain Mapping:** GitHub → Settings → Pages → Custom Domain → hariharwholesale.com

### 4. Verify
- Visit https://hariharwholesale.com
- Check browser console (F12) for errors
- Test search, filters, WhatsApp buttons

---

## 📋 Complete Deployment Checklist

### Phase 1: Pre-Deployment Verification (30 minutes)

#### 1.1 Code Quality Check
```bash
# Verify no console errors
# 1. Open index.html in browser
# 2. Press F12 (DevTools)
# 3. Check Console tab - should be empty
```

**Fix Errors:**
- If "config.json not found": Verify file exists at `js/config.json`
- If "script.js 404": Check file path in HTML `<script src="js/script.js"></script>`
- If "style.css not loading": Verify `<link rel="stylesheet" href="css/style.css">`

#### 1.2 Configuration Validation
```javascript
// Open browser console and run:
fetch('js/config.json')
  .then(r => r.json())
  .then(config => {
    console.log('✓ Config loaded:', config.company.full_name);
    console.log('✓ Phone:', config.contact.phone_number);
    console.log('✓ WhatsApp:', config.contact.whatsapp_number);
  })
  .catch(err => console.error('✗ Config error:', err));
```

**Expected Output:**
```
✓ Config loaded: Harihar Wholesale Pharmacy
✓ Phone: +91 99812 20777
✓ WhatsApp: 919981220777
```

#### 1.3 File Structure Verification
```bash
# Verify all required files exist:
├── index.html              ← Home page
├── about.html              ← About page
├── services.html           ← Services page
├── stock.html              ← Medicine inventory
├── inquiry.html            ← Bulk inquiry form
├── contact.html            ← Contact page
├── css/
│   └── style.css           ← All styles
├── js/
│   ├── script.js           ← Core application (production-ready)
│   ├── config.json         ← Configuration
│   └── medicines.json      ← Fallback inventory data
└── assets/
    ├── logo.svg            ← Company logo
    └── placeholder.svg     ← OG image placeholder
```

**Fix Missing Files:**
```bash
# Create any missing directories
mkdir -p css js assets

# Verify with:
ls -la
```

#### 1.4 Mobile Responsiveness Test
```
Test on devices:
- Desktop: 1920x1080
- Tablet: 768x1024
- Mobile: 375x667

Checklist:
☑ Navigation hamburger appears on mobile
☑ Menu expands/collapses correctly
☑ Medicine cards stack vertically on mobile
☑ Buttons are touch-friendly (>48px height)
☑ No horizontal scrolling
```

**Fix Responsive Issues:**
- Open `css/style.css`
- Check breakpoints at `@media (max-width: 1024px)` and `@media (max-width: 768px)`
- Test with Chrome DevTools Device Emulation (F12 → Toggle device toolbar)

#### 1.5 SEO Metadata Check
```bash
# For each HTML file (index.html, about.html, etc.):

# 1. Verify <title> tag exists and is unique
grep "<title>" index.html
# Expected: <title>Harihar Pharma - B2B Wholesale Medicine Distributor</title>

# 2. Verify meta description
grep "meta name=\"description\"" index.html
# Expected: ~150 characters

# 3. Verify canonical URL
grep "canonical" index.html
# Expected: <link rel="canonical" href="https://hariharwholesale.com/index.html">

# 4. Verify JSON-LD schema
grep "@context" index.html
# Expected: "https://schema.org"
```

---

### Phase 2: Google Sheets Integration (10 minutes)

#### 2.1 Create Google Sheet
1. Go to https://sheets.google.com
2. Create new spreadsheet
3. Name: "Harihar Pharma - Medicine Inventory"

#### 2.2 Add Column Headers
```
Row 1 (Headers):
A: medicineName
B: manufacturer
C: category
D: packing
E: availability
F: stockStatus
G: whatsappCode
```

#### 2.3 Add Sample Data (at least 20 rows)
```
A2: Paracetamol 650mg
B2: Micro Labs (Dolo)
C2: Fever & Pain Relief
D2: 10x10 Tablets Strip
E2: 450+ Packs
F2: In Stock
G2: PARA650
```

**Data Entry Tips:**
- Category can be: "Fever & Pain Relief", "Antibiotics", "Allergy & Cold", "Gastric & Digestive", "Hydration & Electrolytes", "Surgical & Medical", "Vitamins & Supplements"
- Packing format: "10x10 Tablets Strip", "15 Capsules Blister", "100ml Syrup Bottle"
- Availability: "450+ Packs", "250 Units", "In Stock", "Limited Stock"
- Stock Status: "In Stock", "Low Stock", "Out of Stock"
- WhatsApp Code: Unique product identifier (e.g., "PARA650", "DOLO500")

#### 2.4 Publish Sheet as CSV
1. In Google Sheets: **File → Share**
2. Click "Change to anyone with link" (or set Public)
3. Go to **File → Export → Comma Separated Values (.csv)**
4. Copy the URL shown (ends with `&output=csv`)

**Expected URL Format:**
```
https://docs.google.com/spreadsheets/d/e/2PACX-1vTjTA6zGOOuxjYbhlw4tiKHhCNn7NizfMDgj1ofDwgrLrVhTfWEMlgl76W1-Asj1cS05MG7TdLmN0q8/pub?gid=0&single=true&output=csv
```

#### 2.5 Update config.json
```json
{
  "spreadsheet": {
    "google_sheets_csv_url": "https://docs.google.com/spreadsheets/d/e/2PACX-1v...[YOUR_URL]...&output=csv",
    "cache_ttl_minutes": 3,
    "fallback_file": "js/medicines.json"
  }
}
```

#### 2.6 Test Integration
```javascript
// Open browser console and run:
fetch('https://[YOUR_CSV_URL]')
  .then(r => r.text())
  .then(csv => {
    console.log('✓ CSV fetched:', csv.split('\n').length, 'rows');
    console.log(csv.substring(0, 200)); // Show first 200 chars
  })
  .catch(err => console.error('✗ CSV fetch failed:', err));
```

**Expected Output:**
```
✓ CSV fetched: 25 rows
medicineName,manufacturer,category,packing,availability,stockStatus,whatsappCode
Paracetamol 650mg,Micro Labs (Dolo),Fever & Pain Relief,10x10 Tablets Strip,450+ Packs,In Stock,PARA650
...
```

---

### Phase 3: EmailJS Setup (Optional - 15 minutes)

#### 3.1 Create EmailJS Account
1. Go to https://www.emailjs.com
2. Sign up (free account includes 200 emails/month)
3. Verify email

#### 3.2 Add Email Service
1. Dashboard → **Add Service**
2. Select provider: Gmail, SendGrid, etc.
3. Connect your email account
4. Service Name: "harihar_service"
5. Service ID: Save for later (e.g., `service_abc123def`)

#### 3.3 Create Email Template
1. Dashboard → **Templates → Create New**
2. Template Name: "B2B Inquiry Form"
3. Subject: `B2B Inquiry from {{from_name}}`
4. Email Body:
```html
<h2>New B2B Wholesale Inquiry</h2>

<p><strong>Contact Name:</strong> {{from_name}}</p>
<p><strong>Business Name:</strong> {{business_name}}</p>
<p><strong>Mobile:</strong> {{mobile_number}}</p>
<p><strong>City:</strong> {{city_location}}</p>
<p><strong>Required Medicines:</strong> {{required_medicines}}</p>
<p><strong>Bulk Quantity:</strong> {{bulk_quantity}}</p>
<p><strong>Message:</strong> {{additional_message}}</p>

<p>---</p>
<p>This inquiry was submitted from hariharwholesale.com</p>
```
5. Save Template ID (e.g., `template_xyz789abc`)

#### 3.4 Get Credentials
1. Dashboard → **Account → API Keys**
2. Copy:
   - Public Key (starts with `pub_`)
   - Service ID (from step 3.2)
   - Template ID (from step 3.3)
   - User ID (from API Keys page)

#### 3.5 Update config.json
```json
{
  "emailjs": {
    "enabled": true,
    "public_key": "pub_abc123...",
    "service_id": "service_xyz789...",
    "template_id": "template_123abc...",
    "user_id": "user_456def..."
  }
}
```

#### 3.6 Test Email Submission
1. Open `inquiry.html` in browser
2. Fill form with test data
3. Click "Submit Inquiry"
4. Check email inbox for test message
5. Verify all fields populated correctly

**Troubleshooting:**
- If email not received: Check spam folder, verify keys in config.json
- If "EmailJS not initialized": Confirm `emailjs.enabled: true` in config.json
- If template errors: Check variable names match `{{from_name}}` format

---

### Phase 4: GitHub Pages Deployment (10 minutes)

#### 4.1 Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `medical-store-website`
3. Description: "B2B Wholesale Pharmacy Medicine Distributor Website"
4. Public
5. Create repository

#### 4.2 Initialize Local Git
```bash
cd /path/to/project
git init
git add .
git commit -m "Initial commit: production-ready pharmacy website"
git branch -M main
git remote add origin https://github.com/[YOUR_USERNAME]/medical-store-website.git
git push -u origin main
```

#### 4.3 Enable GitHub Pages
1. Go to **Settings → Pages**
2. Source: "Deploy from a branch"
3. Branch: `main` | Folder: `/ (root)`
4. Save
5. Wait 1-2 minutes for deployment

**Pages URL:** `https://[YOUR_USERNAME].github.io/medical-store-website`

#### 4.4 Map Custom Domain (Optional)
1. GitHub: **Settings → Pages → Custom Domain**
2. Enter domain: `hariharwholesale.com`
3. Click "Save"

**DNS Configuration (GoDaddy/Namecheap/etc):**
```
Type: A Record
Host: @
Value: 185.199.108.153

Type: A Record
Host: @
Value: 185.199.109.153

Type: A Record
Host: @
Value: 185.199.110.153

Type: A Record
Host: @
Value: 185.199.111.153

Type: CNAME Record
Host: www
Value: [YOUR_USERNAME].github.io
```

**Verify:**
```bash
# After 10-15 minutes:
nslookup hariharwholesale.com
# Should show GitHub IP addresses
```

---

### Phase 5: SSL/HTTPS Configuration

#### 5.1 Enable GitHub Pages HTTPS
1. **Settings → Pages → Enforce HTTPS** → Check box
2. GitHub automatically provisions SSL certificate (free)
3. Wait 5-10 minutes

**Verify HTTPS:**
```bash
curl -I https://hariharwholesale.com
# Should show: HTTP/1.1 200 OK
# And: Strict-Transport-Security header
```

#### 5.2 Fix Mixed Content Warnings
If images/scripts don't load, check for hardcoded `http://` URLs:

```bash
# Find non-HTTPS resources:
grep -r "http://" --include="*.html" --include="*.css" .

# Fix:
# Replace http://fonts.googleapis.com → https://fonts.googleapis.com
# Replace http://docs.google.com → https://docs.google.com
```

---

### Phase 6: Performance Optimization (10 minutes)

#### 6.1 Enable Caching Headers
Create `.htaccess` file (if using traditional hosting):
```apache
# Cache static assets for 30 days
<FilesMatch "\.(jpg|jpeg|png|gif|ico|svg|css|js|json)$">
    Header set Cache-Control "max-age=2592000, public"
</FilesMatch>

# Don't cache HTML (fetch fresh)
<FilesMatch "\.html$">
    Header set Cache-Control "max-age=3600, must-revalidate"
</FilesMatch>
```

**For GitHub Pages:** Caching handled automatically

#### 6.2 Minify Assets (Optional)
```bash
# Minify CSS
npm install -g cssnano
cssnano css/style.css -o css/style.min.css

# Minify JS
npm install -g terser
terser js/script.js -o js/script.min.js

# Update HTML:
# Change: <link rel="stylesheet" href="css/style.css">
# To:     <link rel="stylesheet" href="css/style.min.css">
# Change: <script src="js/script.js"></script>
# To:     <script src="js/script.min.js"></script>
```

#### 6.3 Test Page Speed
```bash
# Use Google PageSpeed Insights:
# Visit: https://pagespeed.web.dev
# Enter: https://hariharwholesale.com

# Target scores:
# Performance: >80
# Accessibility: >90
# Best Practices: >90
# SEO: >95
```

**Improvements to Target:**
- Cumulative Layout Shift (CLS): < 0.1
- Largest Contentful Paint (LCP): < 2.5s
- First Input Delay (FID): < 100ms

---

### Phase 7: SEO Verification (15 minutes)

#### 7.1 Google Search Console Setup
1. Go to https://search.google.com/search-console
2. Add property: `https://hariharwholesale.com`
3. Verify ownership (add DNS TXT record or HTML file)
4. Submit sitemap: `https://hariharwholesale.com/sitemap.xml`

#### 7.2 Verify Structured Data
```bash
# Use Google's Rich Results Test:
# https://search.google.com/test/rich-results

# Test URL: https://hariharwholesale.com/index.html

# Should show:
# ✓ LocalBusiness
# ✓ WholesaleStore
# ✓ Website
```

#### 7.3 Check Meta Tags
```bash
# Open each page in browser and check:
# View Page Source (Ctrl+U)

# Look for:
# <title>...</title>
# <meta name="description" content="...">
# <meta property="og:type" content="...">
# <meta property="og:image" content="...">
# <link rel="canonical" href="...">
# <script type="application/ld+json">{"@context": "https://schema.org", ...}
```

#### 7.4 Submit to Search Engines
```bash
# Google Search Console:
# Dashboard → URL Inspection → Request Indexing

# Bing Webmaster Tools:
# https://www.bing.com/webmaster
# Add site and submit sitemap

# Yandex Webmaster:
# https://webmaster.yandex.com (for India markets)
```

---

### Phase 8: Monitoring & Maintenance (Ongoing)

#### 8.1 Set Up Alerts
```bash
# Google Search Console:
# Notifications → Email alerts on:
# - Coverage issues
# - Mobile usability issues
# - Security issues

# Uptime Monitoring:
# Use UptimeRobot (free): https://uptimerobot.com
# Add: https://hariharwholesale.com
# Alert if down > 5 minutes
```

#### 8.2 Monthly Maintenance
```bash
# Week 1:
- Review Search Console coverage
- Check for security issues
- Test all links (internal & external)

# Week 2:
- Update medicine inventory (Google Sheets)
- Review contact form submissions
- Check WhatsApp integration

# Week 3:
- Monitor PageSpeed score
- Check mobile responsiveness
- Verify HTTPS certificate

# Week 4:
- Review analytics (if enabled)
- Backup website files
- Update DNS records if needed
```

#### 8.3 Update Content
```bash
# Medicine Inventory:
# Edit Google Sheet → Changes auto-sync to website (3-min cache)

# Static Content:
# Edit HTML files → Commit to GitHub → Auto-deploys

# Configuration:
# Edit js/config.json → Commit → Auto-deploys
# Changes take effect on next page load

# CSS/JavaScript:
# Edit files → Commit → Auto-deploys
# May need browser cache clear (Ctrl+Shift+Delete)
```

---

## 🔍 Troubleshooting Guide

### Issue: Website Not Loading
```
Symptom: Blank page or 404 error
Cause:   GitHub Pages not configured correctly

Fix:
1. Check Settings → Pages → Source is set to "main /"
2. Verify repository is public (not private)
3. Wait 5-10 minutes for Pages to activate
4. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
```

### Issue: Styles Not Loading
```
Symptom: Page loads but no CSS styling
Cause:   CSS file path incorrect or CSS file missing

Fix:
1. Check <link> tag: <link rel="stylesheet" href="css/style.css">
2. Verify css/style.css exists in repository
3. Check file permissions (should be 644)
4. In DevTools (F12 → Network), check CSS response status
   - Should be 200 OK
   - If 404: File path is wrong
```

### Issue: Medicine Data Not Loading
```
Symptom: "Syncing Live Inventory Feed..." spinner never stops
Cause:   Google Sheets CSV URL invalid or not published

Fix:
1. Test CSV URL directly in browser:
   https://docs.google.com/spreadsheets/d/e/.../pub?gid=0&single=true&output=csv
   Should download a .csv file
2. In config.json, ensure URL is complete and exact
3. Verify sheet is published to web (File → Publish to web)
4. If still failing, fallback to medicines.json
```

### Issue: WhatsApp Buttons Not Working
```
Symptom: Clicking WhatsApp button doesn't open WhatsApp
Cause:   Phone number format incorrect

Fix:
1. Check config.json:
   "whatsapp_number": "919981220777" (10-11 digits, no +)
2. Open browser console and run:
   fetch('js/config.json').then(r => r.json()).then(c => console.log(c.contact.whatsapp_number))
3. Should print: "919981220777" (without + or spaces)
```

### Issue: Form Submission Fails
```
Symptom: "Unable to submit via email" error
Cause:   EmailJS not configured or credentials wrong

Fix:
1. Check if EmailJS is required:
   - If optional, fallback to WhatsApp works
   - If required, configure EmailJS:
     - config.json has correct public_key, service_id, template_id
     - EmailJS account still active (not expired)
     - Template variables match ({{from_name}}, {{business_name}}, etc.)
2. Check browser console for specific error
3. Verify email limit not exceeded (free plan = 200/month)
```

### Issue: Mobile Menu Not Working
```
Symptom: Hamburger button doesn't toggle menu
Cause:   JavaScript not loading or element IDs wrong

Fix:
1. Check DevTools Console for JS errors
2. Verify <script src="js/script.js"></script> loads (Network tab → JS file → 200 OK)
3. Verify HTML has correct IDs:
   - <div class="hamburger">
   - <div class="nav-links">
4. Check CSS media query at 768px breakpoint exists
```

---

## 📊 Performance & Health Checklist

### Pre-Launch Verification
```
☑ All HTML files validated with https://validator.w3.org
☑ CSS passes validation at https://jigsaw.w3.org/css-validator
☑ No console errors (F12 → Console)
☑ Mobile responsive on 375px width
☑ PageSpeed score >80 on mobile
☑ All external links tested and working
☑ WhatsApp number verified with +91 code
☑ Google Sheets CSV URL tested
☑ HTTPS certificate valid (lock icon in address bar)
☑ Sitemap.xml accessible at /sitemap.xml
☑ robots.txt accessible at /robots.txt
```

### Post-Launch Monitoring (First Week)
```
Day 1:
☑ Site accessible from multiple networks
☑ Mobile menu working on iPhone/Android
☑ Search filters responsive to user input
☑ WhatsApp buttons open correct conversation
☑ Contact form submissions working

Day 2-3:
☑ Monitor Google Search Console for crawl errors
☑ Check analytics for user behavior
☑ Test medicine inventory updates sync correctly
☑ Verify email notifications for form submissions

Day 4-7:
☑ Monitor website uptime (UptimeRobot)
☑ Check PageSpeed weekly trend
☑ Verify SSL certificate expiration date
☑ Backup website files
```

---

## 🔐 Security Best Practices

### Before Deployment
- [ ] Remove API keys from config.json (use environment variables)
- [ ] Ensure config.json is not in .gitignore (it's safe - no secrets)
- [ ] All external scripts use HTTPS (Google Fonts, EmailJS)
- [ ] No hardcoded passwords in code
- [ ] HTML inputs sanitized (XSS prevention with escapeHtml)
- [ ] CORS headers set appropriately for Google Sheets fetch

### Ongoing Security
- [ ] Monitor GitHub Security tab for vulnerabilities
- [ ] Keep dependencies updated (if using npm)
- [ ] Review access logs for suspicious activity
- [ ] SSL certificate renewed before expiration
- [ ] Regular backups of website files

---

## 📞 Support Resources

### Error Messages & Solutions
| Error | Solution |
|-------|----------|
| `config.json 404` | Verify file exists at `js/config.json` |
| `CSV fetch failed` | Check Google Sheets URL, ensure published |
| `EmailJS init failed` | Verify public_key in config.json |
| `WhatsApp undefined` | Check phone number format in config.json |
| `CORS error` | Ensure Google Sheets URL has `&output=csv` |

### Helpful Links
- Google Sheets Publishing: https://support.google.com/docs/answer/183965
- EmailJS Setup: https://www.emailjs.com/docs/setup/
- GitHub Pages Docs: https://docs.github.com/en/pages
- SEO Starter Guide: https://developers.google.com/search/docs
- Web Vitals Guide: https://web.dev/vitals/

---

## ✅ Final Verification Checklist

Before marking as "PRODUCTION READY":

- [ ] Repository pushed to GitHub
- [ ] GitHub Pages enabled and domain mapped
- [ ] HTTPS certificate active (lock icon visible)
- [ ] All 6 HTML pages load without errors
- [ ] Medicine grid loads from Google Sheets
- [ ] Search and filter functions work correctly
- [ ] WhatsApp buttons functional on all pages
- [ ] Contact form submits successfully
- [ ] Mobile menu responsive on narrow screens
- [ ] PageSpeed score >80 mobile / >95 desktop
- [ ] Google Search Console shows 0 errors
- [ ] No console errors in DevTools (F12)
- [ ] All external links working (404 check)
- [ ] Structured data validated (Rich Results Test)

---

**Deployment Status:** ✅ Ready for Production
**Last Updated:** January 2025
**Support Email:** contact@hariharwholesale.com
**Emergency Hotline:** +91 99812 20777