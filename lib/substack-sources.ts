// /lib/substack-sources.ts

export type SubscribeSource = {
  utm_source: string;
  headline: string;
  subline: string;
  placeholder: string;
  cta: string;
};

export const SUBSCRIBE_SOURCES: Record<string, SubscribeSource> = {

  // TOOL PAGES — shown after user completes an action
  'whale-watch': {
    utm_source: 'whale-watch',
    headline: 'Get the weekly whale digest',
    subline: 'Top wallet movements every Sunday. Free.',
    placeholder: 'your@email.com',
    cta: 'Send me the digest',
  },
  'meme-scanner': {
    utm_source: 'meme-scanner',
    headline: 'Get early signals in your inbox',
    subline: 'Weekly meme coin alpha before it spikes.',
    placeholder: 'your@email.com',
    cta: 'Get the alpha',
  },
  'tokenomics-analyzer': {
    utm_source: 'tokenomics-analyzer',
    headline: 'Weekly tokenomics breakdowns',
    subline: 'Deep-dive analysis on trending tokens, free.',
    placeholder: 'your@email.com',
    cta: 'Subscribe free',
  },
  'security-scanner': {
    utm_source: 'security-scanner',
    headline: 'Get our security alerts newsletter',
    subline: 'New rug pulls, exploits & honeypots — weekly.',
    placeholder: 'your@email.com',
    cta: 'Stay protected',
  },
  'portfolio': {
    utm_source: 'portfolio',
    headline: 'Weekly portfolio strategy',
    subline: 'Market insights to protect and grow your bag.',
    placeholder: 'your@email.com',
    cta: 'Get the strategy',
  },
  'calculator': {
    utm_source: 'calculator',
    headline: 'DCA tips straight to your inbox',
    subline: 'Weekly entry strategies and market timing.',
    placeholder: 'your@email.com',
    cta: 'Subscribe free',
  },
  'converter': {
    utm_source: 'converter',
    headline: 'Track crypto rates weekly',
    subline: 'Market overview every Sunday. No spam.',
    placeholder: 'your@email.com',
    cta: 'Subscribe free',
  },
  'fiat-converter': {
    utm_source: 'fiat-converter',
    headline: 'Weekly crypto market summary',
    subline: 'Key price movements across 30+ fiat pairs.',
    placeholder: 'your@email.com',
    cta: 'Subscribe free',
  },
  'web3-jobs': {
    utm_source: 'web3-jobs',
    headline: 'Top Web3 jobs, weekly',
    subline: 'Curated DeFi, NFT & L2 roles every Monday.',
    placeholder: 'your@email.com',
    cta: 'Get the job list',
  },
  'ai-web3-jobs': {
    utm_source: 'ai-web3-jobs',
    headline: 'Get AI × Web3 jobs in your inbox',
    subline: 'Roles at the intersection of AI and blockchain, weekly.',
    placeholder: 'your@email.com',
    cta: 'Subscribe free',
  },
  'salary-estimator': {
    utm_source: 'salary-estimator',
    headline: 'Web3 salary trends, monthly',
    subline: 'Know your market value before your next negotiation.',
    placeholder: 'your@email.com',
    cta: 'Subscribe free',
  },

  // BLOG CATEGORIES — shown at end of articles
  'blog-news': {
    utm_source: 'blog-news',
    headline: 'Breaking crypto news in your inbox',
    subline: 'Weekly digest of what actually matters.',
    placeholder: 'your@email.com',
    cta: 'Stay informed',
  },
  'blog-blockchain-basics': {
    utm_source: 'blog-blockchain-basics',
    headline: 'More Web3 fundamentals, weekly',
    subline: 'Level up your knowledge — one concept at a time.',
    placeholder: 'your@email.com',
    cta: 'Keep learning',
  },
  'blog-defi': {
    utm_source: 'blog-defi',
    headline: 'DeFi alpha delivered weekly',
    subline: 'Protocol updates, yield strategies & risk alerts.',
    placeholder: 'your@email.com',
    cta: 'Get the DeFi digest',
  },
  'blog-guide': {
    utm_source: 'blog-guide',
    headline: 'More practical Web3 guides',
    subline: 'Step-by-step playbooks every week, free.',
    placeholder: 'your@email.com',
    cta: 'Get the guides',
  },
  'blog-security': {
    utm_source: 'blog-security',
    headline: 'Security alerts & audit reports',
    subline: 'Know about exploits before they hit your portfolio.',
    placeholder: 'your@email.com',
    cta: 'Stay protected',
  },
  'blog-reviews': {
    utm_source: 'blog-reviews',
    headline: 'Weekly token analysis & reviews',
    subline: 'Data-driven breakdowns every Sunday.',
    placeholder: 'your@email.com',
    cta: 'Get the analysis',
  },
  'blog-web3-ai': {
    utm_source: 'blog-web3-ai',
    headline: 'AI × Web3 trends, weekly',
    subline: 'The intersection of AI and crypto — curated.',
    placeholder: 'your@email.com',
    cta: 'Subscribe free',
  },
  'blog-nfts': {
    utm_source: 'blog-nfts',
    headline: 'NFT market pulse, weekly',
    subline: 'Trends, drops & analysis in your inbox.',
    placeholder: 'your@email.com',
    cta: 'Subscribe free',
  },
  'blog-dev': {
    utm_source: 'blog-dev',
    headline: 'Smart contract insights, weekly',
    subline: 'Security patterns, exploits & dev resources.',
    placeholder: 'your@email.com',
    cta: 'Subscribe free',
  },

  // GLOBAL PLACEMENTS
  'homepage': {
    utm_source: 'homepage',
    headline: 'Join 8,000+ Web3 traders',
    subline: 'Weekly alpha, security alerts & market insights. Free.',
    placeholder: 'your@email.com',
    cta: 'Get free weekly alpha',
  },
  'exit-intent': {
    utm_source: 'exit-intent',
    headline: 'Before you go — free weekly alpha',
    subline: 'Whale alerts, meme coin signals & security news.',
    placeholder: 'your@email.com',
    cta: 'Send me the digest',
  },
  'footer': {
    utm_source: 'footer',
    headline: 'Free weekly Web3 intelligence',
    subline: 'No spam. Unsubscribe anytime.',
    placeholder: 'your@email.com',
    cta: 'Subscribe free',
  },
};

export function getSource(sourceId: string): SubscribeSource {
  return SUBSCRIBE_SOURCES[sourceId] ?? SUBSCRIBE_SOURCES['footer'];
}
