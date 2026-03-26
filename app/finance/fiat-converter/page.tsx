import type { Metadata } from 'next';
import { FiatConverter } from "@/components/fiat-converter/FiatConverter";

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
        </div>
    );
}
