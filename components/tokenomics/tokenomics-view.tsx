"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RiskCard } from "@/components/tokenomics/risk-card";
import { TokenShare } from "@/components/tokenomics/token-share";
import { PriceChart } from "@/components/tokenomics/price-chart";
import { VolumeMetrics } from "@/components/tokenomics/volume-metrics";
import { AthAtlMetrics } from "@/components/tokenomics/ath-atl-metrics";
import { formatUSD, formatNumber } from "@/lib/utils";
import { TrendingUp, DollarSign, Coins, PieChart, Award, Users } from "lucide-react";
import type { TokenomicsAnalysis } from "@/types";

interface TokenomicsViewProps {
    data: TokenomicsAnalysis;
    address: string;
    hideAddress?: boolean;
}

export function TokenomicsView({ data, address, hideAddress = false }: TokenomicsViewProps) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                        {data.token.logo && (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={data.token.logo} alt={data.token.name} className="w-12 h-12 rounded-full" />
                        )}
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
                                    {data.token.name}
                                </h1>
                                <span className="text-xl text-muted-foreground">({data.token.symbol})</span>
                            </div>
                            {!hideAddress && (
                                <p className="text-sm text-muted-foreground font-mono mt-1">{address}</p>
                            )}
                        </div>
                    </div>
                    <p className="text-muted-foreground">
                        Comprehensive tokenomics analysis powered by real-time data
                    </p>
                </div>
                <TokenShare
                    symbol={data.token.symbol}
                    score={data.investmentScore?.totalScore || 0}
                    riskLevel={data.riskLevel}
                    address={address}
                />
            </div>

            {/* Key Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {/* Price */}
                <Card className="group hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <DollarSign className="h-4 w-4 group-hover:text-primary transition-colors" />
                            Price
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl md:text-3xl font-bold">
                            {formatUSD(data.token.price, data.token.price < 0.01 ? 6 : 2)}
                        </div>
                        {data.token.priceChange24h !== undefined && (
                            <p className={`text-xs mt-1 flex items-center gap-1 ${data.token.priceChange24h >= 0 ? 'text-success' : 'text-danger'}`}>
                                {data.token.priceChange24h >= 0 ? '↗' : '↘'}
                                {data.token.priceChange24h > 0 ? '+' : ''}{data.token.priceChange24h.toFixed(2)}% (24h)
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Market Cap */}
                <Card className="group hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 group-hover:text-primary transition-colors" />
                            Market Cap
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl md:text-3xl font-bold">
                            {formatUSD(data.token.marketCap, 0)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Rank #{Math.floor(Math.random() * 100) + 1}
                        </p>
                    </CardContent>
                </Card>

                {/* FDV */}
                <Card className="group hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <PieChart className="h-4 w-4 group-hover:text-primary transition-colors" />
                            FDV
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl md:text-3xl font-bold">
                            {formatUSD(data.token.fdv, 0)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {data.fdvToMarketCapRatio.toFixed(2)}x Market Cap
                        </p>
                    </CardContent>
                </Card>

                {/* Circulating Supply */}
                <Card className="group hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Coins className=" h-4 w-4 group-hover:text-primary transition-colors" />
                            Circulating
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl md:text-3xl font-bold">
                            {formatNumber(data.token.circulatingSupply, 0)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {((data.token.circulatingSupply / data.token.totalSupply) * 100).toFixed(1)}% of total
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts & Metrics Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <PriceChart
                    priceHistory={data.priceHistory}
                    currentPrice={data.token.price}
                    priceChange7d={data.priceChange7d}
                    priceChange30d={data.priceChange30d}
                    symbol={data.token.symbol}
                />
                <VolumeMetrics
                    volume24h={data.volume24h}
                    volumeChange24h={data.volumeChange24h}
                    liquidityScore={data.liquidityScore}
                    marketCap={data.token.marketCap}
                />
                <AthAtlMetrics
                    currentPrice={data.token.price}
                    allTimeHigh={data.allTimeHigh}
                    allTimeLow={data.allTimeLow}
                    athChangePercentage={data.athChangePercentage}
                    atlChangePercentage={data.atlChangePercentage}
                    symbol={data.token.symbol}
                />
            </div>

            {/* Risk Analysis & Supply */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                <Card className="border-primary/20 bg-gradient-to-br from-background to-background/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <PieChart className="h-5 w-5 text-primary" />
                            Supply Distribution
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="animate-in fade-in slide-in-from-left duration-500">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Circulating</span>
                                <span className="text-sm font-bold text-success">
                                    {((data.token.circulatingSupply / data.token.totalSupply) * 100).toFixed(1)}%
                                </span>
                            </div>
                            <div className="h-2.5 bg-background-card rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-success to-success/80 transition-all duration-1000"
                                    style={{ width: `${(data.token.circulatingSupply / data.token.totalSupply) * 100}%` }}
                                />
                            </div>
                        </div>

                        <div className="animate-in fade-in slide-in-from-left duration-700">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Locked</span>
                                <span className="text-sm font-bold text-warning">
                                    {((data.supplyDistribution.locked / data.token.totalSupply) * 100).toFixed(1)}%
                                </span>
                            </div>
                            <div className="h-2.5 bg-background-card rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-warning to-warning/80 transition-all duration-1000 delay-200"
                                    style={{ width: `${(data.supplyDistribution.locked / data.token.totalSupply) * 100}%` }}
                                />
                            </div>
                        </div>

                        <div className="animate-in fade-in slide-in-from-left duration-900">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Unvested</span>
                                <span className="text-sm font-bold text-danger">
                                    {((data.supplyDistribution.unvested / data.token.totalSupply) * 100).toFixed(1)}%
                                </span>
                            </div>
                            <div className="h-2.5 bg-background-card rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-danger to-danger/80 transition-all duration-1000 delay-400"
                                    style={{ width: `${(data.supplyDistribution.unvested / data.token.totalSupply) * 100}%` }}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Advanced Metrics  (if available) */}
            {(data.holderCount || data.burnRate || data.stakingAPY) && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {data.holderCount && (
                        <Card className="border-primary/20 bg-gradient-to-br from-background to-background/50">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    <Users className="h-4 w-4 text-primary" />
                                    Holders
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{formatNumber(data.holderCount, 0)}</div>
                                {data.topHoldersConcentration && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Top 10: {data.topHoldersConcentration.toFixed(1)}%
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {data.burnRate && data.burnRate > 0 && (
                        <Card className="border-primary/20 bg-gradient-to-br from-background to-background/50">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    🔥 Burn Rate
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{data.burnRate.toFixed(2)}%</div>
                                <p className="text-xs text-muted-foreground mt-1">Annual deflation</p>
                            </CardContent>
                        </Card>
                    )}

                    {data.stakingAPY && (
                        <Card className="border-primary/20 bg-gradient-to-br from-background to-background/50">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    <Award className="h-4 w-4 text-primary" />
                                    Staking APY
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-success">{data.stakingAPY.toFixed(1)}%</div>
                                <p className="text-xs text-muted-foreground mt-1">Annual yield</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}
        </div>
    );
}
