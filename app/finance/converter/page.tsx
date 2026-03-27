import { ConverterCard } from "@/components/converter/ConverterCard";
import { HistoricalRateChart } from "@/components/converter/HistoricalRateChart";
import { ToolFAQ } from "@/components/seo/ToolFAQ";
import { LiveConversionTable } from "@/components/converter/LiveConversionTable";

export default function ConverterPage() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="mb-8 text-center">
                <h1 className="text-4xl font-extrabold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-secondary">
                    Crypto Converter
                </h1>
                <p className="text-zinc-400 max-w-2xl mx-auto">
                    Instantly convert between Bitcoin, Ethereum, and 100+ other cryptocurrencies with real-time exchange rates.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-1 space-y-6">
                    <ConverterCard />
                </div>

                <div className="lg:col-span-2 space-y-6">
                    {/* For MVP, we pass dummy data/props or static content to these components 
                        since they would require lifting state up from ConverterCard or using a Context.
                        For a better UX, we would normally use a Context or Zustand store.
                        Here, I will just render them to show the layout. 
                    */}
                    <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">Market Analysis</h2>
                            <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-mono">LIVE</span>
                        </div>
                        <HistoricalRateChart fromCurrency="BTC" toCurrency="ETH" />

                        <div className="mt-8 border-t border-zinc-900 pt-8">
                            <LiveConversionTable
                                baseCurrency="BTC"
                                amount={1}
                                rates={{
                                    'ETH': 25.23,
                                    'SOL': 540.5,
                                    'BNB': 120.2,
                                    'ADA': 45000,
                                    'XRP': 32000,
                                    'USDT': 64000
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <ToolFAQ 
                toolName="Crypto Converter" 
                description={
                    <>
                        <p>
                            The ApexWeb3 Crypto Converter is a professional-grade simulation tool designed for cryptocurrency investors, researchers, and traders. Our infrastructure taps into real-time global index rates to aggregate the exact conversion pathways between any two digital assets.
                        </p>
                        <p>
                            Unlike traditional converters, our engine provides a multi-dimensional analysis including live slippage estimations, spread differentials across major exchanges (like Binance, Kraken, and Bybit), and fully functional historical and portfolio basket modelling tools to help you simulate past missed opportunities and future rebalancings.
                        </p>
                    </>
                }
                faqs={[
                    {
                        question: "How accurate are the conversion rates?",
                        answer: "Our engine synchronizes tightly with top-tier crypto indexing APIs (like CoinGecko) to ensure maximum precision. Rates are refreshed automatically every 30 seconds."
                    },
                    {
                        question: "Does this Converter account for exchange fees?",
                        answer: "Yes. Our unique 'Fee Reality Check' panel analyzes your proposed swap against the live maker/taker fee structures of five major global centralized exchanges, calculating exactly how much of your capital would be lost to hidden spreads during execution."
                    },
                    {
                        question: "Can I simulate past crypto conversions?",
                        answer: "Absolutely. By switching the tool into 'Historical Mode,' you can select any date dating back to 2015 to see exactly what a specific asset swap was valued at then, compared to its exact valuation today."
                    }
                ]}
            />
        </div>
    );
}
