import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MetricCard = ({ title, value, subtext, isPositive }) => (
    <div className="glass-card p-6 relative overflow-hidden group">
        <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" /></svg>
        </div>
        <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-1">{title}</h3>
        <div className={`text-4xl font-bold font-mono tracking-tighter ${isPositive ? 'text-emerald-400 text-glow-success' : 'text-rose-400 text-glow-danger'}`}>
            {value}
        </div>
        <p className="text-gray-500 text-xs mt-2 font-medium">{subtext}</p>
    </div>
);

export default function PerformanceDashboard() {
    const [account, setAccount] = useState(null);
    const [positions, setPositions] = useState([]);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [accRes, posRes, histRes] = await Promise.all([
                    fetch('/api/ibkr/account'),
                    fetch('/api/ibkr/positions'),
                    fetch('/api/ibkr/history')
                ]);

                const accData = await accRes.json();
                const posData = await posRes.json();
                const histData = await histRes.json();

                setAccount(accData);
                setPositions(posData);
                setHistory(histData);
            } catch (error) {
                console.error("Failed to fetch IBKR data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 5000); // Refresh every 5s
        return () => clearInterval(interval);
    }, []);

    // Derived Metrics
    const netLiquidation = account?.NetLiquidation?.value ? parseFloat(account.NetLiquidation.value) : 0;
    const unrealizedPnL = account?.UnrealizedPnL?.value ? parseFloat(account.UnrealizedPnL.value) : 0;
    const realizedPnL = account?.RealizedPnL?.value ? parseFloat(account.RealizedPnL.value) : 0;
    const totalPnL = unrealizedPnL + realizedPnL;

    // Format History for Table
    const formattedHistory = history.map((exec, index) => ({
        id: exec.execution.execId,
        date: exec.execution.time,
        symbol: exec.contract.symbol,
        type: exec.execution.side === 'BOT' ? 'BUY' : 'SELL', // IBKR uses 'BOT' for Bought
        strike: exec.contract.strike || '-',
        entry: exec.execution.price,
        exit: '-', // Need logic to match entry/exit for PnL
        pnl: 0, // Placeholder until PnL matching logic is added
        status: 'CLOSED',
        greeks: { delta: '-', theta: '-' } // Greeks not in execution report
    })).slice(0, 10); // Show last 10

    return (
        <div className="min-h-screen p-8 font-sans selection:bg-blue-500/30">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <header className="flex justify-between items-end border-b border-white/5 pb-8">
                    <div>
                        <Link href="/trading" className="nav-link mb-4 inline-flex items-center gap-2 group">
                            <span className="group-hover:-translate-x-1 transition-transform">&larr;</span> Back to Terminal
                        </Link>
                        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 tracking-tight">
                            Performance
                        </h1>
                        <p className="text-gray-400 mt-2 font-light text-lg">
                            Live Portfolio Analytics (Connected to IBKR)
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <div className={`px-3 py-1 rounded-full text-xs font-mono border ${loading ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'}`}>
                            {loading ? '● Connecting...' : '● Live Data'}
                        </div>
                    </div>
                </header>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <MetricCard title="Net Liquidation" value={`$${netLiquidation.toLocaleString()}`} subtext="Total Account Value" isPositive={true} />
                    <MetricCard title="Daily PnL" value={`$${totalPnL.toFixed(2)}`} subtext="Realized + Unrealized" isPositive={totalPnL >= 0} />
                    <MetricCard title="Open Positions" value={positions.length} subtext="Active Contracts" isPositive={true} />
                    <MetricCard title="Realized PnL" value={`$${realizedPnL.toFixed(2)}`} subtext="Locked In" isPositive={realizedPnL >= 0} />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Chart Section (Placeholder for Real Equity Curve) */}
                    <div className="lg:col-span-2 glass-panel rounded-2xl p-8 flex items-center justify-center min-h-[400px]">
                        <div className="text-center">
                            <h2 className="text-xl font-bold text-gray-500 mb-2">Equity Curve</h2>
                            <p className="text-gray-600 text-sm">Waiting for historical data accumulation...</p>
                        </div>
                    </div>

                    {/* Positions List */}
                    <div className="glass-panel rounded-2xl p-6">
                        <h2 className="text-lg font-bold text-white mb-4">Open Positions</h2>
                        {positions.length === 0 ? (
                            <p className="text-gray-500 text-sm">No active positions.</p>
                        ) : (
                            <div className="space-y-3">
                                {positions.map((pos, i) => (
                                    <div key={i} className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5">
                                        <div>
                                            <div className="font-bold text-white">{pos.contract.symbol}</div>
                                            <div className="text-xs text-gray-400">{pos.pos} shares @ ${pos.avgCost.toFixed(2)}</div>
                                        </div>
                                        <div className="text-right">
                                            {/* Need live price to calc PnL here, placeholder for now */}
                                            <div className="text-sm font-mono text-gray-300">--</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Trade History Table */}
                <div className="glass-panel rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#0B1120]/30">
                        <h2 className="text-lg font-bold text-white">Recent Executions</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr>
                                    <th className="table-header">Date</th>
                                    <th className="table-header">Symbol</th>
                                    <th className="table-header">Side</th>
                                    <th className="table-header text-right">Price</th>
                                    <th className="table-header text-right">Qty</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {formattedHistory.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No recent executions found.</td>
                                    </tr>
                                ) : (
                                    formattedHistory.map((trade) => (
                                        <tr key={trade.id} className="group hover:bg-white/[0.02] transition-colors">
                                            <td className="table-cell font-mono text-gray-400">{trade.date}</td>
                                            <td className="table-cell font-bold text-white">{trade.symbol}</td>
                                            <td className="table-cell">
                                                <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-wider ${trade.type === 'BUY' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                                    {trade.type}
                                                </span>
                                            </td>
                                            <td className="table-cell text-right font-mono text-gray-400">${trade.entry.toFixed(2)}</td>
                                            <td className="table-cell text-right font-mono text-gray-400">1</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
