import ibkrService from '../lib/ibkr.js';

async function testConnection() {
    console.log("Starting IBKR Connection Test...");

    try {
        ibkrService.connect();

        // Wait a moment for connection
        await new Promise(resolve => setTimeout(resolve, 2000));

        if (ibkrService.isConnected) {
            console.log("SUCCESS: Connected to TWS!");
            const time = await ibkrService.getCurrentTime();
            console.log("Server Time:", new Date(time * 1000).toLocaleString());
        } else {
            console.error("FAILURE: Could not connect. Is TWS running?");
        }
    } catch (error) {
        console.error("Test Failed:", error);
    } finally {
        ibkrService.disconnect();
        process.exit(0);
    }
}

testConnection();
