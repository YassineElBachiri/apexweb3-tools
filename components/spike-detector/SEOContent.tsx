import { JsonLd } from "@/components/seo/json-ld";

export function SEOContent() {
    const faqData = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What is Volume Velocity in memecoin trading?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Volume Velocity measures the speed at which trading volume is entering a token relative to its available liquidity. A high velocity (e.g., >5% in 5 minutes) indicates significant momentum and is often a precursor to a major price spike in micro-cap tokens."
                }
            },
            {
                "@type": "Question",
                "name": "How does RugCheck protect Solana traders?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "RugCheck is a security tool for the Solana blockchain that analyzes token contracts for red flags like high creator holdings, unlocked liquidity, or 'dev sells'. Trench Hunter integrates RugCheck data to automatically downgrade or flag risky tokens."
                }
            },
            {
                "@type": "Question",
                "name": "What are the risks of trading micro-cap trench tokens?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Micro-cap tokens, often called 'trenches', carry extreme risks including 100% capital loss. Common threats include 'rug pulls', where developers drain liquidity, and 'honeypots', where tokens cannot be sold. Always use security tools like GoPlus and RugCheck before trading."
                }
            }
        ]
    };

    return (
        <section className="container mx-auto px-4 py-12 md:px-6 border-t border-slate-800/50 mt-12">
            <JsonLd data={faqData} />

            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-white mb-8 bg-gradient-to-r from-emerald-400 to-brand-primary bg-clip-text text-transparent">
                    Live Solana & Base Memecoin Spike Detector | Trench Hunter
                </h2>

                <div className="prose prose-invert max-w-none text-slate-400 mb-12">
                    <p>
                        Welcome to the front lines of on-chain intelligence. Trench Hunter is designed for high-frequency
                        traders looking to identify <strong>Volume Velocity</strong> spikes in real-time. We aggregate
                        data from the most volatile &quot;trenches&quot; on Solana and Base, filtering through thousands of tokens
                        to surface those with actual momentum.
                    </p>
                    <p>
                        Our proprietary algorithm scores tokens based on liquidity-to-volume ratios, ensuring you don&apos;t
                        just see volume, but <em>acceleration</em>. Combined with integrated safety audits from
                        RugCheck and GoPlus, we provide a professional-grade terminal for micro-cap exploration.
                    </p>
                </div>

                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-slate-200 flex items-center gap-2">
                        <span className="text-brand-primary">FAQ</span> Frequently Asked Questions
                    </h3>

                    <div className="grid gap-4">
                        {faqData.mainEntity.map((item, i) => (
                            <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 hover:border-slate-700 transition-colors">
                                <h4 className="font-bold text-slate-100 mb-2">{item.name}</h4>
                                <p className="text-sm text-slate-400 leading-relaxed">{item.acceptedAnswer.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
