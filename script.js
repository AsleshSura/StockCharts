let chart = null;

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

        const [profileResponse, quoteResponse, candleResponse] = await Promise.all([
            fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${apiKey}`),
            fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`),
            fetch(`https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=D&from=${startTimestamp}&to=${endTimestamp}&token=${apiKey}`)
        ]);

        if (!profileResponse.ok || !quoteResponse.ok || !candleResponse.ok) {
            throw new Error('Failed to fetch stock data');
        }

        const profile = await profileResponse.json();
        const quote = await quoteResponse.json();
        const candle = await candleResponse.json();

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
    const ctx = document.getElementById('stockChart').getContext('2d');

    if (chart) {
        chart.destroy();
    }

    const labels = candle.t.map(timestamp => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString();
    });

    const prices = candle.c;

    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(102, 126, 234, 0.3');
    gradient.addColorStop(1, 'rgba(102, 106, 234, 0.05');

    chart = new chart(ctx, {
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
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(0,0,0, 0.1',
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