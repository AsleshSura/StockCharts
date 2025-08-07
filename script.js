// Using Alpha Vantage free API as fallback
const DEFAULT_API_KEY = 'demo'; // Default demo key
const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query';

// Function to get the current API key from user input or use demo
function getApiKey() {
    const userApiKey = document.getElementById('apiKey').value.trim();
    return userApiKey || DEFAULT_API_KEY;
}

// Backup Yahoo Finance endpoints
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';
const YF_BASE_URL = 'https://query1.finance.yahoo.com';

let chart = null;

document.getElementById('companySymbol').addEventListener('keypress', function(e){
    if (e.key === 'Enter') {
        searchStock();
    }
});

// Add event listener for API key input to provide feedback
document.getElementById('apiKey').addEventListener('input', function(e) {
    updateApiKeyStatus();
});

function updateApiKeyStatus() {
    const apiKey = document.getElementById('apiKey').value.trim();
    const helpText = document.querySelector('.help-text');
    
    if (apiKey && apiKey !== 'demo') {
        helpText.textContent = 'Using your API key for real-time data';
        helpText.style.color = '#38a169';
    } else {
        helpText.textContent = 'Leave empty to use demo data with limited functionality';
        helpText.style.color = '#718096';
    }
}

// Initialize API key status on page load
document.addEventListener('DOMContentLoaded', function() {
    updateApiKeyStatus();
});

async function searchStock() {
    const symbol = document.getElementById('companySymbol').value.trim().toUpperCase();
    const timeRange = parseInt(document.getElementById('timeRange').value);

    console.log('searchStock called with symbol:', symbol, 'timeRange:', timeRange);

    hideError();

    if (!symbol) {
        showError('Please enter a stock symbol');
        return;
    }

    // Validate symbol format if utils.js is loaded
    if (typeof isValidStockSymbol === 'function' && !isValidStockSymbol(symbol)) {
        showError('Please enter a valid stock symbol (1-5 letters)');
        return;
    }

    showLoading();
    document.getElementById('searchButton').disabled = true;

    try {
        // Try using Alpha Vantage API first (more reliable)
        console.log('Trying Alpha Vantage...');
        await searchStockAlphaVantage(symbol, timeRange);
        console.log('Alpha Vantage succeeded');
    } catch (error) {
        console.error('Alpha Vantage failed:', error.message);
        try {
            // Fallback to Yahoo Finance
            console.log('Trying Yahoo Finance...');
            await searchStockYahoo(symbol, timeRange);
            console.log('Yahoo Finance succeeded');
        } catch (yahooError) {
            console.error('Yahoo Finance also failed:', yahooError.message);
            try {
                // Use mock data as last resort
                console.log('Using mock data...');
                await searchStockMockData(symbol, timeRange);
                console.log('Mock data generated successfully');
                
                // Use utility function for better error formatting if available
                const errorMessage = typeof formatErrorMessage === 'function' 
                    ? formatErrorMessage(error) 
                    : `Could not fetch real data for ${symbol}. Showing demo data instead.`;
                showError(errorMessage);
            } catch (mockError) {
                console.error('Even mock data failed:', mockError);
                showError(`Failed to generate any data for ${symbol}. Please try again.`);
            }
        }
    } finally {
        hideLoading();
        document.getElementById('searchButton').disabled = false;
    }
}

async function searchStockAlphaVantage(symbol, timeRange) {
    // Get daily time series data
    const apiKey = getApiKey();
    const url = `${ALPHA_VANTAGE_BASE_URL}?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}&outputsize=compact`;
    
    console.log('Fetching from Alpha Vantage:', url);
    
    const timeSeriesResponse = await fetch(url);
    
    if (!timeSeriesResponse.ok) {
        throw new Error(`Alpha Vantage HTTP error: ${timeSeriesResponse.status} ${timeSeriesResponse.statusText}`);
    }
    
    const timeSeriesData = await timeSeriesResponse.json();
    console.log('Alpha Vantage response:', timeSeriesData);
    
    // Check for various Alpha Vantage error conditions
    if (timeSeriesData['Error Message']) {
        throw new Error(`Alpha Vantage Error: ${timeSeriesData['Error Message']}`);
    }
    
    if (timeSeriesData['Note']) {
        throw new Error(`Alpha Vantage Rate Limit: ${timeSeriesData['Note']}`);
    }
    
    if (timeSeriesData['Information']) {
        throw new Error(`Alpha Vantage Info: ${timeSeriesData['Information']}`);
    }
    
    if (!timeSeriesData['Time Series (Daily)']) {
        throw new Error('No time series data available');
    }
    
    // Process Alpha Vantage data
    const timeSeries = timeSeriesData['Time Series (Daily)'];
    const dates = Object.keys(timeSeries).sort().slice(-timeRange);
    
    const labels = [];
    const prices = [];
    
    dates.forEach(date => {
        labels.push(new Date(date).toLocaleDateString());
        prices.push(parseFloat(timeSeries[date]['4. close']));
    });
    
    const currentPrice = prices[prices.length - 1];
    const previousPrice = prices[prices.length - 2] || currentPrice;
    
    // Create mock quote data
    const quote = {
        longName: symbol + ' Inc.',
        shortName: symbol,
        regularMarketPrice: currentPrice,
        regularMarketPreviousClose: previousPrice,
        regularMarketDayHigh: Math.max(...prices.slice(-5)),
        regularMarketDayLow: Math.min(...prices.slice(-5))
    };
    
    // Create mock chart result
    const chartResult = {
        meta: {
            regularMarketPrice: currentPrice,
            previousClose: previousPrice,
            regularMarketDayHigh: quote.regularMarketDayHigh,
            regularMarketDayLow: quote.regularMarketDayLow
        },
        timestamp: dates.map(date => new Date(date).getTime() / 1000),
        indicators: {
            quote: [{
                close: prices
            }]
        }
    };
    
    updateStockInfo(chartResult, quote, symbol);
    createChart(chartResult, quote.longName);
}

async function searchStockYahoo(symbol, timeRange) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - timeRange);

    const startTimestamp = Math.floor(startDate.getTime() / 1000);
    const endTimestamp = Math.floor(endDate.getTime() / 1000);

    // Try multiple CORS proxies as backup
    const corsProxies = [
        'https://api.allorigins.win/raw?url=',
        'https://cors-anywhere.herokuapp.com/',
        'https://api.codetabs.com/v1/proxy?quest='
    ];

    let lastError = null;

    for (const proxy of corsProxies) {
        try {
            console.log(`Trying CORS proxy: ${proxy}`);
            
            const [chartResponse, quoteResponse] = await Promise.all([
                fetch(`${proxy}${encodeURIComponent(YF_BASE_URL + '/v7/finance/chart/' + symbol + '?period1=' + startTimestamp + '&period2=' + endTimestamp + '&interval=1d')}`),
                fetch(`${proxy}${encodeURIComponent(YF_BASE_URL + '/v6/finance/quote?symbols=' + symbol)}`)
            ]);

            console.log('Chart response status:', chartResponse.status);
            console.log('Quote response status:', quoteResponse.status);
            
            if (!chartResponse.ok || !quoteResponse.ok) {
                throw new Error(`HTTP error - Chart: ${chartResponse.status}, Quote: ${quoteResponse.status}`);
            }
            
            const chartData = await chartResponse.json();
            const quoteData = await quoteResponse.json();

            console.log('Chart data:', chartData);
            console.log('Quote data:', quoteData);

            if (!chartData || !chartData.chart || chartData.chart.error || !chartData.chart.result || chartData.chart.result.length === 0) {
                throw new Error('Invalid chart data or no data available');
            }

            if (!quoteData || !quoteData.quoteResponse || quoteData.quoteResponse.error || !quoteData.quoteResponse.result || quoteData.quoteResponse.result.length === 0) {
                throw new Error('Unable to fetch quote data');
            }

            const result = chartData.chart.result[0];
            const quote = quoteData.quoteResponse.result[0];

            if (!result || !quote) {
                throw new Error('Invalid response data structure');
            }

            updateStockInfo(result, quote, symbol);
            createChart(result, quote.longName || quote.shortName || symbol);
            return; // Success, exit function
            
        } catch (error) {
            console.error(`Proxy ${proxy} failed:`, error);
            lastError = error;
            continue; // Try next proxy
        }
    }
    
    // If all proxies failed, throw the last error
    throw new Error(`All Yahoo Finance proxies failed. Last error: ${lastError.message}`);
}

async function searchStockMockData(symbol, timeRange) {
    console.log('Generating mock data for', symbol, 'with timeRange:', timeRange);
    
    // Generate realistic mock data
    const basePrice = 50 + Math.random() * 200; // Random price between 50-250
    const timestamps = [];
    const prices = [];
    
    // Ensure we have valid timeRange
    const validTimeRange = Math.max(timeRange || 30, 7);
    
    for (let i = validTimeRange; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        timestamps.push(Math.floor(date.getTime() / 1000)); // Store as timestamp
        
        // Generate price with some realistic variation and trend
        const trendFactor = (validTimeRange - i) / validTimeRange; // 0 to 1
        const volatility = (Math.random() - 0.5) * 0.15; // ±7.5% daily variation
        const trend = Math.sin(trendFactor * Math.PI) * 0.1; // Gentle trend
        
        const price = basePrice * (1 + trend + volatility);
        prices.push(Math.max(price, 1)); // Ensure positive price
    }
    
    const currentPrice = prices[prices.length - 1];
    const previousPrice = prices[prices.length - 2] || currentPrice;
    
    const quote = {
        longName: `${symbol} Corporation`,
        shortName: symbol,
        regularMarketPrice: currentPrice,
        regularMarketPreviousClose: previousPrice,
        regularMarketDayHigh: Math.max(...prices.slice(-5)) * 1.02,
        regularMarketDayLow: Math.min(...prices.slice(-5)) * 0.98
    };
    
    const chartResult = {
        meta: {
            regularMarketPrice: currentPrice,
            previousClose: previousPrice,
            regularMarketDayHigh: quote.regularMarketDayHigh,
            regularMarketDayLow: quote.regularMarketDayLow
        },
        timestamp: timestamps,
        indicators: {
            quote: [{
                close: prices
            }]
        }
    };
    
    console.log('Mock data created successfully:', { symbol, dataPoints: prices.length, priceRange: [Math.min(...prices), Math.max(...prices)] });
    updateStockInfo(chartResult, quote, symbol);
    createChart(chartResult, quote.longName);
}

function updateStockInfo(chartResult, quote, symbol) {
    const meta = chartResult.meta || {};
    const currentPrice = meta.regularMarketPrice || (quote && quote.regularMarketPrice);
    const previousClose = meta.previousClose || (quote && quote.regularMarketPreviousClose);
    const dayHigh = meta.regularMarketDayHigh || (quote && quote.regularMarketDayHigh);
    const dayLow = meta.regularMarketDayLow || (quote && quote.regularMarketDayLow);

    document.getElementById('companyName').textContent = (quote && (quote.longName || quote.shortName)) || symbol;
    document.getElementById('currentPrice').textContent = currentPrice ? `${currentPrice.toFixed(2)}`: '-';
    
    if (currentPrice && previousClose) {
        const change = currentPrice - previousClose;
        const changePercent = (change/previousClose) * 100;
        const changeText = `${change >= 0 ? '+' : ''}${change.toFixed(2)} (${changePercent.toFixed(2)}%)`;
        const changeElement = document.getElementById('priceChange');
        changeElement.textContent = changeText;
        changeElement.className = `info-value price-change ${change >= 0 ? 'positive' : 'negative'}`;
    }

    document.getElementById('dayHigh').textContent = dayHigh ? `${dayHigh.toFixed(2)}`: '-';
    document.getElementById('dayLow').textContent = dayLow ? `${dayLow.toFixed(2)}` : '-';

    document.getElementById('stockInfo').classList.add('show');
}

function createChart(chartResult, companyName) {
    console.log('createChart called with:', chartResult, companyName);
    const ctx = document.getElementById('stockChart').getContext('2d');
    console.log('Canvas context:', ctx);

    if (chart) {
        chart.destroy();
    }

    // Validate chartResult data first
    if (!chartResult || !chartResult.timestamp || !chartResult.indicators || !chartResult.indicators.quote || !chartResult.indicators.quote[0]) {
        console.error('Invalid chartResult data:', chartResult);
        showError('Invalid chart data received.');
        return;
    }

    const timestamps = chartResult.timestamp;
    const indicators = chartResult.indicators.quote[0];
    const closes = indicators.close;

    const labels = [];
    const prices = [];

    for (let i = 0; i < timestamps.length; i++) {
        if (closes[i] !== null && closes[i] !== undefined) {
            const date = new Date(timestamps[i] * 1000);
            labels.push(date.toLocaleDateString());
            prices.push(closes[i]);
        }
    }

    console.log('Chart data prepared:', { labels, prices });

    // Get theme-aware colors
    const isDarkMode = window.themeManager && window.themeManager.isDarkMode();
    const textColor = isDarkMode ? '#f7fafc' : '#4a5568';
    const gridColor = isDarkMode ? '#4a5568' : 'rgba(0,0,0, 0.1)';
    const lineColor = isDarkMode ? '#68d391' : '#38a169';
    
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    if (isDarkMode) {
        gradient.addColorStop(0, 'rgba(104, 211, 145, 0.3)');
        gradient.addColorStop(1, 'rgba(104, 211, 145, 0.05)');
    } else {
        gradient.addColorStop(0, 'rgba(102, 126, 234, 0.3)');
        gradient.addColorStop(1, 'rgba(102, 106, 234, 0.05)');
    }

    console.log('Creating Chart.js instance...');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `${companyName} Stock Price`,
                data: prices,
                borderColor: lineColor,
                backgroundColor: gradient,
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: lineColor,
                pointBorderColor: isDarkMode ? '#2d3748' : '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
            }]
        }, 
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: {
                            size: 14,
                            weight: '600'
                        },
                        color: textColor
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: isDarkMode ? 'rgba(45, 55, 72, 0.9)' : 'rgba(0,0,0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: lineColor,
                    borderWidth: 1,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            return `Price: $${context.parsed.y.toFixed(2)}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: gridColor,
                        drawBorder: false
                    },
                    ticks: {
                        color: textColor,
                        font: {
                            size: 12
                        },
                        maxTicksLimit: 8
                    }
                },
                y: {
                    grid: {
                        color: gridColor,
                        drawBorder: false
                    },
                    ticks: {
                        color: textColor,
                        font: {
                            size: 12
                        },
                        callback: function (value) {
                            return '$' + value.toFixed(2);
                        }
                    }
                }
            }
        }
    });

}

function showLoading() {
    document.getElementById('loading').classList.add('show');
}

function hideLoading() {
    document.getElementById('loading').classList.remove('show');
}

function showError(message) {
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = message;
    errorDiv.classList.add('show');
}

function hideError() {
    document.getElementById('error').classList.remove('show');
}

function generateMockCandleData(currentPrice, days) {
    const timestamps = [];
    const closePrices = [];
    const now = Math.floor(Date.now() / 1000);
    
    // Generate mock data starting from 'days' ago
    for (let i = days; i >= 0; i--) {
        const timestamp = now - (i * 24 * 60 * 60); // Go back day by day
        timestamps.push(timestamp);
        
        // Generate a price with some random variation around current price
        const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
        const price = currentPrice * (1 + variation * (i / days)); // Trend toward current
        closePrices.push(Math.max(price, 0.01)); // Ensure positive price
    }
    
    return {
        t: timestamps,
        c: closePrices,
        s: "ok"
    };
}

console.log("You are needed!")

// Test Chart.js availability when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');
    
    // Test Chart.js availability
    if (typeof Chart !== 'undefined') {
        console.log('Chart.js is loaded successfully');
    } else {
        console.error('Chart.js is not loaded!');
    }

    // Test if canvas element exists
    const testCanvas = document.getElementById('stockChart');
    if (testCanvas) {
        console.log('Canvas element found');
        const ctx = testCanvas.getContext('2d');
        console.log('Canvas context:', ctx);
    } else {
        console.error('Canvas element not found!');
    }
    
    // Initialize comparison mode
    initializeComparisonMode();
    
    console.log('Ready to search stocks');
});

// Comparison Mode Variables
let chartA = null;
let chartB = null;
let isComparisonMode = false;

// Initialize comparison mode functionality
function initializeComparisonMode() {
    const comparisonToggle = document.getElementById('comparisonMode');
    if (comparisonToggle) {
        comparisonToggle.addEventListener('change', toggleComparisonMode);
    }

    // Add click listeners for external labels
    const singleLabel = document.getElementById('singleLabel');
    const compareLabel = document.getElementById('compareLabel');
    
    if (singleLabel) {
        singleLabel.addEventListener('click', () => {
            if (isComparisonMode) {
                document.getElementById('comparisonMode').click();
            }
        });
    }
    
    if (compareLabel) {
        compareLabel.addEventListener('click', () => {
            if (!isComparisonMode) {
                document.getElementById('comparisonMode').click();
            }
        });
    }

    // Add enter key listeners for comparison inputs
    const symbolAInput = document.getElementById('symbolA');
    const symbolBInput = document.getElementById('symbolB');
    
    if (symbolAInput) {
        symbolAInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                compareStocks();
            }
        });
    }
    
    if (symbolBInput) {
        symbolBInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                compareStocks();
            }
        });
    }
    
    // Initialize label states
    updateModeLabels();
}

// Toggle between single and comparison mode
function toggleComparisonMode() {
    const comparisonModeToggle = document.getElementById('comparisonMode');
    isComparisonMode = comparisonModeToggle.checked;
    
    const singleMode = document.getElementById('singleMode');
    const comparisonModeContainer = document.getElementById('comparisonModeContainer');
    const singleChartContainer = document.getElementById('singleChartContainer');
    const comparisonChartContainer = document.getElementById('comparisonChartContainer');
    
    if (isComparisonMode) {
        // Switch to comparison mode
        singleMode.style.display = 'none';
        comparisonModeContainer.style.display = 'block';
        singleChartContainer.style.display = 'none';
        comparisonChartContainer.style.display = 'block';
        
        // Clear single chart
        if (chart) {
            chart.destroy();
            chart = null;
        }
        clearStockInfo();
    } else {
        // Switch to single mode
        singleMode.style.display = 'block';
        comparisonModeContainer.style.display = 'none';
        singleChartContainer.style.display = 'block';
        comparisonChartContainer.style.display = 'none';
        
        // Clear comparison charts
        if (chartA) {
            chartA.destroy();
            chartA = null;
        }
        if (chartB) {
            chartB.destroy();
            chartB = null;
        }
        clearComparisonInfo();
    }
    
    // Update labels and description
    updateModeLabels();
    hideError();
}

// Update mode labels and description
function updateModeLabels() {
    const singleLabel = document.getElementById('singleLabel');
    const compareLabel = document.getElementById('compareLabel');
    const modeDescription = document.getElementById('modeDescription');
    
    if (singleLabel && compareLabel && modeDescription) {
        if (isComparisonMode) {
            singleLabel.classList.remove('active');
            compareLabel.classList.add('active');
            modeDescription.textContent = 'Compare two stocks side by side';
        } else {
            singleLabel.classList.add('active');
            compareLabel.classList.remove('active');
            modeDescription.textContent = 'View individual stock charts';
        }
    }
}

// Compare two stocks side by side
async function compareStocks() {
    const symbolA = document.getElementById('symbolA').value.trim().toUpperCase();
    const symbolB = document.getElementById('symbolB').value.trim().toUpperCase();
    const timeRange = parseInt(document.getElementById('comparisonTimeRange').value);
    
    console.log('Comparing stocks:', symbolA, 'vs', symbolB, 'timeRange:', timeRange);
    
    hideError();
    
    if (!symbolA || !symbolB) {
        showError('Please enter both stock symbols for comparison');
        return;
    }
    
    if (symbolA === symbolB) {
        showError('Please enter different stock symbols for comparison');
        return;
    }
    
    // Validate symbols if utility function is available
    if (typeof isValidStockSymbol === 'function') {
        if (!isValidStockSymbol(symbolA)) {
            showError(`Invalid stock symbol: ${symbolA}`);
            return;
        }
        if (!isValidStockSymbol(symbolB)) {
            showError(`Invalid stock symbol: ${symbolB}`);
            return;
        }
    }
    
    showLoading();
    document.getElementById('compareButton').disabled = true;
    
    try {
        // Fetch both stocks simultaneously
        const [dataA, dataB] = await Promise.all([
            fetchStockData(symbolA, timeRange),
            fetchStockData(symbolB, timeRange)
        ]);
        
        // Update titles
        document.getElementById('stockATitle').textContent = symbolA;
        document.getElementById('stockBTitle').textContent = symbolB;
        
        // Update stock info
        updateComparisonStockInfo('A', dataA, symbolA);
        updateComparisonStockInfo('B', dataB, symbolB);
        
        // Create charts
        createComparisonChart('A', dataA, symbolA);
        createComparisonChart('B', dataB, symbolB);
        
    } catch (error) {
        console.error('Comparison failed:', error);
        showError(`Failed to compare stocks: ${error.message}`);
    } finally {
        hideLoading();
        document.getElementById('compareButton').disabled = false;
    }
}

// Fetch stock data (unified function for both Alpha Vantage and Yahoo Finance)
async function fetchStockData(symbol, timeRange) {
    try {
        // Try Alpha Vantage first
        console.log(`Fetching ${symbol} data from Alpha Vantage...`);
        return await fetchStockDataAlphaVantage(symbol, timeRange);
    } catch (error) {
        console.error(`Alpha Vantage failed for ${symbol}:`, error.message);
        try {
            // Fallback to Yahoo Finance
            console.log(`Fetching ${symbol} data from Yahoo Finance...`);
            return await fetchStockDataYahoo(symbol, timeRange);
        } catch (yahooError) {
            console.error(`Yahoo Finance failed for ${symbol}:`, yahooError.message);
            // Use mock data as last resort
            console.log(`Using mock data for ${symbol}...`);
            return await generateMockStockData(symbol, timeRange);
        }
    }
}

// Helper function to fetch from Alpha Vantage
async function fetchStockDataAlphaVantage(symbol, timeRange) {
    const apiKey = getApiKey();
    const url = `${ALPHA_VANTAGE_BASE_URL}?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data['Error Message']) {
        throw new Error(`Stock symbol ${symbol} not found`);
    }
    
    if (data['Note']) {
        throw new Error('API call frequency exceeded. Please try again later.');
    }
    
    const timeSeries = data['Time Series (Daily)'];
    if (!timeSeries) {
        throw new Error(`No data available for ${symbol}`);
    }
    
    return processAlphaVantageData(timeSeries, timeRange, symbol);
}

// Helper function to fetch from Yahoo Finance
async function fetchStockDataYahoo(symbol, timeRange) {
    const endTime = Math.floor(Date.now() / 1000);
    const startTime = endTime - (timeRange * 24 * 60 * 60);
    const url = `${CORS_PROXY}${encodeURIComponent(`${YF_BASE_URL}/v8/finance/chart/${symbol}?period1=${startTime}&period2=${endTime}&interval=1d`)}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.chart || !data.chart.result || data.chart.result.length === 0) {
        throw new Error(`No data available for ${symbol}`);
    }
    
    return processYahooFinanceData(data.chart.result[0], symbol);
}

// Process Alpha Vantage data for comparison
function processAlphaVantageData(timeSeries, timeRange, symbol) {
    const dates = Object.keys(timeSeries).sort().slice(-timeRange);
    const prices = [];
    
    dates.forEach(date => {
        const dayData = timeSeries[date];
        prices.push({
            date: date,
            open: parseFloat(dayData['1. open']),
            high: parseFloat(dayData['2. high']),
            low: parseFloat(dayData['3. low']),
            close: parseFloat(dayData['4. close']),
            volume: parseInt(dayData['5. volume'])
        });
    });
    
    const currentPrice = prices[prices.length - 1].close;
    const previousPrice = prices.length > 1 ? prices[prices.length - 2].close : currentPrice;
    const change = currentPrice - previousPrice;
    
    return {
        symbol: symbol,
        prices: prices,
        currentPrice: currentPrice,
        companyName: `${symbol} Inc.`,
        change: change
    };
}

// Process Yahoo Finance data for comparison
function processYahooFinanceData(result, symbol) {
    const timestamps = result.timestamp || [];
    const quotes = result.indicators.quote[0];
    const prices = [];
    
    timestamps.forEach((timestamp, index) => {
        const date = new Date(timestamp * 1000).toISOString().split('T')[0];
        prices.push({
            date: date,
            open: quotes.open[index] || 0,
            high: quotes.high[index] || 0,
            low: quotes.low[index] || 0,
            close: quotes.close[index] || 0,
            volume: quotes.volume[index] || 0
        });
    });
    
    const currentPrice = result.meta.regularMarketPrice || prices[prices.length - 1].close;
    const previousPrice = result.meta.previousClose || (prices.length > 1 ? prices[prices.length - 2].close : currentPrice);
    const change = currentPrice - previousPrice;
    
    return {
        symbol: symbol,
        prices: prices,
        currentPrice: currentPrice,
        companyName: `${symbol} Corporation`,
        change: change
    };
}

// Helper function to generate mock data
async function generateMockStockData(symbol, timeRange) {
    const basePrice = Math.random() * 200 + 50; // Random price between 50-250
    const mockData = [];
    const dates = [];
    
    for (let i = timeRange - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dates.push(date.toISOString().split('T')[0]);
        
        const variation = (Math.random() - 0.5) * 10; // ±5 variation
        const price = Math.max(1, basePrice + variation);
        
        mockData.push({
            date: date.toISOString().split('T')[0],
            open: price * (0.99 + Math.random() * 0.02),
            high: price * (1.01 + Math.random() * 0.02),
            low: price * (0.98 + Math.random() * 0.02),
            close: price,
            volume: Math.floor(Math.random() * 1000000) + 100000
        });
    }
    
    return {
        symbol: symbol,
        prices: mockData,
        currentPrice: mockData[mockData.length - 1].close,
        companyName: `${symbol} Corporation`,
        change: mockData.length > 1 ? 
            mockData[mockData.length - 1].close - mockData[mockData.length - 2].close : 0
    };
}

// Update stock info for comparison mode
function updateComparisonStockInfo(side, data, symbol) {
    const currentPrice = data.currentPrice || data.prices[data.prices.length - 1].close;
    const change = data.change || 0;
    const changePercent = currentPrice !== 0 ? (change / currentPrice) * 100 : 0;
    
    document.getElementById(`companyName${side}`).textContent = data.companyName || symbol;
    document.getElementById(`currentPrice${side}`).textContent = `$${currentPrice.toFixed(2)}`;
    
    const changeElement = document.getElementById(`priceChange${side}`);
    const changeText = `${change >= 0 ? '+' : ''}${change.toFixed(2)} (${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%)`;
    changeElement.textContent = changeText;
    changeElement.className = `info-value price-change ${change >= 0 ? 'positive' : 'negative'}`;
}

// Create comparison chart
function createComparisonChart(side, data, symbol) {
    const canvasId = `stockChart${side}`;
    const canvas = document.getElementById(canvasId);
    
    if (!canvas) {
        console.error(`Canvas element ${canvasId} not found`);
        return;
    }
    
    // Destroy existing chart
    if (side === 'A' && chartA) {
        chartA.destroy();
    } else if (side === 'B' && chartB) {
        chartB.destroy();
    }
    
    const ctx = canvas.getContext('2d');
    const prices = data.prices || [];
    
    const chartData = {
        labels: prices.map(item => {
            const date = new Date(item.date);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }),
        datasets: [{
            label: `${symbol} Price`,
            data: prices.map(item => item.close),
            borderColor: side === 'A' ? '#667eea' : '#764ba2',
            backgroundColor: side === 'A' ? 'rgba(102, 126, 234, 0.1)' : 'rgba(118, 75, 162, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4
        }]
    };
    
    const config = {
        type: 'line',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: symbol,
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toFixed(2);
                        }
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    };
    
    const newChart = new Chart(ctx, config);
    
    if (side === 'A') {
        chartA = newChart;
    } else {
        chartB = newChart;
    }
}

// Clear comparison info
function clearComparisonInfo() {
    ['A', 'B'].forEach(side => {
        document.getElementById(`companyName${side}`).textContent = '-';
        document.getElementById(`currentPrice${side}`).textContent = '-';
        document.getElementById(`priceChange${side}`).textContent = '-';
        document.getElementById(`priceChange${side}`).className = 'info-value price-change';
    });
    
    document.getElementById('stockATitle').textContent = 'Stock A';
    document.getElementById('stockBTitle').textContent = 'Stock B';
}