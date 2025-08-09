# 🚀 Quick Start Guide

Get up and running with StockCharts in under 5 minutes! This guide covers the fastest ways to start using the financial dashboard suite.

## 🌐 Option 1: Instant Access (Recommended)

**Visit the live demo**: [https://asleshsura.github.io/StockCharts](https://asleshsura.github.io/StockCharts)

✅ **No installation required**  
✅ **Works immediately**  
✅ **All features available**  
✅ **Mobile-friendly**

## 💻 Option 2: Local Setup (5 minutes)

### Prerequisites
- Modern web browser (Chrome 80+, Firefox 75+, Safari 13+, Edge 80+)
- Internet connection for live data

### Step 1: Download
```bash
# Clone the repository
git clone https://github.com/AsleshSura/StockCharts.git
cd StockCharts
```

### Step 2: Open
Choose your preferred method:

**Windows:**
```bash
start index.html
# or for navigation hub
start navigation.html
```

**macOS:**
```bash
open index.html
# or for navigation hub  
open navigation.html
```

**Linux:**
```bash
xdg-open index.html
# or for navigation hub
xdg-open navigation.html
```

**Local Server (Optional):**
```bash
# Python
python -m http.server 8000

# Node.js
npx serve .

# Then visit: http://localhost:8000
```

## 🎯 Choose Your Starting Point

| Dashboard | File | Best For |
|-----------|------|----------|
| **Navigation Hub** | `navigation.html` | First-time users, dashboard overview |
| **All-in-One** | `index.html` | Users who want everything in one place |
| **Market Indices** | `market-indices.html` | S&P 500, NASDAQ, Dow Jones tracking |
| **Cryptocurrency** | `cryptocurrency.html` | Bitcoin, Ethereum, altcoin monitoring |
| **Forex** | `forex.html` | Currency pair analysis |
| **Stock Analysis** | `stock-analysis.html` | Individual stock research |
| **Stock Comparison** | `stock-comparison.html` | Side-by-side stock analysis |

## 🔑 API Key Setup (Optional but Recommended)

### Why Use an API Key?
- **Real-time data** instead of demo data
- **Higher rate limits** for frequent usage
- **More accurate information**

### Getting Your Free API Key

1. **Visit Alpha Vantage**: [https://www.alphavantage.co/support/#api-key](https://www.alphavantage.co/support/#api-key)
2. **Sign up for free** (no credit card required)
3. **Copy your API key**
4. **Enter it in any dashboard** - it will be saved automatically

### Rate Limits
- **Free Plan**: 5 API calls per minute, 500 per day
- **Without API Key**: Demo data with samples

## 🎮 First Steps

### 1. Navigate to Your Dashboard
- Start with `navigation.html` for guided experience
- Or jump directly to specific dashboards

### 2. Enter Stock Symbol
```
Examples:
- Stocks: AAPL, GOOGL, TSLA, MSFT
- Crypto: BTC-USD, ETH-USD, BNB-USD  
- Forex: EUR/USD, GBP/USD, USD/JPY
```

### 3. Select Time Range
- **7 Days**: Recent short-term trends
- **30 Days**: Monthly performance
- **90 Days**: Quarterly analysis
- **1 Year**: Long-term trends

### 4. Analyze the Data
- **Hover** over chart points for detailed information
- **Click legend** to toggle data series
- **Use export** buttons to download charts/data

## 🎨 Customize Your Experience

### Theme Toggle
- **Click the 🌙/☀️ icon** to switch between dark and light themes
- **Your preference is saved** automatically

### Responsive Design
- **Desktop**: Full feature set
- **Tablet**: Touch-optimized interface
- **Mobile**: Swipe-friendly navigation

## 🔍 Dashboard-Specific Quick Start

### 📈 Market Indices Dashboard
```
1. Opens with S&P 500, NASDAQ, Dow Jones loaded
2. Click "Generate Chart" for any index
3. Auto-refreshes every 5 minutes
4. Shows market open/closed status
```

### ₿ Cryptocurrency Dashboard  
```
1. Major cryptocurrencies pre-loaded
2. 24/7 live price updates
3. Percentage change indicators
4. Optimized for crypto volatility
```

### 💱 Forex Dashboard
```
1. 8 major currency pairs available
2. Interactive pair builder
3. Swap functionality (EUR/USD ↔ USD/EUR)
4. Real-time exchange rates
```

### 📊 Stock Analysis
```
1. Enter any stock symbol
2. Get company information
3. Historical price charts
4. Export data as PNG/CSV
```

### ⚖️ Stock Comparison
```
1. Enter two stock symbols
2. Synchronized time ranges
3. Side-by-side visualization
4. Export comparison charts
```

## 🆘 Troubleshooting

### Common Issues

**Charts Not Loading?**
- Check internet connection
- Try refreshing the page
- Clear browser cache

**API Rate Limited?**
- Wait 60 seconds between requests
- Consider using demo mode
- Upgrade to paid Alpha Vantage plan

**Export Not Working?**
- Allow pop-ups in browser
- Check download folder permissions
- Try a different browser

**Mobile Issues?**
- Use Chrome or Safari for best experience
- Enable JavaScript
- Ensure stable internet connection

## 📞 Getting Help

- **Documentation**: Browse other guides in this `/docs` folder
- **Issues**: [GitHub Issues](https://github.com/AsleshSura/StockCharts/issues)
- **Discussions**: [GitHub Discussions](https://github.com/AsleshSura/StockCharts/discussions)

## ⏭️ Next Steps

Once you're comfortable with the basics:

1. **Read the [Dashboard Guide](./dashboards.md)** for advanced features
2. **Check [API Documentation](./api-reference.md)** for data integration
3. **Explore [Development Guide](./development.md)** to customize or contribute
4. **Review [Export Features](./export.md)** for data analysis workflows

---

🎉 **You're all set!** Start exploring financial data with professional-grade visualizations.
