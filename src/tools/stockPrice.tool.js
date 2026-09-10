const stocksData = require('../data/stocks.json');

/**
 * Tool: Fetch mock stock price
 */
function getStockPrice(symbol) {
  if (!symbol) return null;
  const cleanSymbol = symbol.toUpperCase().trim();
  const price = stocksData.prices[cleanSymbol];

  if (!price) {
    return {
      error: `Stock symbol '${cleanSymbol}' not found.`
    };
  }

  return {
    symbol: cleanSymbol,
    price: price
  };
}

module.exports = { getStockPrice };