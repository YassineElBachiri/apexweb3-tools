
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import Image from "next/image"; // Assuming we will use next/image, but for now we might use placeholders or just <img>

export function FeaturesShowcase() {
    return (
        <section className="py-24 bg-brand-dark overflow-hidden">
            <div className="container mx-auto px-4">

                {/* Feature 1: Portfolio */}
                <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center mb-32">
                    <div className="relative group">
                        {/* Glow Effect */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-brand-purple/20 to-brand-blue/20 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity" />
                        <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-brand-card">
                            {/* Placeholder for image */}
                            <div className="aspect-video bg-gradient-to-br from-gray-900 to-black flex items-center justify-center text-gray-700 font-mono">
                                [Portfolio Screenshot]
                            </div>
                        </div>
                    </div>
                    <div>
                        <span className="inline-block px-3 py-1 rounded-full bg-brand-purple/10 text-brand-purple text-sm font-bold mb-4 uppercase tracking-wider">
                            Portfolio Management
                        </span>
                        <h3 className="text-3xl md:text-5xl font-bold mb-6">
                            Track Every Asset, <br />
                            <span className="gradient-text">Own Your Data</span>
                        </h3>
                        <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                            Monitor unlimited crypto assets with real-time prices, 24h changes, and comprehensive P&L tracking.
                            All data is stored locally on your device — you remain in complete control of your privacy.
                        </p>
                        <ul className="space-y-3 mb-8">
                            {['Unlimited assets tracking', 'Real-time price updates', 'Privacy-first local storage', 'Export data anytime'].map((item, i) => (
                                <li key={i} className="flex items-center text-gray-300">
                                    <Check className="w-5 h-5 text-brand-purple mr-3" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <Link href="/portfolio" className="inline-flex items-center text-white font-bold hover:text-brand-purple transition-colors">
                            Try Portfolio Tracker <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                    </div>
                </div>

                {/* Feature 2: Analyzer (Reversed) */}
                <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center mb-32">
                    <div className="md:order-2 relative group">
                        <div className="absolute -inset-4 bg-gradient-to-r from-brand-pink/20 to-brand-purple/20 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity" />
                        <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-brand-card">
                            <div className="aspect-video bg-gradient-to-bl from-gray-900 to-black flex items-center justify-center text-gray-700 font-mono">
                                [Analyzer Screenshot]
                            </div>
                        </div>
                    </div>
                    <div className="md:order-1">
                        <span className="inline-block px-3 py-1 rounded-full bg-brand-pink/10 text-brand-pink text-sm font-bold mb-4 uppercase tracking-wider">
                            Risk Analysis
                        </span>
                        <h3 className="text-3xl md:text-5xl font-bold mb-6">
                            Avoid Rugs, <br />
                            <span className="gradient-text">Invest Smarter</span>
                        </h3>
                        <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                            Our advanced scoring system analyzes tokenomics, market cap, volatility, and on-chain data to
                            give you a clear 0-100 investment score with detailed risk verdicts.
                        </p>
                        <div className="grid grid-cols-2 gap-6 mb-8">
                            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                <div className="text-3xl font-bold text-white mb-1">15+</div>
                                <div className="text-sm text-gray-400">Metrics Analyzed</div>
                            </div>
                            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                <div className="text-3xl font-bold text-white mb-1">98%</div>
                                <div className="text-sm text-gray-400">Accuracy Rate</div>
                            </div>
                        </div>
                        <Link href="/analyzer" className="inline-flex items-center text-white font-bold hover:text-brand-pink transition-colors">
                            Analyze Token <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                    </div>
                </div>

                {/* Feature 3: Converter */}
                <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-gradient-to-r from-brand-blue/20 to-brand-cyan/20 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity" />
                        <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-brand-card">
                            <div className="aspect-video bg-gradient-to-br from-gray-900 to-black flex items-center justify-center text-gray-700 font-mono">
                                [Converter Screenshot]
                            </div>
                        </div>
                    </div>
                    <div>
                        <span className="inline-block px-3 py-1 rounded-full bg-brand-blue/10 text-brand-blue text-sm font-bold mb-4 uppercase tracking-wider">
                            Instant Conversion
                        </span>
                        <h3 className="text-3xl md:text-5xl font-bold mb-6">
                            Convert Anything, <br />
                            <span className="gradient-text">Instantly</span>
                        </h3>
                        <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                            Real-time conversion between 100+ cryptocurrencies and 30+ fiat currencies.
                            Understand exactly what your assets are worth in your local currency.
                        </p>
                        <Link href="/converter" className="inline-flex items-center text-white font-bold hover:text-brand-blue transition-colors">
                            Open Converter <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                    </div>
                </div>

            </div>
        </section>
    );
}
