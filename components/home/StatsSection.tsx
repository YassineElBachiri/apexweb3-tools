
import { Users, Activity, Coins, Zap } from "lucide-react";

interface StatProp {
    number: string;
    label: string;
    icon: any;
}

function StatCard({ number, label, icon: Icon }: StatProp) {
    return (
        <div className="text-center p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-purple/10 text-brand-purple mb-4">
                <Icon className="w-6 h-6" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">{number}</div>
            <div className="text-sm text-gray-400 uppercase tracking-wide font-medium">{label}</div>
        </div>
    );
}

export function StatsSection() {
    return (
        <section className="py-24 bg-gradient-to-b from-[#1a0b2e] to-brand-dark">
            <div className="container mx-auto px-4">

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 mb-20">
                    <StatCard number="50,000+" label="Active Users" icon={Users} />
                    <StatCard number="1M+" label="Analyses Run" icon={Activity} />
                    <StatCard number="100+" label="Supported Assets" icon={Coins} />
                    <StatCard number="99.9%" label="Uptime" icon={Zap} />
                </div>

                <div className="max-w-4xl mx-auto text-center">
                    <h3 className="text-3xl font-bold mb-12">Trusted by Crypto Traders Worldwide</h3>

                    <div className="bg-brand-card border border-white/10 p-8 rounded-2xl relative">
                        <div className="text-4xl text-brand-purple absolute top-4 left-6 opacity-30">"</div>
                        <p className="text-xl text-gray-300 italic mb-6 relative z-10">
                            Finally, a portfolio tracker that doesn't require connecting my wallet.
                            Privacy-first tools like this are rare in Web3. The token analyzer saved me from a potential honeypot last week.
                        </p>
                        <div className="flex items-center justify-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500" />
                            <div className="text-left">
                                <div className="font-bold text-white">Alex Thompson</div>
                                <div className="text-sm text-brand-blue">DeFi Trader</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
