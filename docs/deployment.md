# 🚀 Deployment Guide

This guide covers various deployment options for StockCharts, from simple static hosting to advanced production setups with CDN integration and performance optimization.

## 🎯 Deployment Overview

StockCharts is a **pure frontend application** with no backend requirements, making deployment straightforward and flexible.

### Deployment Requirements
- ✅ **Static File Hosting**: Any web server or CDN
- ✅ **HTTPS Support**: Required for secure API calls
- ✅ **No Server-Side Processing**: Pure client-side application
- ✅ **No Database**: All data fetched from external APIs

### Supported Platforms
- **GitHub Pages** (Recommended for open source)
- **Netlify** (Recommended for ease of use)
- **Vercel** (Recommended for performance)
- **AWS S3 + CloudFront**
- **Traditional Web Hosting**
- **Firebase Hosting**

---

## 🌐 GitHub Pages Deployment (Recommended)

### Automatic Deployment

#### Step 1: Repository Setup
```bash
# Ensure your repository is public or has GitHub Pro
# Your repository should be named: yourusername.github.io
# Or use a custom repository name with Pages enabled
```

#### Step 2: Enable GitHub Pages
1. Go to **Repository Settings**
2. Scroll to **Pages** section
3. Source: **Deploy from a branch**
4. Branch: **main** (or your default branch)
5. Folder: **/ (root)**

#### Step 3: Configure Custom Domain (Optional)
```bash
# Add CNAME file to repository root
echo "your-custom-domain.com" > CNAME
```

#### Step 4: Access Your Site
```
Default URL: https://yourusername.github.io/StockCharts
Custom Domain: https://your-custom-domain.com
```

### GitHub Actions Deployment
```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies (if using build tools)
      run: npm ci
      if: steps.check-package.outputs.exists == 'true'
    
    - name: Build project (if using build tools)
      run: npm run build
      if: steps.check-package.outputs.exists == 'true'
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./
```

---

## ⚡ Netlify Deployment

### Method 1: Drag & Drop Deployment
1. **Build locally** (if needed)
2. **Zip project folder**
3. **Drag to Netlify dashboard**
4. **Configure domain**

### Method 2: Git Integration
```bash
# Connect repository to Netlify
1. Login to Netlify
2. "New site from Git"
3. Choose GitHub/GitLab/Bitbucket
4. Select repository
5. Configure build settings:
   - Build command: (leave empty for static)
   - Publish directory: ./
```

### Netlify Configuration
```toml
# netlify.toml
[build]
  publish = "."
  command = ""

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000"

[[headers]]
  for = "*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
  conditions = {Role = ["admin"]}
```

### Environment Variables (Netlify)
```bash
# Set via Netlify dashboard or CLI
netlify env:set API_URL "https://api.example.com"
netlify env:set ENVIRONMENT "production"
```

---

## 🔥 Vercel Deployment

### Automatic Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project directory
vercel

# Follow prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - Project name: stockcharts
# - Directory: ./
```

### Vercel Configuration
```json
{
  "version": 2,
  "builds": [
    {
      "src": "**/*",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

### Domain Configuration
```bash
# Add custom domain
vercel domains add your-domain.com

# Configure DNS
# Add CNAME record: your-domain.com -> cname.vercel-dns.com
```

---

## ☁️ AWS S3 + CloudFront Deployment

### S3 Bucket Setup
```bash
# Create S3 bucket
aws s3 mb s3://stockcharts-app

# Enable static website hosting
aws s3 website s3://stockcharts-app \
  --index-document index.html \
  --error-document error.html

# Upload files
aws s3 sync . s3://stockcharts-app \
  --exclude ".git/*" \
  --exclude "node_modules/*" \
  --exclude "docs/*"
```

### Bucket Policy
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::stockcharts-app/*"
    }
  ]
}
```

### CloudFront Distribution
```bash
# Create CloudFront distribution
aws cloudfront create-distribution \
  --distribution-config file://cloudfront-config.json
```

```json
{
  "CallerReference": "stockcharts-distribution",
  "DefaultRootObject": "index.html",
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "stockcharts-s3",
        "DomainName": "stockcharts-app.s3-website-us-east-1.amazonaws.com",
        "CustomOriginConfig": {
          "HTTPPort": 80,
          "HTTPSPort": 443,
          "OriginProtocolPolicy": "http-only"
        }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "stockcharts-s3",
    "ViewerProtocolPolicy": "redirect-to-https",
    "MinTTL": 0,
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": {
        "Forward": "none"
      }
    }
  },
  "Comment": "StockCharts Distribution",
  "Enabled": true
}
```

---

## 🐳 Docker Deployment

### Dockerfile
```dockerfile
# Use nginx alpine image
FROM nginx:alpine

# Copy static files
COPY . /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

### Nginx Configuration
```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;
        
        # Enable caching for static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
        
        # Handle SPA routing
        location / {
            try_files $uri $uri/ /index.html;
        }
        
        # Security headers
        add_header X-Frame-Options "DENY" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
    }
}
```

### Docker Commands
```bash
# Build image
docker build -t stockcharts-app .

# Run container
docker run -d -p 8080:80 --name stockcharts stockcharts-app

# Access application
# http://localhost:8080
```

---

## 🔧 Production Optimization

### Performance Optimizations

#### 1. **Asset Optimization**
```bash
# Minify CSS
npm install -g clean-css-cli
cleancss -o style.min.css style.css navigation.css

# Minify JavaScript
npm install -g terser
terser script.js utils.js -o scripts.min.js --compress --mangle
```

#### 2. **Image Optimization**
```bash
# Optimize images if any
npm install -g imagemin-cli
imagemin assets/**/*.{jpg,png,svg} --out-dir=assets/optimized
```

#### 3. **Gzip Compression**
```javascript
// Enable gzip in server configuration
// Most hosting platforms enable this automatically

// For Express server (if needed)
const compression = require('compression');
app.use(compression());
```

### Caching Strategy

#### HTTP Headers
```
# Static assets (JS, CSS)
Cache-Control: public, max-age=31536000, immutable

# HTML files
Cache-Control: public, max-age=3600, must-revalidate

# API responses (handled by external APIs)
Cache-Control: no-cache, must-revalidate
```

#### Service Worker (Optional)
```javascript
// sw.js - Basic service worker for caching
const CACHE_NAME = 'stockcharts-v1';
const urlsToCache = [
    '/',
    '/style.css',
    '/navigation.css',
    '/script.js',
    '/utils.js',
    '/index.html',
    '/navigation.html'
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
            .then(response => {
                // Return cached version or fetch from network
                return response || fetch(event.request);
            }
        )
    );
});
```

---

## 🔒 Security Configuration

### Content Security Policy
```html
<!-- Add to all HTML files -->
<meta http-equiv="Content-Security-Policy" content="
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://www.alphavantage.co;
    style-src 'self' 'unsafe-inline';
    connect-src 'self' https://www.alphavantage.co https://query1.finance.yahoo.com https://api.allorigins.win;
    img-src 'self' data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
">
```

### HTTPS Configuration
```bash
# Let's Encrypt SSL (for custom servers)
sudo certbot --nginx -d your-domain.com

# Or use hosting platform SSL (recommended)
# Most platforms provide free SSL certificates
```

### Security Headers
```javascript
// Security headers for custom server
app.use((req, res, next) => {
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
});
```

---

## 📊 Monitoring & Analytics

### Error Monitoring
```javascript
// Basic error tracking
window.addEventListener('error', (event) => {
    console.error('Application error:', event.error);
    
    // Send to monitoring service
    if (typeof gtag !== 'undefined') {
        gtag('event', 'exception', {
            description: event.error.message,
            fatal: false
        });
    }
});

// API error tracking
function trackApiError(source, error) {
    console.warn(`API Error (${source}):`, error);
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'api_error', {
            api_source: source,
            error_message: error.message
        });
    }
}
```

### Performance Monitoring
```javascript
// Performance tracking
function trackPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perf = performance.getEntriesByType('navigation')[0];
                const loadTime = perf.loadEventEnd - perf.loadEventStart;
                
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'page_load_time', {
                        value: Math.round(loadTime),
                        custom_parameter: 'milliseconds'
                    });
                }
            }, 0);
        });
    }
}
```

---

## 🚀 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy StockCharts

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm ci
      if: hashFiles('package.json') != ''
    
    - name: Run tests
      run: npm test
      if: hashFiles('package.json') != ''
    
    - name: Build
      run: npm run build
      if: hashFiles('package.json') != ''
    
    - name: Deploy to Netlify
      uses: nwtgck/actions-netlify@v1.2
      with:
        publish-dir: './dist'
        production-branch: main
        github-token: ${{ secrets.GITHUB_TOKEN }}
        deploy-message: "Deploy from GitHub Actions"
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

---

## 🎯 Environment-Specific Configurations

### Development
```javascript
const config = {
    environment: 'development',
    apiUrl: 'http://localhost:3000',
    debug: true,
    analytics: false
};
```

### Staging
```javascript
const config = {
    environment: 'staging',
    apiUrl: 'https://staging-api.stockcharts.com',
    debug: true,
    analytics: false
};
```

### Production
```javascript
const config = {
    environment: 'production',
    apiUrl: 'https://api.stockcharts.com',
    debug: false,
    analytics: true
};
```

---

For performance optimization details, see the [Performance Guide](./performance.md). For security best practices, refer to the [Security Documentation](./security.md).
