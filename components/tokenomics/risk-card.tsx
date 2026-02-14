"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getRiskColor } from "@/lib/utils";
import { AlertTriangle, CheckCircle, Info, TrendingUp, Activity, DollarSign, BarChart3 } from "lucide-react";
import { InvestmentScore } from "@/types";

interface RiskCardProps {
    tokenSymbol: string;
    tokenName: string;
    inflationRisk: number;
    sustainabilityScore: number;
    riskLevel: "low" | "medium" | "high";
    investmentScore?: InvestmentScore;
}

export function RiskCard({
    tokenSymbol,
    tokenName,
    inflationRisk,
    sustainabilityScore,
    riskLevel,
    investmentScore
}: RiskCardProps) {
    // Determine verdict colors
    const getVerdictColor = (verdict: string) => {
        switch (verdict) {
            case 'Strong Hold': return 'text-success border-success/50 bg-success/10';
            case 'Speculative': return 'text-warning border-warning/50 bg-warning/10';
            case 'High Risk': return 'text-orange-500 border-orange-500/50 bg-orange-500/10';
            case 'Overvalued': return 'text-danger border-danger/50 bg-danger/10';
            default: return 'text-muted-foreground';
        }
    };

    // Use detailed score if available, otherwise fallback to simple risk level
    if (investmentScore) {
        const verdictStyle = getVerdictColor(investmentScore.verdict);

        return (
            <Card className="border-2 border-primary/20 overflow-hidden">
                <CardHeader className="bg-primary/5 pb-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-2xl">
                                {tokenSymbol} Investment Rating
                            </CardTitle>
                            <CardDescription className="text-base mt-1">
                                Comprehensive analysis based on 5 parameters
                            </CardDescription>
                        </div>
                        <div className={`px-4 py-2 rounded-lg border-2 font-bold text-lg ${verdictStyle}`}>
                            {investmentScore.verdict.toUpperCase()}
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="pt-6 space-y-8">
                    {/* Main Score Display */}
                    <div className="flex flex-col items-center justify-center text-center">
                        <div className="relative flex items-center justify-center w-32 h-32 rounded-full border-8 border-primary/20 mb-4 neon-glow">
                            <span className="text-4xl font-bold gradient-text">
                                {investmentScore.totalScore}
                            </span>
                            <div className="absolute top-0 left-0 w-full h-full rounded-full border-t-8 border-primary animate-spin" style={{ animationDuration: '3s' }}></div>
                        </div>
                        <p className="text-lg font-medium text-muted-foreground">Total Investment Score</p>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* 1. Market Cap Maturity */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-primary" /> Market Cap Maturity</span>
                                <span className="text-muted-foreground">{investmentScore.marketCapMaturity}/25</span>
                            </div>
                            <Progress value={(investmentScore.marketCapMaturity / 25) * 100} className="h-2" />
                        </div>

                        {/* 2. Tokenomics Health */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="flex items-center gap-2"><Activity className="w-4 h-4 text-secondary" /> Tokenomics Health</span>
                                <span className="text-muted-foreground">{investmentScore.tokenomicsHealth}/25</span>
                            </div>
                            <Progress value={(investmentScore.tokenomicsHealth / 25) * 100} className="h-2" />
                        </div>

                        {/* 3. Volatility Score */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="flex items-center gap-2"><BarChart3 className="w-4 h-4 text-success" /> Volatility Stability</span>
                                <span className="text-muted-foreground">{investmentScore.volatilityScore}/20</span>
                            </div>
                            <Progress value={(investmentScore.volatilityScore / 20) * 100} className="h-2" />
                        </div>

                        {/* 4. Price Performance */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="flex items-center gap-2"><TrendingUp className="w-4 h-4 text-warning" /> Price Performance</span>
                                <span className="text-muted-foreground">{investmentScore.pricePerformance}/20</span>
                            </div>
                            <Progress value={(investmentScore.pricePerformance / 20) * 100} className="h-2" />
                        </div>

                        {/* 5. Trend Momentum */}
                        <div className="space-y-2 md:col-span-2">
                            <div className="flex justify-between text-sm">
                                <span className="flex items-center gap-2"><TrendingUp className="w-4 h-4 text-primary" /> Trend / Momentum</span>
                                <span className="text-muted-foreground">{investmentScore.trendMomentum}/10</span>
                            </div>
                            <Progress value={(investmentScore.trendMomentum / 10) * 100} className="h-2" />
                        </div>
                    </div>

                    {/* Legacy Risk Explanation */}
                    <div className="bg-background/50 rounded-lg p-4 border border-border mt-4">
                        <div className="flex items-start gap-3">
                            <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-foreground">Inflation Risk Analysis</p>
                                <p className="text-xs text-muted-foreground">
                                    Current inflation risk is <strong>{inflationRisk.toFixed(1)}%</strong>.
                                    {inflationRisk > 100
                                        ? " High dilution expected due to locked supply."
                                        : " Most supply is already circulating, reducing dilution pressure."}
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Fallback for when no detailed score is available (legacy view)
    return (
        <Card className="border-2" style={{ borderColor: riskLevel === "low" ? "rgb(0, 255, 148, 0.3)" : riskLevel === "medium" ? "rgb(255, 149, 0, 0.3)" : "rgb(255, 59, 48, 0.3)" }}>
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2 mb-2">
                            <CheckCircle className="h-6 w-6 text-success" />
                            <span>{tokenSymbol} Risk Analysis</span>
                        </CardTitle>
                        <CardDescription>{tokenName}</CardDescription>
                    </div>
                    <Badge variant={riskLevel === "low" ? "success" : riskLevel === "medium" ? "warning" : "destructive"}>
                        {riskLevel.toUpperCase()} RISK
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Sustainability Score</span>
                        <span className="text-sm font-bold text-primary">
                            {sustainabilityScore.toFixed(1)}/100
                        </span>
                    </div>
                    <Progress value={sustainabilityScore} className="h-3" />
                </div>
            </CardContent>
        </Card>
    );
}
