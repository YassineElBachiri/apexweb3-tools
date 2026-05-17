import Link from "next/link";

export function AiWeb3Highlight() {
    return (
        <div className="container mx-auto px-4">
            <section style={{
            margin: '40px 0',
            padding: '32px',
            background: 'linear-gradient(135deg, rgba(0,170,255,0.04) 0%, rgba(0,0,0,0) 100%)',
            border: '1px solid rgba(0,170,255,0.12)',
            borderTop: '2px solid #00AAFF',
            }}>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-center">
                <div>
                <div style={{ fontSize: '10px', color: '#00AAFF', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'var(--font-dm-mono), monospace', marginBottom: '8px' }}>
                    New
                </div>
                <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#E8F0FA', marginBottom: '8px' }}>
                    AI × Web3 Jobs &amp; Intelligence
                </h3>
                <p style={{ fontSize: '13px', color: '#4A6A8A', fontFamily: 'var(--font-dm-mono), monospace', lineHeight: 1.7, maxWidth: '480px' }}>
                    Roles at the intersection of AI agents, decentralized ML, and on-chain automation.
                    Plus Claude-powered company trust scores, salary benchmarks, and career coaching.
                </p>
                <div style={{ display: 'flex', gap: '8px', marginTop: '14px', flexWrap: 'wrap' }}>
                    {['AI Agents', 'Decentralized AI', 'On-chain ML', 'Bittensor', 'Fetch.ai'].map(tag => (
                    <span key={tag} style={{
                        fontSize: '10px', padding: '3px 9px',
                        background: 'rgba(0,170,255,0.08)',
                        border: '1px solid rgba(0,170,255,0.2)',
                        color: '#00AAFF', fontFamily: 'var(--font-dm-mono), monospace'
                    }}>
                        {tag}
                    </span>
                    ))}
                </div>
                </div>
                <Link
                href="/jobs/ai"
                style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    background: '#00AAFF', color: '#060D14',
                    fontFamily: 'var(--font-dm-mono), monospace', fontSize: '12px', fontWeight: 600,
                    padding: '12px 20px', textDecoration: 'none',
                    letterSpacing: '0.08em', whiteSpace: 'nowrap', flexShrink: 0
                }}
                className="justify-center"
                >
                Explore AI × Web3 →
                </Link>
            </div>
            </section>
        </div>
    );
}
