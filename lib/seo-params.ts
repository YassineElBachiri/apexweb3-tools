export const SEO_CRYPTOS = [
  'bitcoin', 'ethereum', 'solana', 'binancecoin', 'ripple',
  'cardano', 'dogecoin', 'tron', 'polygon', 'litecoin'
];

export const SEO_COUNTRIES = [
  'nigeria', 'morocco', 'brazil', 'india', 'indonesia',
  'turkey', 'argentina', 'egypt', 'kenya', 'ghana',
  'vietnam', 'philippines', 'pakistan', 'ukraine', 'venezuela',
  'malaysia', 'thailand', 'south-africa', 'colombia', 'mexico'
];

export const SEO_PAIRS = [
  { from: 'bitcoin', to: 'ethereum' }, { from: 'bitcoin', to: 'usd' }, { from: 'ethereum', to: 'usd' },
  { from: 'bitcoin', to: 'solana' }, { from: 'ethereum', to: 'solana' }, { from: 'bitcoin', to: 'usdt' },
  { from: 'ethereum', to: 'usdt' }, { from: 'solana', to: 'usd' }, { from: 'bitcoin', to: 'bnb' },
  { from: 'ethereum', to: 'bnb' }, { from: 'bitcoin', to: 'xrp' }, { from: 'ethereum', to: 'xrp' },
  { from: 'solana', to: 'ethereum' }, { from: 'bitcoin', to: 'cardano' }, { from: 'bitcoin', to: 'dogecoin' },
  { from: 'bitcoin', to: 'litecoin' }, { from: 'ethereum', to: 'polygon' }, { from: 'bitcoin', to: 'tron' },
  { from: 'bitcoin', to: 'avalanche-2' }, { from: 'ethereum', to: 'avalanche-2' }
];

export function capitalize(str: string): string {
  if (!str) return '';
  // Handle edge cases like "south-africa" -> "South Africa"
  return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}
