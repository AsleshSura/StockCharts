// Utility 

// Generate a random stock price between min and max
function getRandomPrice(min = 100, max = 500) {
    return +(Math.random() * (max - min) + min).toFixed(2);
}

// Generate a random date within the last N days
function getRandomDate(daysAgo = 30) {
    const now = new Date();
    const past = new Date(now.getTime() - Math.random() * daysAgo * 24 * 60 * 60 * 1000);
    return past.toISOString().split('T')[0];
}

// Generate mock stock data for a given symbol
function generateMockStockData(symbol = 'AAPL', days = 30) {
    const data = [];
    for (let i = 0; i < days; i++) {
        data.push({
            date: getRandomDate(days),
            price: getRandomPrice(),
        });
    }
    // Sort by date ascending
    data.sort((a, b) => new Date(a.date) - new Date(b.date));
    return data;
}

function movingAverage(data, windowSize = 5) {
    const result = [];
    for (let i = 0; i < data.length; i++) {
        if (i < windowSize - 1) {
            result.push(null);
        } else {
            const window = data.slice(i - windowSize + 1, i + 1);
            const avg = window.reduce((sum, d) => sum + d.price, 0) / window.length;
            result.push(+avg.toFixed(2));
        }
    }
    return result;
}

