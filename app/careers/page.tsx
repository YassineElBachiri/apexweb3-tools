import Link from "next/link";
import { ArrowRight, Briefcase, Zap, Check, TrendingUp } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Web3 Career Tools — Blockchain Jobs & Salary Estimator | ApexWeb3",
    description: "Browse live Web3 and blockchain job listings. Benchmark your salary by role, seniority, and chain. Free career tools for Web3 professionals — no login required.",
    keywords: ["web3 jobs", "blockchain developer salary", "crypto jobs remote", "defi jobs", "web3 career"],
};

const tools = [
    {
        icon: Briefcase,
        title: "Web3 Jobs",
        href: "/jobs",
        description: "Browse live blockchain, DeFi, NFT, and L2 job listings from top Web3 companies. Remote roles available worldwide.",
        features: ["Live Job Board", "Remote & On-site Roles", "DeFi, NFT, L2, Infra", "Direct Apply Links"],
        badge: "New",
        color: "text-violet-400",
        bg: "bg-violet-500/10",
        border: "border-violet-500/20",
        nextTool: { label: "Check what the role pays →", href: "/finance/salary-estimator" },
    },
    {
        icon: Zap,
        title: "Salary Estimator",
        href: "/finance/salary-estimator",
        description: "Benchmark Web3 compensation by job role, seniority level, and location. Know your market value in both fiat and crypto.",
        features: ["Role Benchmarking", "Seniority Levels", "Fiat & Crypto Breakdown", "Market Rate Data"],
        color: "text-yellow-400",
        bg: "bg-yellow-500/10",
        border: "border-yellow-500/20",
        nextTool: { label: "Find roles at this salary level →", href: "/jobs" },
    },
];

const faqs = [
    {
        q: "What types of Web3 jobs are listed?",
        a: "Our job board covers the full Web3 stack — Solidity engineers, smart contract auditors, DeFi product managers, blockchain developers, Web3 marketing, community managers, and more. Roles span DeFi protocols, NFT platforms, L2 networks, and crypto exchanges.",
    },
    {
        q: "How much do Web3 developers earn?",
        a: "Web3 developer salaries vary widely by role and seniority. Junior Solidity developers typically earn $80K–$120K, while senior engineers at top protocols can exceed $200K. Use our Salary Estimator to benchmark by specific role.",
    },
    {
        q: "Are all Web3 jobs remote?",
        a: "Most Web3 companies offer remote positions since the industry is globally distributed. Our job board filters by remote, hybrid, and on-site roles so you can find what fits your lifestyle.",
    },
    {
        q: "Can I use the Salary Estimator before applying to a job?",
        a: "Absolutely — that's the intended workflow. Browse open roles in Web3 Jobs, identify a target position, then use the Salary Estimator to benchmark compensation before entering the negotiation.",
    },
];

export default function CareersPage() {
    return (
        <div className="min-h-screen bg-brand-dark text-white">
            <div className="container mx-auto px-4 pt-32 pb-24">

                {/* Header */}
                <div className="max-w-3xl mx-auto text-center mb-20">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/10 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6">
                        🟢 Careers Pillar
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Web3 Career Tools
                    </h1>
                    <p className="text-xl text-gray-400 leading-relaxed mb-6">
                        Your path into Web3, mapped. Find live blockchain roles and benchmark exactly what you should be earning — before you apply.
                    </p>
                    <p className="text-gray-500">
                        2 professional tools · Live job data · 100% free
                    </p>
                </div>

                {/* Tool Cards */}
                <div className="grid md:grid-cols-2 gap-6 mb-24 max-w-3xl mx-auto">
                    {tools.map((tool) => {
                        const Icon = tool.icon;
                        return (
                            <div key={tool.href} className="flex flex-col gap-5 p-6 rounded-2xl bg-white/3 border border-white/5">
                                <div className="flex items-start justify-between">
                                    <div className={`p-3 rounded-xl border ${tool.bg} ${tool.border}`}>
                                        <Icon className={`w-6 h-6 ${tool.color}`} />
                                    </div>
                                    {tool.badge && (
                                        <span className="text-[10px] font-bold bg-brand-pink/80 text-white px-2 py-0.5 rounded-full">
                                            {tool.badge}
                                        </span>
                                    )}
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
                                        Open Tool <ArrowRight className="ml-2 w-4 h-4" />
                                    </Link>
                                    <Link href={tool.nextTool.href} className="flex items-center text-xs text-gray-500 hover:text-gray-300 transition-colors">
                                        {tool.nextTool.label}
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Internal Link — Intelligence */}
                <div className="bg-white/3 border border-white/10 rounded-2xl p-6 mb-24 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 max-w-3xl mx-auto">
                    <div className="flex items-center gap-3">
                        <TrendingUp className="w-5 h-5 text-brand-purple flex-shrink-0" />
                        <div>
                            <div className="font-bold text-white">New to Web3? Start with the market first.</div>
                            <div className="text-sm text-gray-400">Understand tokenomics and on-chain data — the skills every Web3 employer wants.</div>
                        </div>
                    </div>
                    <Link href="/intelligence" className="flex items-center gap-1 text-sm font-bold text-brand-purple hover:opacity-80 transition-opacity whitespace-nowrap">
                        Intelligence Tools <ArrowRight className="w-4 h-4" />
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
