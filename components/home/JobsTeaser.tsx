import Link from "next/link";

export async function JobsTeaser() {
  // Try to fetch live job count — fallback to static
  let jobCount = 247
  let featuredJobs = [
    { title: 'Senior Solidity Engineer', company: 'Uniswap', salary: '$180K+', chain: 'Ethereum' },
    { title: 'ZK Engineer', company: 'StarkWare', salary: '$240K+', chain: 'Starknet' },
    { title: 'AI Agent Developer', company: 'Fetch.ai', salary: '$160K+', chain: 'Cosmos' },
  ]

  try {
    const res = await fetch('https://web3.career/api/v1?limit=3', {
      headers: { Authorization: `Bearer ${process.env.WEB3_CAREER_API_KEY}` },
      next: { revalidate: 3600 } // cache 1 hour
    })
    if (res.ok) {
      const data = await res.json()
      jobCount = data.total || jobCount
      if (data.jobs?.length >= 3) {
        featuredJobs = data.jobs.slice(0, 3).map((j: any) => ({
          title: j.title,
          company: j.company,
          salary: j.salary || 'Competitive',
          chain: j.tags?.[0] || 'Web3'
        }))
      }
    }
  } catch {}

  return (
    <div className="container mx-auto px-4">
      <section style={{
        margin: '60px auto',
        padding: '40px',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderLeft: '3px solid #00D2FF',
      }}>
        {/* Header */}
        <div className="flex flex-col md:flex-row gap-4" style={{ justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#00D2FF', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'var(--font-dm-mono), monospace', marginBottom: '8px' }}>
              Web3 &amp; AI Careers
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#E8F0FA', margin: 0 }}>
              {jobCount}+ live roles this week
            </h2>
            <p style={{ fontSize: '13px', color: '#4A6A8A', fontFamily: 'var(--font-dm-mono), monospace', marginTop: '6px' }}>
              Remote-first · DeFi · ZK · AI × Web3 · No middlemen
            </p>
          </div>
          <Link
            href="/jobs"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#00D2FF',
              color: '#060D14',
              fontFamily: 'var(--font-dm-mono), monospace',
              fontSize: '12px',
              fontWeight: 600,
              padding: '10px 18px',
              textDecoration: 'none',
              letterSpacing: '0.08em',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            View All Jobs →
          </Link>
        </div>

        {/* Job rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {featuredJobs.map((job, i) => (
            <Link
              key={i}
              href="/jobs"
              className="hover:border-white/20 transition-colors"
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: '16px',
                alignItems: 'center',
                padding: '14px 16px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.04)',
                textDecoration: 'none',
              }}
            >
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#D8E8F8', marginBottom: '3px' }}>
                  {job.title}
                </div>
                <div style={{ fontSize: '12px', color: '#4A6A8A', fontFamily: 'var(--font-dm-mono), monospace' }}>
                  {job.company} · Remote · {job.chain}
                </div>
              </div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#C8D6E8', whiteSpace: 'nowrap' }}>
                {job.salary}
              </div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div style={{ marginTop: '16px', fontSize: '11px', color: '#2A4A6A', fontFamily: 'var(--font-dm-mono), monospace', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <span>91% remote</span>
          <span>·</span>
          <span>Updated daily</span>
          <span>·</span>
          <span>Powered by web3.career</span>
        </div>
      </section>
    </div>
  )
}
