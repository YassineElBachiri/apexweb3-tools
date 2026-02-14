import { SearchBar } from "@/components/search-bar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Wallet, TrendingUp, Eye, ArrowRightLeft, DollarSign } from "lucide-react";

export default function DashboardPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold mb-4">
                    <span className="gradient-text">Web3 Analytics Dashboard</span>
                </h1>
                <p className="text-muted-foreground mb-8">
                    Enter any wallet address or token contract to analyze
                </p>
                <div className="flex justify-center">
                    <SearchBar />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card className="hover:border-primary/50 transition-smooth">
                    <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-3 rounded-lg bg-primary/20">
                                <Wallet className="h-6 w-6 text-primary" />
                            </div>
                            <CardTitle>Portfolio Tracker</CardTitle>
                        </div>
                        <CardDescription>
                            Track any wallet&apos;s token holdings and total value without connecting.
                            Get real-time balance updates and 24h price changes.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm text-muted-foreground">
                            <strong>How to use:</strong> Enter a wallet address (0x...) in the search bar above
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:border-secondary/50 transition-smooth">
                    <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-3 rounded-lg bg-secondary/20">
                                <TrendingUp className="h-6 w-6 text-secondary" />
                            </div>
                            <CardTitle>Tokenomics Analyzer</CardTitle>
                        </div>
                        <CardDescription>
                            Calculate sustainability scores, inflation risk ratios, and FDV/Market Cap analysis.
                            Detect high dilution risks before investing.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm text-muted-foreground">
                            <strong>How to use:</strong> Enter a token contract address to analyze tokenomics
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:border-warning/50 transition-smooth">
                    <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-3 rounded-lg bg-warning/20">
                                <Shield className="h-6 w-6 text-warning" />
                            </div>
                            <CardTitle>Degen Shield</CardTitle>
                        </div>
                        <CardDescription>
                            Detect honeypots, rug pulls, and suspicious contract patterns.
                            Check ownership status, liquidity locks, and contract verification.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm text-muted-foreground">
                            <strong>How to use:</strong> Enter a token contract to run security scan
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:border-success/50 transition-smooth">
                    <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-3 rounded-lg bg-success/20">
                                <Eye className="h-6 w-6 text-success" />
                            </div>
                            <CardTitle>Whale Watch</CardTitle>
                        </div>
                        <CardDescription>
                            Monitor large transactions and smart money movements in real-time.
                            Filter by transaction size and track wallet labels.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm text-muted-foreground">
                            <strong>How to use:</strong> Visit the Whale Watch page to see live feed
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card className="hover:border-blue-500/50 transition-smooth">
                    <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-3 rounded-lg bg-blue-500/20">
                                <ArrowRightLeft className="h-6 w-6 text-blue-500" />
                            </div>
                            <CardTitle>Crypto Converter</CardTitle>
                        </div>
                        <CardDescription>
                            Convert between Bitcoin, Ethereum, and 100+ other cryptocurrencies instantly.
                            View real-time exchange rates and historical price charts.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm text-muted-foreground">
                            <strong>How to use:</strong> <a href="/converter" className="text-primary hover:underline">Launch Converter</a>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:border-green-500/50 transition-smooth">
                    <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-3 rounded-lg bg-green-500/20">
                                <DollarSign className="h-6 w-6 text-green-500" />
                            </div>
                            <CardTitle>Fiat Exchange</CardTitle>
                        </div>
                        <CardDescription>
                            Calculate the value of your crypto in 30+ global fiat currencies.
                            Compare value across USD, EUR, GBP, JPY, and more.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm text-muted-foreground">
                            <strong>How to use:</strong> <a href="/fiat-converter" className="text-primary hover:underline">Launch Fiat Exchange</a>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="glass border-primary/30">
                <CardHeader>
                    <CardTitle>Quick Start Guide</CardTitle>
                </CardHeader>
                <CardContent>
                    <ol className="space-y-3 text-sm">
                        <li className="flex gap-3">
                            <span className="font-bold text-primary">1.</span>
                            <span>Copy any Ethereum wallet address or token contract address</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="font-bold text-primary">2.</span>
                            <span>Paste it into the search bar above</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="font-bold text-primary">3.</span>
                            <span>Click &quot;Analyze&quot; to get instant insights</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="font-bold text-primary">4.</span>
                            <span>Review the analysis and make informed trading decisions</span>
                        </li>
                    </ol>
                </CardContent>
            </Card>
        </div>
    );
}
