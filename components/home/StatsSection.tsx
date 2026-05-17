export function StatsSection() {
    return (
        <section className="py-24 bg-gradient-to-b from-[#1a0b2e] to-brand-dark border-y border-white/5">
            <div className="container mx-auto px-4">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px', textAlign: 'center' }}>
                    {[
                        { num: '50,000+', label: 'Active users' },
                        { num: '1M+', label: 'Analyses run' },
                        { num: '247+', label: 'Live Web3 jobs' },
                        { num: '91%', label: 'Jobs are remote' },
                    ].map(({ num, label }) => (
                        <div key={label}>
                            <div style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: '36px', fontWeight: 800, color: '#E8F0FA', lineHeight: 1 }}>
                                {num}
                            </div>
                            <div style={{ fontSize: '12px', color: '#3A5A7A', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'var(--font-dm-mono), monospace', marginTop: '6px' }}>
                                {label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
