import { WhaleTransaction } from '../../types/whale';

export function generateWhaleShareText(tx: WhaleTransaction): string {
  const amountFormatted = tx.amount.toLocaleString(undefined, { maximumFractionDigits: 2 });
  const usdFormatted = tx.amountUSD.toLocaleString(undefined, { maximumFractionDigits: 0 });
  const fromLabel = tx.from.label ?? 'Unknown';
  const toLabel = tx.to.label ?? 'Unknown';

  return `🐋 Whale Alert on @ApexWeb3
${amountFormatted} ${tx.symbol} just moved
💰 $${usdFormatted} transferred
FROM: ${fromLabel}
TO:   ${toLabel}
Chain: ${tx.chain}
Live feed 👇
https://apexweb3.com/analysis/whales
#CryptoWhales #Web3 #${tx.symbol}`;
}

export function generateWhaleShareUrl(tx: WhaleTransaction): string {
  const text = generateWhaleShareText(tx);
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
}
