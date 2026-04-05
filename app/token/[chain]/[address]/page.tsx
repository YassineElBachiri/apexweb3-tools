import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Shield, ShieldCheck, ShieldAlert, AlertTriangle, RefreshCw, Home, ChevronRight, TrendingUp, Activity } from "lucide-react";
import { analyzeSecurity, fetchTokenMarketData } from "@/lib/security-service";
import { RiskDashboard } from "@/components/security/RiskDashboard";
import { ShareCard } from "@/components/security/ShareCard";
import { recordScan } from "@/lib/scan-store";
import { pingIndexNow, buildTokenUrl, getVerdict } from "@/lib/index-now";

// ─── ISR: Cache each token page for 1 hour ─────────────────────────────────────
export const revalidate = 3600;

const VALID_CHAINS = ["ethereum", "eth", "base", "solana"] as const;
type Chain = (typeof VALID_CHAINS)[number];

function normalizeChain(chain: string): "eth" | "base" | "solana" {
    if (chain === "ethereum") return "eth";
    if (chain === "base") return "base";
    if (chain === "solana") return "solana";
    return "eth";
}

function chainDisplayName(chain: string): string {
    const map: Record<string, string> = {
        eth: "Ethereum", ethereum: "Ethereum", base: "Base", solana: "Solana",
    };
    return map[chain] ?? chain.charAt(0).toUpperCase() + chain.slice(1);
}

// ─── Props ─────────────────────────────────────────────────────────────────────
interface PageProps {
    params: Promise<{ chain: string; address: string }>;
}

// ─── generateMetadata ──────────────────────────────────────────────────────────
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { chain, address } = await params;
    const network = normalizeChain(chain);
    const chainName = chainDisplayName(chain);
    const shortAddr = `${address.slice(0, 6)}...${address.slice(-4)}`;

    // Try to get token data for richer metadata
    let tokenName = shortAddr;
    let tokenSymbol = "TOKEN";
    let score = 0;
    let isHoneypot = false;
    let buyTax = 0;
    let sellTax = 0;

    try {
        const [profile, market] = await Promise.all([
            analyzeSecurity(network, address),
            fetchTokenMarketData(address),
        ]);
        score = profile.score;
        isHoneypot = profile.isHoneypot;
        buyTax = profile.buyTax ?? 0;
        sellTax = profile.sellTax ?? 0;
        if (market) {
            tokenName = market.tokenName;
            tokenSymbol = market.tokenSymbol;
        }
    } catch {/* fallback to address stub */}

    const honeypotStatus = isHoneypot ? "⚠️ HONEYPOT DETECTED" : "✅ Not a honeypot";
    const title = `${tokenName} (${tokenSymbol}) Risk Analysis — Is ${tokenSymbol} Safe? | ApexWeb3`;
    const description = `${tokenName} scored ${score}/100 on ApexWeb3's security scanner. ${honeypotStatus}. Buy tax: ${buyTax.toFixed(1)}%. Sell tax: ${sellTax.toFixed(1)}%. Full ${chainName} audit report.`;
    const ogImageUrl = `/api/og/security?chain=${chain}&address=${address}&score=${score}&symbol=${tokenSymbol}&honeypot=${isHoneypot}`;
    const canonicalUrl = buildTokenUrl(chain, address);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: title,
        description,
        url: canonicalUrl,
        breadcrumb: {
            "@type": "BreadcrumbList",
            itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://www.apexweb3.com" },
                { "@type": "ListItem", position: 2, name: "Security Scanner", item: "https://www.apexweb3.com/analysis/contract-analyzer" },
                { "@type": "ListItem", position: 3, name: chainDisplayName(chain), item: `https://www.apexweb3.com/token/${chain}` },
                { "@type": "ListItem", position: 4, name: tokenName },
            ],
        },
        mainEntity: {
            "@type": "FinancialProduct",
            name: `${tokenName} (${tokenSymbol})`,
            description,
            identifier: address,
        },
    };

    return {
        title,
        description,
        alternates: { canonical: canonicalUrl },
        openGraph: {
            title,
            description,
            url: canonicalUrl,
            type: "website",
            images: [{ url: ogImageUrl, width: 1200, height: 630, alt: `${tokenSymbol} Security Score — ApexWeb3` }],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [ogImageUrl],
        },
        other: {
            "script:ld+json": JSON.stringify(jsonLd),
        },
    };
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default async function TokenSecurityPage({ params }: PageProps) {
    const { chain, address } = await params;

    if (!VALID_CHAINS.includes(chain as Chain)) notFound();

    const network = normalizeChain(chain);
    const chainName = chainDisplayName(chain);

    let profile;
    let marketData;

    try {
        [profile, marketData] = await Promise.all([
            analyzeSecurity(network, address),
            fetchTokenMarketData(address),
        ]);
    } catch (e) {
        console.error("Token page scan failed:", e);
        return (
            <div className="min-h-screen flex items-center justify-center p-8 text-center">
                <div className="space-y-4 max-w-md">
                    <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto">
                        <ShieldAlert className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold">Scan Failed</h1>
                    <p className="text-muted-foreground">We could not analyze this contract. It may be invalid or the network API is temporarily unavailable.</p>
                    <Link href="/analysis/contract-analyzer" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
                        ← Try another token
                    </Link>
                </div>
            </div>
        );
    }

    // Record scan for ticker + sitemap
    try {
        recordScan({
            chain,
            address,
            tokenName: marketData?.tokenName ?? address.slice(0, 8),
            tokenSymbol: marketData?.tokenSymbol ?? "???",
            score: profile.score,
            isHoneypot: profile.isHoneypot,
            scannedAt: Date.now(),
        });
        // Ping IndexNow for Google to crawl this page
        pingIndexNow(buildTokenUrl(chain, address)).catch(() => {});
    } catch {/* non-critical */}

    const verdict = getVerdict(profile.score);
    const tokenName = marketData?.tokenName ?? address.slice(0, 10) + "…";
    const tokenSymbol = marketData?.tokenSymbol ?? "???";
    const lastUpdated = new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });

    const isSafe = profile.status === "SAFE";
    const isCritical = profile.status === "CRITICAL";

    return (
        <div className="min-h-screen bg-background">

            {/* Background glow */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] blur-[140px] rounded-full opacity-40 ${isSafe ? "bg-emerald-600" : isCritical ? "bg-rose-700" : "bg-yellow-600"}`} />
            </div>

            <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl space-y-10">

                {/* ── Breadcrumb ── */}
                <nav className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap">
                    <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-1">
                        <Home className="w-3.5 h-3.5" /> Home
                    </Link>
                    <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                    <Link href="/analysis/contract-analyzer" className="hover:text-foreground transition-colors">Security Scanner</Link>
                    <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                    <span className="capitalize">{chainName}</span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                    <span className="text-foreground font-medium">{tokenSymbol}</span>
                </nav>

                {/* ── Header ── */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            {isSafe ? (
                                <ShieldCheck className="w-8 h-8 text-emerald-500 flex-shrink-0" />
                            ) : isCritical ? (
                                <ShieldAlert className="w-8 h-8 text-rose-500 flex-shrink-0 animate-pulse" />
                            ) : (
                                <AlertTriangle className="w-8 h-8 text-yellow-500 flex-shrink-0" />
                            )}
                            <h1 className="text-2xl md:text-3xl font-black">
                                {tokenName}{" "}
                                <span className="text-muted-foreground font-semibold text-lg">({tokenSymbol})</span>
                            </h1>
                        </div>
                        <p className="text-sm text-muted-foreground font-mono pl-11">
                            {address}
                        </p>
                    </div>

                    {/* Chain + last updated */}
                    <div className="flex flex-col items-start md:items-end gap-2 pl-11 md:pl-0">
                        <span className="text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1">
                            {chainName} Network
                        </span>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>Last updated: {lastUpdated}</span>
                            <Link
                                href={`/token/${chain}/${address}`}
                                className="flex items-center gap-1 text-primary hover:underline"
                            >
                                <RefreshCw className="w-3 h-3" /> Refresh
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ── Verdict Banner ── */}
                <div className={`p-5 rounded-2xl border flex items-center justify-between gap-4 ${isSafe ? "bg-emerald-500/10 border-emerald-500/20" : isCritical ? "bg-rose-500/10 border-rose-500/20" : "bg-yellow-500/10 border-yellow-500/20"}`}>
                    <div className="space-y-0.5">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Verdict</p>
                        <p className={`text-lg font-black ${verdict.color}`}>
                            {verdict.emoji} {verdict.label}
                        </p>
                    </div>
                    <div className={`text-5xl font-black ${verdict.color}`}>
                        {profile.score}<span className="text-2xl text-muted-foreground font-semibold">/100</span>
                    </div>
                </div>

                {/* ── Full Risk Dashboard ── */}
                <RiskDashboard profile={profile} marketData={marketData} />

                {/* ── Share Section ── */}
                <div className="space-y-4">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <Activity className="w-5 h-5 text-primary" />
                        Share This Report
                    </h2>
                    <ShareCard profile={profile} marketData={marketData} />
                </div>

                {/* ── Scan Another Token CTA ── */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-indigo-500/5 border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-5">
                    <div>
                        <h3 className="font-bold text-lg">Scan Another Token</h3>
                        <p className="text-sm text-muted-foreground">Paste any Ethereum, Base, or Solana address for an instant safety check.</p>
                    </div>
                    <Link
                        href="/analysis/contract-analyzer"
                        className="flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 shadow-[0_0_25px_rgba(99,102,241,0.35)] transition-all"
                    >
                        <Shield className="w-4 h-4" />
                        Start New Scan
                    </Link>
                </div>

                {/* ── Related Tools ── */}
                <div className="space-y-4">
                    <h2 className="text-lg font-bold">Related Tools</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                            { title: "Tokenomics Analyzer", desc: "Supply distribution & inflation risk", href: `/analysis/analyzer?q=${address}`, icon: <TrendingUp className="w-4 h-4" /> },
                            { title: "Whale Watch", desc: "Track large wallet movements", href: "/analysis/whales", icon: <Activity className="w-4 h-4" /> },
                            { title: "Spike Detector", desc: "Real-time price pump alerts", href: "/discovery/spike-detector", icon: <Shield className="w-4 h-4" /> },
                        ].map(({ title, desc, href, icon }) => (
                            <Link key={title} href={href} className="flex items-start gap-3 p-4 rounded-xl bg-card/30 border border-white/5 hover:border-primary/25 hover:bg-primary/5 transition-all group">
                                <div className="p-1.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors flex-shrink-0 mt-0.5">{icon}</div>
                                <div>
                                    <div className="font-semibold text-sm group-hover:text-primary transition-colors">{title}</div>
                                    <div className="text-xs text-muted-foreground">{desc}</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* ── FAQ ── */}
                <div className="space-y-4">
                    <h2 className="text-lg font-bold">Token Security — Frequently Asked Questions</h2>
                    <div className="space-y-3">
                        {[
                            {
                                q: "How to check if a crypto token is safe?",
                                a: "Use ApexWeb3's scanner to audit the smart contract for honeypot patterns, hidden taxes, unverified code, and dangerous owner privileges. These are the four most common rug pull vectors.",
                            },
                            {
                                q: "What is a honeypot in crypto?",
                                a: "A honeypot is a scam contract that looks tradeable but blocks you from selling. You can buy but the sell transaction always reverts. Our simulated swap test detects this with 100% accuracy before you invest.",
                            },
                            {
                                q: "How to detect a rug pull before it happens?",
                                a: "Watch for: unrenounced ownership, unlocked liquidity, unverified source code, sell taxes above 10%, or functions like 'setTax' that can be changed after launch. Our scanner flags all of these.",
                            },
                            {
                                q: "What is buy/sell tax in DeFi?",
                                a: "Buy/sell taxes are percentage fees deducted on every trade, written into the smart contract. They cannot be changed by traders. Taxes above 10% are a warning sign; above 25% is nearly always a scam.",
                            },
                        ].map(({ q, a }, i) => (
                            <details key={i} className="group p-4 rounded-xl bg-card/30 border border-white/5 cursor-pointer hover:border-primary/20 transition-colors">
                                <summary className="font-semibold text-sm flex items-center justify-between gap-3 list-none">
                                    {q}
                                    <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 group-open:rotate-90 transition-transform" />
                                </summary>
                                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{a}</p>
                            </details>
                        ))}
                    </div>
                </div>

                {/* ── Footer note ── */}
                <p className="text-xs text-muted-foreground/50 text-center pb-8">
                    ⚠️ ApexWeb3 scans are automated and informational only. Always do your own research (DYOR) before trading. Not financial advice.
                </p>

            </div>
        </div>
    );
}
