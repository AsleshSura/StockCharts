# ⚡ Performance Optimization Guide

This comprehensive guide covers performance optimization strategies, best practices, and monitoring techniques to ensure StockCharts delivers exceptional user experience across all devices and network conditions.

## 🎯 Performance Overview

### Current Performance Metrics
- **Initial Load**: < 2 seconds on 3G connection
- **Chart Rendering**: < 500ms for most datasets
- **API Response**: < 1 second with fallback strategy
- **Theme Switching**: < 200ms smooth transition
- **Memory Usage**: Stable with proper cleanup

### Performance Goals
- ✅ **First Contentful Paint**: < 1.5s
- ✅ **Largest Contentful Paint**: < 2.5s
- ✅ **Time to Interactive**: < 3s
- ✅ **Cumulative Layout Shift**: < 0.1
- ✅ **First Input Delay**: < 100ms

---

## 🚀 Loading Performance

### 1. **Critical Resource Optimization**

#### Prioritize Critical Resources
```html
<!-- Critical CSS inline for immediate rendering -->
<style>
    /* Critical above-the-fold styles */
    .container { max-width: 1200px; margin: 0 auto; }
    .header { padding: 1rem; background: var(--color-surface); }
    .loading { display: flex; justify-content: center; padding: 2rem; }
</style>

<!-- Preload critical external resources -->
<link rel="preload" href="https://cdn.jsdelivr.net/npm/chart.js@4.0.1/dist/chart.umd.js" as="script">
<link rel="preconnect" href="https://www.alphavantage.co">
<link rel="preconnect" href="https://query1.finance.yahoo.com">
```

#### Lazy Load Non-Critical Resources
```javascript
// Lazy load Chart.js only when needed
let chartJSLoaded = false;

async function loadChartJS() {
    if (chartJSLoaded) return;
    
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.0.1/dist/chart.umd.js';
        script.onload = () => {
            chartJSLoaded = true;
            resolve();
        };
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Load only when user requests a chart
async function createChart() {
    showLoading('Loading chart library...');
    await loadChartJS();
    hideLoading();
    // Now create the chart
}
```

### 2. **Resource Bundling & Minification**

#### CSS Optimization
```bash
# Combine and minify CSS files
npm install -g clean-css-cli

# Combine files
cat style.css navigation.css > combined.css

# Minify combined file
cleancss -o styles.min.css combined.css
```

#### JavaScript Optimization
```bash
# Minify JavaScript files
npm install -g terser

# Minify with source maps for debugging
terser script.js utils.js \
  --compress \
  --mangle \
  --source-map \
  -o scripts.min.js
```

#### HTML Optimization
```html
<!-- Remove unnecessary whitespace and comments in production -->
<!DOCTYPE html><html lang="en" data-theme="light"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>StockCharts</title><link rel="stylesheet" href="styles.min.css"></head>
```

### 3. **Image & Asset Optimization**

#### Responsive Images
```html
<!-- Use appropriate image formats and sizes -->
<picture>
    <source media="(min-width: 768px)" srcset="logo-desktop.webp">
    <source media="(min-width: 480px)" srcset="logo-tablet.webp">
    <img src="logo-mobile.webp" alt="StockCharts Logo" loading="lazy">
</picture>
```

#### SVG Optimization
```javascript
// Inline critical SVG icons to avoid HTTP requests
const icons = {
    theme: '<svg viewBox="0 0 24 24"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"/></svg>',
    export: '<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/></svg>'
};
```

---

## 🔄 Runtime Performance

### 1. **Efficient DOM Manipulation**

#### Batch DOM Updates
```javascript
// Bad: Multiple DOM manipulations
function updateStockList(stocks) {
    const container = document.getElementById('stockList');
    stocks.forEach(stock => {
        const item = document.createElement('div');
        item.textContent = `${stock.symbol}: $${stock.price}`;
        container.appendChild(item); // Multiple reflows
    });
}

// Good: Single DOM update
function updateStockListOptimized(stocks) {
    const container = document.getElementById('stockList');
    const fragment = document.createDocumentFragment();
    
    stocks.forEach(stock => {
        const item = document.createElement('div');
        item.textContent = `${stock.symbol}: $${stock.price}`;
        fragment.appendChild(item);
    });
    
    container.appendChild(fragment); // Single reflow
}
```

#### Use CSS for Animations
```css
/* Use CSS transitions instead of JavaScript animations */
.chart-container {
    transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
}

.chart-container.loading {
    opacity: 0.6;
    transform: scale(0.98);
}

/* Use transform instead of changing layout properties */
.card {
    transition: transform 0.2s ease-in-out;
}

.card:hover {
    transform: translateY(-2px); /* Better than changing top/margin */
}
```

### 2. **Memory Management**

#### Chart Cleanup
```javascript
// Properly destroy charts to prevent memory leaks
function destroyExistingChart() {
    if (window.currentChart) {
        window.currentChart.destroy();
        window.currentChart = null;
    }
}

function createNewChart(data) {
    // Always clean up before creating new chart
    destroyExistingChart();
    
    const ctx = document.getElementById('stockChart').getContext('2d');
    window.currentChart = new Chart(ctx, config);
    
    return window.currentChart;
}

// Clean up when page unloads
window.addEventListener('beforeunload', () => {
    destroyExistingChart();
});
```

#### Event Listener Management
```javascript
// Remove event listeners when no longer needed
class DashboardComponent {
    constructor() {
        this.handleResize = this.handleResize.bind(this);
        this.handleThemeChange = this.handleThemeChange.bind(this);
    }
    
    init() {
        window.addEventListener('resize', this.handleResize);
        themeManager.subscribe(this.handleThemeChange);
    }
    
    destroy() {
        window.removeEventListener('resize', this.handleResize);
        themeManager.unsubscribe(this.handleThemeChange);
    }
    
    handleResize() {
        // Handle resize
    }
    
    handleThemeChange(theme) {
        // Handle theme change
    }
}
```

### 3. **Efficient Data Processing**

#### Data Transformation Optimization
```javascript
// Optimize data processing loops
function processStockDataOptimized(rawData) {
    const processedData = [];
    const dataLength = rawData.length;
    
    // Pre-allocate array if size is known
    processedData.length = dataLength;
    
    // Use for loop instead of forEach for better performance
    for (let i = 0; i < dataLength; i++) {
        const item = rawData[i];
        processedData[i] = {
            date: item.date,
            price: parseFloat(item.close),
            volume: parseInt(item.volume, 10),
            change: i > 0 ? item.close - rawData[i-1].close : 0
        };
    }
    
    return processedData;
}
```

#### Debounced API Calls
```javascript
// Prevent excessive API calls
function debounce(func, wait, immediate = false) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Apply debouncing to search
const debouncedSearch = debounce(async (symbol) => {
    await searchStock(symbol);
}, 300);

// Use with input events
document.getElementById('stockSymbol').addEventListener('input', (e) => {
    debouncedSearch(e.target.value);
});
```

---

## 💾 Caching Strategies

### 1. **HTTP Caching**

#### Static Asset Caching
```javascript
// Service Worker for aggressive caching of static assets
const CACHE_NAME = 'stockcharts-static-v1';
const STATIC_ASSETS = [
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
            .then(cache => cache.addAll(STATIC_ASSETS))
    );
});

self.addEventListener('fetch', event => {
    if (STATIC_ASSETS.includes(new URL(event.request.url).pathname)) {
        event.respondWith(
            caches.match(event.request)
                .then(response => response || fetch(event.request))
        );
    }
});
```

### 2. **Application-Level Caching**

#### API Response Caching
```javascript
class CacheManager {
    constructor(defaultTTL = 300000) { // 5 minutes default
        this.cache = new Map();
        this.defaultTTL = defaultTTL;
    }
    
    set(key, data, ttl = this.defaultTTL) {
        const expiry = Date.now() + ttl;
        this.cache.set(key, { data, expiry });
        
        // Clean up expired items periodically
        this.scheduleCleanup();
    }
    
    get(key) {
        const item = this.cache.get(key);
        if (!item) return null;
        
        if (Date.now() > item.expiry) {
            this.cache.delete(key);
            return null;
        }
        
        return item.data;
    }
    
    scheduleCleanup() {
        if (this.cleanupTimeout) return;
        
        this.cleanupTimeout = setTimeout(() => {
            this.cleanup();
            this.cleanupTimeout = null;
        }, 60000); // Clean every minute
    }
    
    cleanup() {
        const now = Date.now();
        for (const [key, item] of this.cache.entries()) {
            if (now > item.expiry) {
                this.cache.delete(key);
            }
        }
    }
}

// Usage
const apiCache = new CacheManager();

async function fetchStockDataCached(symbol, timeRange) {
    const cacheKey = `${symbol}-${timeRange}`;
    
    // Check cache first
    const cached = apiCache.get(cacheKey);
    if (cached) {
        return cached;
    }
    
    // Fetch and cache
    const data = await fetchStockData(symbol, timeRange);
    apiCache.set(cacheKey, data);
    
    return data;
}
```

### 3. **Browser Storage Optimization**

#### Efficient LocalStorage Usage
```javascript
class StorageManager {
    constructor(prefix = 'stockcharts-') {
        this.prefix = prefix;
        this.maxSize = 5 * 1024 * 1024; // 5MB limit
    }
    
    set(key, data) {
        try {
            const serialized = JSON.stringify({
                data,
                timestamp: Date.now(),
                size: this.getDataSize(data)
            });
            
            localStorage.setItem(this.prefix + key, serialized);
            this.manageStorage();
        } catch (error) {
            console.warn('Storage full, cleaning up...', error);
            this.cleanup();
            // Retry once after cleanup
            try {
                localStorage.setItem(this.prefix + key, serialized);
            } catch (retryError) {
                console.error('Storage still full after cleanup', retryError);
            }
        }
    }
    
    get(key) {
        try {
            const item = localStorage.getItem(this.prefix + key);
            if (!item) return null;
            
            const parsed = JSON.parse(item);
            return parsed.data;
        } catch (error) {
            console.warn('Error reading from storage:', error);
            return null;
        }
    }
    
    getDataSize(data) {
        return new Blob([JSON.stringify(data)]).size;
    }
    
    getCurrentUsage() {
        let total = 0;
        for (let key in localStorage) {
            if (key.startsWith(this.prefix)) {
                total += localStorage[key].length;
            }
        }
        return total;
    }
    
    cleanup() {
        // Remove oldest items if storage is getting full
        const items = [];
        for (let key in localStorage) {
            if (key.startsWith(this.prefix)) {
                try {
                    const item = JSON.parse(localStorage[key]);
                    items.push({ key, timestamp: item.timestamp });
                } catch (error) {
                    // Remove corrupted items
                    localStorage.removeItem(key);
                }
            }
        }
        
        // Sort by timestamp and remove oldest
        items.sort((a, b) => a.timestamp - b.timestamp);
        const toRemove = items.slice(0, Math.floor(items.length / 2));
        toRemove.forEach(item => localStorage.removeItem(item.key));
    }
}
```

---

## 📊 Performance Monitoring

### 1. **Core Web Vitals Monitoring**

#### Performance Observer API
```javascript
class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.setupObservers();
    }
    
    setupObservers() {
        // Largest Contentful Paint
        this.observeLCP();
        
        // First Input Delay
        this.observeFID();
        
        // Cumulative Layout Shift
        this.observeCLS();
        
        // Custom metrics
        this.observeCustomMetrics();
    }
    
    observeLCP() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.metrics.lcp = lastEntry.startTime;
                this.reportMetric('lcp', lastEntry.startTime);
            });
            
            observer.observe({ entryTypes: ['largest-contentful-paint'] });
        }
    }
    
    observeFID() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    this.metrics.fid = entry.processingStart - entry.startTime;
                    this.reportMetric('fid', entry.processingStart - entry.startTime);
                });
            });
            
            observer.observe({ entryTypes: ['first-input'] });
        }
    }
    
    observeCLS() {
        if ('PerformanceObserver' in window) {
            let clsValue = 0;
            
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                });
                
                this.metrics.cls = clsValue;
                this.reportMetric('cls', clsValue);
            });
            
            observer.observe({ entryTypes: ['layout-shift'] });
        }
    }
    
    observeCustomMetrics() {
        // Chart rendering time
        this.measureChartPerformance();
        
        // API response time
        this.measureAPIPerformance();
        
        // Theme switch time
        this.measureThemePerformance();
    }
    
    measureChartPerformance() {
        const originalCreateChart = window.createChart;
        if (originalCreateChart) {
            window.createChart = (...args) => {
                const start = performance.now();
                const result = originalCreateChart.apply(this, args);
                const end = performance.now();
                
                this.reportMetric('chart-render-time', end - start);
                return result;
            };
        }
    }
    
    reportMetric(name, value) {
        // Report to analytics service
        if (typeof gtag !== 'undefined') {
            gtag('event', 'performance_metric', {
                metric_name: name,
                metric_value: Math.round(value),
                page_path: window.location.pathname
            });
        }
        
        console.log(`Performance metric - ${name}: ${value.toFixed(2)}ms`);
    }
}

// Initialize monitoring
const performanceMonitor = new PerformanceMonitor();
```

### 2. **Resource Timing Analysis**

#### Network Performance Monitoring
```javascript
function analyzeResourceTiming() {
    if ('performance' in window && 'getEntriesByType' in performance) {
        const resources = performance.getEntriesByType('resource');
        
        const analysis = {
            total: resources.length,
            byType: {},
            slowResources: [],
            totalTransferSize: 0
        };
        
        resources.forEach(resource => {
            // Categorize by type
            const type = getResourceType(resource.name);
            analysis.byType[type] = (analysis.byType[type] || 0) + 1;
            
            // Track transfer size
            analysis.totalTransferSize += resource.transferSize || 0;
            
            // Identify slow resources
            const loadTime = resource.responseEnd - resource.requestStart;
            if (loadTime > 1000) { // Slower than 1 second
                analysis.slowResources.push({
                    name: resource.name,
                    loadTime: loadTime,
                    size: resource.transferSize
                });
            }
        });
        
        console.table(analysis);
        return analysis;
    }
}

function getResourceType(url) {
    if (url.includes('.css')) return 'CSS';
    if (url.includes('.js')) return 'JavaScript';
    if (url.includes('.png') || url.includes('.jpg') || url.includes('.svg')) return 'Image';
    if (url.includes('alphavantage') || url.includes('yahoo')) return 'API';
    return 'Other';
}

// Run analysis after page load
window.addEventListener('load', () => {
    setTimeout(analyzeResourceTiming, 1000);
});
```

### 3. **User Experience Metrics**

#### Custom UX Metrics
```javascript
class UXMetrics {
    constructor() {
        this.metrics = {};
        this.setupTracking();
    }
    
    setupTracking() {
        this.trackTimeToInteractive();
        this.trackUserEngagement();
        this.trackErrorRates();
    }
    
    trackTimeToInteractive() {
        const startTime = performance.now();
        
        // Check when all critical elements are ready
        const checkInteractive = () => {
            const criticalElements = [
                document.getElementById('stockSymbol'),
                document.getElementById('timeRange'),
                document.getElementById('themeToggle')
            ];
            
            if (criticalElements.every(el => el !== null)) {
                const tti = performance.now() - startTime;
                this.metrics.timeToInteractive = tti;
                this.reportMetric('time-to-interactive', tti);
            } else {
                requestAnimationFrame(checkInteractive);
            }
        };
        
        checkInteractive();
    }
    
    trackUserEngagement() {
        let engagementScore = 0;
        
        // Track meaningful interactions
        document.addEventListener('click', (e) => {
            if (e.target.matches('button, .card, .chart')) {
                engagementScore++;
            }
        });
        
        // Track scroll depth
        let maxScrollDepth = 0;
        window.addEventListener('scroll', () => {
            const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            maxScrollDepth = Math.max(maxScrollDepth, scrollPercent);
        });
        
        // Report on page unload
        window.addEventListener('beforeunload', () => {
            this.reportMetric('engagement-score', engagementScore);
            this.reportMetric('max-scroll-depth', maxScrollDepth);
        });
    }
    
    trackErrorRates() {
        let errorCount = 0;
        
        window.addEventListener('error', () => {
            errorCount++;
        });
        
        // Track API errors
        const originalFetch = window.fetch;
        window.fetch = (...args) => {
            return originalFetch(...args).catch(error => {
                errorCount++;
                throw error;
            });
        };
        
        // Report error rate periodically
        setInterval(() => {
            if (errorCount > 0) {
                this.reportMetric('error-rate', errorCount);
                errorCount = 0; // Reset counter
            }
        }, 60000); // Every minute
    }
    
    reportMetric(name, value) {
        console.log(`UX Metric - ${name}: ${value}`);
        
        // Send to analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'ux_metric', {
                metric_name: name,
                metric_value: Math.round(value)
            });
        }
    }
}

const uxMetrics = new UXMetrics();
```

---

## 🎯 Optimization Techniques by Component

### Chart Performance
```javascript
// Optimize chart rendering
function createOptimizedChart(data, symbol) {
    // Reduce data points for better performance
    const optimizedData = data.length > 100 ? 
        downsampleData(data, 100) : data;
    
    const config = {
        type: 'line',
        data: {
            labels: optimizedData.map(item => item.date),
            datasets: [{
                label: symbol,
                data: optimizedData.map(item => item.close),
                borderColor: getThemeColor('primary'),
                borderWidth: 2,
                fill: false,
                pointRadius: 0, // Remove points for better performance
                pointHoverRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: data.length > 50 ? 0 : 300 // Disable animation for large datasets
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
            scales: {
                x: {
                    ticks: {
                        maxTicksLimit: 10 // Limit number of x-axis labels
                    }
                }
            }
        }
    };
    
    return new Chart(ctx, config);
}

// Data downsampling for large datasets
function downsampleData(data, targetPoints) {
    if (data.length <= targetPoints) return data;
    
    const interval = Math.floor(data.length / targetPoints);
    return data.filter((_, index) => index % interval === 0);
}
```

### Theme Performance
```javascript
// Optimize theme switching
class OptimizedThemeManager extends ThemeManager {
    applyTheme(theme) {
        // Use CSS custom property updates instead of class changes
        const root = document.documentElement;
        const themeColors = this.getThemeColors(theme);
        
        // Batch style updates
        requestAnimationFrame(() => {
            Object.entries(themeColors).forEach(([property, value]) => {
                root.style.setProperty(property, value);
            });
        });
        
        // Update data attribute
        root.setAttribute('data-theme', theme);
        
        // Store preference
        this.storeTheme(theme);
        
        // Notify observers with throttling
        this.notifyObserversThrottled(theme);
    }
    
    notifyObserversThrottled = throttle((theme) => {
        this.observers.forEach(callback => callback(theme));
    }, 100);
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
```

---

For deployment optimization strategies, see the [Deployment Guide](./deployment.md). For architecture-specific performance considerations, refer to the [Architecture Documentation](./architecture.md).
