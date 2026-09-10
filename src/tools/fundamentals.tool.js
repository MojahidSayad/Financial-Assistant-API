const stocksData = require('../data/stocks.json');

/**
 * Tool: Fetch mock stock fundamentals
 */
function getFundamentals(symbol) {
  if (!symbol) return null;
  const cleanSymbol = symbol.toUpperCase().trim();
  const fundamentals = stocksData.fundamentals[cleanSymbol];

  if (!fundamentals) {
    return {
      error: `Fundamentals for symbol '${cleanSymbol}' not found.`
    };
  }

  return fundamentals;
}

module.exports = { getFundamentals };