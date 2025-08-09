# 🎨 Theme System Documentation

StockCharts features a comprehensive theme system that provides seamless dark/light mode switching with persistent preferences and automatic chart integration.

## 🌈 Theme Overview

### Available Themes
- **🌞 Light Theme**: Clean, professional light interface
- **🌙 Dark Theme**: Modern dark interface optimized for low-light environments
- **🔄 Auto-Detection**: Respects system preferences (future feature)

### Key Features
- ✅ **Persistent Settings**: Theme choice saved across sessions
- ✅ **Instant Switching**: No page reload required
- ✅ **Chart Integration**: Charts automatically adapt to theme changes
- ✅ **Accessibility**: High contrast ratios in both themes
- ✅ **Cross-Dashboard**: Consistent theming across all dashboards

---

## 🏗️ Technical Implementation

### CSS Custom Properties Architecture

#### Root Theme Variables
```css
:root[data-theme="light"] {
    /* Primary Colors */
    --color-primary: #2563eb;
    --color-primary-hover: #1d4ed8;
    --color-primary-transparent: rgba(37, 99, 235, 0.1);
    
    /* Background Colors */
    --color-background: #ffffff;
    --color-surface: #f8fafc;
    --color-surface-hover: #f1f5f9;
    
    /* Text Colors */
    --color-text: #1e293b;
    --color-text-secondary: #64748b;
    --color-text-muted: #94a3b8;
    
    /* Border Colors */
    --color-border: #e2e8f0;
    --color-border-hover: #cbd5e1;
    
    /* Status Colors */
    --color-success: #10b981;
    --color-success-light: rgba(16, 185, 129, 0.1);
    --color-danger: #ef4444;
    --color-danger-light: rgba(239, 68, 68, 0.1);
    --color-warning: #f59e0b;
    --color-warning-light: rgba(245, 158, 11, 0.1);
    
    /* Shadows */
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

:root[data-theme="dark"] {
    /* Primary Colors */
    --color-primary: #3b82f6;
    --color-primary-hover: #2563eb;
    --color-primary-transparent: rgba(59, 130, 246, 0.1);
    
    /* Background Colors */
    --color-background: #0f172a;
    --color-surface: #1e293b;
    --color-surface-hover: #334155;
    
    /* Text Colors */
    --color-text: #f1f5f9;
    --color-text-secondary: #cbd5e1;
    --color-text-muted: #94a3b8;
    
    /* Border Colors */
    --color-border: #334155;
    --color-border-hover: #475569;
    
    /* Status Colors */
    --color-success: #34d399;
    --color-success-light: rgba(52, 211, 153, 0.1);
    --color-danger: #f87171;
    --color-danger-light: rgba(248, 113, 113, 0.1);
    --color-warning: #fbbf24;
    --color-warning-light: rgba(251, 191, 36, 0.1);
    
    /* Shadows */
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.4);
    --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.4);
}
```

#### Spacing and Layout Variables
```css
:root {
    /* Spacing Scale */
    --spacing-1: 0.25rem;   /* 4px */
    --spacing-2: 0.5rem;    /* 8px */
    --spacing-3: 0.75rem;   /* 12px */
    --spacing-4: 1rem;      /* 16px */
    --spacing-5: 1.25rem;   /* 20px */
    --spacing-6: 1.5rem;    /* 24px */
    --spacing-8: 2rem;      /* 32px */
    --spacing-10: 2.5rem;   /* 40px */
    --spacing-12: 3rem;     /* 48px */
    --spacing-16: 4rem;     /* 64px */
    
    /* Border Radius */
    --border-radius: 0.5rem;        /* 8px */
    --border-radius-sm: 0.25rem;    /* 4px */
    --border-radius-lg: 0.75rem;    /* 12px */
    --border-radius-xl: 1rem;       /* 16px */
    
    /* Transitions */
    --transition-fast: 0.15s ease-in-out;
    --transition-normal: 0.2s ease-in-out;
    --transition-slow: 0.3s ease-in-out;
    
    /* Typography */
    --font-size-xs: 0.75rem;    /* 12px */
    --font-size-sm: 0.875rem;   /* 14px */
    --font-size-base: 1rem;     /* 16px */
    --font-size-lg: 1.125rem;   /* 18px */
    --font-size-xl: 1.25rem;    /* 20px */
    --font-size-2xl: 1.5rem;    /* 24px */
    --font-size-3xl: 1.875rem;  /* 30px */
}
```

### ThemeManager Class

#### Core Implementation
```javascript
class ThemeManager {
    constructor() {
        this.currentTheme = this.getStoredTheme() || this.getSystemTheme() || 'light';
        this.observers = [];
        this.themeToggle = null;
        this.init();
    }
    
    init() {
        // Wait for DOM if needed
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupTheme());
        } else {
            this.setupTheme();
        }
    }
    
    setupTheme() {
        // Find theme toggle button
        this.themeToggle = document.getElementById('themeToggle');
        
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }
        
        // Apply current theme
        this.applyTheme(this.currentTheme);
        this.updateToggleButton();
        
        // Listen for system theme changes
        this.watchSystemTheme();
    }
    
    // Get stored theme preference
    getStoredTheme() {
        try {
            return localStorage.getItem('stockchart-theme');
        } catch (e) {
            console.warn('Could not access localStorage for theme preference');
            return null;
        }
    }
    
    // Get system theme preference
    getSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }
    
    // Store theme preference
    storeTheme(theme) {
        try {
            localStorage.setItem('stockchart-theme', theme);
        } catch (e) {
            console.warn('Could not save theme preference to localStorage');
        }
    }
    
    // Apply theme to document
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        this.storeTheme(theme);
        
        // Notify observers (charts, components, etc.)
        this.notifyObservers(theme);
    }
    
    // Toggle between light and dark themes
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
        this.updateToggleButton();
    }
    
    // Update toggle button appearance
    updateToggleButton() {
        if (!this.themeToggle) return;
        
        const icon = this.themeToggle.querySelector('.theme-icon');
        if (icon) {
            icon.textContent = this.currentTheme === 'light' ? '🌙' : '☀️';
        }
        
        this.themeToggle.setAttribute('aria-label', 
            `Switch to ${this.currentTheme === 'light' ? 'dark' : 'light'} theme`
        );
    }
    
    // Observer pattern for theme changes
    subscribe(callback) {
        this.observers.push(callback);
    }
    
    unsubscribe(callback) {
        this.observers = this.observers.filter(obs => obs !== callback);
    }
    
    notifyObservers(theme) {
        this.observers.forEach(callback => {
            try {
                callback(theme);
            } catch (error) {
                console.warn('Theme observer error:', error);
            }
        });
    }
    
    // Watch for system theme changes
    watchSystemTheme() {
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
                // Only auto-switch if user hasn't manually set a preference
                if (!this.getStoredTheme()) {
                    this.applyTheme(e.matches ? 'dark' : 'light');
                    this.updateToggleButton();
                }
            });
        }
    }
}
```

---

## 📊 Chart Theme Integration

### Chart.js Theme Configuration

#### Theme-Aware Chart Colors
```javascript
function getChartThemeConfig(theme = null) {
    const currentTheme = theme || document.documentElement.getAttribute('data-theme') || 'light';
    
    const themes = {
        light: {
            backgroundColor: '#ffffff',
            textColor: '#1e293b',
            gridColor: '#e2e8f0',
            primaryColor: '#2563eb',
            primaryTransparent: 'rgba(37, 99, 235, 0.1)',
            successColor: '#10b981',
            dangerColor: '#ef4444',
            surfaceColor: '#f8fafc'
        },
        dark: {
            backgroundColor: '#0f172a',
            textColor: '#f1f5f9',
            gridColor: '#334155',
            primaryColor: '#3b82f6',
            primaryTransparent: 'rgba(59, 130, 246, 0.1)',
            successColor: '#34d399',
            dangerColor: '#f87171',
            surfaceColor: '#1e293b'
        }
    };
    
    return themes[currentTheme];
}
```

#### Dynamic Chart Updates
```javascript
function updateChartTheme(chart, theme) {
    if (!chart) return;
    
    const themeConfig = getChartThemeConfig(theme);
    
    // Update chart options
    chart.options.plugins.legend.labels.color = themeConfig.textColor;
    chart.options.plugins.tooltip.backgroundColor = themeConfig.surfaceColor;
    chart.options.plugins.tooltip.titleColor = themeConfig.textColor;
    chart.options.plugins.tooltip.bodyColor = themeConfig.textColor;
    chart.options.plugins.tooltip.borderColor = themeConfig.gridColor;
    
    // Update scales
    chart.options.scales.x.ticks.color = themeConfig.textColor;
    chart.options.scales.x.grid.color = themeConfig.gridColor;
    chart.options.scales.y.ticks.color = themeConfig.textColor;
    chart.options.scales.y.grid.color = themeConfig.gridColor;
    
    // Update dataset colors
    chart.data.datasets.forEach(dataset => {
        if (dataset.borderColor === getChartThemeConfig('light').primaryColor ||
            dataset.borderColor === getChartThemeConfig('dark').primaryColor) {
            dataset.borderColor = themeConfig.primaryColor;
            dataset.backgroundColor = themeConfig.primaryTransparent;
        }
    });
    
    // Refresh chart
    chart.update('none'); // No animation for theme changes
}
```

#### Chart Initialization with Theme
```javascript
function createThemedChart(ctx, data, symbol) {
    const themeConfig = getChartThemeConfig();
    
    const config = {
        type: 'line',
        data: {
            labels: data.map(item => item.date),
            datasets: [{
                label: symbol,
                data: data.map(item => item.close),
                borderColor: themeConfig.primaryColor,
                backgroundColor: themeConfig.primaryTransparent,
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
                        color: themeConfig.textColor,
                        font: {
                            family: 'Inter, sans-serif',
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: themeConfig.surfaceColor,
                    titleColor: themeConfig.textColor,
                    bodyColor: themeConfig.textColor,
                    borderColor: themeConfig.gridColor,
                    borderWidth: 1,
                    cornerRadius: 8,
                    padding: 12
                }
            },
            scales: {
                x: {
                    ticks: { 
                        color: themeConfig.textColor,
                        font: {
                            size: 11
                        }
                    },
                    grid: { 
                        color: themeConfig.gridColor,
                        lineWidth: 1
                    }
                },
                y: {
                    ticks: { 
                        color: themeConfig.textColor,
                        font: {
                            size: 11
                        },
                        callback: function(value) {
                            return '$' + value.toFixed(2);
                        }
                    },
                    grid: { 
                        color: themeConfig.gridColor,
                        lineWidth: 1
                    }
                }
            }
        }
    };
    
    const chart = new Chart(ctx, config);
    
    // Subscribe to theme changes
    if (window.themeManager) {
        window.themeManager.subscribe((newTheme) => {
            updateChartTheme(chart, newTheme);
        });
    }
    
    return chart;
}
```

---

## 🎨 Component Theming

### Button Components
```css
.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-3) var(--spacing-6);
    font-size: var(--font-size-sm);
    font-weight: 500;
    border-radius: var(--border-radius);
    border: 1px solid transparent;
    transition: all var(--transition-normal);
    cursor: pointer;
    text-decoration: none;
}

.btn-primary {
    background-color: var(--color-primary);
    color: white;
    border-color: var(--color-primary);
}

.btn-primary:hover {
    background-color: var(--color-primary-hover);
    border-color: var(--color-primary-hover);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
}

.btn-secondary {
    background-color: var(--color-surface);
    color: var(--color-text);
    border-color: var(--color-border);
}

.btn-secondary:hover {
    background-color: var(--color-surface-hover);
    border-color: var(--color-border-hover);
}
```

### Card Components
```css
.card {
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-6);
    box-shadow: var(--shadow-sm);
    transition: all var(--transition-normal);
}

.card:hover {
    box-shadow: var(--shadow-lg);
    transform: translateY(-2px);
    border-color: var(--color-border-hover);
}

.card-header {
    color: var(--color-text);
    font-size: var(--font-size-xl);
    font-weight: 600;
    margin-bottom: var(--spacing-4);
}

.card-content {
    color: var(--color-text-secondary);
    line-height: 1.6;
}
```

### Form Components
```css
.form-group {
    margin-bottom: var(--spacing-4);
}

.form-label {
    display: block;
    color: var(--color-text);
    font-size: var(--font-size-sm);
    font-weight: 500;
    margin-bottom: var(--spacing-2);
}

.form-input {
    display: block;
    width: 100%;
    padding: var(--spacing-3);
    font-size: var(--font-size-base);
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius);
    background-color: var(--color-background);
    color: var(--color-text);
    transition: all var(--transition-normal);
}

.form-input:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px var(--color-primary-transparent);
}

.form-input::placeholder {
    color: var(--color-text-muted);
}
```

---

## 🌐 Cross-Dashboard Theme Consistency

### Theme Synchronization
```javascript
// Initialize theme manager on all pages
document.addEventListener('DOMContentLoaded', function() {
    // Create global theme manager instance
    window.themeManager = new ThemeManager();
    
    // Initialize page-specific components
    initializeDashboard();
});

function initializeDashboard() {
    // Subscribe to theme changes for any charts
    if (window.themeManager && window.currentChart) {
        window.themeManager.subscribe((theme) => {
            updateChartTheme(window.currentChart, theme);
        });
    }
}
```

### Theme Toggle Component
```html
<!-- Standard theme toggle for all dashboards -->
<button class="theme-toggle" id="themeToggle" aria-label="Toggle theme">
    <span class="theme-icon">🌙</span>
</button>
```

```css
.theme-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius);
    background-color: var(--color-surface);
    color: var(--color-text);
    cursor: pointer;
    transition: all var(--transition-normal);
}

.theme-toggle:hover {
    background-color: var(--color-surface-hover);
    border-color: var(--color-border-hover);
    transform: scale(1.05);
}

.theme-icon {
    font-size: 18px;
    transition: transform var(--transition-normal);
}

.theme-toggle:hover .theme-icon {
    transform: rotate(180deg);
}
```

---

## 🔧 Customization & Extension

### Adding Custom Themes
```javascript
// Extend ThemeManager for custom themes
class ExtendedThemeManager extends ThemeManager {
    constructor() {
        super();
        this.customThemes = {
            'blue': {
                primary: '#1e40af',
                background: '#eff6ff',
                surface: '#dbeafe',
                text: '#1e3a8a'
            },
            'green': {
                primary: '#059669',
                background: '#ecfdf5',
                surface: '#d1fae5',
                text: '#064e3b'
            }
        };
    }
    
    applyCustomTheme(themeName) {
        if (this.customThemes[themeName]) {
            const theme = this.customThemes[themeName];
            const root = document.documentElement;
            
            Object.entries(theme).forEach(([property, value]) => {
                root.style.setProperty(`--color-${property}`, value);
            });
        }
    }
}
```

### Theme Presets
```javascript
const themePresets = {
    'high-contrast': {
        light: {
            primary: '#000000',
            background: '#ffffff',
            text: '#000000',
            border: '#000000'
        },
        dark: {
            primary: '#ffffff',
            background: '#000000',
            text: '#ffffff',
            border: '#ffffff'
        }
    },
    'colorful': {
        light: {
            primary: '#8b5cf6',
            success: '#10b981',
            danger: '#ef4444',
            warning: '#f59e0b'
        },
        dark: {
            primary: '#a78bfa',
            success: '#34d399',
            danger: '#f87171',
            warning: '#fbbf24'
        }
    }
};
```

---

## ♿ Accessibility Considerations

### Color Contrast Ratios
- **Light Theme**: Minimum 4.5:1 contrast ratio (WCAG AA)
- **Dark Theme**: Enhanced contrast for better readability
- **Focus Indicators**: High-contrast focus rings
- **State Colors**: Accessible color combinations

### Screen Reader Support
```html
<!-- Theme toggle with proper ARIA -->
<button 
    class="theme-toggle" 
    id="themeToggle" 
    aria-label="Toggle between light and dark theme"
    aria-pressed="false"
    role="switch"
>
    <span class="theme-icon" aria-hidden="true">🌙</span>
    <span class="sr-only">Current theme: light</span>
</button>
```

### Reduced Motion Support
```css
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
    
    .theme-toggle:hover .theme-icon {
        transform: none;
    }
}
```

---

For implementation details, see the [Development Guide](./development.md). For chart-specific theming, refer to the [Chart Configuration Guide](./chart-config.md).
