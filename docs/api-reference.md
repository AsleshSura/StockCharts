# 🔌 API Reference Documentation

This document provides comprehensive information about data sources, API integrations, rate limits, and data formats used in StockCharts.

## 📊 Overview

StockCharts implements a **multi-tier data strategy** with intelligent fallbacks to ensure reliable data access:

1. **Primary**: Alpha Vantage API (requires free API key)
2. **Fallback**: Yahoo Finance API (CORS proxy required)
3. **Demo**: Local sample data (always available)

## 🔑 Alpha Vantage API (Primary)

### Base Configuration
```javascript
const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query';
const DEFAULT_API_KEY = 'demo';
```

### Getting Your API Key
1. Visit [Alpha Vantage Support](https://www.alphavantage.co/support/#api-key)
2. Sign up for a free account
3. Copy your API key
4. Enter it in any StockCharts dashboard

### Rate Limits
- **Free Tier**: 5 API calls per minute, 500 calls per day
- **Premium**: Higher limits available
- **Recommendation**: Cache responses to minimize calls

### Supported Endpoints

#### 1. **Stock Data** - `TIME_SERIES_DAILY`
```javascript
// Example API call
const url = `${ALPHA_VANTAGE_BASE_URL}?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`;

// Response format
{
  "Meta Data": {
    "1. Information": "Daily Prices (open, high, low, close) and Volumes",
    "2. Symbol": "AAPL",
    "3. Last Refreshed": "2025-08-09",
    "4. Output Size": "Compact",
    "5. Time Zone": "US/Eastern"
  },
  "Time Series (Daily)": {
    "2025-08-09": {
      "1. open": "225.80",
      "2. high": "227.87",
      "3. low": "224.83",
      "4. close": "227.52",
      "5. volume": "54126300"
    }
    // ... more dates
  }
}
```

#### 2. **Cryptocurrency** - `DIGITAL_CURRENCY_DAILY`
```javascript
// Example API call
const url = `${ALPHA_VANTAGE_BASE_URL}?function=DIGITAL_CURRENCY_DAILY&symbol=${crypto}&market=USD&apikey=${apiKey}`;

// Response format
{
  "Meta Data": {
    "1. Information": "Daily Prices and Volumes for Digital Currency",
    "2. Digital Currency Code": "BTC",
    "3. Digital Currency Name": "Bitcoin",
    "4. Market Code": "USD",
    "5. Market Name": "United States Dollar"
  },
  "Time Series (Digital Currency Daily)": {
    "2025-08-09": {
      "1a. open (USD)": "43750.00000000",
      "1b. open (USD)": "43750.00000000",
      "2a. high (USD)": "44250.00000000",
      "2b. high (USD)": "44250.00000000",
      "3a. low (USD)": "43200.00000000",
      "3b. low (USD)": "43200.00000000",
      "4a. close (USD)": "44100.00000000",
      "4b. close (USD)": "44100.00000000",
      "5. volume": "12345.67890000",
      "6. market cap (USD)": "825000000000.00000000"
    }
  }
}
```

#### 3. **Forex** - `FX_DAILY`
```javascript
// Example API call
const url = `${ALPHA_VANTAGE_BASE_URL}?function=FX_DAILY&from_symbol=EUR&to_symbol=USD&apikey=${apiKey}`;

// Response format
{
  "Meta Data": {
    "1. Information": "Forex Daily Prices (open, high, low, close)",
    "2. From Symbol": "EUR",
    "3. To Symbol": "USD",
    "4. Output Size": "Compact",
    "5. Last Refreshed": "2025-08-08 21:20:00",
    "6. Time Zone": "GMT+0"
  },
  "Time Series FX (Daily)": {
    "2025-08-09": {
      "1. open": "1.0932",
      "2. high": "1.0965",
      "3. low": "1.0918",
      "4. close": "1.0945"
    }
  }
}
```

## 🌐 Yahoo Finance API (Fallback)

### Base Configuration
```javascript
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';
const YF_BASE_URL = 'https://query1.finance.yahoo.com';
```

### CORS Handling
Yahoo Finance requires CORS proxy due to browser restrictions:

```javascript
function buildYahooUrl(symbol, range = '1y') {
    const endpoint = `/v8/finance/chart/${symbol}?range=${range}&interval=1d`;
    return `${CORS_PROXY}${encodeURIComponent(YF_BASE_URL + endpoint)}`;
}
```

### Supported Endpoints

#### 1. **Chart Data** - `/v8/finance/chart/{symbol}`
```javascript
// Response format (simplified)
{
  "chart": {
    "result": [{
      "meta": {
        "currency": "USD",
        "symbol": "AAPL",
        "exchangeName": "NMS",
        "regularMarketPrice": 227.52,
        "chartPreviousClose": 225.80,
        "currentTradingPeriod": {
          "regular": {
            "start": 1691596200,
            "end": 1691619600
          }
        }
      },
      "timestamp": [1691596200, 1691682600, ...],
      "indicators": {
        "quote": [{
          "open": [225.80, 227.10, ...],
          "high": [227.87, 229.50, ...],
          "low": [224.83, 226.75, ...],
          "close": [227.52, 228.90, ...],
          "volume": [54126300, 48932100, ...]
        }]
      }
    }]
  }
}
```

### Time Range Parameters
```javascript
const timeRanges = {
    '7d': '7d',
    '30d': '1mo', 
    '90d': '3mo',
    '1y': '1y'
};
```

## 🎮 Demo Data System

### Purpose
- **Fallback**: When all APIs fail
- **Testing**: Development and testing environment
- **Demo**: Users without API keys

### Data Structure
```javascript
const demoData = {
    stocks: {
        'AAPL': {
            meta: {
                symbol: 'AAPL',
                name: 'Apple Inc.',
                currency: 'USD',
                exchange: 'NASDAQ'
            },
            timeSeries: [
                { date: '2025-07-09', open: 220.50, high: 225.80, low: 219.75, close: 224.30, volume: 45623100 },
                { date: '2025-07-10', open: 225.10, high: 227.90, low: 223.45, close: 226.75, volume: 38945200 },
                // ... more data points
            ]
        }
    },
    crypto: {
        'BTC-USD': {
            meta: {
                symbol: 'BTC-USD',
                name: 'Bitcoin USD',
                currency: 'USD'
            },
            timeSeries: [
                { date: '2025-07-09', open: 42500.00, high: 43800.00, low: 42100.00, close: 43250.00, volume: 15234.56 },
                // ... more data points
            ]
        }
    },
    forex: {
        'EUR/USD': {
            meta: {
                from: 'EUR',
                to: 'USD',
                name: 'Euro to US Dollar'
            },
            timeSeries: [
                { date: '2025-07-09', open: 1.0920, high: 1.0965, low: 1.0905, close: 1.0945 },
                // ... more data points
            ]
        }
    }
};
```

## 🔄 Data Processing Pipeline

### 1. **API Response Normalization**

```javascript
function normalizeStockData(response, source) {
    switch (source) {
        case 'alphavantage':
            return normalizeAlphaVantageData(response);
        case 'yahoo':
            return normalizeYahooData(response);
        case 'demo':
            return normalizeDemoData(response);
    }
}

function normalizeAlphaVantageData(response) {
    const timeSeries = response['Time Series (Daily)'];
    const meta = response['Meta Data'];
    
    return {
        symbol: meta['2. Symbol'],
        lastRefreshed: meta['3. Last Refreshed'],
        data: Object.entries(timeSeries).map(([date, values]) => ({
            date,
            open: parseFloat(values['1. open']),
            high: parseFloat(values['2. high']),
            low: parseFloat(values['3. low']),
            close: parseFloat(values['4. close']),
            volume: parseInt(values['5. volume'])
        })).reverse() // Ensure chronological order
    };
}
```

### 2. **Data Validation**

```javascript
function validateStockData(data) {
    if (!data || !data.data || !Array.isArray(data.data)) {
        return false;
    }
    
    // Ensure minimum data points
    if (data.data.length < 5) {
        return false;
    }
    
    // Validate data structure
    return data.data.every(point => 
        point.date && 
        typeof point.close === 'number' && 
        !isNaN(point.close) &&
        point.close > 0
    );
}
```

### 3. **Error Handling**

```javascript
async function fetchWithRetry(url, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (isRateLimited(data)) {
                throw new Error('API rate limit exceeded');
            }
            
            return data;
            
        } catch (error) {
            console.warn(`Attempt ${attempt} failed:`, error.message);
            
            if (attempt === maxRetries) {
                throw error;
            }
            
            // Exponential backoff
            await new Promise(resolve => 
                setTimeout(resolve, Math.pow(2, attempt) * 1000)
            );
        }
    }
}
```

## ⚡ Rate Limiting & Optimization

### 1. **Request Debouncing**

```javascript
const debouncedApiCall = debounce(async (symbol, timeRange) => {
    return await fetchStockData(symbol, timeRange);
}, 500); // 500ms debounce
```

### 2. **Caching Strategy**

```javascript
class ApiCache {
    constructor(ttl = 300000) { // 5 minutes default TTL
        this.cache = new Map();
        this.ttl = ttl;
    }
    
    set(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }
    
    get(key) {
        const item = this.cache.get(key);
        if (!item) return null;
        
        if (Date.now() - item.timestamp > this.ttl) {
            this.cache.delete(key);
            return null;
        }
        
        return item.data;
    }
    
    clear() {
        this.cache.clear();
    }
}

const apiCache = new ApiCache();
```

### 3. **Smart Fallback Logic**

```javascript
async function smartFetch(symbol, timeRange) {
    // Check cache first
    const cacheKey = `${symbol}-${timeRange}`;
    const cached = apiCache.get(cacheKey);
    if (cached) return cached;
    
    // Try primary API
    try {
        const data = await fetchFromAlphaVantage(symbol, timeRange);
        if (validateData(data)) {
            apiCache.set(cacheKey, data);
            return data;
        }
    } catch (error) {
        console.warn('Alpha Vantage failed:', error.message);
    }
    
    // Try fallback API
    try {
        const data = await fetchFromYahoo(symbol, timeRange);
        if (validateData(data)) {
            apiCache.set(cacheKey, data);
            return data;
        }
    } catch (error) {
        console.warn('Yahoo Finance failed:', error.message);
    }
    
    // Use demo data
    return getDemoData(symbol, timeRange);
}
```

## 🛠️ Custom API Integration

### Adding New Data Sources

1. **Create Source Configuration**:
```javascript
const customSource = {
    name: 'Custom API',
    baseUrl: 'https://api.example.com',
    headers: {
        'Authorization': 'Bearer YOUR_TOKEN'
    },
    endpoints: {
        stocks: '/stocks/{symbol}/daily',
        crypto: '/crypto/{symbol}/daily'
    }
};
```

2. **Implement Fetch Function**:
```javascript
async function fetchFromCustomAPI(symbol, timeRange) {
    const url = `${customSource.baseUrl}${customSource.endpoints.stocks}`
        .replace('{symbol}', symbol);
    
    const response = await fetch(url, {
        headers: customSource.headers
    });
    
    if (!response.ok) {
        throw new Error(`Custom API error: ${response.status}`);
    }
    
    const data = await response.json();
    return normalizeCustomData(data);
}
```

3. **Add to Fallback Chain**:
```javascript
const dataSources = [
    fetchFromAlphaVantage,
    fetchFromCustomAPI,  // Add here
    fetchFromYahoo,
    getDemoData
];
```

## 📈 Supported Data Types

### Stock Data
- **Symbols**: Any valid stock ticker (AAPL, GOOGL, TSLA, etc.)
- **Time Ranges**: 7d, 30d, 90d, 1y
- **Data Points**: OHLCV (Open, High, Low, Close, Volume)

### Cryptocurrency  
- **Symbols**: Major crypto pairs (BTC-USD, ETH-USD, etc.)
- **Updates**: 24/7 availability
- **Data Points**: OHLCV with market cap

### Forex
- **Pairs**: Major currency pairs (EUR/USD, GBP/USD, etc.)
- **Updates**: Real-time during market hours
- **Data Points**: OHLC exchange rates

### Market Indices
- **Symbols**: SPY (S&P 500), QQQ (NASDAQ), DIA (Dow Jones)
- **Updates**: Real-time during market hours
- **Features**: Market status indicators

---

For questions about API integration or data issues, please check the [Error Handling Guide](./error-handling.md) or [open an issue](https://github.com/AsleshSura/StockCharts/issues).
