import yahooFinance from 'yahoo-finance2';

export async function getQuote(ticker) {
    try {
        const quote = await yahooFinance.quote(ticker);
        return quote;
    } catch (error) {
        console.error(`Failed to fetch quote for ${ticker}:`, error);
        return null;
    }
}

export async function getOptionsChain(ticker) {
    try {
        const queryOptions = { lang: 'en-US', region: 'US' }; // Adjust if needed for TSX
        const result = await yahooFinance.options(ticker, queryOptions);
        return result;
    } catch (error) {
        console.error(`Failed to fetch options for ${ticker}:`, error);
        return null;
    }
}
