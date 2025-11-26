import { IBApi, EventName, ErrorCode } from "@stoqey/ib";

// Configuration
const IB_PORT = 7497; // 7497 = Paper Trading, 7496 = Live Trading
const IB_HOST = "127.0.0.1";

class IBKRService {
    constructor() {
        this.ib = new IBApi({
            host: IB_HOST,
            port: IB_PORT,
            clientId: Math.floor(Math.random() * 1000) + 1, // Random Client ID to avoid conflicts
        });

        this.isConnected = false;

        this.setupListeners();
    }

    setupListeners() {
        this.ib.on(EventName.connected, () => {
            console.log("Connected to IBKR TWS/Gateway");
            this.isConnected = true;
        });

        this.ib.on(EventName.disconnected, () => {
            console.log("Disconnected from IBKR");
            this.isConnected = false;
        });

        this.ib.on(EventName.error, (err, code, reqId) => {
            console.error(`IBKR Error: ${err.message} (Code: ${code}, ReqId: ${reqId})`);
        });

        // Account Summary Listener
        this.ib.on(EventName.accountSummary, (reqId, account, tag, value, currency) => {
            if (this.accountSummaryResolve) {
                this.accountSummaryData[tag] = { value, currency };
            }
        });

        this.ib.on(EventName.accountSummaryEnd, (reqId) => {
            if (this.accountSummaryResolve) {
                this.accountSummaryResolve(this.accountSummaryData);
                this.accountSummaryResolve = null;
            }
        });

        // Positions Listener
        this.ib.on(EventName.position, (account, contract, pos, avgCost) => {
            if (this.positionsResolve) {
                this.positionsData.push({ account, contract, pos, avgCost });
            }
        });

        this.ib.on(EventName.positionEnd, () => {
            if (this.positionsResolve) {
                this.positionsResolve(this.positionsData);
                this.positionsResolve = null;
            }
        });

        // Executions Listener
        this.ib.on(EventName.execDetails, (reqId, contract, execution) => {
            if (this.executionsResolve) {
                this.executionsData.push({ contract, execution });
            }
        });

        this.ib.on(EventName.execDetailsEnd, (reqId) => {
            if (this.executionsResolve) {
                this.executionsResolve(this.executionsData);
                this.executionsResolve = null;
            }
        });
    }

    connect() {
        if (!this.isConnected) {
            console.log(`Connecting to IBKR on ${IB_HOST}:${IB_PORT}...`);
            this.ib.connect();
        }
    }

    disconnect() {
        if (this.isConnected) {
            this.ib.disconnect();
        }
    }

    // Request Real-time Market Data
    async getMarketData(symbol) {
        if (!this.isConnected) throw new Error("Not connected to IBKR");

        const contract = {
            symbol: symbol,
            secType: "STK",
            exchange: "SMART",
            currency: "USD",
        };

        const reqId = Math.floor(Math.random() * 10000);

        return new Promise((resolve, reject) => {
            const onTick = (tickReqId, field, value) => {
                if (tickReqId === reqId && field === 4) { // 4 = Last Price
                    this.ib.off(EventName.tickPrice, onTick);
                    resolve(value);
                }
            };

            this.ib.on(EventName.tickPrice, onTick);

            // Switch to Delayed Data (Type 3) if live data is not available
            this.ib.reqMarketDataType(3);
            this.ib.reqMktData(reqId, contract, "", false, false);

            // Timeout after 5 seconds
            setTimeout(() => {
                this.ib.off(EventName.tickPrice, onTick);
                reject(new Error("Timeout waiting for market data"));
            }, 5000);
        });
    }

    // Place Order (Simple Market Order)
    async placeOrder(symbol, action, quantity) {
        if (!this.isConnected) throw new Error("Not connected to IBKR");

        const contract = {
            symbol: symbol,
            secType: "STK",
            exchange: "SMART",
            currency: "USD",
        };

        const order = {
            action: action, // "BUY" or "SELL"
            totalQuantity: quantity,
            orderType: "MKT",
            transmit: true,
        };

        const orderId = await this.getNextOrderId();

        console.log(`Placing ${action} order for ${quantity} ${symbol} (ID: ${orderId})...`);
        this.ib.placeOrder(orderId, contract, order);
        return orderId;
    }

    async getNextOrderId() {
        return new Promise(resolve => {
            this.ib.once(EventName.nextValidId, (orderId) => resolve(orderId));
            this.ib.reqIds(1);
        });
    }

    // Example: Get Current Time to verify connection
    async getCurrentTime() {
        return new Promise((resolve, reject) => {
            if (!this.isConnected) {
                reject(new Error("Not connected to IBKR"));
                return;
            }

            const listener = (time) => {
                this.ib.off(EventName.currentTime, listener);
                resolve(time);
            };

            this.ib.on(EventName.currentTime, listener);
            this.ib.reqCurrentTime();
        });
    }

    // Get Account Summary (Net Liquidation, PnL)
    async getAccountSummary() {
        if (!this.isConnected) throw new Error("Not connected to IBKR");

        return new Promise((resolve) => {
            this.accountSummaryData = {};
            this.accountSummaryResolve = resolve;
            const reqId = Math.floor(Math.random() * 10000);
            // Request NetLiquidation, TotalCashValue, GrossPositionValue, UnrealizedPnL, RealizedPnL
            this.ib.reqAccountSummary(reqId, "All", "NetLiquidation,TotalCashValue,UnrealizedPnL,RealizedPnL");

            // Timeout fallback
            setTimeout(() => {
                if (this.accountSummaryResolve) {
                    resolve(this.accountSummaryData);
                    this.accountSummaryResolve = null;
                }
            }, 2000);
        });
    }

    // Get Current Positions
    async getPositions() {
        if (!this.isConnected) throw new Error("Not connected to IBKR");

        return new Promise((resolve) => {
            this.positionsData = [];
            this.positionsResolve = resolve;
            this.ib.reqPositions();

            // Timeout fallback
            setTimeout(() => {
                if (this.positionsResolve) {
                    resolve(this.positionsData);
                    this.positionsResolve = null;
                }
            }, 2000);
        });
    }

    // Get Trade Executions (History)
    async getExecutions() {
        if (!this.isConnected) throw new Error("Not connected to IBKR");

        return new Promise((resolve) => {
            this.executionsData = [];
            this.executionsResolve = resolve;

            // Request all executions
            this.ib.reqExecutions(Math.floor(Math.random() * 10000), {
                clientId: 0, // 0 means all clients
                acctCode: "",
                time: "",
                symbol: "",
                secType: "",
                exchange: "",
                side: ""
            });

            // Timeout fallback
            setTimeout(() => {
                if (this.executionsResolve) {
                    resolve(this.executionsData);
                    this.executionsResolve = null;
                }
            }, 2000);
        });
    }
}

// Singleton instance
const ibkrService = new IBKRService();
export default ibkrService;
