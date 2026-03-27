import type { Metadata } from 'next';
import { FiatConverter } from "@/components/fiat-converter/FiatConverter";
import { ToolFAQ } from "@/components/seo/ToolFAQ";

export const metadata: Metadata = {
    title: 'Global Fiat Converter — Crypto in Your Currency | ApexWeb3',
    description:
        'See what your crypto is actually worth in MAD, NGN, BRL, INR, and 60+ local currencies. Includes purchasing power context, on-ramp cost comparison, and savings calculator.',
    openGraph: {
        title: 'Global Fiat Converter | ApexWeb3',
        description: 'Crypto-to-fiat conversion built for non-USD users. Know your local value.',
    },
};

export default function FiatConverterPage() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            {/* Hero header */}
            <div className="mb-8 text-center">
                <h1 className="text-4xl font-extrabold tracking-tight mb-3 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-green-400 to-teal-500">
                    Global Fiat Exchange
                </h1>
                <p className="text-zinc-400 max-w-2xl mx-auto text-base">
                    Crypto in <em>your</em> currency — not just USD.
                    Real purchasing power. Real on-ramp costs.
                </p>
            </div>

            <FiatConverter />

            <ToolFAQ 
                toolName="Global Fiat Exchange" 
                description={
                    <>
                        <p>
                            Traditional crypto portals heavily index against the US Dollar (USD). The ApexWeb3 Fiat Exchange solves this discrepancy by aggressively translating cryptocurrency valuations directly into over 60 of the world&apos;s most utilized local currencies—from the Moroccan Dirham to the Nigerian Naira.
                        </p>
                        <p>
                            Beyond raw conversion, this tool calculates exactly how your digital asset positions translate into real-world purchasing power within your specific geography. We also monitor regional on-ramp spreads, highlighting the cheapest, most efficient avenues for transforming your fiat savings into crypto.
                        </p>
                    </>
                }
                faqs={[
                    {
                        question: "Why should I track crypto in my local currency?",
                        answer: "Because Forex exchange rates (like the strength of the USD against your local fiat) impact your actual profit margins. If Bitcoin goes sideways, but your local currency devalues, your crypto is actually worth more locally. Tracking in your home denomination gives you the true picture of your buying power."
                    },
                    {
                        question: "How are the Purchasing Power averages calculated?",
                        answer: "We source macroeconomic data benchmarks combining national average salaries, median rental rates, and standardized local goods pricing to contextualize exactly what an amount of cryptocurrency is tangibly worth within your country's borders."
                    },
                    {
                        question: "What are on-ramp spreads?",
                        answer: "On-ramp spreads are the hidden 'markups' local exchanges or P2P providers charge above the global spot rate. Our tool tracks these differences to help you find the absolute cheapest way to acquire crypto in your specific region."
                    }
                ]}
            />
        </div>
    );
}
