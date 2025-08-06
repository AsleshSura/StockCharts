let chart = null;

// Check if Chart.js is loaded when page loads
document.addEventListener('DOMContentLoaded', function() {
    if (typeof Chart === 'undefined') {
        console.error('Chart.js failed to load');
        showError('Chart.js library failed to load. Please check your internet connection and refresh the page.');
    } else {
        console.log('Chart.js loaded successfully, version:', Chart.version);
    }
});

document.getElementById('companySymbol').addEventListener('keypress', function(e){
    if (e.key === 'Enter') {
        searchStock();
    }
});

document.getElementById('apiKey').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        searchStock();
    }
});

async function searchStock() {
    const apiKey = document.getElementById('apiKey').value.trim();
    const symbol = document.getElementById('companySymbol').value.trim().toUpperCase();
    const timeRange = parseInt(document.getElementById('timeRange').value);

    hideError();

    if (!apiKey) {
        showError('Please enter your Finnhub API key');
        return;
    }

    if (!symbol) {
        showError('Please enter a stock symbol');
        return;
    }

    showLoading();
    document.getElementById('searchButton').disabled = true;

    try {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - timeRange);

        const startTimestamp = Math.floor(startDate.getTime() / 1000);
        const endTimestamp = Math.floor(endDate.getTime() / 1000);

        console.log('Fetching data for:', symbol);
        console.log('API Key length:', apiKey.length);
        console.log('API Key first/last chars:', apiKey.charAt(0) + '...' + apiKey.charAt(apiKey.length-1));
        console.log('Date range:', new Date(startTimestamp * 1000), 'to', new Date(endTimestamp * 1000));

        // Test API key with a simple request first
        console.log('Testing API key...');
        const testResponse = await fetch(`https://finnhub.io/api/v1/quote?symbol=AAPL&token=${apiKey}`);
        console.log('API Key test status:', testResponse.status);
        
        if (testResponse.status === 401) {
            throw new Error('Invalid API key. Please check your Finnhub API key and try again.');
        }

        const [profileResponse, quoteResponse, candleResponse] = await Promise.all([
            fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${apiKey}`),
            fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`),
            fetch(`https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=D&from=${startTimestamp}&to=${endTimestamp}&token=${apiKey}`)
        ]);

        console.log('Response status:', {
            profile: profileResponse.status,
            quote: quoteResponse.status,
            candle: candleResponse.status
        });

        if (!profileResponse.ok || !quoteResponse.ok || !candleResponse.ok) {
            // Log the specific error responses
            if (!profileResponse.ok) console.error('Profile API error:', profileResponse.status, profileResponse.statusText);
            if (!quoteResponse.ok) console.error('Quote API error:', quoteResponse.status, quoteResponse.statusText);
            if (!candleResponse.ok) console.error('Candle API error:', candleResponse.status, candleResponse.statusText);
            
            // If candle data fails but profile and quote work, show stock info without chart
            if (profileResponse.ok && quoteResponse.ok && !candleResponse.ok) {
                const profile = await profileResponse.json();
                const quote = await quoteResponse.json();
                
                if (profile.name || quote.c) {
                    updateStockInfo(profile, quote, symbol);
                    
                    // Try to create a demo chart with mock data
                    const mockCandle = generateMockCandleData(quote.c, timeRange);
                    createChart(mockCandle, profile.name || symbol);
                    
                    showError('Using demo chart data due to API limitations. Real-time price shown above.');
                    return;
                }
            }
            
            throw new Error(`API Error: ${!profileResponse.ok ? 'Profile ' + profileResponse.status : ''} ${!quoteResponse.ok ? 'Quote ' + quoteResponse.status : ''} ${!candleResponse.ok ? 'Candle ' + candleResponse.status : ''}`);
        }

        const profile = await profileResponse.json();
        const quote = await quoteResponse.json();
        const candle = await candleResponse.json();

        console.log('API Responses:', {
            profile: profile,
            quote: quote,
            candle: candle
        });

        if (candle.s === "no_data") {
            throw new Error('No data available for this symbol');
        }

        if (!profile.name && !quote.c) {
            throw new Error('Invalid stock symbol or API limit reached');
        }

        updateStockInfo(profile, quote, symbol);

        createChart(candle, profile.name || symbol);

    } catch (error) {
        console.error('Error:', error);
        showError(error.message || 'Failed to fetch stock data. Please check your API key and symbol.');
    } finally {
        hideLoading();
        document.getElementById('searchButton').disabled = false;
    }
}

function updateStockInfo(profile, quote, symbol) {
    document.getElementById('companyName').textContent = profile.name || symbol;
    document.getElementById('currentPrice').textContent = quote.c ? `$${quote.c.toFixed(2)}`: '-';
    
    if (quote.d !== undefined && quote.dp !== undefined) {
        const change = quote.d;
        const changePercent= quote.dp;
        const changeText = `${change >= 0 ? '+' : ''}${change.toFixed(2)} (${changePercent.toFixed(2)}%)`;
        const changeElement = document.getElementById('priceChange');
        changeElement.textContent = changeText;
        changeElement.className = `info-value price-change ${change >= 0 ? 'positive' : 'negative'}`;
    }

    document.getElementById('dayHigh').textContent = quote.h ? `$${quote.h.toFixed(2)}`: '-';
    document.getElementById('dayLow').textContent = quote.l ? `$${quote.l.toFixed(2)}` : '-';

    document.getElementById('stockInfo').classList.add('show');
}

function createChart(candle, companyName) {
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.error('Chart.js is not loaded!');
        showError('Chart library failed to load. Please refresh the page and try again.');
        return;
    }

    const ctx = document.getElementById('stockChart').getContext('2d');

    if (chart) {
        chart.destroy();
    }

    // Validate candle data
    if (!candle || !candle.t || !candle.c) {
        console.error('Invalid candle data:', candle);
        showError('Invalid chart data received.');
        return;
    }

    const labels = candle.t.map(timestamp => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString();
    });

    const prices = candle.c;

    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(102, 126, 234, 0.3)');
    gradient.addColorStop(1, 'rgba(102, 106, 234, 0.05)');

    try {
        chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `${companyName} Stock Price`,
                data: prices,
                borderColor: '#667eea',
                backgroundColor: gradient,
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#667eea',
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
                    borderColor: '#667eea',
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
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
            }
        });
    } catch (error) {
        console.error('Error creating chart:', error);
        showError('Failed to create chart. Chart.js may not be properly loaded.');
    }
}function showLoading() {
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