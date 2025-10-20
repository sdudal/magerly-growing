# Google Analytics 4 Setup Guide

## Overview
Google Analytics 4 (GA4) has been implemented on all pages of the Magerly website to track user behavior, conversions, and engagement metrics.

## Current Implementation Status

✅ **GA4 script added to all pages:**
- `index.html` (Homepage)
- `privacy.html` (Privacy Policy)
- `terms.html` (Terms of Service)

✅ **Features configured:**
- IP anonymization for privacy compliance
- Secure cookie flags (SameSite=None;Secure)
- Custom event tracking via `gtag()` function
- Ready for custom events in `main.js`

⚠️ **Action Required:**
Replace `G-XXXXXXXXXX` with your actual GA4 Measurement ID

## Step 1: Create Google Analytics 4 Property

### If you don't have a GA4 account yet:

1. **Go to Google Analytics**
   - Visit: https://analytics.google.com/

2. **Create Account**
   - Click "Start measuring"
   - Enter account name: `Magerly`
   - Configure data-sharing settings (optional)
   - Click "Next"

3. **Create Property**
   - Property name: `Magerly Website`
   - Reporting time zone: Select your timezone
   - Currency: Select your currency
   - Click "Next"

4. **Business Information**
   - Industry category: `Health & Fitness` or `Online Communities`
   - Business size: Select appropriate size
   - Business objectives: Select `Examine user behavior`
   - Click "Create"

5. **Accept Terms of Service**
   - Accept the Google Analytics Terms of Service
   - Accept Data Processing Terms if applicable

6. **Set Up Data Stream**
   - Click "Web"
   - Website URL: `https://magerly.com`
   - Stream name: `Magerly Website`
   - Enhanced measurement: **Enable** (recommended)
   - Click "Create stream"

7. **Get Your Measurement ID**
   - After creating the stream, you'll see your **Measurement ID**
   - Format: `G-XXXXXXXXXX` (e.g., `G-ABC123DEF4`)
   - Copy this ID - you'll need it in Step 2

## Step 2: Update Your Website Code

### Option A: Manual Update (All Files)

Replace `G-XXXXXXXXXX` in these files with your actual Measurement ID:

1. **src/index.html** (lines 37 and 42)
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-YOUR_ACTUAL_ID"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'G-YOUR_ACTUAL_ID', {
       'anonymize_ip': true,
       'cookie_flags': 'SameSite=None;Secure'
     });
   </script>
   ```

2. **src/privacy.html** (lines 36 and 41)
   - Replace `G-XXXXXXXXXX` with your Measurement ID

3. **src/terms.html** (lines 36 and 41)
   - Replace `G-XXXXXXXXXX` with your Measurement ID

### Option B: Using Find & Replace (Recommended)

Use your IDE's find and replace feature:

1. **Find:** `G-XXXXXXXXXX`
2. **Replace with:** Your actual Measurement ID (e.g., `G-ABC123DEF4`)
3. **Files:** `src/*.html`
4. **Replace All**

### Option C: Using Command Line

**PowerShell (Windows):**
```powershell
$GA_ID = "G-ABC123DEF4"  # Replace with your actual ID
Get-ChildItem -Path src -Filter *.html -Recurse | ForEach-Object {
    (Get-Content $_.FullName) -replace 'G-XXXXXXXXXX', $GA_ID | Set-Content $_.FullName
}
```

**Bash (Linux/Mac):**
```bash
export GA_ID="G-ABC123DEF4"  # Replace with your actual ID
find src -name "*.html" -type f -exec sed -i '' "s/G-XXXXXXXXXX/$GA_ID/g" {} +
```

## Step 3: Build and Deploy

After updating your Measurement ID:

```bash
# Build the site
npm run build

# Verify the ID is in the built files
grep -r "G-" dist/*.html

# Deploy to production (see infrastructure/README.md for details)
cd infrastructure/scripts
./deploy.sh
```

## Step 4: Verify Installation

### Using Google Analytics Real-Time Reports

1. **Go to Google Analytics**
   - Navigate to your property
   - Click "Reports" → "Realtime"

2. **Open Your Website**
   - Visit https://magerly.com in a new tab
   - Navigate between pages

3. **Check Real-Time Data**
   - You should see yourself as an active user
   - Page views should increment
   - Events should be tracked

### Using Chrome DevTools

1. **Open DevTools**
   - Press `F12` or `Right-click → Inspect`

2. **Network Tab**
   - Filter by "gtag" or "google-analytics"
   - Reload the page
   - Look for requests to `www.google-analytics.com/g/collect`

3. **Console Tab**
   - Check for any errors related to gtag
   - Should see no errors if properly configured

### Using Google Tag Assistant

1. **Install Extension**
   - Chrome: https://chrome.google.com/webstore/detail/tag-assistant-legacy-by-g/kejbdjndbnbjgmefkgdddjlbokphdefk

2. **Enable Tag Assistant**
   - Click the extension icon
   - Click "Enable"
   - Reload your page

3. **Verify Tags**
   - Should show "Google Analytics 4" tag
   - Status should be green
   - Click for details and validation

## Step 5: Configure Enhanced Measurement

Enhanced measurement is automatically enabled and tracks:

- ✅ Page views
- ✅ Scrolls (90% depth)
- ✅ Outbound clicks
- ✅ Site search
- ✅ Video engagement
- ✅ File downloads

### To customize:

1. Go to **Admin** → **Data Streams**
2. Click your web stream
3. Click **Enhanced measurement**
4. Toggle features on/off as needed

## Custom Events Being Tracked

The website already tracks these custom events via `trackEvent()` in `main.js`:

### Download Button Clicks
```javascript
{
  event_name: 'download_button_click',
  location: 'hero' | 'calculator' | 'final-cta',
  platform: 'ios' | 'android' | 'generic'
}
```

### Age Calculator Usage
```javascript
{
  event_name: 'calculate_age',
  baby_age_days: 123,
  calculation_count: 1
}
```

### Email Newsletter Signups
```javascript
{
  event_name: 'newsletter_signup',
  location: 'age_calculator' | 'footer'
}
```

### Navigation Clicks
```javascript
{
  event_name: 'navigation_click',
  link_text: 'Features' | 'How It Works' | etc.
}
```

## Key Metrics to Monitor

### Engagement Metrics
- **Users**: Total unique visitors
- **Sessions**: Total visits to your site
- **Session Duration**: Average time on site
- **Bounce Rate**: % of single-page sessions
- **Pages per Session**: Average pages viewed

### Conversion Metrics
- **Download Button Clicks**: Track app downloads
- **Age Calculator Usage**: Track feature engagement
- **Email Signups**: Track newsletter conversions
- **Form Submissions**: Track lead generation

### Page Metrics
- **Most Visited Pages**: Popular content
- **Landing Pages**: Entry points
- **Exit Pages**: Where users leave
- **Page Load Time**: Performance metrics

### Traffic Sources
- **Organic Search**: Google, Bing traffic
- **Direct**: Typed URL or bookmarks
- **Referral**: Links from other sites
- **Social**: Facebook, Twitter, etc.

## Setting Up Conversions

### 1. Create Download Conversion Event

1. Go to **Admin** → **Events**
2. Click **Create Event**
3. Event name: `app_download`
4. Matching conditions:
   - Parameter: `event_name`
   - Operator: `equals`
   - Value: `download_button_click`
5. Click **Create**

### 2. Mark as Conversion

1. Go to **Admin** → **Conversions**
2. Find `app_download` or `download_button_click`
3. Toggle **Mark as conversion**

### 3. Create Other Conversions

Repeat for:
- `newsletter_signup` → Newsletter subscription
- `calculate_age` → Feature engagement
- `session_start` → New user acquisition

## Privacy and GDPR Compliance

### Current Configuration

✅ **IP Anonymization**: Enabled via `'anonymize_ip': true`
✅ **Secure Cookies**: SameSite=None;Secure flags set
✅ **Privacy Policy**: Link present in footer

### For GDPR Compliance (EU Visitors)

If you have EU visitors, consider adding a cookie consent banner:

1. **Install Cookie Consent Tool**
   - Options: CookieBot, OneTrust, Termly
   - Or implement custom solution

2. **Update Analytics Configuration**
   ```javascript
   // Only load if consent given
   if (cookieConsentGiven) {
     gtag('config', 'G-XXXXXXXXXX', {
       'anonymize_ip': true,
       'cookie_flags': 'SameSite=None;Secure'
     });
   }
   ```

3. **Update Privacy Policy**
   - Explain what data is collected
   - How it's used
   - User rights (access, deletion)
   - Cookie retention period

## Troubleshooting

### Data Not Appearing

**Problem**: No data in GA4 reports after 24-48 hours

**Solutions**:
1. Verify Measurement ID is correct
2. Check if ad blockers are preventing tracking
3. Use browser DevTools to check for errors
4. Verify requests to `google-analytics.com` in Network tab
5. Check Real-Time reports for immediate feedback

### Events Not Tracking

**Problem**: Custom events not appearing

**Solutions**:
1. Open browser console and check for errors
2. Verify `gtag()` function is defined
3. Check if GA4 script loaded before events fire
4. Use DebugView in GA4 for detailed event inspection

### Duplicate Tracking

**Problem**: Double-counting page views

**Solutions**:
1. Ensure GA4 script is only loaded once per page
2. Check for multiple `gtag('config')` calls
3. Verify no other analytics tools are causing conflicts

### Real-Time Reports Empty

**Problem**: Can't see yourself in Real-Time reports

**Solutions**:
1. Make sure you're not excluded (IP filter)
2. Disable browser ad blockers
3. Use incognito/private browsing mode
4. Clear browser cache and reload

## Advanced Configuration

### User ID Tracking

To track users across devices:

```javascript
gtag('config', 'G-XXXXXXXXXX', {
  'user_id': 'USER_ID_HERE'
});
```

### Custom Dimensions

Track additional user properties:

```javascript
gtag('set', 'user_properties', {
  'subscription_status': 'free',
  'app_installed': 'no'
});
```

### E-commerce Tracking

If you add in-app purchases:

```javascript
gtag('event', 'purchase', {
  transaction_id: 'T12345',
  value: 9.99,
  currency: 'USD',
  items: [{
    item_id: 'premium_subscription',
    item_name: 'Premium Monthly',
    price: 9.99
  }]
});
```

## Resources

### Official Documentation
- [GA4 Setup Guide](https://support.google.com/analytics/answer/9304153)
- [GA4 Events](https://support.google.com/analytics/answer/9267735)
- [GA4 Conversions](https://support.google.com/analytics/answer/9267568)

### Tools
- [Google Analytics](https://analytics.google.com/)
- [Tag Assistant](https://tagassistant.google.com/)
- [GA4 Query Explorer](https://ga-dev-tools.web.app/ga4/query-explorer/)

### Privacy Resources
- [GDPR Compliance](https://support.google.com/analytics/answer/9019185)
- [Data Retention](https://support.google.com/analytics/answer/7667196)
- [User Deletion](https://support.google.com/analytics/answer/9450800)

---

**Implementation Date**: October 16, 2025  
**Status**: ⚠️ Pending Measurement ID  
**Next Steps**: Replace `G-XXXXXXXXXX` with your actual GA4 Measurement ID

