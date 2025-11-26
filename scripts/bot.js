import ibkrService from '../lib/ibkr.js';
import { RSI } from 'technicalindicators';

// Configuration
const WATCHLIST = ['SPY', 'QQQ'];
const RSI_PERIOD = 14;
const BUY_THRESHOLD = 30;
const SELL_THRESHOLD = 70;
const QUANTITY = 1;

// Mock price history storage (In real app, fetch historical data)
const priceHistory = {
    'SPY': [],
    'QQQ': []
};

async function runBot() {
    console.log("🤖 Starting Trading Bot...");

    try {
        ibkrService.connect();
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for connection

        if (!ibkrService.isConnected) {
            console.error("❌ Failed to connect to IBKR. Exiting.");
            process.exit(1);
        }

        console.log("✅ Connected to IBKR. Monitoring market...");

        // Main Bot Loop
        setInterval(async () => {
            for (const symbol of WATCHLIST) {
                try {
                    const price = await ibkrService.getMarketData(symbol);
                    console.log(`[${symbol}] Price: $${price}`);

                    // Update history
                    priceHistory[symbol].push(price);
                    if (priceHistory[symbol].length > RSI_PERIOD + 1) {
                        priceHistory[symbol].shift(); // Keep only necessary history
                    }

                    // Calculate RSI
                    if (priceHistory[symbol].length >= RSI_PERIOD) {
                        const rsiValues = RSI.calculate({
                            values: priceHistory[symbol],
                            period: RSI_PERIOD
                        });
                        const currentRSI = rsiValues[rsiValues.length - 1];

                        console.log(`[${symbol}] RSI: ${currentRSI?.toFixed(2)}`);

                        // Trading Logic
                        if (currentRSI < BUY_THRESHOLD) {
                            console.log(`🚀 BUY SIGNAL for ${symbol} (RSI ${currentRSI} < ${BUY_THRESHOLD})`);
                            await ibkrService.placeOrder(symbol, "BUY", QUANTITY);
                        } else if (currentRSI > SELL_THRESHOLD) {
                            console.log(`🔻 SELL SIGNAL for ${symbol} (RSI ${currentRSI} > ${SELL_THRESHOLD})`);
                            await ibkrService.placeOrder(symbol, "SELL", QUANTITY);
                        }
                    }
                } catch (err) {
                    console.error(`Error processing ${symbol}:`, err.message);
                }
            }
        }, 10000); // Run every 10 seconds

    } catch (error) {
        console.error("Bot Error:", error);
    }
}

runBot();
