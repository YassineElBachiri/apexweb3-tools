import Link from "next/link";
import { ArrowRight, Calculator, ArrowRightLeft, DollarSign, Check, Flame } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Web3 Utility Tools — Crypto Converter, DCA Calculator & Fiat Exchange | ApexWeb3",
    description: "Convert between 100+ cryptocurrencies, calculate your average cost, and check rates in 30+ fiat currencies. Fast, free Web3 utility tools — no login required.",
    keywords: ["crypto converter", "dollar cost average calculator", "fiat to crypto", "crypto to usd", "web3 utilities"],
};

const tools = [
    {
        icon: Calculator,
        title: "Avg Cost Calculator",
        href: "/calculator",
        description: "Calculate your average buy price across multiple purchases, simulate DCA strategies, and find your break-even point.",
        features: ["Multi-Purchase Tracking", "DCA Simulation", "Profit/Loss Analysis", "Break-even Calculator"],
        color: "text-cyan-400",
        bg: "bg-cyan-500/10",
        border: "border-cyan-500/20",
        nextTool: { label: "Convert your crypto values →", href: "/converter" },
    },
    {
        icon: ArrowRightLeft,
        title: "Crypto Converter",
        href: "/converter",
        description: "Real-time conversion between 100+ cryptocurrencies with live exchange rates. Bi-directional and instant.",
        features: ["100+ Crypto Pairs", "Real-Time Rates", "Bi-Directional", "Live Price Updates"],
        color: "text-indigo-400",
        bg: "bg-indigo-500/10",
        border: "border-indigo-500/20",
        nextTool: { label: "Check fiat exchange rates →", href: "/fiat-converter" },
    },
    {
        icon: DollarSign,
        title: "Fiat Exchange",
        href: "/fiat-converter",
        description: "Check your crypto holdings' value in 30+ fiat currencies at once. Ideal for international investors and cross-border payments.",
        features: ["30+ Fiat Currencies", "Multi-Currency Grid", "Fee Calculator", "Real-Time Rates"],
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
        nextTool: { label: "Calculate your average cost →", href: "/calculator" },
    },
];

const faqs = [
    {
        q: "How do I calculate my average crypto buy price?",
        a: "Open the Avg Cost Calculator, add each purchase with the amount and price paid, and the tool instantly calculates your average cost, total investment, and current profit or loss.",
    },
    {
        q: "How many cryptocurrencies does the Crypto Converter support?",
        a: "The Crypto Converter supports 100+ major and mid-cap cryptocurrencies with live exchange rates updated in real-time via CoinGecko.",
    },
    {
        q: "Can I see my crypto in multiple fiat currencies at once?",
        a: "Yes. The Fiat Exchange tool displays your crypto value across 30+ fiat currencies simultaneously in a grid view — perfect for international users.",
    },
    {
        q: "Which tool should I use to plan a DCA strategy?",
        a: "The Avg Cost Calculator includes a DCA simulator — enter your recurring investment amount, frequency, and token, and it projects your average cost over time.",
    },
];

export default function UtilitiesPage() {
    return (
        <div className="min-h-screen bg-brand-dark text-white">
            <div className="container mx-auto px-4 pt-32 pb-24">

                {/* Header */}
                <div className="max-w-3xl mx-auto text-center mb-20">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/10 text-brand-purple text-xs font-bold uppercase tracking-widest mb-6">
                        🟡 Utilities Pillar
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Web3 Utility Tools
                    </h1>
                    <p className="text-xl text-gray-400 leading-relaxed mb-6">
                        Fast converters and calculators to support every trade decision — from DCA planning to fiat conversion. Instant, no login.
                    </p>
                    <p className="text-gray-500">
                        3 professional tools · Real-time rates · 100% free
                    </p>
                </div>

                {/* Tool Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-24">
                    {tools.map((tool) => {
                        const Icon = tool.icon;
                        return (
                            <div key={tool.href} className="group flex flex-col gap-5 p-6 rounded-2xl bg-white/3 border border-white/5 hover:border-white/15 transition-all">
                                <div className={`p-3 rounded-xl border ${tool.bg} ${tool.border} w-fit`}>
                                    <Icon className={`w-6 h-6 ${tool.color}`} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold mb-2">{tool.title}</h2>
                                    <p className="text-gray-400 text-sm leading-relaxed mb-4">{tool.description}</p>
                                    <ul className="space-y-1.5 mb-6">
                                        {tool.features.map((f, i) => (
                                            <li key={i} className="flex items-center gap-2 text-xs text-gray-500">
                                                <Check className={`w-3.5 h-3.5 ${tool.color} flex-shrink-0`} />
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="mt-auto space-y-3">
                                    <Link href={tool.href} className={`flex items-center text-sm font-bold ${tool.color}`}>
                                        Open Tool <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                    <Link href={tool.nextTool.href} className="flex items-center text-xs text-gray-500 hover:text-gray-300 transition-colors">
                                        {tool.nextTool.label}
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Internal Link — Meme Coin */}
                <div className="bg-white/3 border border-white/10 rounded-2xl p-6 mb-24 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Flame className="w-5 h-5 text-orange-400 flex-shrink-0" />
                        <div>
                            <div className="font-bold text-white">Found a meme coin? Calculate your entry first.</div>
                            <div className="text-sm text-gray-400">Use the Avg Cost Calculator after spotting a new token on our Meme Coin Scanner.</div>
                        </div>
                    </div>
                    <Link href="/spike-detector" className="flex items-center gap-1 text-sm font-bold text-orange-400 hover:opacity-80 transition-opacity whitespace-nowrap">
                        Meme Coin Scanner <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* FAQ */}
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <div key={i} className="p-6 rounded-2xl bg-white/3 border border-white/5">
                                <h3 className="font-bold text-white mb-3">{faq.q}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
