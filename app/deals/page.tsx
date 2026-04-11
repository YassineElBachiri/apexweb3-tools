import { Metadata } from "next";
import DealsClient from "@/components/deals/DealsClient";

export const metadata: Metadata = {
  title: "Crypto Partner Deals & Offers | ApexWeb3",
  description: "Exclusive deals on crypto exchanges, hardware wallets, and analytics tools. Trusted partners of ApexWeb3.",
  openGraph: {
      images: ["/og/deals.png"],
  }
};

export default function DealsPage() {
  return (
    <div className="min-h-screen bg-[#0F172A] relative overflow-hidden pb-12">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-blue-500/10 blur-[100px] pointer-events-none rounded-full" />
      
      {/* Section 2 - Disclosure Banner */}
      <div className="w-full bg-amber-500/8 border-b border-amber-500/20 py-2 px-4 shadow-sm relative z-10">
        <p className="text-amber-300/80 text-xs text-center max-w-3xl mx-auto flex items-center justify-center gap-2">
          <span>ℹ</span> ApexWeb3 participates in affiliate programs. We only recommend tools and platforms we trust. Commissions help us keep all tools free.
        </p>
      </div>

      <div className="container mx-auto px-4 pt-16 relative z-10">
        {/* Section 3 - Page Header */}
        <div className="text-center mb-10">
          <p className="text-blue-500 uppercase tracking-[0.2em] font-bold text-sm mb-3">
            PARTNER DEALS
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Deals & Offers
          </h1>
          <p className="text-lg text-white/60 max-w-xl mx-auto">
            Hand-picked tools trusted by the ApexWeb3 team. Every partner is vetted.
          </p>
        </div>

        {/* Section 4 & 5 - Category Filter Tabs & Grid */}
        <DealsClient />

        {/* Section 6 - Footer Disclosure */}
        <div className="mt-20 pt-8 border-t border-white/5 mx-auto max-w-3xl">
          <p className="text-xs text-white/40 text-center leading-relaxed">
            ApexWeb3 may earn a commission when you click partner links on this page. 
            This does not affect our tool recommendations or editorial independence.
          </p>
        </div>
      </div>
    </div>
  );
}
