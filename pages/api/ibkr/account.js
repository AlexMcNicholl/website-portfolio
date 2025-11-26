import ibkrService from '../../../lib/ibkr';

export default async function handler(req, res) {
    try {
        // Ensure connected
        ibkrService.connect();

        // Wait a bit for connection if needed (simple retry logic could be added)
        if (!ibkrService.isConnected) {
            await new Promise(r => setTimeout(r, 1000));
        }

        const data = await ibkrService.getAccountSummary();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
