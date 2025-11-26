import Link from 'next/link';
import { getQuote } from '../../lib/api';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

export async function getServerSideProps() {
    const tickers = ['SPY', 'QQQ', 'XIU.TO', 'HOD.TO', 'HOU.TO'];
    const quotes = await Promise.all(tickers.map(t => getQuote(t)));

    // Serialize to handle Date objects
    const serializedQuotes = JSON.parse(JSON.stringify(quotes.filter(q => q !== null)));

    return {
        props: {
            quotes: serializedQuotes,
        },
    };
}

// Mock data generator for sparklines (since we don't have history API yet)
const generateSparklineData = (basePrice) => {
    let data = [];
    let price = basePrice;
    for (let i = 0; i < 20; i++) {
        price = price * (1 + (Math.random() - 0.5) * 0.02);
        data.push({ value: price });
    }
    return data;
};

export default function MarketData({ quotes }) {
    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-[#111827] to-black text-white p-8 font-sans">
            <header className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 tracking-tight">
                        Market Overview
                    </h1>
                    <p className="text-gray-400 mt-2 text-lg">Real-time ETF Data & Options Chains</p>
                </div>

                <div className="flex gap-4 items-center">
                    <Link href="/trading" className="text-gray-400 hover:text-white transition-colors font-medium">
                        &larr; Back to Hub
                    </Link>
                    <div className="bg-gray-800/50 backdrop-blur-md px-4 py-2 rounded-full border border-gray-700">
                        <span className="text-green-400 font-mono">● Market Open</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {quotes.map((quote) => {
                    const isPositive = quote.regularMarketChangePercent >= 0;
                    const sparklineData = generateSparklineData(quote.regularMarketPrice);

                    return (
                        <div key={quote.symbol} className="group relative bg-gray-800/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-3xl font-bold tracking-tight">{quote.symbol}</h2>
                                    <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">{quote.shortName}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-mono font-bold text-white">
                                        ${quote.regularMarketPrice?.toFixed(2)}
                                    </div>
                                    <div className={`text-sm font-bold flex items-center justify-end gap-1 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        {isPositive ? '▲' : '▼'} {Math.abs(quote.regularMarketChangePercent)?.toFixed(2)}%
                                    </div>
                                </div>
                            </div>

                            {/* Sparkline Chart */}
                            <div className="h-24 mb-6 -mx-2">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={sparklineData}>
                                        <Line
                                            type="monotone"
                                            dataKey="value"
                                            stroke={isPositive ? '#34d399' : '#fb7185'}
                                            strokeWidth={2}
                                            dot={false}
                                        />
                                        <YAxis domain={['dataMin', 'dataMax']} hide />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            <Link href={`/trading/options/${quote.symbol}`} className="block w-full text-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-blue-900/20">
                                Analyze Options Chain &rarr;
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
