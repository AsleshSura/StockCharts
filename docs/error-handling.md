# 🚨 Error Handling & Troubleshooting Guide

This comprehensive guide covers error handling strategies, common issues, debugging techniques, and solutions for the StockCharts platform.

## 🎯 Error Handling Overview

StockCharts implements a **multi-layered error handling strategy** to ensure graceful degradation and user-friendly error messages:

1. **API Fallback Strategy**: Multiple data sources with automatic failover
2. **User-Friendly Messages**: Clear, actionable error messages
3. **Graceful Degradation**: App continues functioning with demo data
4. **Error Logging**: Comprehensive error tracking and reporting
5. **Recovery Mechanisms**: Automatic retry and manual recovery options

---

## 🔄 API Error Handling

### Multi-Source Fallback Implementation

```javascript
class APIErrorHandler {
    constructor() {
        this.sources = [
            { name: 'Alpha Vantage', handler: this.fetchFromAlphaVantage },
            { name: 'Yahoo Finance', handler: this.fetchFromYahoo },
            { name: 'Demo Data', handler: this.getDemoData }
        ];
        this.retryConfig = {
            maxRetries: 3,
            baseDelay: 1000, // 1 second
            maxDelay: 10000  // 10 seconds
        };
    }
    
    async fetchWithFallback(symbol, timeRange) {
        const errors = [];
        
        for (const source of this.sources) {
            try {
                const data = await this.fetchWithRetry(
                    source.handler.bind(this), 
                    symbol, 
                    timeRange
                );
                
                if (this.validateData(data)) {
                    return {
                        success: true,
                        data,
                        source: source.name,
                        errors
                    };
                }
            } catch (error) {
                const errorInfo = {
                    source: source.name,
                    error: error.message,
                    timestamp: new Date().toISOString()
                };
                errors.push(errorInfo);
                console.warn(`${source.name} failed:`, error);
            }
        }
        
        // All sources failed
        throw new Error(`All data sources failed: ${errors.map(e => e.error).join(', ')}`);
    }
    
    async fetchWithRetry(fetchFunction, ...args) {
        let lastError;
        
        for (let attempt = 1; attempt <= this.retryConfig.maxRetries; attempt++) {
            try {
                return await fetchFunction(...args);
            } catch (error) {
                lastError = error;
                
                // Don't retry on certain error types
                if (this.isNonRetryableError(error)) {
                    throw error;
                }
                
                // Calculate delay with exponential backoff
                const delay = Math.min(
                    this.retryConfig.baseDelay * Math.pow(2, attempt - 1),
                    this.retryConfig.maxDelay
                );
                
                console.warn(`Attempt ${attempt} failed, retrying in ${delay}ms:`, error.message);
                await this.sleep(delay);
            }
        }
        
        throw lastError;
    }
    
    isNonRetryableError(error) {
        const nonRetryableErrors = [
            'Invalid API key',
            'Symbol not found',
            'Malformed request',
            'Invalid time range'
        ];
        
        return nonRetryableErrors.some(msg => 
            error.message.toLowerCase().includes(msg.toLowerCase())
        );
    }
    
    validateData(data) {
        return data && 
               data.data && 
               Array.isArray(data.data) && 
               data.data.length > 0 &&
               data.data.every(item => 
                   item.date && 
                   typeof item.close === 'number' && 
                   !isNaN(item.close)
               );
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
```

### Specific API Error Handling

#### Alpha Vantage Error Patterns
```javascript
function handleAlphaVantageErrors(response) {
    // Rate limiting
    if (response['Note']) {
        throw new APIError('RATE_LIMITED', 'API rate limit exceeded. Please wait a minute before trying again.');
    }
    
    // Invalid API key
    if (response['Error Message'] && response['Error Message'].includes('Invalid API call')) {
        throw new APIError('INVALID_API_KEY', 'Invalid API key. Please check your Alpha Vantage API key.');
    }
    
    // Symbol not found
    if (response['Error Message'] && response['Error Message'].includes('Invalid API call')) {
        throw new APIError('SYMBOL_NOT_FOUND', 'Stock symbol not found. Please check the symbol and try again.');
    }
    
    // Empty response
    if (!response['Time Series (Daily)'] && !response['Time Series FX (Daily)']) {
        throw new APIError('NO_DATA', 'No data available for this symbol and time range.');
    }
    
    return response;
}
```

#### Yahoo Finance Error Patterns
```javascript
function handleYahooFinanceErrors(response) {
    if (!response.chart || !response.chart.result || response.chart.result.length === 0) {
        throw new APIError('NO_DATA', 'No data available from Yahoo Finance.');
    }
    
    const result = response.chart.result[0];
    
    // Check for error in response
    if (response.chart.error) {
        throw new APIError('YAHOO_ERROR', response.chart.error.description || 'Yahoo Finance API error');
    }
    
    // Validate data structure
    if (!result.timestamp || !result.indicators || !result.indicators.quote) {
        throw new APIError('INVALID_DATA', 'Invalid data structure from Yahoo Finance.');
    }
    
    return response;
}
```

### Custom Error Classes
```javascript
class APIError extends Error {
    constructor(code, message, details = {}) {
        super(message);
        this.name = 'APIError';
        this.code = code;
        this.details = details;
        this.timestamp = new Date().toISOString();
    }
    
    toJSON() {
        return {
            name: this.name,
            code: this.code,
            message: this.message,
            details: this.details,
            timestamp: this.timestamp
        };
    }
}

class ValidationError extends Error {
    constructor(field, value, message) {
        super(message);
        this.name = 'ValidationError';
        this.field = field;
        this.value = value;
    }
}

class ChartError extends Error {
    constructor(message, chartType = null) {
        super(message);
        this.name = 'ChartError';
        this.chartType = chartType;
    }
}
```

---

## 🎨 User Interface Error Handling

### Error Display Components

#### Toast Notifications
```javascript
class ToastManager {
    constructor() {
        this.container = this.createContainer();
        this.toasts = new Map();
    }
    
    createContainer() {
        const container = document.createElement('div');
        container.className = 'toast-container';
        container.innerHTML = `
            <style>
                .toast-container {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 10000;
                    pointer-events: none;
                }
                
                .toast {
                    background: var(--color-surface);
                    border: 1px solid var(--color-border);
                    border-radius: var(--border-radius);
                    padding: var(--spacing-4);
                    margin-bottom: var(--spacing-2);
                    box-shadow: var(--shadow-lg);
                    pointer-events: auto;
                    transform: translateX(100%);
                    transition: transform 0.3s ease-in-out;
                    max-width: 400px;
                }
                
                .toast.show {
                    transform: translateX(0);
                }
                
                .toast-error {
                    border-left: 4px solid var(--color-danger);
                }
                
                .toast-warning {
                    border-left: 4px solid var(--color-warning);
                }
                
                .toast-success {
                    border-left: 4px solid var(--color-success);
                }
                
                .toast-info {
                    border-left: 4px solid var(--color-primary);
                }
            </style>
        `;
        
        document.body.appendChild(container);
        return container;
    }
    
    show(message, type = 'info', duration = 5000) {
        const id = Date.now().toString();
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <div class="toast-message">${message}</div>
                <button class="toast-close" onclick="toastManager.hide('${id}')">&times;</button>
            </div>
        `;
        
        this.container.appendChild(toast);
        this.toasts.set(id, toast);
        
        // Trigger animation
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });
        
        // Auto-hide after duration
        if (duration > 0) {
            setTimeout(() => this.hide(id), duration);
        }
        
        return id;
    }
    
    hide(id) {
        const toast = this.toasts.get(id);
        if (!toast) return;
        
        toast.classList.remove('show');
        
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
            this.toasts.delete(id);
        }, 300);
    }
    
    error(message, duration = 8000) {
        return this.show(message, 'error', duration);
    }
    
    warning(message, duration = 6000) {
        return this.show(message, 'warning', duration);
    }
    
    success(message, duration = 4000) {
        return this.show(message, 'success', duration);
    }
    
    info(message, duration = 5000) {
        return this.show(message, 'info', duration);
    }
}

// Global instance
const toastManager = new ToastManager();
```

#### Error States for Components
```javascript
// Loading states with error handling
function showLoadingState(element, message = 'Loading...') {
    element.classList.add('loading');
    element.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
            <span>${message}</span>
        </div>
    `;
}

function showErrorState(element, error, retryCallback = null) {
    element.classList.remove('loading');
    element.classList.add('error');
    
    const retryButton = retryCallback ? 
        `<button class="btn btn-primary" onclick="(${retryCallback.toString()})()">Try Again</button>` : '';
    
    element.innerHTML = `
        <div class="error-state">
            <div class="error-icon">⚠️</div>
            <h3>Something went wrong</h3>
            <p>${getErrorMessage(error)}</p>
            ${retryButton}
        </div>
    `;
}

function getErrorMessage(error) {
    if (error instanceof APIError) {
        switch (error.code) {
            case 'RATE_LIMITED':
                return 'Too many requests. Please wait a moment and try again.';
            case 'INVALID_API_KEY':
                return 'Invalid API key. Please check your Alpha Vantage API key.';
            case 'SYMBOL_NOT_FOUND':
                return 'Stock symbol not found. Please check the symbol and try again.';
            case 'NO_DATA':
                return 'No data available for this symbol. Using demo data instead.';
            default:
                return error.message;
        }
    }
    
    if (error.name === 'NetworkError') {
        return 'Network connection error. Please check your internet connection.';
    }
    
    return error.message || 'An unexpected error occurred.';
}
```

---

## 🔍 Common Issues & Solutions

### 1. **API-Related Issues**

#### Issue: API Rate Limiting
```
Symptoms: "Rate limit exceeded" messages
Root Cause: Too many API calls in short time period

Solutions:
✅ Implement request debouncing
✅ Add API call caching
✅ Show rate limit warnings to users
✅ Use demo data during rate limits
```

```javascript
// Rate limiting solution
class RateLimitManager {
    constructor(maxRequests = 5, timeWindow = 60000) { // 5 requests per minute
        this.maxRequests = maxRequests;
        this.timeWindow = timeWindow;
        this.requests = [];
    }
    
    canMakeRequest() {
        const now = Date.now();
        // Remove old requests outside time window
        this.requests = this.requests.filter(time => now - time < this.timeWindow);
        
        return this.requests.length < this.maxRequests;
    }
    
    recordRequest() {
        this.requests.push(Date.now());
    }
    
    getTimeUntilNextRequest() {
        if (this.requests.length < this.maxRequests) return 0;
        
        const oldestRequest = Math.min(...this.requests);
        return this.timeWindow - (Date.now() - oldestRequest);
    }
}

const rateLimiter = new RateLimitManager();

async function fetchWithRateLimit(fetchFunction, ...args) {
    if (!rateLimiter.canMakeRequest()) {
        const waitTime = rateLimiter.getTimeUntilNextRequest();
        toastManager.warning(`Rate limit reached. Please wait ${Math.ceil(waitTime / 1000)} seconds.`);
        throw new APIError('RATE_LIMITED', 'API rate limit exceeded');
    }
    
    rateLimiter.recordRequest();
    return await fetchFunction(...args);
}
```

#### Issue: CORS Errors
```
Symptoms: "CORS policy" errors in console
Root Cause: Browser blocking cross-origin requests

Solutions:
✅ Use CORS proxy for Yahoo Finance
✅ Implement proper fallback strategies
✅ Handle CORS errors gracefully
```

```javascript
// CORS error handling
async function fetchWithCORSFallback(url) {
    try {
        // Try direct request first
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        if (error.message.includes('CORS')) {
            console.warn('CORS error, trying proxy...', error);
            // Try with CORS proxy
            const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
            const response = await fetch(proxyUrl);
            return await response.json();
        }
        throw error;
    }
}
```

### 2. **Chart Rendering Issues**

#### Issue: Charts Not Displaying
```
Symptoms: Empty chart area or console errors
Root Causes: 
- Chart.js not loaded
- Invalid data format
- Canvas context issues

Solutions:
✅ Ensure Chart.js is loaded before creating charts
✅ Validate data before chart creation
✅ Handle canvas initialization errors
```

```javascript
// Chart initialization with error handling
async function createChartSafely(canvasId, data, symbol) {
    try {
        // Ensure Chart.js is loaded
        if (typeof Chart === 'undefined') {
            await loadChartJS();
        }
        
        // Validate canvas element
        const canvas = document.getElementById(canvasId);
        if (!canvas) {
            throw new ChartError(`Canvas element '${canvasId}' not found`);
        }
        
        // Validate data
        if (!validateChartData(data)) {
            throw new ChartError('Invalid chart data format');
        }
        
        // Destroy existing chart
        destroyExistingChart();
        
        // Create new chart
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new ChartError('Unable to get canvas context');
        }
        
        const chart = new Chart(ctx, createChartConfig(data, symbol));
        window.currentChart = chart;
        
        return chart;
        
    } catch (error) {
        console.error('Chart creation failed:', error);
        showChartError(canvasId, error);
        throw error;
    }
}

function validateChartData(data) {
    return data && 
           Array.isArray(data) && 
           data.length > 0 &&
           data.every(item => 
               item.date && 
               typeof item.close === 'number' && 
               !isNaN(item.close)
           );
}

function showChartError(canvasId, error) {
    const canvas = document.getElementById(canvasId);
    if (canvas) {
        const container = canvas.parentElement;
        container.innerHTML = `
            <div class="chart-error">
                <div class="error-icon">📊❌</div>
                <h3>Chart Error</h3>
                <p>${getErrorMessage(error)}</p>
                <button class="btn btn-primary" onclick="location.reload()">Refresh Page</button>
            </div>
        `;
    }
}
```

### 3. **Theme System Issues**

#### Issue: Theme Not Persisting
```
Symptoms: Theme resets to default on page reload
Root Cause: LocalStorage access issues

Solutions:
✅ Check LocalStorage availability
✅ Handle storage exceptions
✅ Provide fallback theme detection
```

```javascript
// Theme persistence with error handling
class RobustThemeManager extends ThemeManager {
    getStoredTheme() {
        try {
            if (typeof Storage === 'undefined') {
                console.warn('LocalStorage not available');
                return null;
            }
            
            return localStorage.getItem('stockchart-theme');
        } catch (error) {
            console.warn('Could not access localStorage:', error);
            return null;
        }
    }
    
    storeTheme(theme) {
        try {
            if (typeof Storage !== 'undefined') {
                localStorage.setItem('stockchart-theme', theme);
            }
        } catch (error) {
            console.warn('Could not save theme to localStorage:', error);
            // Theme will work for current session only
        }
    }
    
    getSystemTheme() {
        try {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                return 'dark';
            }
        } catch (error) {
            console.warn('Could not detect system theme:', error);
        }
        return 'light';
    }
}
```

### 4. **Export Functionality Issues**

#### Issue: Export Not Working
```
Symptoms: No download triggered or corrupted files
Root Causes:
- Browser security restrictions
- Canvas not ready
- Data formatting issues

Solutions:
✅ Check browser download permissions
✅ Ensure canvas is fully rendered
✅ Validate data before export
```

```javascript
// Robust export functionality
async function exportChartSafely() {
    try {
        // Check if chart exists
        if (!window.currentChart) {
            throw new Error('No chart available to export');
        }
        
        // Ensure chart is fully rendered
        await waitForChartRender();
        
        // Generate image
        const dataURL = window.currentChart.toBase64Image('image/png', 1.0);
        
        if (!dataURL || dataURL === 'data:,') {
            throw new Error('Failed to generate chart image');
        }
        
        // Create download
        const link = document.createElement('a');
        link.download = `${currentSymbol}_chart_${getCurrentDate()}.png`;
        link.href = dataURL;
        
        // Check if download is supported
        if (typeof link.download === 'undefined') {
            // Fallback: open in new window
            window.open(dataURL, '_blank');
            toastManager.info('Chart opened in new window. Right-click to save.');
        } else {
            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toastManager.success('Chart exported successfully');
        }
        
    } catch (error) {
        console.error('Export failed:', error);
        toastManager.error(`Export failed: ${error.message}`);
    }
}

function waitForChartRender() {
    return new Promise((resolve) => {
        if (window.currentChart) {
            // Wait for next animation frame to ensure chart is rendered
            requestAnimationFrame(() => {
                setTimeout(resolve, 100); // Small delay to ensure completion
            });
        } else {
            resolve();
        }
    });
}
```

---

## 🔧 Debug Tools & Logging

### Debug Console
```javascript
class DebugConsole {
    constructor() {
        this.enabled = localStorage.getItem('stockcharts-debug') === 'true';
        this.logs = [];
        this.maxLogs = 1000;
    }
    
    enable() {
        this.enabled = true;
        localStorage.setItem('stockcharts-debug', 'true');
        console.log('🔧 StockCharts debug mode enabled');
    }
    
    disable() {
        this.enabled = false;
        localStorage.removeItem('stockcharts-debug');
        console.log('🔧 StockCharts debug mode disabled');
    }
    
    log(level, category, message, data = null) {
        if (!this.enabled) return;
        
        const logEntry = {
            timestamp: new Date().toISOString(),
            level,
            category,
            message,
            data
        };
        
        this.logs.push(logEntry);
        
        // Keep only recent logs
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }
        
        // Console output with styling
        const style = this.getLogStyle(level);
        console.log(`%c[${category}] ${message}`, style, data || '');
    }
    
    getLogStyle(level) {
        const styles = {
            error: 'color: #ef4444; font-weight: bold;',
            warn: 'color: #f59e0b; font-weight: bold;',
            info: 'color: #3b82f6;',
            debug: 'color: #6b7280;'
        };
        return styles[level] || styles.debug;
    }
    
    api(message, data) {
        this.log('info', 'API', message, data);
    }
    
    chart(message, data) {
        this.log('info', 'CHART', message, data);
    }
    
    theme(message, data) {
        this.log('info', 'THEME', message, data);
    }
    
    error(category, message, error) {
        this.log('error', category, message, error);
    }
    
    exportLogs() {
        const blob = new Blob([JSON.stringify(this.logs, null, 2)], {
            type: 'application/json'
        });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `stockcharts-debug-${getCurrentDate()}.json`;
        link.click();
    }
}

// Global debug instance
const debug = new DebugConsole();

// Enable debug mode for development
if (window.location.hostname === 'localhost' || window.location.search.includes('debug=true')) {
    debug.enable();
}
```

### Performance Monitoring
```javascript
// Performance debugging
function measurePerformance(name, fn) {
    return async function(...args) {
        const start = performance.now();
        debug.log('debug', 'PERF', `Starting ${name}`);
        
        try {
            const result = await fn.apply(this, args);
            const end = performance.now();
            debug.log('info', 'PERF', `${name} completed in ${(end - start).toFixed(2)}ms`);
            return result;
        } catch (error) {
            const end = performance.now();
            debug.error('PERF', `${name} failed after ${(end - start).toFixed(2)}ms`, error);
            throw error;
        }
    };
}

// Wrap functions for performance monitoring
const measuredFetchStockData = measurePerformance('fetchStockData', fetchStockData);
const measuredCreateChart = measurePerformance('createChart', createChart);
```

---

## 📞 User Support & Reporting

### Error Reporting System
```javascript
class ErrorReporter {
    constructor() {
        this.endpoint = 'https://api.stockcharts.com/errors'; // Example endpoint
        this.enableAutoReporting = false; // Set to true in production
    }
    
    async reportError(error, context = {}) {
        try {
            const report = {
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                url: window.location.href,
                error: {
                    name: error.name,
                    message: error.message,
                    stack: error.stack
                },
                context,
                sessionId: this.getSessionId(),
                version: '2.0' // App version
            };
            
            if (this.enableAutoReporting) {
                await fetch(this.endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(report)
                });
            }
            
            console.log('Error report generated:', report);
            return report;
            
        } catch (reportingError) {
            console.error('Failed to report error:', reportingError);
        }
    }
    
    getSessionId() {
        let sessionId = sessionStorage.getItem('stockcharts-session-id');
        if (!sessionId) {
            sessionId = 'session-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('stockcharts-session-id', sessionId);
        }
        return sessionId;
    }
}

const errorReporter = new ErrorReporter();

// Global error handler
window.addEventListener('error', (event) => {
    errorReporter.reportError(event.error, {
        type: 'uncaught-exception',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
    });
});

// Promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
    errorReporter.reportError(new Error(event.reason), {
        type: 'unhandled-promise-rejection'
    });
});
```

---

For API-specific troubleshooting, see the [API Reference](./api-reference.md). For performance-related issues, refer to the [Performance Guide](./performance.md).
