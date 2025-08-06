// Using Alpha Vantage free API as fallback
const ALPHA_VANTAGE_API_KEY = 'demo'; // You can get a free key from https://www.alphavantage.co/support/#api-key
const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query';

// Backup Yahoo Finance endpoints
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';
const YF_BASE_URL = 'https://query1.finance.yahoo.com';

let chart = null;

document.getElementById('companySymbol').addEventListener('keypress', function(e){
    if (e.key === 'Enter') {
        searchStock();
    }
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

    showLoading();
    document.getElementById('searchButton').disabled = true;

    try {
        // Try using Alpha Vantage API first (more reliable)
        console.log('Trying Alpha Vantage...');
        await searchStockAlphaVantage(symbol, timeRange);
    } catch (error) {
        console.error('Alpha Vantage failed, trying Yahoo Finance:', error);
        try {
            // Fallback to Yahoo Finance
            console.log('Trying Yahoo Finance...');
            await searchStockYahoo(symbol, timeRange);
        } catch (yahooError) {
            console.error('Both APIs failed, using mock data:', yahooError);
            // Use mock data as last resort
            console.log('Using mock data...');
            await searchStockMockData(symbol, timeRange);
        }
    } finally {
        hideLoading();
        document.getElementById('searchButton').disabled = false;
    }
}

async function searchStockAlphaVantage(symbol, timeRange) {
    // Get daily time series data
    const timeSeriesResponse = await fetch(
        `${ALPHA_VANTAGE_BASE_URL}?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}&outputsize=compact`
    );
    
    if (!timeSeriesResponse.ok) {
        throw new Error('Failed to fetch from Alpha Vantage');
    }
    
    const timeSeriesData = await timeSeriesResponse.json();
    console.log('Alpha Vantage response:', timeSeriesData);
    
    if (timeSeriesData['Error Message'] || timeSeriesData['Note']) {
        throw new Error(timeSeriesData['Error Message'] || 'API rate limit exceeded');
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

    const [chartResponse, quoteResponse] = await Promise.all([
        fetch(`${CORS_PROXY}${encodeURIComponent(YF_BASE_URL + '/v7/finance/chart/' + symbol + '?period1=' + startTimestamp + '&period2=' + endTimestamp + '&interval=1d')}`),
        fetch(`${CORS_PROXY}${encodeURIComponent(YF_BASE_URL + '/v6/finance/quote?symbols=' + symbol)}`)
    ]);

    console.log('Chart response status:', chartResponse.status);
    console.log('Quote response status:', quoteResponse.status);
    
    if (!chartResponse.ok || !quoteResponse.ok) {
        throw new Error(`Failed to fetch stock data. Chart: ${chartResponse.status}, Quote: ${quoteResponse.status}`);
    }
    
    const chartData = await chartResponse.json();
    const quoteData = await quoteResponse.json();

    console.log('Chart data:', chartData);
    console.log('Quote data:', quoteData);

    if (!chartData || !chartData.chart || chartData.chart.error || !chartData.chart.result || chartData.chart.result.length === 0) {
        throw new Error('Invalid stock symbol or no data available');
    }

    if (!quoteData || !quoteData.quoteResponse || quoteData.quoteResponse.error || !quoteData.quoteResponse.result || quoteData.quoteResponse.result.length === 0) {
        throw new Error('Unable to fetch current quote data');
    }

    const result = chartData.chart.result[0];
    const quote = quoteData.quoteResponse.result[0];

    if (!result || !quote) {
        throw new Error('Invalid response data structure');
    }

    updateStockInfo(result, quote, symbol);
    createChart(result, quote.longName || quote.shortName || symbol);
}

async function searchStockMockData(symbol, timeRange) {
    console.log('Using mock data for', symbol);
    
    // Generate realistic mock data
    const currentPrice = 100 + Math.random() * 200; // Random price between 100-300
    const timestamps = [];
    const prices = [];
    
    for (let i = timeRange; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        timestamps.push(Math.floor(date.getTime() / 1000)); // Store as timestamp
        
        // Generate price with some realistic variation
        const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
        const price = currentPrice * (1 + variation * (i / timeRange));
        prices.push(Math.max(price, 1)); // Ensure positive price
    }
    
    const previousPrice = prices[prices.length - 2] || currentPrice;
    
    const quote = {
        longName: `${symbol} Corporation`,
        shortName: symbol,
        regularMarketPrice: currentPrice,
        regularMarketPreviousClose: previousPrice,
        regularMarketDayHigh: Math.max(...prices.slice(-5)),
        regularMarketDayLow: Math.min(...prices.slice(-5))
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
    
    console.log('Mock data created:', chartResult);
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

    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(102, 126, 234, 0.3)');
    gradient.addColorStop(1, 'rgba(102, 106, 234, 0.05)');

    console.log('Creating Chart.js instance...');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `${companyName} Stock Price`,
                data: prices,
                borderColor: '#38a169',
                backgroundColor: gradient,
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#38a169',
                pointBorderColor: '#ffffff',
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
                        color: '#4a5568'
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0,0,0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#38a169',
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
                        color: 'rgba(0,0,0, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#718096',
                        font: {
                            size: 12
                        },
                        maxTicksLimit: 8
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(0,0,0, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#718096',
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
    
    console.log('Ready to search stocks');
});