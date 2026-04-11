import { analyzeSecurity, fetchTokenMarketData } from "@/lib/security-service";
import { RiskDashboard } from "@/components/security/RiskDashboard";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { Shield } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import AffiliateBanner from "@/components/affiliates/AffiliateBanner";

interface PageProps {
    params: Promise<{ network: string; address: string }>;
}

export async function generateMetadata(
    { params }: PageProps,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const resolvedParams = await params;
    const { network, address } = resolvedParams;

    const shortAddr = `${address.slice(0, 6)}...${address.slice(-4)}`;
    const title = `Is ${shortAddr} a Rug Pull? Security Audit & Risk Report | ApexWeb3`;
    const description = `Live smart contract security scanner for ${address} on ${network.toUpperCase()}. Check for honeypots, mint functions, liquidity locks, and simulated swap results.`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
        }
    };
}

export default async function SecurityResultPage({ params }: PageProps) {
    const resolvedParams = await params;
    const { network, address } = resolvedParams;

    // Validate network
    if (network !== 'solana' && network !== 'eth' && network !== 'base') {
        notFound();
    }

    try {
        // Fetch security data and market data in parallel
        const [profile, marketData] = await Promise.all([
            analyzeSecurity(network as 'solana' | 'eth' | 'base', address),
            fetchTokenMarketData(address),
        ]);

        return (
            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl space-y-8">

                    <Breadcrumbs items={[
                        { label: "Security Scanner", href: "/analysis/contract-analyzer" },
                        { label: `${network.toUpperCase()} Scan` },
                        { label: marketData ? `${marketData.tokenSymbol}` : `${address.slice(0, 6)}...${address.slice(-4)}` }
                    ]} />

                    <div className="mb-8 text-center md:text-left space-y-2">
                        <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500 flex items-center justify-center md:justify-start gap-3">
                            <Shield className="w-8 h-8 text-primary" />
                            {marketData ? `${marketData.tokenName} (${marketData.tokenSymbol})` : 'Security Scan Report'}
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Automated analysis for {network.toUpperCase()} contract <span className="font-mono text-sm bg-white/5 px-2 py-1 rounded">{address}</span>
                        </p>
                    </div>

                    <RiskDashboard profile={profile} marketData={marketData} />

                    <div className={profile.status === 'CRITICAL' ? "ring-1 ring-red-500/30 rounded-xl mt-8" : "mt-8"}>
                        <AffiliateBanner pageId="security-scanner" variant="inline" />
                    </div>

                </div>
            </div>
        );
    } catch (e) {
        console.error("Scan failed", e);
        return (
            <div className="min-h-screen flex items-center justify-center p-4 text-center">
                <div className="space-y-4 max-w-md">
                    <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Shield className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold">Analysis Failed</h1>
                    <p className="text-muted-foreground">We could not analyze this contract. It may be invalid, or the network API might be temporarily unavailable.</p>
                </div>
            </div>
        )
    }
}

// ISR Revalidation: Cache the result for 15 seconds to prevent rate limiting 
// on high-volume chains while keeping data sufficiently fresh.
export const revalidate = 15;
