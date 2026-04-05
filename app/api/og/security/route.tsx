import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const chain   = searchParams.get("chain")    ?? "eth";
    const address = searchParams.get("address")  ?? "";
    const score   = parseInt(searchParams.get("score") ?? "0", 10);
    const symbol  = searchParams.get("symbol")   ?? "TOKEN";
    const name    = searchParams.get("name")      ?? symbol;
    const honeypot = searchParams.get("honeypot") === "true";

    const shortAddr = address.length > 12
        ? `${address.slice(0, 8)}…${address.slice(-6)}`
        : address;

    const chainLabel = chain === "eth" ? "Ethereum" : chain === "base" ? "Base" : "Solana";

    // Score-based colours
    const scoreColor  = score >= 80 ? "#10b981" : score >= 50 ? "#f59e0b" : "#f43f5e";
    const scoreBg     = score >= 80 ? "rgba(16,185,129,0.15)" : score >= 50 ? "rgba(245,158,11,0.15)" : "rgba(244,63,94,0.15)";
    const verdictText = score >= 86 ? "VERY SAFE ✅" : score >= 61 ? "LOW RISK 🟢" : score >= 31 ? "MODERATE RISK 🟡" : "HIGH RISK 🔴";

    return new ImageResponse(
        (
            <div
                style={{
                    width: "1200px",
                    height: "630px",
                    background: "linear-gradient(135deg, #05080f 0%, #0a1020 50%, #0d1528 100%)",
                    display: "flex",
                    flexDirection: "column",
                    padding: "56px 64px",
                    fontFamily: "sans-serif",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* Background glow */}
                <div style={{
                    position: "absolute", top: "-120px", left: "50%", transform: "translateX(-50%)",
                    width: "700px", height: "400px",
                    background: `radial-gradient(ellipse, ${scoreColor}22 0%, transparent 70%)`,
                    borderRadius: "50%",
                }} />

                {/* Logo row */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "40px" }}>
                    <div style={{
                        width: "36px", height: "36px", borderRadius: "8px",
                        background: "linear-gradient(135deg,#2563eb,#6366f1)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "white", fontWeight: 900, fontSize: "18px",
                    }}>A</div>
                    <span style={{ color: "#94a3b8", fontSize: "18px", fontWeight: 600 }}>ApexWeb3 Security Scan</span>
                    <div style={{ flex: 1 }} />
                    <div style={{
                        background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)",
                        borderRadius: "999px", padding: "4px 16px",
                        color: "#818cf8", fontSize: "14px", fontWeight: 700,
                    }}>
                        {chainLabel}
                    </div>
                </div>

                {/* Token info */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "24px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
                        <div style={{ fontSize: "52px", fontWeight: 900, color: "white", lineHeight: 1.1 }}>
                            {name.length > 20 ? symbol : name}
                            <span style={{ fontSize: "30px", color: "#64748b", fontWeight: 600, marginLeft: "12px" }}>
                                ({symbol})
                            </span>
                        </div>
                        <div style={{ color: "#475569", fontSize: "16px", fontFamily: "monospace" }}>{shortAddr}</div>
                    </div>

                    {/* Score circle */}
                    <div style={{
                        display: "flex", flexDirection: "column", alignItems: "center",
                        background: scoreBg, border: `2px solid ${scoreColor}44`,
                        borderRadius: "20px", padding: "24px 36px", flexShrink: 0,
                    }}>
                        <div style={{ color: "#64748b", fontSize: "13px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "6px" }}>
                            Risk Score
                        </div>
                        <div style={{ color: scoreColor, fontSize: "72px", fontWeight: 900, lineHeight: 1 }}>
                            {score}
                        </div>
                        <div style={{ color: "#475569", fontSize: "18px", fontWeight: 600 }}>/100</div>
                        <div style={{ color: scoreColor, fontSize: "15px", fontWeight: 700, marginTop: "8px" }}>
                            {verdictText}
                        </div>
                    </div>
                </div>

                {/* Metrics row */}
                <div style={{ display: "flex", gap: "16px", marginTop: "36px" }}>
                    {[
                        { label: "🍯 Honeypot",  value: honeypot ? "DANGER" : "SAFE", ok: !honeypot },
                        { label: "🔐 Scan Type",  value: "Full Audit",               ok: true },
                        { label: "⚡ Speed",      value: "< 5 seconds",              ok: true },
                        { label: "💰 Cost",       value: "Free",                     ok: true },
                    ].map(({ label, value, ok }) => (
                        <div key={label} style={{
                            flex: 1, padding: "14px 18px", borderRadius: "14px",
                            background: ok ? "rgba(16,185,129,0.08)" : "rgba(244,63,94,0.08)",
                            border: `1px solid ${ok ? "rgba(16,185,129,0.2)" : "rgba(244,63,94,0.2)"}`,
                            display: "flex", flexDirection: "column", gap: "4px",
                        }}>
                            <span style={{ color: "#64748b", fontSize: "12px", fontWeight: 600 }}>{label}</span>
                            <span style={{ color: ok ? "#10b981" : "#f43f5e", fontSize: "16px", fontWeight: 800 }}>{value}</span>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div style={{
                    position: "absolute", bottom: "36px", left: "64px", right: "64px",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                    <span style={{ color: "#1e40af", fontSize: "14px", fontWeight: 600 }}>
                        www.apexweb3.com
                    </span>
                    <span style={{ color: "#334155", fontSize: "13px" }}>
                        Detect honeypots, hidden taxes &amp; rug pulls — free
                    </span>
                </div>
            </div>
        ),
        { width: 1200, height: 630 }
    );
}
