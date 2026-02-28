import { Shield, Search, AlertTriangle, CheckCircle } from "lucide-react";
import { SearchBar } from "@/components/search-bar";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { FAQSection } from "@/components/seo/faq-section";
import { RelatedTools } from "@/components/seo/related-tools";
import { securityScannerFAQs } from "@/lib/seo-content/security-faq";

const relatedTools = [
    {
        name: "Tokenomics Analyzer",
        description: "Analyze token economics and get investment scores",
        href: "/analysis/analyzer",
    },
    {
        name: "Portfolio Tracker",
        description: "Track your crypto holdings and performance privately",
        href: "/portfolio",
    },
    {
        name: "Whale Watch",
        description: "Monitor large wallet movements in real-time",
        href: "/analysis/whales",
    },
];

export default function SecurityScanLandingPage() {
    return (
        <div className="min-h-screen">
            <div className="container mx-auto px-4 py-12 space-y-12">
                {/* Breadcrumbs */}
                <Breadcrumbs items={[{ label: "Security Scanner" }]} />

                <div className="max-w-4xl mx-auto text-center space-y-8">
                    {/* Hero Section */}
                    <div className="space-y-4">
                        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
                            <Shield className="h-12 w-12 text-primary" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
                            Smart Contract Security Scanner
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Analyze any token contract for honeypots, hidden mint functions, and liquidity locks.
                            Protect yourself from rug pulls.
                        </p>
                    </div>

                    {/* Search Section */}
                    <div className="flex justify-center py-8">
                        <SearchBar />
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mt-12">
                        <Card className="bg-background/40 hover:bg-background/60 transition-smooth border-primary/20">
                            <CardContent className="pt-6">
                                <div className="mb-4 p-2 bg-red-500/10 w-fit rounded-lg">
                                    <AlertTriangle className="h-6 w-6 text-red-500" />
                                </div>
                                <h3 className="text-lg font-bold mb-2">Honeypot Detection</h3>
                                <p className="text-sm text-muted-foreground">
                                    Simulates buy and sell transactions to ensure you can exit your position.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-background/40 hover:bg-background/60 transition-smooth border-primary/20">
                            <CardContent className="pt-6">
                                <div className="mb-4 p-2 bg-blue-500/10 w-fit rounded-lg">
                                    <Search className="h-6 w-6 text-blue-500" />
                                </div>
                                <h3 className="text-lg font-bold mb-2">Contract Analysis</h3>
                                <p className="text-sm text-muted-foreground">
                                    Checks for ownership renouncement, hidden mints, and malicious code patterns.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-background/40 hover:bg-background/60 transition-smooth border-primary/20">
                            <CardContent className="pt-6">
                                <div className="mb-4 p-2 bg-green-500/10 w-fit rounded-lg">
                                    <CheckCircle className="h-6 w-6 text-green-500" />
                                </div>
                                <h3 className="text-lg font-bold mb-2">Liquidity Check</h3>
                                <p className="text-sm text-muted-foreground">
                                    Verifies if liquidity is locked and for how long, preventing quick rug pulls.
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sample Address Helper */}
                    <div className="text-sm text-muted-foreground mt-8">
                        <p>Try searching for a token address or name.</p>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="max-w-4xl mx-auto">
                    <FAQSection
                        title="Security Scanner - Frequently Asked Questions"
                        faqs={securityScannerFAQs}
                    />
                </div>

                {/* Related Tools */}
                <div className="max-w-6xl mx-auto">
                    <RelatedTools
                        title="Complete Your Token Research"
                        tools={relatedTools}
                    />
                </div>
            </div>
        </div>
    );
}
