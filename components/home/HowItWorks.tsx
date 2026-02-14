
import { Search, Zap, Target } from "lucide-react";

export function HowItWorks() {
    const steps = [
        {
            number: "01",
            title: "Choose Your Tool",
            description: "Browse our collection of professional Web3 tools organized by category.",
            icon: Search,
            color: "brand-purple"
        },
        {
            number: "02",
            title: "Enter Your Data",
            description: "Paste wallet addresses, token contracts, or enter amounts — zero login required.",
            icon: Zap,
            color: "brand-blue"
        },
        {
            number: "03",
            title: "Get Instant Insights",
            description: "Receive real-time analysis, calculations, and actionable insights in seconds.",
            icon: Target,
            color: "brand-pink"
        }
    ];

    return (
        <section className="py-24 bg-gradient-to-b from-brand-dark to-[#1a0b2e] relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">

                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        Simple, Powerful, <span className="gradient-text">Instant</span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        We&apos;ve removed all friction. No registration, no wallet connection, no complexity.
                        Just pure utility.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-brand-purple/30 to-transparent z-0" />

                    {steps.map((step, idx) => {
                        const Icon = step.icon;
                        return (
                            <div key={idx} className="relative z-10 bg-brand-dark border border-white/5 p-8 rounded-2xl hover:border-brand-purple/30 transition-colors group">
                                <div className="w-16 h-16 rounded-full bg-brand-card flex items-center justify-center border border-white/10 mb-6 mx-auto group-hover:scale-110 transition-transform shadow-lg shadow-black/50 relative">
                                    <div className={`absolute inset-0 rounded-full bg-${step.color}/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity`} />
                                    <Icon className="w-8 h-8 text-white relative z-10" />
                                </div>
                                <div className="text-center">
                                    <span className="text-6xl font-bold text-white/5 absolute top-4 right-4">{step.number}</span>
                                    <h3 className="text-xl font-bold mb-3 relative z-10">{step.title}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed relative z-10">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}
