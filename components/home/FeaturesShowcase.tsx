
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";

export function FeaturesShowcase() {
    return (
        <section className="py-24 bg-brand-dark overflow-hidden">
            <div className="container mx-auto px-4">

                {/* Feature 1: Intelligence Pillar */}
                <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center mb-32">
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-gradient-to-r from-brand-blue/20 to-brand-purple/20 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity" />
                        <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-brand-card p-8">
                            {/* Mock Intelligence UI */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                                    <span className="text-xs font-mono text-brand-blue uppercase tracking-widest">Whale Activity</span>
                                    <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
                                </div>
                                {[
                                    { wallet: '0x3f...8a2c', amount: '$2.4M', token: 'ETH', dir: '↑', color: 'text-green-400' },
                                    { wallet: '0x91...c44f', amount: '$890K', token: 'SOL', dir: '↓', color: 'text-red-400' },
                                    { wallet: '0xbb...12e1', amount: '$5.1M', token: 'BTC', dir: '↑', color: 'text-green-400' },
                                ].map((row, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                                        <span className="text-xs font-mono text-gray-400">{row.wallet}</span>
                                        <span className={`text-sm font-bold ${row.color}`}>{row.dir} {row.amount} {row.token}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div>
                        <span className="inline-block px-3 py-1 rounded-full bg-brand-blue/10 text-brand-blue text-sm font-bold mb-4 uppercase tracking-wider">
                            🔵 Intelligence
                        </span>
                        <h3 className="text-3xl md:text-5xl font-bold mb-6">
                            Know What Smart Money<br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-blue to-brand-purple">Knows First</span>
                        </h3>
                        <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                            Track whale wallets, detect early liquidity events in meme coins, and run deep tokenomics analysis — before the market moves.
                        </p>
                        <ul className="space-y-3 mb-8">
                            {[
                                'Whale Watch — $100K+ wallet movements in real-time',
                                'Meme Coin Scanner — Early liquidity on Solana & Base',
                                'Tokenomics Analyzer — 0–100 investment score',
                            ].map((item, i) => (
                                <li key={i} className="flex items-start text-gray-300">
                                    <Check className="w-5 h-5 text-brand-blue mr-3 flex-shrink-0 mt-0.5" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <Link href="/intelligence" className="inline-flex items-center text-white font-bold hover:text-brand-blue transition-colors">
                            Explore Intelligence Tools <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                    </div>
                </div>

                {/* Feature 2: Risk Pillar (Reversed) */}
                <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center mb-32">
                    <div className="md:order-2 relative group">
                        <div className="absolute -inset-4 bg-gradient-to-r from-brand-pink/20 to-red-500/10 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity" />
                        <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-brand-card p-8">
                            {/* Mock Risk UI */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                                    <span className="text-xs font-mono text-brand-pink uppercase tracking-widest">Security Scan</span>
                                    <span className="text-xs text-red-400 font-bold">⚠ 3 risks found</span>
                                </div>
                                {[
                                    { label: 'Honeypot Detection', status: 'CLEAR', color: 'text-green-400' },
                                    { label: 'Liquidity Lock', status: 'WARNING', color: 'text-yellow-400' },
                                    { label: 'Owner Privileges', status: 'RISK', color: 'text-red-400' },
                                    { label: 'Mint Function', status: 'RISK', color: 'text-red-400' },
                                ].map((row, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                                        <span className="text-sm text-gray-300">{row.label}</span>
                                        <span className={`text-xs font-bold ${row.color}`}>{row.status}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="md:order-1">
                        <span className="inline-block px-3 py-1 rounded-full bg-brand-pink/10 text-brand-pink text-sm font-bold mb-4 uppercase tracking-wider">
                            🔴 Risk
                        </span>
                        <h3 className="text-3xl md:text-5xl font-bold mb-6">
                            Protect Your Capital<br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-pink to-brand-purple">Before You Deploy It</span>
                        </h3>
                        <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                            Scan contracts for honeypots and rug pull risks before investing. Track your portfolio exposure across all holdings in real-time.
                        </p>
                        <ul className="space-y-3 mb-8">
                            {[
                                'Security Scanner — Honeypot & contract vulnerability detection',
                                'Portfolio Tracker — P&L, real-time prices, exposure at a glance',
                            ].map((item, i) => (
                                <li key={i} className="flex items-start text-gray-300">
                                    <Check className="w-5 h-5 text-brand-pink mr-3 flex-shrink-0 mt-0.5" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <Link href="/risk" className="inline-flex items-center text-white font-bold hover:text-brand-pink transition-colors">
                            Explore Risk Tools <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                    </div>
                </div>

                {/* Feature 3: Careers Pillar */}
                <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/15 to-brand-blue/15 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity" />
                        <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-brand-card p-8">
                            {/* Mock Careers UI */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                                    <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">Web3 Jobs</span>
                                    <span className="text-xs text-gray-500">247 live roles</span>
                                </div>
                                {[
                                    { role: 'Solidity Engineer', co: 'Uniswap', salary: '$180K+', tag: 'Remote' },
                                    { role: 'DeFi Product Manager', co: 'Aave', salary: '$160K+', tag: 'Remote' },
                                    { role: 'Blockchain Developer', co: 'Polygon', salary: '$200K+', tag: 'Hybrid' },
                                ].map((row, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                                        <div>
                                            <div className="text-sm font-semibold text-white">{row.role}</div>
                                            <div className="text-xs text-gray-500">{row.co} · {row.tag}</div>
                                        </div>
                                        <span className="text-sm font-bold text-emerald-400">{row.salary}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div>
                        <span className="inline-block px-3 py-1 rounded-full bg-emerald-400/10 text-emerald-400 text-sm font-bold mb-4 uppercase tracking-wider">
                            🟢 Careers
                        </span>
                        <h3 className="text-3xl md:text-5xl font-bold mb-6">
                            Your Path Into Web3,<br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-brand-blue">Mapped</span>
                        </h3>
                        <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                            Find live blockchain and DeFi roles from top Web3 companies. Know exactly what the role pays with our Web3 salary benchmarks.
                        </p>
                        <ul className="space-y-3 mb-8">
                            {[
                                'Web3 Jobs — Live board with DeFi, NFT & L2 roles',
                                'Salary Estimator — Benchmark compensation by role & seniority',
                            ].map((item, i) => (
                                <li key={i} className="flex items-start text-gray-300">
                                    <Check className="w-5 h-5 text-emerald-400 mr-3 flex-shrink-0 mt-0.5" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <Link href="/careers" className="inline-flex items-center text-white font-bold hover:text-emerald-400 transition-colors">
                            Explore Career Tools <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                    </div>
                </div>

            </div>
        </section>
    );
}
