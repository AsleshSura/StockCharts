# 📥 Export Features Documentation

StockCharts provides comprehensive export capabilities for both chart visualizations and raw data. This guide covers all export features, formats, and usage patterns.

## 🎯 Export Overview

### Available Export Types

| Export Type | Format | Content | Use Case |
|-------------|--------|---------|----------|
| **Chart Image** | PNG | High-resolution chart visualization | Presentations, reports, sharing |
| **Raw Data** | CSV | OHLCV data with timestamps | Analysis, spreadsheets, backtesting |
| **Comparison Charts** | PNG | Side-by-side chart images | Comparative analysis reports |
| **Comparison Data** | CSV | Dual stock datasets | Advanced comparative analysis |

### Universal Features
- ✅ **Smart Naming**: Automatic file naming with symbol and timestamp
- ✅ **High Quality**: Optimized resolution for professional use
- ✅ **Instant Download**: No configuration required
- ✅ **Cross-Browser**: Works on Chrome, Firefox, Safari, Edge

---

## 📊 Chart Image Export

### Single Chart Export

#### Features
- **Resolution**: 800×400px for individual charts
- **Format**: PNG with transparent background option
- **Quality**: High-DPI ready for presentations
- **Themes**: Exports match current theme (dark/light)

#### Usage
```javascript
// Export current chart
function exportChart() {
    if (window.currentChart) {
        const link = document.createElement('a');
        link.download = `${currentSymbol}_chart_${getCurrentDate()}.png`;
        link.href = window.currentChart.toBase64Image();
        link.click();
    }
}
```

#### File Naming Convention
```
Format: {SYMBOL}_chart_{YYYY-MM-DD}.png
Examples:
- AAPL_chart_2025-08-09.png
- BTC-USD_chart_2025-08-09.png
- EUR-USD_chart_2025-08-09.png
```

### Comparison Charts Export

#### Features
- **Resolution**: 1600×600px for side-by-side comparison
- **Layout**: Dual charts with synchronized time axis
- **Labeling**: Clear distinction between compared assets
- **Themes**: Maintains theme consistency

#### File Naming Convention
```
Format: {SYMBOL1}_vs_{SYMBOL2}_comparison_{YYYY-MM-DD}.png
Examples:
- AAPL_vs_GOOGL_comparison_2025-08-09.png
- BTC-USD_vs_ETH-USD_comparison_2025-08-09.png
```

---

## 📋 Data Export (CSV)

### Single Asset Data Export

#### Data Structure
```csv
Date,Open,High,Low,Close,Volume
2025-08-09,225.80,227.87,224.83,227.52,54126300
2025-08-08,223.45,226.10,222.90,225.80,48932100
2025-08-07,220.15,224.75,219.80,223.45,52847200
```

#### Column Descriptions
- **Date**: Trading date in YYYY-MM-DD format
- **Open**: Opening price for the trading session
- **High**: Highest price during the trading session
- **Low**: Lowest price during the trading session
- **Close**: Closing price for the trading session
- **Volume**: Number of shares/units traded

#### File Naming Convention
```
Format: {SYMBOL}_data_{YYYY-MM-DD}.csv
Examples:
- AAPL_data_2025-08-09.csv
- BTC-USD_data_2025-08-09.csv
```

### Comparison Data Export

#### Data Structure
```csv
Date,AAPL_Open,AAPL_High,AAPL_Low,AAPL_Close,AAPL_Volume,GOOGL_Open,GOOGL_High,GOOGL_Low,GOOGL_Close,GOOGL_Volume
2025-08-09,225.80,227.87,224.83,227.52,54126300,158.20,160.45,157.85,159.84,28745100
2025-08-08,223.45,226.10,222.90,225.80,48932100,156.75,159.30,156.20,158.20,31892400
```

#### File Naming Convention
```
Format: {SYMBOL1}_vs_{SYMBOL2}_data_{YYYY-MM-DD}.csv
Examples:
- AAPL_vs_GOOGL_data_2025-08-09.csv
- BTC-USD_vs_ETH-USD_data_2025-08-09.csv
```

---

## 🎨 Theme-Aware Export

### Light Theme Export
- **Background**: White (#ffffff)
- **Text Color**: Dark gray (#1e293b)
- **Grid Lines**: Light gray (#e2e8f0)
- **Primary Color**: Blue (#2563eb)

### Dark Theme Export
- **Background**: Dark slate (#0f172a)
- **Text Color**: Light gray (#f1f5f9)
- **Grid Lines**: Medium gray (#334155)
- **Primary Color**: Light blue (#3b82f6)

### Chart Export with Theme
```javascript
function exportChartWithTheme() {
    const chart = window.currentChart;
    if (!chart) return;
    
    // Get current theme
    const theme = document.documentElement.getAttribute('data-theme');
    
    // Configure export options based on theme
    const exportOptions = {
        backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff'
    };
    
    // Export with theme-appropriate background
    const dataURL = chart.toBase64Image('image/png', 1.0);
    downloadImage(dataURL, `${currentSymbol}_${theme}_chart_${getCurrentDate()}.png`);
}
```

---

## 🔧 Implementation Details

### Chart Export Implementation

#### Basic Chart Export
```javascript
function exportSingleChart(symbol) {
    if (!window.currentChart) {
        showError('No chart available to export');
        return;
    }
    
    try {
        const canvas = window.currentChart.canvas;
        const dataURL = canvas.toDataURL('image/png');
        
        const link = document.createElement('a');
        link.download = `${symbol}_chart_${getCurrentDate()}.png`;
        link.href = dataURL;
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showSuccess('Chart exported successfully');
    } catch (error) {
        showError('Failed to export chart: ' + error.message);
    }
}
```

#### Comparison Chart Export
```javascript
function exportComparisonCharts(symbol1, symbol2) {
    const chart1 = document.getElementById('chart1');
    const chart2 = document.getElementById('chart2');
    
    if (!chart1 || !chart2) {
        showError('Both charts must be loaded to export comparison');
        return;
    }
    
    try {
        // Create combined canvas
        const combinedCanvas = document.createElement('canvas');
        combinedCanvas.width = 1600;
        combinedCanvas.height = 600;
        const ctx = combinedCanvas.getContext('2d');
        
        // Draw both charts
        ctx.drawImage(chart1, 0, 0, 800, 600);
        ctx.drawImage(chart2, 800, 0, 800, 600);
        
        // Add labels
        ctx.font = '16px Arial';
        ctx.fillStyle = getThemeColor('text');
        ctx.fillText(symbol1, 20, 30);
        ctx.fillText(symbol2, 820, 30);
        
        // Export combined image
        const dataURL = combinedCanvas.toDataURL('image/png');
        downloadImage(dataURL, `${symbol1}_vs_${symbol2}_comparison_${getCurrentDate()}.png`);
        
        showSuccess('Comparison charts exported successfully');
    } catch (error) {
        showError('Failed to export comparison: ' + error.message);
    }
}
```

### CSV Data Export Implementation

#### Single Dataset Export
```javascript
function exportCSVData(data, symbol) {
    if (!data || !Array.isArray(data) || data.length === 0) {
        showError('No data available to export');
        return;
    }
    
    try {
        // Create CSV header
        const header = 'Date,Open,High,Low,Close,Volume\\n';
        
        // Convert data to CSV rows
        const rows = data.map(row => {
            return [
                row.date,
                row.open.toFixed(2),
                row.high.toFixed(2),
                row.low.toFixed(2),
                row.close.toFixed(2),
                row.volume || 0
            ].join(',');
        }).join('\\n');
        
        // Combine header and rows
        const csvContent = header + rows;
        
        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${symbol}_data_${getCurrentDate()}.csv`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showSuccess('Data exported successfully');
    } catch (error) {
        showError('Failed to export data: ' + error.message);
    }
}
```

#### Comparison Data Export
```javascript
function exportComparisonCSV(data1, symbol1, data2, symbol2) {
    try {
        // Create header with both symbols
        const header = `Date,${symbol1}_Open,${symbol1}_High,${symbol1}_Low,${symbol1}_Close,${symbol1}_Volume,${symbol2}_Open,${symbol2}_High,${symbol2}_Low,${symbol2}_Close,${symbol2}_Volume\\n`;
        
        // Merge data by date
        const mergedData = mergeDataByDate(data1, data2);
        
        // Convert to CSV rows
        const rows = mergedData.map(row => {
            return [
                row.date,
                row[symbol1]?.open?.toFixed(2) || '',
                row[symbol1]?.high?.toFixed(2) || '',
                row[symbol1]?.low?.toFixed(2) || '',
                row[symbol1]?.close?.toFixed(2) || '',
                row[symbol1]?.volume || '',
                row[symbol2]?.open?.toFixed(2) || '',
                row[symbol2]?.high?.toFixed(2) || '',
                row[symbol2]?.low?.toFixed(2) || '',
                row[symbol2]?.close?.toFixed(2) || '',
                row[symbol2]?.volume || ''
            ].join(',');
        }).join('\\n');
        
        const csvContent = header + rows;
        
        // Download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${symbol1}_vs_${symbol2}_data_${getCurrentDate()}.csv`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showSuccess('Comparison data exported successfully');
    } catch (error) {
        showError('Failed to export comparison data: ' + error.message);
    }
}
```

---

## 📱 Platform-Specific Considerations

### Mobile Export
- **Touch-Friendly**: Large export buttons for mobile users
- **Share Integration**: Uses native sharing APIs when available
- **File Handling**: Works with mobile file management apps

### Desktop Export
- **Keyboard Shortcuts**: Ctrl+E for quick export
- **Drag & Drop**: Supports drag to other applications
- **File Explorer**: Direct save to chosen directories

### Browser Compatibility

#### Chrome/Edge
- ✅ Full support for all export features
- ✅ High-quality PNG export
- ✅ CSV download with proper encoding

#### Firefox
- ✅ Full support for all export features
- ⚠️ May prompt for download location

#### Safari
- ✅ Full support for all export features
- ⚠️ Files may download to default folder

---

## 🎯 Use Cases & Workflows

### Financial Analysis Workflow
1. **Research Phase**: Use stock analysis dashboard
2. **Data Collection**: Export CSV data for multiple stocks
3. **Comparison**: Use comparison dashboard
4. **Report Creation**: Export PNG charts for presentations
5. **Backtesting**: Use CSV data in analysis software

### Portfolio Management Workflow
1. **Track Performance**: Monitor key holdings
2. **Export Historical Data**: Get CSV for portfolio analysis
3. **Generate Reports**: Export charts for client presentations
4. **Trend Analysis**: Compare sectors or asset classes

### Educational Workflow
1. **Learning Markets**: Explore different asset classes
2. **Chart Analysis**: Export charts for study materials
3. **Data Analysis**: Use CSV exports in spreadsheet software
4. **Presentation**: Create educational materials with exported charts

---

## 🛠️ Troubleshooting Export Issues

### Common Problems

#### Export Button Not Working
```
Symptoms: Nothing happens when clicking export
Solutions:
- Check if chart is fully loaded
- Ensure browser allows downloads
- Try refreshing the page
- Check browser console for errors
```

#### Poor Image Quality
```
Symptoms: Exported images appear blurry
Solutions:
- Use high-DPI display settings
- Ensure chart is fully rendered
- Check browser zoom level (100% recommended)
- Try different export timing
```

#### CSV File Corrupted
```
Symptoms: CSV won't open in Excel/spreadsheet apps
Solutions:
- Check file encoding (should be UTF-8)
- Try opening in text editor first
- Ensure data is fully loaded before export
- Check for special characters in stock symbols
```

#### File Download Blocked
```
Symptoms: Downloads don't start or are blocked
Solutions:
- Allow pop-ups for the website
- Check browser download settings
- Disable download blockers
- Try incognito/private browsing mode
```

---

For technical implementation details, see the [Development Guide](./development.md). For API-related export functionality, refer to the [API Reference](./api-reference.md).
