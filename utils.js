// Theme management functionality
class ThemeManager {
    constructor() {
        this.currentTheme = this.getStoredTheme() || 'light';
        this.themeToggle = null;
        this.init();
    }

    init() {
        // Wait for DOM to be loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupTheme());
        } else {
            this.setupTheme();
        }
    }

    setupTheme() {
        this.themeToggle = document.getElementById('themeToggle');
        
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Apply the current theme
        this.applyTheme(this.currentTheme);
        this.updateToggleButton();
    }

    getStoredTheme() {
        try {
            return localStorage.getItem('stockchart-theme');
        } catch (e) {
            console.warn('Could not access localStorage for theme preference');
            return null;
        }
    }

    storeTheme(theme) {
        try {
            localStorage.setItem('stockchart-theme', theme);
        } catch (e) {
            console.warn('Could not save theme preference to localStorage');
        }
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        this.storeTheme(theme);
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
        this.updateToggleButton();
        
        // Trigger chart update if chart exists to apply new colors
        this.updateChartTheme();
    }

    updateToggleButton() {
        if (this.themeToggle) {
            const icon = this.themeToggle.querySelector('.theme-icon');
            if (icon) {
                icon.textContent = this.currentTheme === 'light' ? '🌙' : '☀️';
            }
            this.themeToggle.setAttribute('aria-label', 
                `Switch to ${this.currentTheme === 'light' ? 'dark' : 'light'} mode`);
        }
    }

    updateChartTheme() {
        // If there's a global chart variable, update its colors
        if (typeof chart !== 'undefined' && chart && chart.data) {
            const isDark = this.currentTheme === 'dark';
            
            // Update chart options for theme
            if (chart.options && chart.options.plugins && chart.options.plugins.legend) {
                chart.options.plugins.legend.labels.color = isDark ? '#f7fafc' : '#2d3748';
            }
            
            if (chart.options && chart.options.scales) {
                const textColor = isDark ? '#f7fafc' : '#2d3748';
                const gridColor = isDark ? '#4a5568' : '#e2e8f0';
                
                if (chart.options.scales.x) {
                    chart.options.scales.x.ticks.color = textColor;
                    chart.options.scales.x.grid.color = gridColor;
                }
                
                if (chart.options.scales.y) {
                    chart.options.scales.y.ticks.color = textColor;
                    chart.options.scales.y.grid.color = gridColor;
                }
            }
            
            chart.update('none'); // Update without animation
        }
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    isDarkMode() {
        return this.currentTheme === 'dark';
    }
}

// Initialize theme manager
const themeManager = new ThemeManager();

// Export for use in other scripts
window.themeManager = themeManager;

// Stock symbol validation utility
function isValidStockSymbol(symbol) {
    if (!symbol || typeof symbol !== 'string') {
        return false;
    }
    
    // Remove whitespace and convert to uppercase
    const cleanSymbol = symbol.trim().toUpperCase();
    
    // Check if it's between 1-5 characters and contains only letters
    const symbolRegex = /^[A-Z]{1,5}$/;
    return symbolRegex.test(cleanSymbol);
}

// Format error messages for better display
function formatErrorMessage(error) {
    if (!error) return 'An unknown error occurred';
    
    const message = error.message || error.toString();
    
    // Common error patterns and their user-friendly messages
    const errorMappings = {
        'Failed to fetch': 'Network connection error. Please check your internet connection.',
        'CORS': 'Unable to access stock data due to browser security restrictions.',
        'Rate limit': 'Too many requests. Please wait a moment and try again.',
        'API key': 'Invalid API key. Please check your Alpha Vantage API key.',
        'not found': 'Stock symbol not found. Please verify the symbol is correct.',
        'timeout': 'Request timed out. Please try again.',
        'Invalid response': 'Received invalid data from the stock service.'
    };
    
    // Check if any known error pattern matches
    for (const [pattern, userMessage] of Object.entries(errorMappings)) {
        if (message.toLowerCase().includes(pattern.toLowerCase())) {
            return userMessage;
        }
    }
    
    // Return original message if no pattern matches
    return message;
}

// Clear stock info utility
function clearStockInfo() {
    const elements = ['companyName', 'currentPrice', 'priceChange', 'dayHigh', 'dayLow'];
    elements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = '-';
            if (id === 'priceChange') {
                element.className = 'info-value price-change';
            }
        }
    });
}

// Export functions for global use
window.isValidStockSymbol = isValidStockSymbol;
window.formatErrorMessage = formatErrorMessage;
window.clearStockInfo = clearStockInfo;
