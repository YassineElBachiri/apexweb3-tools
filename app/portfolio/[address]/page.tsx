import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PortfolioTable } from "@/components/portfolio/portfolio-table";
import { formatUSD, shortenAddress, formatTimeAgo } from "@/lib/utils";
import { Wallet, TrendingUp, Clock, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ApiResponse, PortfolioData } from "@/types";

interface PageProps {
    params: Promise<{ address: string }>;
}

async function getPortfolioData(address: string): Promise<PortfolioData | null> {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
        const response = await fetch(`${baseUrl}/api/portfolio?address=${address}`, {
            next: { revalidate: 30 },
        });

        if (!response.ok) {
            return null;
        }

        const result: ApiResponse<PortfolioData> = await response.json();
        return result.success ? result.data || null : null;
    } catch (error) {
        console.error("Error fetching portfolio data:", error);
        return null;
    }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { address } = await params;

    return {
        title: `Portfolio ${shortenAddress(address)} | ApexWeb3 Tools`,
        description: `View real-time portfolio holdings and total value for wallet ${shortenAddress(address)}. Track token balances, USD values, and 24h price changes.`,
        openGraph: {
            title: `Portfolio ${shortenAddress(address)} | ApexWeb3 Tools`,
            description: `Real-time portfolio analysis for ${shortenAddress(address)}`,
        },
    };
}

export default async function PortfolioPage({ params }: PageProps) {
    const { address } = await params;
    const portfolioData = await getPortfolioData(address);

    if (!portfolioData) {
        return (
            <div className="container mx-auto px-4 py-12">
                <Card className="max-w-2xl mx-auto">
                    <CardContent className="py-12 text-center">
                        <Wallet className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                        <h2 className="text-2xl font-bold mb-2">Portfolio Not Found</h2>
                        <p className="text-muted-foreground mb-6">
                            Unable to load portfolio data for this address. Please check the address and try again.
                        </p>
                        <p className="text-sm text-muted-foreground font-mono bg-background-card px-4 py-2 rounded inline-block">
                            {address}
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                    <Wallet className="h-6 w-6 text-primary" />
                    <h1 className="text-3xl font-bold">Portfolio Tracker</h1>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                    <p className="text-muted-foreground font-mono text-sm">
                        {address}
                    </p>
                    <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="border-primary/30">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Portfolio Value
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold gradient-text">
                            {formatUSD(portfolioData.totalValueUsd)}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Tokens
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">
                            {portfolioData.holdings.length}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Last Updated
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl font-semibold">
                            {formatTimeAgo(portfolioData.lastUpdated)}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Portfolio Table */}
            <PortfolioTable holdings={portfolioData.holdings} />
        </div>
    );
}
