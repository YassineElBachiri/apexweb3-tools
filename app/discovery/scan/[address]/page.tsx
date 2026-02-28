import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SecurityChecklist } from "@/components/security/security-checklist";
import { Badge } from "@/components/ui/badge";
import { formatTimeAgo, shortenAddress } from "@/lib/utils";
import { Shield, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import type { ApiResponse, SecurityScanResult } from "@/types";

interface PageProps {
    params: Promise<{ address: string }>;
}

async function getSecurityData(address: string): Promise<SecurityScanResult | null> {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
        const response = await fetch(`${baseUrl}/api/security?address=${address}`, {
            next: { revalidate: 120 },
        });

        if (!response.ok) {
            return null;
        }

        const result: ApiResponse<SecurityScanResult> = await response.json();
        return result.success ? result.data || null : null;
    } catch (error) {
        console.error("Error fetching security data:", error);
        return null;
    }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { address } = await params;

    return {
        title: `Security Scan ${shortenAddress(address)} | Degen Shield`,
        description: `Comprehensive security analysis for token ${shortenAddress(address)}. Honeypot detection, ownership verification, liquidity lock status, and rug pull risk assessment.`,
        openGraph: {
            title: `Security Scan ${shortenAddress(address)} | Degen Shield`,
            description: `Real-time security scan and rug pull detection`,
        },
    };
}

export default async function ScanPage({ params }: PageProps) {
    const { address } = await params;
    const data = await getSecurityData(address);

    if (!data) {
        return (
            <div className="container mx-auto px-4 py-12">
                <Card className="max-w-2xl mx-auto">
                    <CardContent className="py-12 text-center">
                        <Shield className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                        <h2 className="text-2xl font-bold mb-2">Scan Failed</h2>
                        <p className="text-muted-foreground mb-6">
                            Unable to scan this token contract.
                        </p>
                        <p className="text-sm text-muted-foreground font-mono bg-background-card px-4 py-2 rounded inline-block">
                            {address}
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const passedChecks = data.checks.filter(c => c.passed).length;
    const totalChecks = data.checks.length;

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-6 w-6 text-primary" />
                    <h1 className="text-3xl font-bold">Degen Shield Security Scan</h1>
                </div>
                <p className="text-muted-foreground">
                    Comprehensive security analysis and rug pull detection
                </p>
                <p className="text-sm text-muted-foreground font-mono mt-1">{address}</p>
            </div>

            {/* Overall Status */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card className="md:col-span-2 border-2" style={{
                    borderColor: data.overallRisk === "low" ? "rgb(0, 255, 148, 0.3)" :
                        data.overallRisk === "medium" ? "rgb(255, 149, 0, 0.3)" :
                            "rgb(255, 59, 48, 0.3)"
                }}>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Overall Risk Assessment
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4">
                            {data.overallRisk === "low" ? (
                                <CheckCircle className="h-12 w-12 text-success" />
                            ) : (
                                <AlertTriangle className="h-12 w-12 text-warning" />
                            )}
                            <div>
                                <div className="text-3xl font-bold">
                                    {data.overallRisk === "low" ? "SAFE" :
                                        data.overallRisk === "medium" ? "CAUTION" : "DANGER"}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {passedChecks}/{totalChecks} checks passed
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Honeypot Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Badge variant={data.isHoneypot ? "destructive" : "success"} className="text-lg px-4 py-2">
                            {data.isHoneypot ? "DETECTED" : "SAFE"}
                        </Badge>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Last Scanned
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg font-semibold">
                            {formatTimeAgo(data.lastScanned)}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                    <CardContent className="py-6">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Ownership Renounced</span>
                            {data.ownershipRenounced ? (
                                <CheckCircle className="h-5 w-5 text-success" />
                            ) : (
                                <AlertTriangle className="h-5 w-5 text-warning" />
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="py-6">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Contract Verified</span>
                            {data.contractVerified ? (
                                <CheckCircle className="h-5 w-5 text-success" />
                            ) : (
                                <AlertTriangle className="h-5 w-5 text-warning" />
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="py-6">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Liquidity Locked</span>
                            {data.liquidityLocked ? (
                                <CheckCircle className="h-5 w-5 text-success" />
                            ) : (
                                <AlertTriangle className="h-5 w-5 text-danger" />
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Checks */}
            <SecurityChecklist checks={data.checks} overallRisk={data.overallRisk} />
        </div>
    );
}
