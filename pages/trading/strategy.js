import Link from 'next/link';
import { useState } from 'react';

export default function StrategyCockpit() {
    const [activeStrategy, setActiveStrategy] = useState(null);
    const [isRunning, setIsRunning] = useState(false);
    const [logs, setLogs] = useState(['System initialized.', 'Waiting for strategy selection...']);

    const toggleBot = () => {
        if (isRunning) {
            setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Stopping ${activeStrategy}...`, `[${new Date().toLocaleTimeString()}] Bot Stopped.`]);
            setIsRunning(false);
        } else {
            if (!activeStrategy) return;
            setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Starting ${activeStrategy}...`, `[${new Date().toLocaleTimeString()}] Connected to IBKR Gateway.`, `[${new Date().toLocaleTimeString()}] Scanning for opportunities...`]);
            setIsRunning(true);
        }
    };

    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-[#111827] to-black text-white p-8 font-sans">
            <header className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 tracking-tight">
                        Strategy Cockpit
                    </h1>
                    <p className="text-gray-400 mt-2 text-lg">Deploy & Manage Automated Bots</p>
                </div>
                <Link href="/trading" className="text-gray-400 hover:text-white transition-colors font-medium">
                    &larr; Back to Hub
                </Link>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Configuration Panel */}
                <div className="lg:col-span-1 space-y-8">
                    {/* Strategy Selector */}
                    <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
                        <h3 className="text-xl font-bold mb-4 text-purple-400">1. Select Strategy</h3>
                        <div className="space-y-3">
                            {['Iron Condor (Greeks)', 'RSI Mean Reversion', 'Delta Neutral Hedging'].map(strat => (
                                <button
                                    key={strat}
                                    onClick={() => setActiveStrategy(strat)}
                                    className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${activeStrategy === strat
                                            ? 'bg-purple-600/20 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                                            : 'bg-gray-900/50 border-gray-700 text-gray-400 hover:border-gray-500'
                                        }`}
                                >
                                    {strat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Parameters */}
                    <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
                        <h3 className="text-xl font-bold mb-4 text-purple-400">2. Configure Risk</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Max Allocation ($)</label>
                                <input type="number" defaultValue={10000} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-purple-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Stop Loss (%)</label>
                                <input type="number" defaultValue={5} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-purple-500 outline-none" />
                            </div>
                        </div>
                    </div>

                    {/* Activation */}
                    <button
                        onClick={toggleBot}
                        disabled={!activeStrategy}
                        className={`w-full py-4 rounded-xl font-bold text-xl tracking-wide transition-all shadow-lg ${isRunning
                                ? 'bg-red-600 hover:bg-red-700 shadow-red-900/30'
                                : activeStrategy
                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-purple-900/30'
                                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        {isRunning ? 'STOP BOT' : 'ACTIVATE STRATEGY'}
                    </button>
                </div>

                {/* Live Status Panel */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Active Status */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 text-center">
                            <div className="text-gray-400 text-sm uppercase tracking-wider mb-1">Status</div>
                            <div className={`text-2xl font-mono font-bold ${isRunning ? 'text-green-400 animate-pulse' : 'text-gray-500'}`}>
                                {isRunning ? 'RUNNING' : 'IDLE'}
                            </div>
                        </div>
                        <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 text-center">
                            <div className="text-gray-400 text-sm uppercase tracking-wider mb-1">Active Positions</div>
                            <div className="text-2xl font-mono font-bold text-white">0</div>
                        </div>
                        <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 text-center">
                            <div className="text-gray-400 text-sm uppercase tracking-wider mb-1">Daily PnL</div>
                            <div className="text-2xl font-mono font-bold text-emerald-400">$0.00</div>
                        </div>
                    </div>

                    {/* Live Logs */}
                    <div className="bg-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 h-[500px] overflow-hidden flex flex-col">
                        <h3 className="text-lg font-bold mb-4 text-gray-300 flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            Live Execution Logs
                        </h3>
                        <div className="flex-1 overflow-y-auto font-mono text-sm space-y-2 p-4 bg-gray-900/50 rounded-xl border border-gray-800/50">
                            {logs.map((log, i) => (
                                <div key={i} className="text-gray-300 border-b border-gray-800/50 pb-1 last:border-0">
                                    <span className="text-purple-500 mr-2">&gt;</span>
                                    {log}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
