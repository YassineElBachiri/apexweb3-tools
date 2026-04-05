import { analyzeSecurity, fetchTokenMarketData } from "@/lib/security-service";
import { getVerdict } from "@/lib/index-now";
import { ShieldCheck, ShieldAlert, AlertTriangle } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const revalidate = 3600;

interface PageProps {
    params: Promise<{ network: string; address: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { network, address } = await params;
    return {
        title: `Token Security Widget — ${address.slice(0, 8)}… | ApexWeb3`,
        robots: { index: false },
    };
}

export default async function WidgetPage({ params }: PageProps) {
    const { network, address } = await params;

    let score = 0;
    let isHoneypot = false;
    let buyTax: number | undefined;
    let sellTax: number | undefined;
    let tokenSymbol = "???";
    let status: "SAFE" | "WARNING" | "CRITICAL" = "WARNING";

    try {
        const net = network === "ethereum" ? "eth" : network === "base" ? "base" : "solana";
        const [profile, market] = await Promise.all([
            analyzeSecurity(net as "eth" | "base" | "solana", address),
            fetchTokenMarketData(address),
        ]);
        score = profile.score;
        isHoneypot = profile.isHoneypot;
        buyTax = profile.buyTax;
        sellTax = profile.sellTax;
        status = profile.status;
        if (market) tokenSymbol = market.tokenSymbol;
    } catch { /* show error state */ }

    const verdict = getVerdict(score);
    const isSafe = status === "SAFE";
    const isCritical = status === "CRITICAL";
    const chainLabel = network === "eth" || network === "ethereum" ? "Ethereum" : network === "base" ? "Base" : "Solana";
    const resultUrl = `https://www.apexweb3.com/token/${network}/${address}`;

    const scoreColor = isSafe ? "#10b981" : isCritical ? "#f43f5e" : "#f59e0b";

    return (
        <html lang="en" className="dark">
            <body className="bg-[#0a0f1e] m-0 p-0 overflow-hidden">
                <div style={{
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    background: "linear-gradient(135deg, #0a0f1e, #0d1528)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "12px",
                    padding: "20px",
                    width: "100%",
                    minHeight: "200px",
                    color: "white",
                }}>
                    {/* Header */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <div style={{ width: "22px", height: "22px", borderRadius: "5px", background: "linear-gradient(135deg,#2563eb,#6366f1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 900, color: "white" }}>A</div>
                            <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>ApexWeb3 Security</span>
                        </div>
                        <span style={{ fontSize: "11px", background: "rgba(99,102,241,0.15)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.25)", borderRadius: "999px", padding: "2px 10px", fontWeight: 600 }}>
                            {chainLabel}
                        </span>
                    </div>

                    {/* Token + Score */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                        <div>
                            <div style={{ fontSize: "22px", fontWeight: 900, color: "white" }}>{tokenSymbol}</div>
                            <div style={{ fontSize: "11px", color: "#475569", fontFamily: "monospace" }}>
                                {address.slice(0, 8)}…{address.slice(-6)}
                            </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: "36px", fontWeight: 900, color: scoreColor, lineHeight: 1 }}>
                                {score}<span style={{ fontSize: "16px", color: "#475569" }}>/100</span>
                            </div>
                            <div style={{ fontSize: "11px", color: scoreColor, fontWeight: 700 }}>{verdict.emoji} {verdict.label.split(" — ")[0]}</div>
                        </div>
                    </div>

                    {/* Metrics */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "16px" }}>
                        {[
                            { label: "Honeypot", value: isHoneypot ? "DANGER" : "SAFE", ok: !isHoneypot },
                            { label: "Buy Tax", value: buyTax !== undefined ? `${buyTax.toFixed(1)}%` : "N/A", ok: (buyTax ?? 0) <= 5 },
                            { label: "Sell Tax", value: sellTax !== undefined ? `${sellTax.toFixed(1)}%` : "N/A", ok: (sellTax ?? 0) <= 5 },
                            { label: "Risk Level", value: status, ok: isSafe },
                        ].map(({ label, value, ok }) => (
                            <div key={label} style={{
                                background: ok ? "rgba(16,185,129,0.07)" : "rgba(244,63,94,0.07)",
                                border: `1px solid ${ok ? "rgba(16,185,129,0.15)" : "rgba(244,63,94,0.15)"}`,
                                borderRadius: "8px", padding: "8px 12px",
                                display: "flex", justifyContent: "space-between", alignItems: "center",
                            }}>
                                <span style={{ fontSize: "11px", color: "#64748b" }}>{label}</span>
                                <span style={{ fontSize: "12px", fontWeight: 700, color: ok ? "#10b981" : "#f43f5e" }}>{value}</span>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <a
                        href={resultUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: "block", textAlign: "center", padding: "9px",
                            background: "linear-gradient(135deg,#2563eb,#6366f1)",
                            borderRadius: "8px", color: "white",
                            fontSize: "12px", fontWeight: 700, textDecoration: "none",
                        }}
                    >
                        View Full Report → apexweb3.com
                    </a>
                </div>
            </body>
        </html>
    );
}
