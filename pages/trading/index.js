import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function TradingHub() {
    const [marketStatus, setMarketStatus] = useState('CLOSED');

    useEffect(() => {
        // Simple check for market hours (9:30 AM - 4:00 PM ET)
        const now = new Date();
        const hour = now.getUTCHours() - 5; // EST (approx)
        const minute = now.getUTCMinutes();
        const isOpen = hour > 9 && hour < 16 && (hour !== 9 || minute >= 30);
        setMarketStatus(isOpen ? 'OPEN' : 'CLOSED');
    }, []);

    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800 via-gray-900 to-black text-white p-8 font-sans flex flex-col items-center justify-center">

            <header className="text-center mb-16 relative z-10">
                <div className="inline-block mb-4 px-4 py-1 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-400 text-sm font-mono tracking-wider">
                    ALPHA_TRADE_OS v1.0
                </div>
                <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-gray-600 tracking-tighter mb-4 drop-shadow-2xl">
                    COMMAND CENTER
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                    Automated Options Trading & Portfolio Management System
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl w-full relative z-10">

                {/* Card 1: Market Data */}
                <Link href="/trading/market" className="group relative bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 hover:border-cyan-500/50 transition-all duration-500 hover:shadow-[0_0_50px_rgba(6,182,212,0.15)] hover:-translate-y-2">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-cyan-900/30 rounded-2xl flex items-center justify-center mb-6 border border-cyan-500/20 group-hover:border-cyan-500/50 transition-colors">
                            <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">Market Data</h2>
                        <p className="text-gray-400 mb-6">Real-time ETF quotes, Options Chains, and Greeks visualization.</p>
                        <span className="text-cyan-400 font-mono text-sm group-hover:underline">View Watchlist &rarr;</span>
                    </div>
                </Link>

                {/* Card 2: Strategy Cockpit */}
                <Link href="/trading/strategy" className="group relative bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 hover:border-purple-500/50 transition-all duration-500 hover:shadow-[0_0_50px_rgba(168,85,247,0.15)] hover:-translate-y-2">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-purple-900/30 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/20 group-hover:border-purple-500/50 transition-colors">
                            <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">Strategy Cockpit</h2>
                        <p className="text-gray-400 mb-6">Configure and deploy automated bots. Manage active strategies.</p>
                        <span className="text-purple-400 font-mono text-sm group-hover:underline">Deploy Bots &rarr;</span>
                    </div>
                </Link>

                {/* Card 3: Performance */}
                <Link href="/trading/performance" className="group relative bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 hover:border-emerald-500/50 transition-all duration-500 hover:shadow-[0_0_50px_rgba(16,185,129,0.15)] hover:-translate-y-2">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-emerald-900/30 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/20 group-hover:border-emerald-500/50 transition-colors">
                            <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">Performance</h2>
                        <p className="text-gray-400 mb-6">Track PnL, Win Rate, and detailed trade history.</p>
                        <span className="text-emerald-400 font-mono text-sm group-hover:underline">View Analytics &rarr;</span>
                    </div>
                </Link>
            </div>

            {/* Status Bar */}
            <div className="mt-16 flex gap-8 text-sm font-mono text-gray-500">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${marketStatus === 'OPEN' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                    MARKET: {marketStatus}
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    IBKR: CONNECTED
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    BOTS: 0 ACTIVE
                </div>
            </div>

            <div className="mt-8 text-gray-600 text-xs">
                Research Lab (Offline): Run <code>D:\trading_env\Scripts\python backtest/run.py</code>
            </div>
        </div>
    );
}
