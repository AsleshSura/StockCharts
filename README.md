# Stock Chart Visualizer

A comprehensive web application for visualizing stock market data with interactive charts, market indices tracking, and stock comparison capabilities. Built with vanilla JavaScript, Chart.js, and modern CSS.

🔗 **Live Demo**: [https://asleshsura.github.io/StockCharts](https://asleshsura.github.io/StockCharts)

![Stock Chart Visualizer](https://img.shields.io/badge/Status-Live-brightgreen) ![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow) ![Chart.js](https://img.shields.io/badge/Chart.js-4.0+-orange) ![CSS3](https://img.shields.io/badge/CSS3-Modern-blue)

## ✨ Features

### 📊 Stock Chart Visualization
- **Interactive stock charts** with smooth animations and hover effects
- **Multiple time ranges**: 7 days, 30 days, 90 days, and 1 year
- **Real-time stock data** from Alpha Vantage API
- **Fallback data sources** including Yahoo Finance and demo data
- **Responsive design** that works on desktop, tablet, and mobile devices

### 📈 Market Indices Dashboard
- **Live market indices tracking** for major US markets:
  - **S&P 500 (SPY)** - Track the broader market performance
  - **NASDAQ (QQQ)** - Technology-focused index tracking
  - **Dow Jones (DIA)** - Blue-chip stock performance
- **Real-time price updates** with automatic refresh every 5 minutes
- **Market status indicator** (Open/Closed) based on Eastern Time
- **One-click chart viewing** for any market index
- **Price change indicators** with color-coded positive/negative changes

### 🔄 Stock Comparison Mode
- **Side-by-side stock comparison** with dual chart display
- **Visual comparison interface** with intuitive toggle switch
- **Independent stock analysis** for informed investment decisions
- **Synchronized time ranges** for accurate comparisons
- **Separate stock information panels** for each compared stock

### 🎨 Theme Support
- **Dark/Light mode toggle** with smooth transitions
- **Persistent theme preference** saved in localStorage
- **Theme-aware charts** that automatically adjust colors
- **Modern gradient design** with glassmorphism effects
- **Accessible color schemes** for better readability

### 🔧 Data Sources & API Integration
- **Primary**: Alpha Vantage API for real-time financial data
- **Fallback**: Yahoo Finance API through CORS proxy
- **Demo mode**: Mock data generation for testing and demonstration
- **API key management**: Optional API key input for enhanced data access
- **Error handling**: Graceful fallbacks and user-friendly error messages

### 📱 User Experience
- **Input validation** for stock symbols with format checking
- **Loading indicators** with animated spinners
- **Keyboard shortcuts** (Enter key support for quick searches)
- **Responsive grid layout** that adapts to screen size
- **Smooth animations** and transitions throughout the interface
- **Error recovery** with helpful suggestions and fallback options

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for live data (optional for demo mode)
- Alpha Vantage API key (optional, free tier available)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/AsleshSura/StockCharts.git
   cd StockCharts
   ```

2. **Open in browser**:
   - Simply open `index.html` in your web browser
   - Or use a local server for better development experience

3. **Get API Key (Optional)**:
   - Visit [Alpha Vantage](https://www.alphavantage.co/support/#api-key)
   - Sign up for a free API key
   - Enter the key in the application for real-time data

## 📖 Usage Guide

### Basic Stock Search
1. Enter a stock symbol (e.g., AAPL, TSLA, GOOGL) in the search field
2. Select your preferred time range
3. Click "Set Chart" or press Enter
4. View the interactive chart with stock information

### Market Indices
- View live prices for S&P 500, NASDAQ, and Dow Jones
- Click on any index card to view its detailed chart
- Use the refresh button to manually update prices
- Monitor market status (Open/Closed) in real-time

### Stock Comparison
1. Toggle the comparison mode switch
2. Enter two different stock symbols
3. Select the time range for comparison
4. Click "Compare Stocks" to view side-by-side charts
5. Analyze the relative performance of both stocks

### Theme Switching
- Click the moon/sun icon in the top-right corner
- Theme preference is automatically saved
- Charts and interface colors adapt to your choice

## 🛠️ Technical Details

### Architecture
- **Frontend**: Vanilla JavaScript (ES6+)
- **Charts**: Chart.js library for interactive visualizations
- **Styling**: Modern CSS with CSS custom properties
- **APIs**: Alpha Vantage (primary), Yahoo Finance (fallback)
- **Storage**: localStorage for theme and preferences

### File Structure
```
StockCharts/
├── index.html          # Main HTML structure
├── script.js           # Core JavaScript functionality
├── style.css           # Comprehensive styling and themes
├── utils.js            # Utility functions and theme management
└── README.md           # This documentation
```

### Browser Compatibility
- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

### Performance Features
- **Lazy loading** of chart libraries
- **Debounced API calls** to prevent rate limiting
- **Efficient DOM manipulation** with minimal reflows
- **Memory management** with proper chart cleanup
- **Responsive images** and optimized assets

## 🔑 API Integration

### Alpha Vantage API
- **Function**: Primary data source for real-time stock information
- **Endpoints Used**:
  - `TIME_SERIES_DAILY` for historical price data
  - `GLOBAL_QUOTE` for current market prices
- **Rate Limits**: 5 API requests per minute (free tier)
- **Fallback**: Automatic switching to alternative sources

### Yahoo Finance API
- **Function**: Secondary data source via CORS proxy
- **Endpoints Used**: Chart and quote endpoints
- **Benefits**: No API key required, higher rate limits
- **Limitations**: May be blocked by some CORS policies

## 📊 Data Features

### Chart Capabilities
- **Interactive tooltips** with detailed price information
- **Responsive design** that scales with container
- **Smooth animations** for data transitions
- **Customizable time ranges** from 1 week to 1 year
- **Professional styling** with gradient fills and borders

### Stock Information Display
- Current price with real-time updates
- Daily price change (absolute and percentage)
- Day's high and low prices
- Company name and symbol
- Color-coded indicators for gains/losses

## 🎯 Future Enhancements

- [ ] Technical indicators (Moving averages, RSI, MACD)
- [ ] Portfolio tracking functionality
- [ ] Cryptocurrency support
- [ ] Advanced charting tools (candlestick charts)
- [ ] Stock news integration
- [ ] Export functionality (PNG, PDF)
- [ ] Watchlist management
- [ ] Price alerts and notifications

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Chart.js](https://www.chartjs.org/) for the powerful charting library
- [Alpha Vantage](https://www.alphavantage.co/) for financial data API
- [Yahoo Finance](https://finance.yahoo.com/) for backup data source
- Modern CSS techniques inspired by contemporary design trends

## 📞 Support

If you encounter any issues or have questions:
- Create an issue on GitHub
- Check the demo mode if API calls are failing
- Ensure you have a stable internet connection
- Verify your API key is valid (if using one)

---

**Made with ❤️ by [AsleshSura](https://github.com/AsleshSura)**

*Experience the power of financial data visualization with Stock Chart Visualizer!*
