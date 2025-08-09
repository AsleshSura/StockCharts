# 📱 Dashboard User Guide

This comprehensive guide covers all six specialized dashboards in the StockCharts suite, their features, usage patterns, and advanced functionality.

## 🏠 Navigation Hub (`navigation.html`)

The **Navigation Hub** serves as the central entry point to all specialized dashboards. It provides a modern, card-based interface for dashboard selection and global settings.

### Features
- **🎯 Dashboard Selection**: Visual cards for each specialized dashboard
- **🌙 Theme Toggle**: Global dark/light theme switching
- **📱 Responsive Design**: Optimized for all device sizes
- **⚡ Quick Access**: Direct links to specific dashboards

### Usage
1. **Open Navigation**: Start with `navigation.html`
2. **Browse Dashboards**: Review available options with descriptions
3. **Select Dashboard**: Click any card to navigate to specific dashboard
4. **Theme Control**: Use the moon/sun icon to toggle themes

---

## 📈 Market Indices Dashboard (`market-indices.html`)

Monitor major U.S. market indices with real-time data and professional-grade charts.

### Supported Indices

| Index | Symbol | Description |
|-------|--------|-------------|
| **S&P 500** | SPY | Broad market performance (500 largest U.S. companies) |
| **NASDAQ** | QQQ | Technology-focused index |
| **Dow Jones** | DIA | 30 blue-chip industrial companies |

### Key Features

#### 🔄 **Auto-Refresh System**
- **Frequency**: Every 5 minutes during market hours
- **Status Indicators**: Live market open/closed status
- **Manual Refresh**: Click "Refresh Data" button anytime

#### 📊 **Real-Time Data Display**
```
Current Price: $427.32
Change: +$2.15 (+0.51%)
Last Updated: 2025-08-09 15:45:32 EST
Market Status: OPEN
```

#### 📈 **Interactive Charts**
- **Chart Generation**: Click "Generate Chart" for any index
- **Time Ranges**: 7 days, 30 days, 90 days, 1 year
- **Tooltips**: Hover for detailed price information
- **Responsive**: Auto-adjusts to screen size

### Usage Workflow
1. **Dashboard loads** with current data for all three indices
2. **Review current prices** and percentage changes
3. **Generate charts** by clicking buttons for specific indices
4. **Select time range** for historical analysis
5. **Monitor status** with automatic updates

### Market Hours
- **Regular Hours**: 9:30 AM - 4:00 PM EST (Monday-Friday)
- **Pre-Market**: 4:00 AM - 9:30 AM EST
- **After-Hours**: 4:00 PM - 8:00 PM EST
- **Weekends/Holidays**: Markets closed (last available data shown)

---

## ₿ Cryptocurrency Dashboard (`cryptocurrency.html`)

24/7 cryptocurrency monitoring with real-time price tracking and volatility-optimized charts.

### Supported Cryptocurrencies

| Crypto | Symbol | Description |
|--------|--------|-------------|
| **Bitcoin** | BTC-USD | Leading cryptocurrency by market cap |
| **Ethereum** | ETH-USD | Smart contract platform token |
| **Binance Coin** | BNB-USD | Binance exchange native token |
| **Ripple** | XRP-USD | Cross-border payment token |
| **Cardano** | ADA-USD | Proof-of-stake blockchain platform |
| **Polkadot** | DOT-USD | Multi-chain protocol token |

### Key Features

#### 🌐 **24/7 Monitoring**
- **Continuous Updates**: Real-time price tracking
- **Global Markets**: No market close times
- **Weekend Trading**: Available Saturday and Sunday

#### 💹 **Volatility Indicators**
```
BTC-USD: $43,250.00
24h Change: +$1,250.00 (+2.98%)
24h High: $44,100.00
24h Low: $42,800.00
Volume: 15,234.56 BTC
```

#### 📊 **Crypto-Optimized Charts**
- **Volatility Scaling**: Charts adjusted for crypto price swings
- **Color Coding**: Green for gains, red for losses
- **Percentage Focus**: Emphasis on percentage changes
- **Volume Indicators**: Trading volume visualization

### Usage Patterns

#### **Day Trading Focus**
1. **Monitor major pairs** (BTC-USD, ETH-USD)
2. **Watch 24h percentage changes**
3. **Use 7-day charts** for short-term trends
4. **Check volume** for market activity confirmation

#### **Long-Term Investment**
1. **Compare multiple cryptocurrencies**
2. **Use 90-day or 1-year charts**
3. **Track historical performance**
4. **Export data** for portfolio analysis

### Special Considerations
- **High Volatility**: Crypto prices change rapidly
- **24/7 Markets**: No trading breaks
- **Regulatory Sensitivity**: Prices react to news quickly
- **Market Correlation**: Often move together during major events

---

## 💱 Forex Dashboard (`forex.html`)

Real-time currency exchange rate monitoring with professional trading tools.

### Supported Currency Pairs

| Pair | Description | Category |
|------|-------------|----------|
| **EUR/USD** | Euro to US Dollar | Major |
| **GBP/USD** | British Pound to US Dollar | Major |
| **USD/JPY** | US Dollar to Japanese Yen | Major |
| **USD/CHF** | US Dollar to Swiss Franc | Major |
| **USD/CAD** | US Dollar to Canadian Dollar | Major |
| **AUD/USD** | Australian Dollar to US Dollar | Major |
| **NZD/USD** | New Zealand Dollar to US Dollar | Major |
| **EUR/GBP** | Euro to British Pound | Cross |

### Key Features

#### 💱 **Interactive Pair Builder**
- **Custom Pairs**: Create any currency combination
- **Swap Function**: Instantly reverse pair direction (EUR/USD ↔ USD/EUR)
- **Real-Time Rates**: Live exchange rate updates
- **Precision**: Up to 5 decimal places

#### 📊 **Professional Trading View**
```
EUR/USD: 1.09450
Bid: 1.09448
Ask: 1.09452
Spread: 0.4 pips
Daily Change: +0.0023 (+0.21%)
```

#### 🔄 **Live Rate Updates**
- **Refresh Frequency**: Every 60 seconds during active hours
- **Market Hours**: 24/5 (Sunday 5 PM EST - Friday 5 PM EST)
- **Holiday Schedule**: Updates pause during major holidays

### Trading Hours by Session

| Session | Hours (EST) | Major Pairs Active |
|---------|-------------|-------------------|
| **Sydney** | 5:00 PM - 2:00 AM | AUD/USD, NZD/USD |
| **Tokyo** | 7:00 PM - 4:00 AM | USD/JPY, AUD/JPY |
| **London** | 3:00 AM - 12:00 PM | EUR/USD, GBP/USD |
| **New York** | 8:00 AM - 5:00 PM | USD/CAD, USD/CHF |

### Usage for Different Purposes

#### **Travel Planning**
1. **Select destination currency pair**
2. **Check current exchange rate**
3. **Review 30-day trend** for timing
4. **Export data** for planning

#### **Business/Import-Export**
1. **Monitor relevant currency pairs**
2. **Track 90-day trends** for budgeting
3. **Set up regular monitoring**
4. **Export historical data** for analysis

#### **Investment Analysis**
1. **Compare multiple pairs**
2. **Use 1-year charts** for trends
3. **Analyze correlation patterns**
4. **Track central bank policies**

---

## 📊 Stock Analysis Dashboard (`stock-analysis.html`)

Deep-dive individual stock research with comprehensive data and professional charts.

### Research Capabilities

#### 🔍 **Company Information**
- **Stock Symbol**: Automatic symbol validation
- **Company Name**: Full corporate name
- **Exchange**: Trading exchange (NYSE, NASDAQ, etc.)
- **Currency**: Trading currency
- **Last Updated**: Data freshness timestamp

#### 📈 **Price Analysis**
```
AAPL - Apple Inc.
Current Price: $227.52
Open: $225.80
High: $227.87
Low: $224.83
Volume: 54,126,300
Market Cap: $3.42T
```

#### 📊 **Historical Data**
- **OHLCV Data**: Open, High, Low, Close, Volume
- **Multiple Timeframes**: 7D, 30D, 90D, 1Y
- **Trend Analysis**: Visual trend indicators
- **Volume Analysis**: Trading volume patterns

### Advanced Features

#### 📥 **Export Capabilities**
- **Chart Export**: High-quality PNG images (800x400px)
- **Data Export**: CSV format with OHLCV data
- **Smart Naming**: Files include symbol and date
- **Instant Download**: One-click export process

#### 🎯 **Research Workflow**
1. **Enter Stock Symbol**: Type ticker (AAPL, GOOGL, TSLA)
2. **Review Company Info**: Verify correct stock
3. **Select Time Range**: Choose analysis period
4. **Generate Chart**: Create interactive visualization
5. **Analyze Trends**: Use chart tools and tooltips
6. **Export Data**: Download for further analysis

### Popular Stock Categories

#### **Technology Stocks**
- **AAPL** (Apple), **GOOGL** (Google), **MSFT** (Microsoft)
- **TSLA** (Tesla), **NVDA** (NVIDIA), **META** (Meta)

#### **Financial Stocks**
- **JPM** (JPMorgan), **BAC** (Bank of America)
- **WFC** (Wells Fargo), **GS** (Goldman Sachs)

#### **Healthcare Stocks**
- **JNJ** (Johnson & Johnson), **PFE** (Pfizer)
- **UNH** (UnitedHealth), **ABBV** (AbbVie)

---

## ⚖️ Stock Comparison Dashboard (`stock-comparison.html`)

Side-by-side stock analysis with synchronized charts and comparative metrics.

### Comparison Features

#### 📊 **Dual Chart System**
- **Side-by-Side Visualization**: Compare two stocks simultaneously
- **Synchronized Time Ranges**: Both charts use same period
- **Independent Scaling**: Each chart optimized for its stock's price range
- **Color Coding**: Distinct colors for easy differentiation

#### 📈 **Comparative Analysis**
```
Stock A: AAPL          Stock B: GOOGL
Price: $227.52         Price: $159.84
Change: +2.15 (+0.95%) Change: -1.23 (-0.76%)
Volume: 54.1M          Volume: 28.7M
```

#### ⚖️ **Performance Metrics**
- **Price Comparison**: Current values side-by-side
- **Percentage Changes**: Daily/period performance
- **Volume Analysis**: Trading activity comparison
- **Trend Direction**: Visual trend indicators

### Usage Scenarios

#### **Sector Analysis**
Compare stocks within the same industry:
- **Tech**: AAPL vs GOOGL vs MSFT
- **Banking**: JPM vs BAC vs WFC
- **Energy**: XOM vs CVX vs COP

#### **Market Cap Analysis**
Compare stocks by size:
- **Large Cap**: AAPL vs MSFT
- **Mid Cap**: Regional comparisons
- **Growth vs Value**: Different investment styles

#### **Performance Analysis**
- **Bull Market Leaders**: Best performers
- **Defensive Stocks**: Stable performers
- **Recovery Plays**: Post-decline stocks

### Advanced Comparison Features

#### 📥 **Dual Export System**
- **Combined Chart**: Single image with both stocks
- **Separate Charts**: Individual PNG files
- **Comparative Data**: CSV with both datasets
- **Smart Naming**: Files include both symbols

#### 🎯 **Comparison Workflow**
1. **Enter First Stock**: Primary comparison symbol
2. **Enter Second Stock**: Secondary comparison symbol
3. **Select Time Range**: Same period for both
4. **Generate Comparison**: Create side-by-side charts
5. **Analyze Differences**: Compare trends and metrics
6. **Export Results**: Download charts and data

---

## 🎯 All-in-One Dashboard (`index.html`)

The original unified dashboard combining multiple financial data types in a single interface.

### Unified Features

#### 🔄 **Multi-Asset Support**
- **Stocks**: Individual company analysis
- **Indices**: Market overview data
- **Crypto**: Digital asset monitoring
- **Forex**: Currency pair analysis

#### 📊 **Single Chart Interface**
- **Universal Chart**: Handles all asset types
- **Auto-Detection**: Recognizes symbol type automatically
- **Consistent UI**: Same interface for all assets
- **Theme Integration**: Unified styling across assets

### Symbol Recognition

| Input Example | Asset Type | Result |
|---------------|------------|---------|
| `AAPL` | Stock | Apple Inc. stock data |
| `BTC-USD` | Crypto | Bitcoin to USD |
| `EUR/USD` | Forex | Euro to US Dollar |
| `SPY` | Index | S&P 500 ETF |

### Use Cases

#### **Portfolio Overview**
- **Mixed Assets**: Stocks, crypto, forex in one view
- **Quick Switching**: Rapid symbol changes
- **Unified Analysis**: Consistent chart interface

#### **Learning Platform**
- **Explore Different Assets**: Try various symbol types
- **Compare Asset Classes**: Switch between stocks and crypto
- **Understand Markets**: Learn about different financial instruments

---

## 🎨 Universal Features (All Dashboards)

### Theme System
- **Dark/Light Toggle**: Available on all dashboards
- **Persistent Settings**: Theme choice saved across sessions
- **Chart Integration**: Themes apply to charts automatically
- **Accessibility**: High contrast ratios in both themes

### Export Functionality
- **PNG Charts**: High-quality image export
- **CSV Data**: Spreadsheet-compatible data export
- **Smart Naming**: Automatic file naming with symbol and date
- **Cross-Browser**: Works on all modern browsers

### Responsive Design
- **Mobile Optimized**: Touch-friendly interface
- **Tablet Support**: Optimized for medium screens
- **Desktop Full**: Complete feature set on large screens
- **Progressive Enhancement**: Core features work everywhere

### Accessibility
- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: ARIA labels and roles
- **Color Contrast**: WCAG 2.1 AA compliance
- **Focus Indicators**: Clear navigation cues

---

For detailed technical information, see the [API Reference](./api-reference.md) and [Development Guide](./development.md).
