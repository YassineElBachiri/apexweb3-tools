import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '1200px',
                    height: '630px',
                    background: '#080C10',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '80px',
                    fontFamily: 'sans-serif',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Subtle grid overlay */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage:
                            'linear-gradient(rgba(0,210,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,210,255,0.03) 1px, transparent 1px)',
                        backgroundSize: '60px 60px',
                    }}
                />
                {/* Glow blob */}
                <div
                    style={{
                        position: 'absolute',
                        right: '-80px',
                        top: '-80px',
                        width: '500px',
                        height: '500px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(0,210,255,0.12) 0%, transparent 70%)',
                    }}
                />

                {/* Label */}
                <div
                    style={{
                        fontSize: '16px',
                        color: '#00D2FF',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        marginBottom: '28px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                    }}
                >
                    <div style={{ width: '32px', height: '2px', background: '#00D2FF' }} />
                    ApexWeb3 · Web3 &amp; AI Careers
                </div>

                {/* Headline */}
                <div
                    style={{
                        fontSize: '72px',
                        fontWeight: 800,
                        color: '#E8F0FA',
                        lineHeight: 1.05,
                        marginBottom: '28px',
                    }}
                >
                    Find your role
                    <br />
                    <span style={{ color: '#00D2FF' }}>in Web3.</span>
                </div>

                {/* Sub-stats */}
                <div
                    style={{
                        fontSize: '22px',
                        color: '#4A6A8A',
                        display: 'flex',
                        gap: '40px',
                    }}
                >
                    <span>200+ live roles</span>
                    <span style={{ color: '#1A2332' }}>·</span>
                    <span>Remote-first</span>
                    <span style={{ color: '#1A2332' }}>·</span>
                    <span>Updated daily</span>
                </div>

                {/* Bottom domain watermark */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '40px',
                        right: '80px',
                        fontSize: '14px',
                        color: '#1A2332',
                        letterSpacing: '0.1em',
                    }}
                >
                    apexweb3.com/jobs
                </div>
            </div>
        ),
        { width: 1200, height: 630 }
    )
}
