import { useRouter } from 'next/router';
import { getOptionsChain, getQuote } from '../../../lib/api';
import { calculateOptionGreeks } from '../../../lib/greeks';

export async function getServerSideProps(context) {
    const { ticker } = context.params;
    const optionsData = await getOptionsChain(ticker);
    const quote = await getQuote(ticker);

    if (!optionsData || !quote) {
        return { notFound: true };
    }

    // Process options to add Greeks
    const expirationDates = optionsData.expirationDates;
    const currentExpiration = optionsData.options[0]; // Default to nearest expiry
    const underlyingPrice = quote.regularMarketPrice;

    const calls = currentExpiration.calls.map(opt => ({
        ...opt,
        greeks: calculateOptionGreeks(opt, underlyingPrice, (new Date(currentExpiration.expirationDate) - new Date()) / (1000 * 60 * 60 * 24))
    }));

    const puts = currentExpiration.puts.map(opt => ({
        ...opt,
        greeks: calculateOptionGreeks(opt, underlyingPrice, (new Date(currentExpiration.expirationDate) - new Date()) / (1000 * 60 * 60 * 24))
    }));

    return {
        props: {
            ticker,
            underlyingPrice,
            expirationDate: currentExpiration.expirationDate.toISOString(),
            calls: JSON.parse(JSON.stringify(calls)),
            puts: JSON.parse(JSON.stringify(puts)),
        },
    };
}

// Helper component for Greek bars
const GreekBar = ({ value, type, max = 1 }) => {
    const percentage = Math.min(Math.abs(value) / max * 100, 100);
    let color = 'bg-gray-500';

    if (type === 'delta') color = value > 0 ? 'bg-emerald-500' : 'bg-rose-500';
    if (type === 'gamma') color = 'bg-purple-500';
    if (type === 'theta') color = 'bg-amber-500';

    return (
        <div className="w-24 flex flex-col gap-1">
            <span className={`text-xs font-mono ${value > 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
                {value?.toFixed(3)}
            </span>
            <div className="h-1.5 w-full bg-gray-700 rounded-full overflow-hidden">
                <div className={`h-full ${color} transition-all`} style={{ width: `${percentage}%` }} />
            </div>
        </div>
    );
};

export default function OptionsChain({ ticker, underlyingPrice, expirationDate, calls, puts }) {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-[#111827] to-black text-white p-8 font-sans">
            <button onClick={() => router.back()} className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
                <span className="group-hover:-translate-x-1 transition-transform">&larr;</span> Back to Dashboard
            </button>

            <header className="mb-10 flex justify-between items-end border-b border-gray-800 pb-6">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight mb-2">{ticker} <span className="text-gray-500 font-light">Options</span></h1>
                    <div className="flex items-center gap-4 text-lg">
                        <span className="bg-gray-800 px-3 py-1 rounded-md border border-gray-700">
                            ${underlyingPrice}
                        </span>
                        <span className="text-gray-400">Expiry: <span className="text-white font-bold">{new Date(expirationDate).toLocaleDateString()}</span></span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                {/* Calls Table */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
                    <div className="bg-emerald-900/20 p-4 border-b border-emerald-900/30">
                        <h2 className="text-xl font-bold text-emerald-400">Calls (Bullish)</h2>
                    </div>
                    <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-400 uppercase bg-gray-800/80 sticky top-0 backdrop-blur-md z-10">
                                <tr>
                                    <th className="px-4 py-3">Strike</th>
                                    <th className="px-4 py-3">Price</th>
                                    <th className="px-4 py-3">Delta</th>
                                    <th className="px-4 py-3">Gamma</th>
                                    <th className="px-4 py-3">Theta</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {calls.map((opt) => (
                                    <tr key={opt.contractSymbol} className="hover:bg-gray-800/50 transition-colors">
                                        <td className="px-4 py-3 font-bold text-white bg-gray-800/30">{opt.strike}</td>
                                        <td className="px-4 py-3 font-mono text-emerald-300">${opt.lastPrice}</td>
                                        <td className="px-4 py-3"><GreekBar value={opt.greeks?.delta} type="delta" /></td>
                                        <td className="px-4 py-3"><GreekBar value={opt.greeks?.gamma} type="gamma" max={0.1} /></td>
                                        <td className="px-4 py-3"><GreekBar value={opt.greeks?.theta} type="theta" max={0.5} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Puts Table */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
                    <div className="bg-rose-900/20 p-4 border-b border-rose-900/30">
                        <h2 className="text-xl font-bold text-rose-400">Puts (Bearish)</h2>
                    </div>
                    <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-400 uppercase bg-gray-800/80 sticky top-0 backdrop-blur-md z-10">
                                <tr>
                                    <th className="px-4 py-3">Strike</th>
                                    <th className="px-4 py-3">Price</th>
                                    <th className="px-4 py-3">Delta</th>
                                    <th className="px-4 py-3">Gamma</th>
                                    <th className="px-4 py-3">Theta</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {puts.map((opt) => (
                                    <tr key={opt.contractSymbol} className="hover:bg-gray-800/50 transition-colors">
                                        <td className="px-4 py-3 font-bold text-white bg-gray-800/30">{opt.strike}</td>
                                        <td className="px-4 py-3 font-mono text-rose-300">${opt.lastPrice}</td>
                                        <td className="px-4 py-3"><GreekBar value={opt.greeks?.delta} type="delta" /></td>
                                        <td className="px-4 py-3"><GreekBar value={opt.greeks?.gamma} type="gamma" max={0.1} /></td>
                                        <td className="px-4 py-3"><GreekBar value={opt.greeks?.theta} type="theta" max={0.5} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
