import ibkrService from '../../../lib/ibkr';

export default async function handler(req, res) {
    try {
        ibkrService.connect();
        if (!ibkrService.isConnected) await new Promise(r => setTimeout(r, 1000));

        const data = await ibkrService.getExecutions();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
