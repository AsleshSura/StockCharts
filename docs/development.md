# 🚀 Development Guide

This guide provides comprehensive information for developers who want to contribute to, extend, or customize the StockCharts platform.

## 🛠️ Development Environment Setup

### Prerequisites
- **Modern Browser**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **Code Editor**: VS Code, Sublime Text, or your preferred editor
- **Local Server** (optional): Python, Node.js, or browser DevTools
- **Git**: For version control and contributions

### Quick Setup
```bash
# Clone the repository
git clone https://github.com/AsleshSura/StockCharts.git
cd StockCharts

# Open in your editor
code .  # VS Code
subl .  # Sublime Text

# Start local development server (optional)
python -m http.server 8000  # Python
npx serve .                 # Node.js
```

### Project Structure Understanding
```
StockCharts/
├── 📱 Frontend Applications
│   ├── navigation.html         # Dashboard hub
│   ├── index.html             # Unified dashboard
│   ├── market-indices.html    # Market tracking
│   ├── cryptocurrency.html    # Crypto monitoring
│   ├── forex.html            # Currency trading
│   ├── stock-analysis.html   # Individual stocks
│   └── stock-comparison.html # Stock comparison
│
├── 🎨 Styling System
│   ├── style.css             # Core styles + themes
│   └── navigation.css        # Navigation styles
│
├── ⚙️ JavaScript Core
│   ├── script.js             # Main application logic
│   └── utils.js              # Utilities + theme system
│
└── 📖 Documentation
    └── docs/                 # Comprehensive docs
```

## 🧩 Core Components

### 1. **Theme System** (`utils.js`)

The theme system provides dark/light mode switching with persistence.

#### ThemeManager Class
```javascript
class ThemeManager {
    constructor() {
        this.currentTheme = this.getStoredTheme() || 'light';
        this.observers = [];
        this.init();
    }
    
    // Theme switching
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
        this.notifyObservers();
    }
    
    // Apply theme to DOM
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.storeTheme(theme);
    }
    
    // Observer pattern for theme changes
    subscribe(callback) {
        this.observers.push(callback);
    }
}
```

#### CSS Custom Properties
```css
:root[data-theme="light"] {
    --color-primary: #2563eb;
    --color-background: #ffffff;
    --color-surface: #f8fafc;
    --color-text: #1e293b;
    --color-border: #e2e8f0;
    --color-success: #10b981;
    --color-danger: #ef4444;
}

:root[data-theme="dark"] {
    --color-primary: #3b82f6;
    --color-background: #0f172a;
    --color-surface: #1e293b;
    --color-text: #f1f5f9;
    --color-border: #334155;
    --color-success: #34d399;
    --color-danger: #f87171;
}
```

### 2. **Data Management** (`script.js`)

#### API Integration Pattern
```javascript
// Multi-source data fetching
async function fetchStockData(symbol, timeRange) {
    const sources = [
        () => fetchFromAlphaVantage(symbol, timeRange),
        () => fetchFromYahoo(symbol, timeRange),
        () => getDemoData(symbol, timeRange)
    ];
    
    for (const source of sources) {
        try {
            const data = await source();
            if (validateData(data)) {
                return data;
            }
        } catch (error) {
            console.warn('Source failed, trying next:', error.message);
        }
    }
    
    throw new Error('All data sources failed');
}
```

#### Data Normalization
```javascript
function normalizeStockData(response, source) {
    switch (source) {
        case 'alphavantage':
            return {
                symbol: response['Meta Data']['2. Symbol'],
                data: Object.entries(response['Time Series (Daily)'])
                    .map(([date, values]) => ({
                        date,
                        open: parseFloat(values['1. open']),
                        high: parseFloat(values['2. high']),
                        low: parseFloat(values['3. low']),
                        close: parseFloat(values['4. close']),
                        volume: parseInt(values['5. volume'])
                    }))
                    .reverse()
            };
            
        case 'yahoo':
            const result = response.chart.result[0];
            return {
                symbol: result.meta.symbol,
                data: result.timestamp.map((time, i) => ({
                    date: new Date(time * 1000).toISOString().split('T')[0],
                    open: result.indicators.quote[0].open[i],
                    high: result.indicators.quote[0].high[i],
                    low: result.indicators.quote[0].low[i],
                    close: result.indicators.quote[0].close[i],
                    volume: result.indicators.quote[0].volume[i]
                }))
            };
    }
}
```

### 3. **Chart Management**

#### Chart.js Configuration
```javascript
function createStockChart(data, symbol) {
    const ctx = document.getElementById('stockChart').getContext('2d');
    
    // Destroy existing chart
    if (window.currentChart) {
        window.currentChart.destroy();
    }
    
    const config = {
        type: 'line',
        data: {
            labels: data.map(item => item.date),
            datasets: [{
                label: symbol,
                data: data.map(item => item.close),
                borderColor: getThemeColor('primary'),
                backgroundColor: getThemeColor('primaryTransparent'),
                borderWidth: 2,
                fill: false,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    labels: {
                        color: getThemeColor('text')
                    }
                },
                tooltip: {
                    backgroundColor: getThemeColor('surface'),
                    titleColor: getThemeColor('text'),
                    bodyColor: getThemeColor('text'),
                    borderColor: getThemeColor('border'),
                    borderWidth: 1
                }
            },
            scales: {
                x: {
                    ticks: { color: getThemeColor('text') },
                    grid: { color: getThemeColor('border') }
                },
                y: {
                    ticks: { 
                        color: getThemeColor('text'),
                        callback: function(value) {
                            return '$' + value.toFixed(2);
                        }
                    },
                    grid: { color: getThemeColor('border') }
                }
            }
        }
    };
    
    window.currentChart = new Chart(ctx, config);
    return window.currentChart;
}
```

#### Theme-Aware Chart Colors
```javascript
function getThemeColor(colorName) {
    const root = document.documentElement;
    const theme = root.getAttribute('data-theme') || 'light';
    
    const colors = {
        light: {
            primary: '#2563eb',
            primaryTransparent: 'rgba(37, 99, 235, 0.1)',
            text: '#1e293b',
            border: '#e2e8f0',
            surface: '#ffffff'
        },
        dark: {
            primary: '#3b82f6',
            primaryTransparent: 'rgba(59, 130, 246, 0.1)',
            text: '#f1f5f9',
            border: '#334155',
            surface: '#1e293b'
        }
    };
    
    return colors[theme][colorName];
}
```

## 🎯 Adding New Features

### 1. **Creating a New Dashboard**

#### Step 1: Create HTML File
```html
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Dashboard - StockCharts</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>New Dashboard</h1>
            <button class="theme-toggle" id="themeToggle" aria-label="Toggle theme">
                <span class="theme-icon">🌙</span>
            </button>
        </div>
        
        <div class="content">
            <!-- Dashboard content -->
        </div>
    </div>
    
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="utils.js"></script>
    <script src="script.js"></script>
    <script>
        // Dashboard-specific initialization
        document.addEventListener('DOMContentLoaded', function() {
            new ThemeManager();
            initializeNewDashboard();
        });
    </script>
</body>
</html>
```

#### Step 2: Add Dashboard Logic
```javascript
function initializeNewDashboard() {
    // Dashboard-specific initialization
    setupEventListeners();
    loadInitialData();
}

function setupEventListeners() {
    // Add event listeners for dashboard controls
    document.getElementById('newFeatureButton').addEventListener('click', handleNewFeature);
}

async function handleNewFeature() {
    try {
        showLoading();
        const data = await fetchNewData();
        renderNewVisualization(data);
    } catch (error) {
        showError('Failed to load new feature data');
    } finally {
        hideLoading();
    }
}
```

### 2. **Adding New Data Sources**

#### Create Data Source Module
```javascript
const NewDataSource = {
    name: 'New API',
    baseUrl: 'https://api.newprovider.com',
    
    async fetchData(symbol, timeRange) {
        const url = `${this.baseUrl}/data/${symbol}?range=${timeRange}`;
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${getApiKey()}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`New API error: ${response.status}`);
        }
        
        return await response.json();
    },
    
    normalizeData(response) {
        return {
            symbol: response.symbol,
            data: response.timeSeries.map(item => ({
                date: item.date,
                open: item.open,
                high: item.high,
                low: item.low,
                close: item.close,
                volume: item.volume
            }))
        };
    }
};
```

#### Integrate into Fallback Chain
```javascript
async function fetchWithNewSource(symbol, timeRange) {
    const sources = [
        () => fetchFromAlphaVantage(symbol, timeRange),
        () => NewDataSource.fetchData(symbol, timeRange), // Add here
        () => fetchFromYahoo(symbol, timeRange),
        () => getDemoData(symbol, timeRange)
    ];
    
    for (const source of sources) {
        try {
            const data = await source();
            if (validateData(data)) {
                return data;
            }
        } catch (error) {
            console.warn('Source failed:', error.message);
        }
    }
}
```

### 3. **Adding New Chart Types**

#### Candlestick Chart Example
```javascript
function createCandlestickChart(data, symbol) {
    const ctx = document.getElementById('candlestickChart').getContext('2d');
    
    const candlestickData = data.map(item => ({
        x: item.date,
        o: item.open,
        h: item.high,
        l: item.low,
        c: item.close
    }));
    
    const config = {
        type: 'candlestick',
        data: {
            datasets: [{
                label: symbol,
                data: candlestickData,
                borderColor: {
                    up: getThemeColor('success'),
                    down: getThemeColor('danger'),
                    unchanged: getThemeColor('text')
                },
                backgroundColor: {
                    up: getThemeColor('successTransparent'),
                    down: getThemeColor('dangerTransparent'),
                    unchanged: getThemeColor('textTransparent')
                }
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day'
                    }
                },
                y: {
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toFixed(2);
                        }
                    }
                }
            }
        }
    };
    
    return new Chart(ctx, config);
}
```

## 🎨 Styling Guidelines

### CSS Architecture
```css
/* Base styles */
.component {
    /* Layout properties */
    display: flex;
    flex-direction: column;
    
    /* Spacing using consistent scale */
    padding: var(--spacing-4);
    margin: var(--spacing-2);
    
    /* Theme-aware colors */
    background-color: var(--color-surface);
    color: var(--color-text);
    border: 1px solid var(--color-border);
    
    /* Consistent border radius */
    border-radius: var(--border-radius);
    
    /* Smooth transitions */
    transition: all 0.2s ease-in-out;
}

/* State modifiers */
.component:hover {
    background-color: var(--color-surface-hover);
    transform: translateY(-1px);
    box-shadow: var(--shadow-lg);
}

.component--loading {
    opacity: 0.6;
    pointer-events: none;
}

.component--error {
    border-color: var(--color-danger);
    background-color: var(--color-danger-light);
}
```

### Responsive Design Patterns
```css
/* Mobile first approach */
.dashboard-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--spacing-4);
    padding: var(--spacing-4);
}

/* Tablet */
@media (min-width: 768px) {
    .dashboard-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: var(--spacing-6);
        padding: var(--spacing-6);
    }
}

/* Desktop */
@media (min-width: 1024px) {
    .dashboard-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: var(--spacing-8);
        padding: var(--spacing-8);
    }
}

/* Large screens */
@media (min-width: 1440px) {
    .dashboard-grid {
        max-width: 1400px;
        margin: 0 auto;
    }
}
```

## 🧪 Testing Strategies

### Unit Testing Functions
```javascript
// Testing utility functions
function testThemeManager() {
    const themeManager = new ThemeManager();
    
    // Test initial theme
    console.assert(
        themeManager.currentTheme === 'light',
        'Default theme should be light'
    );
    
    // Test theme toggle
    themeManager.toggleTheme();
    console.assert(
        themeManager.currentTheme === 'dark',
        'Theme should toggle to dark'
    );
    
    // Test theme persistence
    const stored = localStorage.getItem('stockchart-theme');
    console.assert(
        stored === 'dark',
        'Theme should be stored in localStorage'
    );
}
```

### Integration Testing
```javascript
// Testing API integration
async function testApiIntegration() {
    try {
        const data = await fetchStockData('AAPL', '7d');
        
        console.assert(data.symbol === 'AAPL', 'Symbol should match');
        console.assert(Array.isArray(data.data), 'Data should be array');
        console.assert(data.data.length > 0, 'Data should not be empty');
        
        const firstPoint = data.data[0];
        console.assert(typeof firstPoint.close === 'number', 'Close should be number');
        console.assert(firstPoint.date, 'Date should exist');
        
        console.log('✅ API integration test passed');
    } catch (error) {
        console.error('❌ API integration test failed:', error);
    }
}
```

### Manual Testing Checklist
```
Dashboard Functionality:
□ All dashboards load without errors
□ Theme toggle works on all pages
□ Charts render correctly in both themes
□ Export functions work (PNG/CSV)
□ Responsive design works on mobile/tablet/desktop

API Integration:
□ Data loads with API key
□ Fallback works when API fails
□ Demo data loads when offline
□ Error messages are user-friendly

Performance:
□ Initial load under 3 seconds
□ Chart rendering under 1 second
□ Smooth animations and transitions
□ Memory usage remains stable
```

## 🚀 Deployment & Build Process

### Static Deployment
```bash
# Build for production (if using build tools)
npm run build

# Deploy to GitHub Pages
git add .
git commit -m "Update production build"
git push origin main

# Or deploy to Netlify/Vercel
# Simply connect your repository and deploy
```

### Performance Optimization
```javascript
// Lazy load Chart.js
async function loadChartJS() {
    if (window.Chart) return;
    
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.0.1/dist/chart.umd.js';
    
    return new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Debounce API calls
const debouncedFetch = debounce(fetchStockData, 300);

// Implement caching
const cache = new Map();
function getCachedData(key) {
    const item = cache.get(key);
    if (item && Date.now() - item.timestamp < 300000) { // 5 minutes
        return item.data;
    }
    return null;
}
```

## 🤝 Contributing Guidelines

### Code Style
- **ES6+**: Use modern JavaScript features
- **Consistent Naming**: camelCase for variables, PascalCase for classes
- **Comments**: Document complex functions and business logic
- **Error Handling**: Always handle potential errors gracefully

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/amazing-feature

# Make changes and commit
git add .
git commit -m "Add: Amazing new feature with tests"

# Push and create pull request
git push origin feature/amazing-feature
```

### Pull Request Template
```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested on Chrome/Firefox/Safari
- [ ] Mobile responsive testing
- [ ] API integration testing
- [ ] Theme switching testing

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console errors
```

---

For more specific technical details, refer to the [API Reference](./api-reference.md) and [Architecture Documentation](./architecture.md).
