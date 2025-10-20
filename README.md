# Magerly Website

Static promotional website for the Magerly mobile application - your baby's growth companion.

## 🌟 Project Overview

Magerly is a modern, fast-loading static website designed to promote the Magerly mobile app for tracking baby growth milestones. Built with performance and SEO in mind, this site provides an excellent user experience across all devices.

## ✨ Features

- **⚡ Lightning Fast**: Static HTML with optimized assets for sub-second loading
- **📱 Mobile-First**: Responsive design that works perfectly on all devices  
- **🔍 SEO Optimized**: Semantic HTML, meta tags, and structured data
- **♿ Accessible**: WCAG compliant with proper alt text and keyboard navigation
- **🎨 Modern Design**: Clean, professional design with Tailwind CSS
- **📊 Interactive Elements**: Age calculator, email capture, and smooth animations

## 🛠️ Tech Stack

- **HTML5**: Semantic markup for accessibility and SEO
- **CSS**: Tailwind CSS for utility-first styling  
- **JavaScript**: Modern ES6+ for interactivity
- **Vite**: Fast development server and optimized builds
- **PostCSS**: CSS processing and optimization

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ 
- npm 10+

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd magerly-website
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

   The site will be available at `http://localhost:3000`

### Development Commands

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Format code with Prettier
npm run format

# Check code formatting
npm run format:check

# Lint JavaScript
npm run lint

# Fix JavaScript linting issues
npm run lint:fix
```

## 📁 Project Structure

```
magerly-website/
├── src/                      # Source files
│   ├── index.html            # Main landing page
│   ├── privacy.html          # Privacy policy
│   ├── terms.html            # Terms of service  
│   ├── css/
│   │   └── style.css         # Main stylesheet (Tailwind)
│   ├── js/
│   │   └── main.js           # Application JavaScript
│   └── assets/
│       ├── images/           # Images and graphics
│       └── icons/            # Icons and favicons
├── public/                   # Static assets (copied directly)
│   └── app-ads.txt           # Mobile app advertising verification
├── dist/                     # Built files for production
├── docs/                     # Project documentation
├── infrastructure/           # AWS CloudFormation infrastructure
│   ├── templates/            # CloudFormation YAML template
│   ├── parameters/           # Production parameters
│   ├── scripts/              # Deployment script (bash)
│   └── README.md             # Infrastructure documentation
├── package.json              # Dependencies and scripts
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
└── README.md                # This file
```

## 🎨 Key Pages

### Landing Page (`/`)
- Hero section with app preview
- Interactive baby age calculator
- Feature showcase
- User testimonials
- FAQ section
- Email capture form

### Privacy Policy (`/privacy.html`)
- Comprehensive privacy information
- GDPR compliance details
- Data handling practices

### Terms of Service (`/terms.html`)
- Terms and conditions
- User responsibilities
- Subscription details

## 🔧 Configuration

### Tailwind CSS

The site uses a custom Tailwind configuration with:
- Custom color palette (primary/secondary)
- Extended animations and transitions
- Mobile-first responsive design
- Custom component classes

### Vite Configuration

Optimized for:
- Fast development with hot reload
- Multi-page application support
- Asset optimization and minification
- Legacy browser support

## 📊 Performance

Target metrics:
- **Lighthouse Score**: 90+ across all categories
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Bundle Size**: JS < 50KB, CSS < 30KB (gzipped)

## 🧪 Testing

### Manual Testing Checklist

- [ ] Mobile responsiveness (iOS/Android)
- [ ] Cross-browser compatibility (Chrome, Firefox, Safari, Edge)
- [ ] Age calculator functionality
- [ ] Email capture form
- [ ] Download button interactions
- [ ] Navigation and smooth scrolling
- [ ] Form validation and error handling

### Performance Testing

```bash
# Run Lighthouse audit
npx lighthouse http://localhost:3000 --view

# Check bundle size
npm run build && npx bundlesize
```

## 🚀 Deployment

### Build Process

```bash
# Create production build
npm run build

# Files will be generated in /dist directory
# Ready for deployment to any static hosting service
# app-ads.txt will be automatically copied to site root for ad verification
```

### Deployment Options

- **AWS S3 + CloudFront**: Static hosting with CDN
- **Netlify**: Easy deployment with form handling
- **Vercel**: Fast global deployment
- **GitHub Pages**: Free hosting for public repositories

### AWS Infrastructure Deployment

The project includes production-ready AWS infrastructure using CloudFormation:

```bash
# 1. Make script executable (Linux/Mac/WSL)
chmod +x infrastructure/scripts/deploy.sh

# 2. Deploy AWS infrastructure (first time)
./infrastructure/scripts/deploy.sh deploy

# 3. Build the website
npm run build

# 4. Deploy website files to S3
./infrastructure/scripts/deploy.sh sync
```

**Note**: Deployment script requires Linux, Mac, or WSL environment with bash and AWS CLI. 
Optional: Install `jq` for enhanced JSON processing.

**Infrastructure includes**: S3 + CloudFront + Route 53 + SSL + WAF + Monitoring

For detailed infrastructure documentation, see [`infrastructure/README.md`](infrastructure/README.md).

### Manual AWS S3 Deployment (Alternative)

```bash
# Build the site
npm run build

# Sync to S3 bucket (manual method)
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

## 📈 Analytics & Tracking

The site includes:
- Google Analytics 4 integration
- Custom event tracking for user interactions
- Conversion tracking for app downloads
- Performance monitoring

## 🔒 Security

- No sensitive data handling (static site)
- HTTPS enforced via hosting platform
- Content Security Policy headers
- Input sanitization for forms

## 🌍 SEO Features

- Semantic HTML5 markup
- Open Graph and Twitter Card meta tags
- Structured data (JSON-LD)
- Optimized images with alt text
- Fast loading speeds
- Mobile-friendly design

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Format code (`npm run format`)
5. Lint code (`npm run lint:fix`)
6. Commit changes (`git commit -m 'Add amazing feature'`)
7. Push to branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## 📝 Code Style

- Use Prettier for formatting
- Follow ESLint rules
- Write semantic HTML
- Use Tailwind utility classes
- Comment complex JavaScript logic

## 🐛 Troubleshooting

### Common Issues

**Development server won't start:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Styles not updating:**
```bash
# Restart dev server to rebuild Tailwind
npm run dev
```

**Build fails:**
```bash
# Check for linting errors
npm run lint

# Check for formatting issues  
npm run format:check
```

## 📞 Support

- **Email**: magerly.growing.together@gmail.com
- **Documentation**: See `/docs` directory
- **Issues**: GitHub Issues for bug reports and feature requests

## 📄 License

This project is proprietary and confidential.

---

**Made with ❤️ for parents everywhere**