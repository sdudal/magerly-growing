# 🔍 Google Analytics Setup - Quick Start

## ⚠️ Action Required

Your website is ready for Google Analytics 4, but you need to add your **Measurement ID**.

## Quick Steps

### 1️⃣ Get Your GA4 Measurement ID

1. Go to https://analytics.google.com/
2. Create a new property (or use existing)
3. Add a web data stream for `magerly.com`
4. Copy your **Measurement ID** (format: `G-XXXXXXXXXX`)

**Don't have GA4 yet?** See detailed setup guide: [`docs/google-analytics-setup.md`](docs/google-analytics-setup.md)

### 2️⃣ Update Your Code

**Replace** `G-XXXXXXXXXX` with your actual ID in these files:
- `src/index.html` (2 occurrences - lines 37 & 42)
- `src/privacy.html` (2 occurrences - lines 36 & 41)
- `src/terms.html` (2 occurrences - lines 36 & 41)

**Quick Find & Replace:**
- **Find:** `G-XXXXXXXXXX`
- **Replace:** Your actual Measurement ID (e.g., `G-ABC123DEF4`)
- **Scope:** `src/*.html`

### 3️⃣ Deploy

```bash
# Build
npm run build

# Verify
grep -r "G-" dist/*.html

# Deploy
cd infrastructure/scripts
./deploy.sh
```

### 4️⃣ Verify

1. Visit your website
2. Open Google Analytics → Reports → Realtime
3. You should see your visit tracked live! 🎉

## What's Already Configured

✅ Google Analytics 4 script on all pages  
✅ IP anonymization for privacy  
✅ Secure cookie configuration  
✅ Custom event tracking ready  
✅ Integration with download buttons  
✅ Age calculator usage tracking  
✅ Newsletter signup tracking  

## Events Being Tracked

The following custom events are automatically tracked:

| Event | Description | Parameters |
|-------|-------------|------------|
| `download_button_click` | User clicks download button | `location`, `platform` |
| `calculate_age` | User uses age calculator | `baby_age_days`, `calculation_count` |
| `newsletter_signup` | Email newsletter signup | `location` |
| `navigation_click` | Navigation menu clicks | `link_text` |

## Need Help?

📖 **Full Documentation**: [`docs/google-analytics-setup.md`](docs/google-analytics-setup.md)

Includes:
- Detailed GA4 account creation
- Enhanced measurement setup
- Conversion tracking configuration
- GDPR compliance guide
- Troubleshooting tips

---

**Current Status**: 🟡 Pending Configuration  
**Time to Setup**: ~10 minutes  
**Once configured**: 🟢 Fully operational

