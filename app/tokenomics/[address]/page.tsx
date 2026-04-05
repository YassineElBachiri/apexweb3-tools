import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RiskCard } from "@/components/tokenomics/risk-card";
import { TokenShare } from "@/components/tokenomics/token-share";
import { formatUSD, formatNumber, shortenAddress } from "@/lib/utils";
import { TrendingUp, DollarSign, Coins, PieChart } from "lucide-react";
import type { ApiResponse, TokenomicsAnalysis } from "@/types";

interface PageProps {
    params: Promise<{ address: string }>;
}

async function getTokenomicsData(address: string): Promise<TokenomicsAnalysis | null> {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
        const response = await fetch(`${baseUrl}/api/tokenomics?address=${address}`, {
            next: { revalidate: 60 },
        });

        if (!response.ok) {
            return null;
        }

        const result: ApiResponse<TokenomicsAnalysis> = await response.json();
        return result.success ? result.data || null : null;
    } catch (error) {
        console.error("Error fetching tokenomics data:", error);
        return null;
    }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { address } = await params;
    const data = await getTokenomicsData(address);

    const title = data
        ? `Is ${data.token.symbol} a rug? | ApexWeb3 Tokenomics Analysis`
        : `Token Analysis ${shortenAddress(address)} | ApexWeb3 Tools`;

    const description = data
        ? `Real-time tokenomics analysis for ${data.token.symbol}. Inflation risk: ${data.inflationRisk.toFixed(1)}%, Sustainability score: ${data.sustainabilityScore.toFixed(1)}/100. Check supply distribution and dilution risks.`
        : `Comprehensive tokenomics analysis for token ${shortenAddress(address)}`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
        },
    };
}

export default async function TokenPage({ params }: PageProps) {
    const { address } = await params;
    const data = await getTokenomicsData(address);

    if (!data) {
        return (
            <div className="container mx-auto px-4 py-12">
                <Card className="max-w-2xl mx-auto">
                    <CardContent className="py-12 text-center">
                        <TrendingUp className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                        <h2 className="text-2xl font-bold mb-2">Token Not Found</h2>
                        <p className="text-muted-foreground mb-6">
                            Unable to load tokenomics data for this address.
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
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-6 w-6 text-primary" />
                        <h1 className="text-3xl font-bold">Tokenomics Analyzer</h1>
                    </div>
                    <p className="text-muted-foreground">
                        Deep dive analysis for {data.token.name} ({data.token.symbol})
                    </p>
                    <p className="text-sm text-muted-foreground font-mono mt-1">{address}</p>
                </div>
                <TokenShare
                    symbol={data.token.symbol}
                    score={data.investmentScore?.totalScore || 0}
                    riskLevel={data.riskLevel}
                    address={address}
                />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            Market Cap
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatUSD(data.token.marketCap, 0)}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <PieChart className="h-4 w-4" />
                            FDV
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatUSD(data.token.fdv, 0)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {data.fdvToMarketCapRatio.toFixed(2)}x Market Cap
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Coins className="h-4 w-4" />
                            Circulating Supply
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatNumber(data.token.circulatingSupply, 0)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {data.supplyDistribution.circulating.toFixed(1)}% of total
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Coins className="h-4 w-4" />
                            Total Supply
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatNumber(data.token.totalSupply, 0)}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Risk Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2">
                    <RiskCard
                        tokenSymbol={data.token.symbol}
                        tokenName={data.token.name}
                        inflationRisk={data.inflationRisk}
                        sustainabilityScore={data.sustainabilityScore}
                        riskLevel={data.riskLevel}
                    />
                </div>

                {/* Supply Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle>Supply Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm">Circulating</span>
                                <span className="text-sm font-bold text-success">
                                    {data.supplyDistribution.circulating.toFixed(1)}%
                                </span>
                            </div>
                            <div className="h-2 bg-background-card rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-success"
                                    style={{ width: `${data.supplyDistribution.circulating}%` }}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm">Locked</span>
                                <span className="text-sm font-bold text-warning">
                                    {data.supplyDistribution.locked.toFixed(1)}%
                                </span>
                            </div>
                            <div className="h-2 bg-background-card rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-warning"
                                    style={{ width: `${data.supplyDistribution.locked}%` }}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm">Unvested</span>
                                <span className="text-sm font-bold text-danger">
                                    {data.supplyDistribution.unvested.toFixed(1)}%
                                </span>
                            </div>
                            <div className="h-2 bg-background-card rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-danger"
                                    style={{ width: `${data.supplyDistribution.unvested}%` }}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div >
    );
}
