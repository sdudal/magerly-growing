# Social Media Preview Images

This directory contains social media preview images for Magerly website.

## Current Images

- **og-preview.svg** (1200x630px) - Open Graph image for Facebook, LinkedIn
- **twitter-card.svg** (1200x600px) - Twitter Card image
- **og-preview.html** - HTML version for easy viewing/editing
- **twitter-card.html** - HTML version for easy viewing/editing

## Image Specifications

### Open Graph (Facebook, LinkedIn)
- **Dimensions**: 1200 x 630 pixels
- **Format**: SVG (or PNG/JPG recommended)
- **Aspect Ratio**: 1.91:1
- **File Size**: < 8 MB

### Twitter Card
- **Dimensions**: 1200 x 600 pixels  
- **Format**: SVG (or PNG/JPG recommended)
- **Aspect Ratio**: 2:1
- **File Size**: < 5 MB

## Converting SVG to PNG (Recommended)

For better social media compatibility, convert SVG files to PNG:

### Option 1: Using Online Tool
1. Visit https://cloudconvert.com/svg-to-png
2. Upload `og-preview.svg` and `twitter-card.svg`
3. Set quality to 100%
4. Download PNG files

### Option 2: Using ImageMagick (Command Line)
```bash
# Install ImageMagick if not already installed
# On macOS: brew install imagemagick
# On Windows: choco install imagemagick
# On Linux: sudo apt-get install imagemagick

# Convert Open Graph image
convert og-preview.svg -resize 1200x630 og-preview.png

# Convert Twitter Card image
convert twitter-card.svg -resize 1200x600 twitter-card.png
```

### Option 3: Using Node.js (sharp package)
```javascript
const sharp = require('sharp');
const { readFileSync } = require('fs');

// Convert OG image
const ogSvg = readFileSync('og-preview.svg');
sharp(ogSvg)
  .resize(1200, 630)
  .png()
  .toFile('og-preview.png');

// Convert Twitter image
const twitterSvg = readFileSync('twitter-card.svg');
sharp(twitterSvg)
  .resize(1200, 600)
  .png()
  .toFile('twitter-card.png');
```

### Option 4: Using Browser (Screenshots)
1. Open `og-preview.html` in browser
2. Set browser window to exactly 1200x630 pixels
3. Take screenshot or use browser dev tools to capture
4. Save as PNG

## Testing Social Media Previews

### Facebook/Open Graph
- https://developers.facebook.com/tools/debug/
- Enter your URL and click "Scrape Again"

### Twitter
- https://cards-dev.twitter.com/validator
- Enter your URL to preview Twitter Card

### LinkedIn
- https://www.linkedin.com/post-inspector/
- Enter your URL to check preview

## Image Content

Both images feature:
- ✅ Magerly branding with baby emoji logo
- ✅ Clear value proposition
- ✅ Key features (Growth Tracking, Smart Reminders, Expert Tips)
- ✅ Social proof (4.8 rating, 10,000+ families)
- ✅ Call-to-action (Free Download)
- ✅ Professional gradient background
- ✅ High contrast for readability

## Customization

To modify the images:
1. Edit the SVG files directly (any text editor)
2. Or edit the HTML versions and re-export
3. Update colors, text, or layout as needed
4. Test on social media platforms before deploying

## Deployment

After converting to PNG (if needed):
1. Place images in `public/` directory
2. Update meta tags in `src/index.html` to reference `.png` instead of `.svg`
3. Run `npm run build`
4. Deploy to production
5. Test with social media validators

## Notes

- SVG files work for some platforms but PNG/JPG is more universally supported
- Always test on actual social media platforms after deployment
- Images are cached by social platforms - use their debug tools to refresh
- Keep file sizes reasonable for faster loading and sharing

