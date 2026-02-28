import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Globe, Shield, Zap, Users, Mail, Linkedin, Twitter } from "lucide-react";

export const metadata: Metadata = {
    title: "About ApexWeb3 — The Future of AI & Web3",
    description: "Learn about ApexWeb3, our mission to make blockchain accessible, and our founder's vision for a decentralized future.",
};

const focuses = [
    {
        icon: Globe,
        title: "Stay Updated",
        description: "News is one of our top priorities. The blockchain and crypto space moves fast, and we're here to keep you updated with market trends and regulations.",
        color: "text-blue-400",
    },
    {
        icon: Shield,
        title: "Security & Audits",
        description: "Protecting yourself from scams and hacks is more important than ever. We share best practices for keeping your assets safe.",
        color: "text-brand-pink",
    },
    {
        icon: Zap,
        title: "AI & Web3",
        description: "Exploring how Artificial Intelligence is shaping the blockchain world, from data analysis to smart contracts and beyond.",
        color: "text-brand-purple",
    },
    {
        icon: Users,
        title: "Community Growth",
        description: "Creating a space where blockchain enthusiasts and Web3 explorers can learn, share, and grow together.",
        color: "text-emerald-400",
    },
];

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-brand-dark text-white">
            <div className="container mx-auto px-4 pt-32 pb-24">

                {/* Hero Section */}
                <div className="max-w-4xl mx-auto text-center mb-24">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/10 text-brand-purple text-xs font-bold uppercase tracking-widest mb-6">
                        About ApexWeb3
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
                        Navigating the Future of the <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-purple via-brand-pink to-brand-blue animate-gradient">Decentralized Web</span>
                    </h1>
                    <p className="text-xl text-gray-400 leading-relaxed">
                        Welcome to ApexWeb3 — the home of AI meets Web3 exploration, where blockchain breakthroughs,
                        decentralized innovation, and artificial intelligence collide.
                    </p>
                </div>

                {/* Founder Section */}
                <div className="grid md:grid-cols-2 gap-12 items-center mb-32 bg-white/3 border border-white/10 rounded-3xl p-8 md:p-12">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold">Who Am I?</h2>
                        <p className="text-gray-400 leading-relaxed text-lg">
                            I'm <span className="text-white font-semibold">Yassine</span>, the founder of ApexWeb3.
                            I'm passionate about everything blockchain and Web3. I've spent years exploring this space,
                            and now I'm here to share everything I've learned with you.
                        </p>
                        <p className="text-gray-400 leading-relaxed">
                            The vision behind ApexWeb3 is simple: to make Web3 and blockchain accessible,
                            understandable, and actionable for anyone, anywhere. No jargon, no fluff—just
                            straightforward, useful content.
                        </p>
                        <div className="flex gap-4 pt-4">
                            <Link href="https://www.linkedin.com/in/yassine-el-bachiri-020a88170/" className="p-3 rounded-xl bg-brand-blue/10 border border-brand-blue/20 text-brand-blue hover:bg-brand-blue/20 transition-all">
                                <Linkedin className="w-6 h-6" />
                            </Link>
                            <Link href="https://x.com/apexweb3_" className="p-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all">
                                <Twitter className="w-6 h-6" />
                            </Link>
                        </div>
                    </div>
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-brand-purple to-brand-blue rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative bg-brand-dark rounded-2xl overflow-hidden aspect-video flex items-center justify-center border border-white/10">
                            <span className="text-5xl font-bold text-white/10 select-none">ApexWeb3 Founder</span>
                            <div className="absolute bottom-4 left-4 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-widest">Building the Future</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* What We Do / Pillars */}
                <div className="mb-32 text-center">
                    <h2 className="text-3xl font-bold mb-16">What We Focus On</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {focuses.map((item, idx) => (
                            <div key={idx} className="p-6 rounded-2xl bg-white/3 border border-white/5 hover:border-white/15 transition-all text-left group">
                                <div className={`p-3 rounded-xl bg-white/5 w-fit mb-6 ${item.color} group-hover:scale-110 transition-transform`}>
                                    <item.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                <p className="text-sm text-gray-400 leading-relaxed">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Why ApexWeb3 / Community */}
                <div className="max-w-3xl mx-auto text-center space-y-12">
                    <div className="space-y-4">
                        <h2 className="text-4xl font-bold">Why ApexWeb3?</h2>
                        <p className="text-xl text-gray-400 leading-relaxed">
                            It's simple: We believe in the transformative power of blockchain and Web3 technologies,
                            and we're here to make sure you don't miss out on it. We prioritize honesty,
                            transparency, and education above all.
                        </p>
                    </div>

                    <div className="pt-8">
                        <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-brand-purple text-white font-bold hover:bg-brand-purple/90 transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(199,125,255,0.3)]">
                            Join the Community <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}
