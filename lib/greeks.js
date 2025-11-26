import greeks from 'greeks';

// Black-Scholes Greeks Calculator
// Note: 'greeks' library expects: greeks.getDelta(price, strike, time, vol, riskFree, type)

const RISK_FREE_RATE = 0.045; // Approx 4.5%

export function calculateOptionGreeks(option, underlyingPrice, daysToExpiration) {
    if (!option || !underlyingPrice) return null;

    const timeToExpiry = daysToExpiration / 365;
    const volatility = option.impliedVolatility || 0.2; // Fallback IV if missing
    const type = option.contractSymbol.includes('C') ? 'call' : 'put'; // Simple heuristic, better to pass type explicitly

    try {
        const delta = greeks.getDelta(underlyingPrice, option.strike, timeToExpiry, volatility, RISK_FREE_RATE, type);
        const gamma = greeks.getGamma(underlyingPrice, option.strike, timeToExpiry, volatility, RISK_FREE_RATE, type);
        const theta = greeks.getTheta(underlyingPrice, option.strike, timeToExpiry, volatility, RISK_FREE_RATE, type);
        const vega = greeks.getVega(underlyingPrice, option.strike, timeToExpiry, volatility, RISK_FREE_RATE, type);

        return { delta, gamma, theta, vega };
    } catch (e) {
        console.error("Error calculating Greeks:", e);
        return { delta: 0, gamma: 0, theta: 0, vega: 0 };
    }
}
