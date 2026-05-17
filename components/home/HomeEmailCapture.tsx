'use client'
import { useState } from 'react'

export function HomeEmailCapture() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  async function handleSubscribe() {
    if (!email || !email.includes('@')) return
    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, tag: 'homepage-hero' })
      })
      setStatus(res.ok ? 'done' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        fontSize: '14px',
        color: '#00D2FF',
        fontFamily: 'var(--font-dm-mono), monospace',
        padding: '12px 0'
      }}>
        ✓ You&apos;re in. Weekly Web3 intelligence incoming.
      </div>
    )
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      maxWidth: '480px',
      padding: '16px 0 8px',
      margin: '0 auto'
    }}>
      <div style={{ fontSize: '12px', color: '#5A7A9A', fontFamily: 'var(--font-dm-mono), monospace' }}>
        Get the weekly Web3 intelligence digest — free
      </div>
      <div style={{ display: 'flex', gap: '0' }}>
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubscribe()}
          style={{
            flex: 1,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRight: 'none',
            padding: '11px 16px',
            fontSize: '13px',
            color: '#C8D6E8',
            outline: 'none',
            fontFamily: 'var(--font-dm-mono), monospace',
          }}
        />
        <button
          onClick={handleSubscribe}
          disabled={status === 'loading'}
          style={{
            background: '#00D2FF',
            color: '#060D14',
            border: 'none',
            padding: '11px 20px',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            letterSpacing: '0.08em',
            whiteSpace: 'nowrap',
            opacity: status === 'loading' ? 0.7 : 1,
            transition: 'opacity 0.15s'
          }}
        >
          {status === 'loading' ? 'Joining...' : 'Join Free →'}
        </button>
      </div>
      {status === 'error' && (
        <div style={{ fontSize: '11px', color: '#FF6B6B', fontFamily: 'var(--font-dm-mono), monospace' }}>
          Something went wrong. Try again.
        </div>
      )}
    </div>
  )
}
