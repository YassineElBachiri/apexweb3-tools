"use client";

import Link from "next/link";
import { useState } from "react";

export function CTASection() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

    async function handleSubscribe(e: React.FormEvent) {
        e.preventDefault();
        if (!email || !email.includes('@')) return;
        setStatus('loading');
        try {
            const res = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, tag: 'homepage-final-cta' })
            });
            setStatus(res.ok ? 'done' : 'error');
        } catch {
            setStatus('error');
        }
    }

    return (
        <section style={{ textAlign: 'center', padding: '80px 0' }} className="bg-brand-dark">
            <div className="container mx-auto px-4">
                <div style={{ fontSize: '11px', color: '#00D2FF', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'var(--font-dm-mono), monospace', marginBottom: '16px' }}>
                    Start now — no account required
                </div>
                <h2 style={{ fontSize: '40px', fontWeight: 800, color: '#E8F0FA', marginBottom: '16px', fontFamily: 'var(--font-syne), sans-serif' }}>
                    Your edge in Web3 starts here.
                </h2>
                <p style={{ fontSize: '14px', color: '#4A6A8A', fontFamily: 'var(--font-dm-mono), monospace', marginBottom: '32px' }}>
                    Scan a token, track whales, or find your next role — all free, no wallet needed.
                </p>

                {/* Primary CTA — most compelling tool */}
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '24px', flexWrap: 'wrap' }}>
                    <Link href="/discovery/spike-detector" style={{
                    background: '#00D2FF', color: '#060D14',
                    padding: '14px 28px', fontWeight: 700,
                    fontSize: '14px', textDecoration: 'none',
                    letterSpacing: '0.05em'
                    }}>
                    Scan a Meme Coin Free →
                    </Link>
                    <Link href="/jobs" style={{
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#C8D6E8',
                    padding: '14px 28px',
                    fontSize: '14px', textDecoration: 'none'
                    }}>
                    Browse Web3 Jobs
                    </Link>
                </div>

                {/* Email opt-in as secondary conversion */}
                <div style={{ maxWidth: '420px', margin: '0 auto' }}>
                    <div style={{ fontSize: '12px', color: '#3A5A7A', fontFamily: 'var(--font-dm-mono), monospace', marginBottom: '10px' }}>
                    Or get weekly intelligence delivered to your inbox
                    </div>
                    {status === 'done' ? (
                        <div style={{ padding: '11px 0', fontSize: '13px', color: '#00D2FF', fontFamily: 'var(--font-dm-mono), monospace' }}>
                            ✓ Subscribed successfully!
                        </div>
                    ) : (
                        <form style={{ display: 'flex' }} onSubmit={handleSubscribe}>
                        <input
                            type="email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                            flex: 1, background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRight: 'none', padding: '11px 14px',
                            fontSize: '13px', color: '#C8D6E8',
                            outline: 'none', fontFamily: 'var(--font-dm-mono), monospace'
                            }}
                        />
                        <button type="submit" disabled={status === 'loading'} style={{
                            background: status === 'loading' ? '#006A80' : 'rgba(255,255,255,0.08)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: '#C8D6E8', padding: '11px 16px',
                            fontSize: '11px', cursor: 'pointer',
                            fontFamily: 'var(--font-dm-mono), monospace', letterSpacing: '0.1em'
                        }}>
                            {status === 'loading' ? 'WAIT' : 'SUBSCRIBE'}
                        </button>
                        </form>
                    )}
                    {status === 'error' && (
                        <div style={{ marginTop: '8px', fontSize: '11px', color: '#FF6B6B', fontFamily: 'var(--font-dm-mono), monospace' }}>
                            Error subscribing. Please try again.
                        </div>
                    )}
                </div>

                <div style={{ fontSize: '11px', color: '#2A4A6A', fontFamily: 'var(--font-dm-mono), monospace', marginTop: '16px' }}>
                    No credit card · No login · 100% free forever
                </div>
            </div>
        </section>
    );
}
