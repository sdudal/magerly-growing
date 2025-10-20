# Google Analytics 4 - Download Button Conversion Setup

## Overview
Your website now tracks detailed metrics for iOS and Android download button clicks. This guide will help you set up conversion tracking in Google Analytics 4 to measure app download performance.

## 📊 Events Being Tracked

### 1. Primary Conversion Event: `download_app`
This is the main event with comprehensive data:

**Parameters tracked:**
- `platform` - 'ios' or 'android'
- `button_location` - 'hero-ios', 'hero-android', 'calculator', 'final-cta'
- `detected_device` - User's actual device type
- `user_agent` - Browser information
- `page_url` - Current page URL
- `page_title` - Current page title
- `timestamp` - When the click occurred
- `value` - 0 (free app)
- `currency` - 'USD'
- `is_mobile` - true/false
- `screen_width` - User's screen width
- `screen_height` - User's screen height

### 2. Secondary Event: `app_download_click`
Simplified conversion event for easier reporting:
- `platform` - 'ios' or 'android'
- `location` - Button location

### 3. Legacy Event: `download_button_click`
For backwards compatibility and additional tracking.

## 🎯 Setting Up Conversions in GA4

### Step 1: Access GA4 Events

1. Open Google Analytics 4
2. Go to **Admin** (gear icon, bottom left)
3. Under **Data display**, click **Events**
4. Wait 24 hours after deployment for events to appear

### Step 2: Mark Events as Conversions

#### Option A: Mark `app_download_click` as Conversion
1. Find `app_download_click` in the events list
2. Toggle the **Mark as conversion** switch
3. ✅ This creates a simple conversion counter

#### Option B: Mark `download_app` as Conversion  
1. Find `download_app` in the events list
2. Toggle the **Mark as conversion** switch
3. ✅ This gives you access to all the detailed parameters

**Recommendation:** Mark BOTH as conversions for maximum flexibility.

### Step 3: Create Custom Event (Optional)

Create separate conversion events for iOS and Android:

1. Go to **Admin** → **Events** → **Create event**

**For iOS Downloads:**
```
Event name: ios_download
Matching conditions:
  - Parameter: platform
  - Operator: equals
  - Value: ios
Copy parameters from: download_app
```

**For Android Downloads:**
```
Event name: android_download
Matching conditions:
  - Parameter: platform
  - Operator: equals  
  - Value: android
Copy parameters from: download_app
```

2. Toggle **Mark as conversion** for both new events

## 📈 Creating Reports

### Standard Reports

**1. View All Download Clicks:**
- Go to **Reports** → **Engagement** → **Events**
- Look for: `download_app`, `app_download_click`, `ios_download`, `android_download`
- Click event name to see details

**2. View Real-Time Downloads:**
- Go to **Reports** → **Realtime**
- See live download button clicks as they happen

### Custom Reports

**Create iOS vs Android Comparison Report:**

1. Go to **Explore** (left sidebar)
2. Click **Blank** to create new exploration
3. **Add dimensions:**
   - Event name
   - Platform (custom parameter)
   - Button location (custom parameter)
   - Detected device (custom parameter)

4. **Add metrics:**
   - Event count
   - Total users
   - Sessions

5. **Set up visualization:**
   - Type: Free form
   - Rows: Platform
   - Values: Event count
   - Filter: Event name exactly matches `download_app`

**Create Button Location Report:**

1. Create new exploration
2. Dimensions: Button location, Platform
3. Metrics: Event count
4. Rows: Button location
5. Columns: Platform
6. Filter: Event name = `download_app`

This shows which buttons are most effective!

## 🔍 Key Metrics to Monitor

### 1. Platform Distribution
**Question:** Are more users clicking iOS or Android buttons?

**Where to find:**
- Events → `download_app` → View parameter: platform
- Create custom report with Platform dimension

**Use case:** Optimize marketing spend per platform

### 2. Button Location Performance  
**Question:** Which button location gets the most clicks?

**Where to find:**
- Events → `download_app` → View parameter: button_location
- Expected locations: 'hero-ios', 'hero-android', 'calculator', 'final-cta'

**Use case:** Optimize button placement

### 3. Device Mismatch
**Question:** Are iOS users clicking Android buttons (and vice versa)?

**Where to find:**
- Custom report comparing `platform` vs `detected_device`

**Use case:** Improve smart button detection logic

### 4. Mobile vs Desktop
**Question:** Are mobile users more likely to download?

**Where to find:**
- Events → `download_app` → View parameter: is_mobile

**Use case:** Optimize mobile experience

### 5. Conversion Rate
**Question:** What % of visitors click download?

**Formula:** (Download clicks / Total sessions) × 100

**Where to find:**
- Reports → Engagement → Conversions
- Compare sessions to download_app count

## 📊 Example GA4 Queries

### Query 1: iOS vs Android Downloads (Last 30 Days)

```
Event name: download_app
Date range: Last 30 days
Breakdown by: platform
Metric: Event count
```

Expected result:
```
iOS:     150 downloads
Android: 120 downloads
Total:   270 downloads
```

### Query 2: Button Performance

```
Event name: download_app  
Date range: Last 7 days
Breakdown by: button_location
Metric: Event count
```

Expected result:
```
hero-ios:     80 clicks
hero-android: 65 clicks
calculator:   45 clicks
final-cta:    25 clicks
```

### Query 3: Device Matching Accuracy

```
Event name: download_app
Breakdown by: platform, detected_device
Metric: Event count
```

Good scenario:
```
iOS clicked on iOS device:         140 ✅
Android clicked on Android device: 110 ✅
iOS clicked on Android device:      10 ⚠️
Android clicked on iOS device:       10 ⚠️
```

## 🎯 Setting Up Conversion Goals

### Goal 1: Total App Downloads
- **Event:** `app_download_click`
- **Goal:** 100 downloads/month
- **Alert:** Email when < 50 downloads in 30 days

### Goal 2: iOS Downloads
- **Event:** `ios_download` (custom event)
- **Goal:** 50 downloads/month
- **Alert:** Email when < 25 downloads in 30 days

### Goal 3: Android Downloads
- **Event:** `android_download` (custom event)
- **Goal:** 50 downloads/month
- **Alert:** Email when < 25 downloads in 30 days

### Goal 4: Calculator Conversion Rate
- **Metric:** Calculator CTA downloads / Age Calculator uses
- **Goal:** > 5% conversion
- **Track:** `download_app` where location = 'calculator'

## 🔔 Setting Up Alerts

1. Go to **Admin** → **Custom Alerts**
2. Click **Create Alert**

**Alert Example: Low iOS Downloads**
```
Alert name: Low iOS Downloads
Apply to: All Website Data
Period: Week
Condition:
  - download_app (platform = ios)
  - < 10
  - Send email to: your@email.com
```

## 📱 Testing Your Tracking

### Manual Testing

1. **Open Browser Console** (F12)
2. **Visit your website**
3. **Click iOS download button**
4. Look for console log: `📊 GA4 Event: download_app`
5. Check that parameters are logged correctly

### GA4 DebugView Testing

1. Install **Google Analytics Debugger** Chrome extension
2. Enable the extension
3. Go to GA4 → **Admin** → **DebugView**
4. Visit your website in that browser
5. Click download buttons
6. Watch events appear in DebugView in real-time

### Verify in Real-Time Reports

1. Open GA4 → **Reports** → **Realtime**
2. Open your website in another tab
3. Click download buttons
4. Events should appear within 30 seconds

## 📊 Sample Dashboard Setup

### Create a "Download Performance" Dashboard

1. Go to **Explore** → **Blank**
2. Name: "App Download Performance"

**Add these visualizations:**

1. **Total Downloads (Scorecard)**
   - Metric: download_app count
   - Date range: Last 30 days

2. **iOS vs Android (Pie Chart)**
   - Dimension: platform
   - Metric: Event count
   - Event: download_app

3. **Downloads Over Time (Line Chart)**
   - X-axis: Date
   - Y-axis: Event count
   - Line color: Platform
   - Event: download_app

4. **Button Location Performance (Bar Chart)**
   - X-axis: button_location
   - Y-axis: Event count
   - Event: download_app

5. **Device Match Accuracy (Table)**
   - Rows: platform, detected_device
   - Values: Event count
   - Event: download_app

## 🎓 Advanced Tracking

### A/B Testing Button Positions

Track different button variants:
```javascript
utils.trackDownload('ios', 'hero-variant-a');
utils.trackDownload('ios', 'hero-variant-b');
```

Then compare in GA4 to see which performs better.

### User Journey Tracking

See the path users take before downloading:
1. GA4 → **Explore** → **Path exploration**
2. Starting point: page_view (/)
3. Ending point: download_app
4. This shows you what users do before clicking download

### Cohort Analysis

Compare download rates by user acquisition source:
1. GA4 → **Explore** → **Cohort exploration**
2. Cohort: First user campaign
3. Return criteria: download_app
4. Shows which marketing campaigns lead to downloads

## 📋 Checklist

Before going live:
- [ ] GA4 Measurement ID added to all pages (G-27QDM88JLM)
- [ ] Download buttons have `data-location` attributes
- [ ] Tested iOS button click in browser console
- [ ] Tested Android button click in browser console
- [ ] Verified events appear in GA4 DebugView
- [ ] Marked `download_app` as conversion
- [ ] Marked `app_download_click` as conversion
- [ ] Created custom dashboard
- [ ] Set up email alerts
- [ ] Documented baseline metrics

After 1 week:
- [ ] Review download counts by platform
- [ ] Check button location performance
- [ ] Analyze device matching accuracy
- [ ] Adjust button placements if needed
- [ ] Set up A/B tests for underperforming areas

## 🆘 Troubleshooting

**Events not showing up in GA4:**
- Wait 24 hours (GA4 has a delay)
- Check DebugView for real-time validation
- Verify gtag is loaded: Open console, type `gtag`, should not be undefined
- Check for ad blockers (disable for testing)

**Events showing but no parameters:**
- Events may appear before parameters
- Wait 24-48 hours for full parameter data
- Use DebugView to verify parameters are sent

**Conversions not tracking:**
- Ensure event is marked as conversion in GA4
- Wait 24 hours after marking
- Check that exact event name matches

**Wrong platform detected:**
- Check user agent in event parameters
- May need to adjust detection logic in utils.detectPlatform()

## 📞 Need Help?

Check these resources:
- [GA4 Documentation](https://support.google.com/analytics/answer/9304153)
- [GA4 Event Reference](https://support.google.com/analytics/answer/9267735)
- [GA4 Conversions](https://support.google.com/analytics/answer/9267568)

---

**Last Updated:** October 2025
**GA4 Property ID:** G-27QDM88JLM

