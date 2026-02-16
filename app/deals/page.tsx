import { Metadata } from "next";
import { DealsHero } from "@/components/deals/Hero";
import { DealsFilterSystem } from "@/components/deals/FilterSystem";
import { NewsletterSignup } from "@/components/deals/NewsletterSignup";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
    title: "Web3 Developer Deals & Crypto Bonuses | ApexWeb3 Tools",
    description: "Exclusive Web3 infrastructure credits, crypto exchange bonuses, security discounts, and cloud hosting perks for blockchain developers.",
    openGraph: {
        title: "Web3 Developer Deals & Crypto Bonuses | ApexWeb3 Tools",
        description: "Exclusive Web3 infrastructure credits, crypto exchange bonuses, security discounts, and cloud hosting perks for blockchain developers.",
        type: "website",
        url: "https://apexweb3.tools/deals", // Assuming this is the URL
        images: [
            {
                url: "https://apexweb3.tools/og-deals.jpg", // Placeholder
                width: 1200,
                height: 630,
                alt: "ApexWeb3 Developer Deals",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Web3 Developer Deals & Crypto Bonuses",
        description: "Exclusive Web3 infrastructure credits, crypto exchange bonuses, security discounts, and cloud hosting perks for blockchain developers.",
        images: ["https://apexweb3.tools/og-deals.jpg"], // Placeholder
    },
};

export default function DealsPage() {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Web3 Developer Deals & Exclusive Builder Perks",
        description: "Curated infrastructure credits, exchange bonuses, security discounts, and cloud offers for serious Web3 builders.",
        publisher: {
            "@type": "Organization",
            name: "ApexWeb3 Tools",
            url: "https://apexweb3.tools",
            logo: {
                "@type": "ImageObject",
                url: "https://apexweb3.tools/logo.png" // Placeholder
            }
        },
        mainEntity: {
            "@type": "ItemList",
            itemListElement: [
                {
                    "@type": "ListItem",
                    position: 1,
                    name: "Alchemy Infrastructure Credits",
                    url: "https://apexweb3.tools/deals#alchemy"
                },
                {
                    "@type": "ListItem",
                    position: 2,
                    name: "QuickNode RPC Credits",
                    url: "https://apexweb3.tools/deals#quicknode"
                },
                {
                    "@type": "ListItem",
                    position: 3,
                    name: "Binance Developer Bonus",
                    url: "https://apexweb3.tools/deals#binance"
                }
            ]
        }
    };

    return (
        <div className="min-h-screen bg-brand-dark pb-20">
            <JsonLd data={structuredData} />

            <DealsHero />

            <div className="container mx-auto px-4 py-12 md:px-6">
                <DealsFilterSystem />
            </div>

            <div className="container mx-auto px-4 py-12 md:px-6">
                <NewsletterSignup />
            </div>

            <div className="container mx-auto max-w-4xl space-y-12 px-4 py-12 md:px-6">
                <div className="space-y-4 text-center">
                    <h2 className="text-3xl font-bold text-white">Why Use Our Curated Deals?</h2>
                    <p className="mx-auto max-w-2xl text-slate-400">
                        ApexWeb3 partners directly with top Web3 infrastructure providers and exchanges to bring you exclusive credits and bonuses you won&apos;t find elsewhere.
                        We verify every deal to ensure it provides genuine value to developers.
                    </p>
                </div>

                <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
                    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
                        <h3 className="mb-2 text-lg font-bold text-white"> verified Offers</h3>
                        <p className="text-sm text-slate-400">Every code and link is tested weekly to ensure it works.</p>
                    </div>
                    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
                        <h3 className="mb-2 text-lg font-bold text-white">Developer First</h3>
                        <p className="text-sm text-slate-400">We prioritize infrastructure and tooling deals over speculative assets.</p>
                    </div>
                    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
                        <h3 className="mb-2 text-lg font-bold text-white">High Value</h3>
                        <p className="text-sm text-slate-400">Total value of active deals on this page exceeds $5,000 in credits.</p>
                    </div>
                </div>

                <div className="rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-8 text-center">
                    <h3 className="mb-4 text-2xl font-bold text-white">Frequently Asked Questions</h3>
                    <div className="mx-auto max-w-2xl space-y-4 text-left">
                        <div className="space-y-2">
                            <h4 className="font-semibold text-slate-200">How do I claim these credits?</h4>
                            <p className="text-sm text-slate-400">Click the &quot;Claim Deal&quot; button to visit the partner site. Some deals require a specific coupon code which you can copy from the card.</p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-semibold text-slate-200">Are these offers valid for existing users?</h4>
                            <p className="text-sm text-slate-400">Most infrastructure credits are for new accounts or new team creations. Exchange bonuses typically apply to new registrations only.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
