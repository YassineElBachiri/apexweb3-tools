import { NextResponse } from 'next/server';

export const revalidate = 0; // disable cache for debug

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const min = parseInt(searchParams.get('min') ?? '100000');

  const ETHERSCAN_KEY = process.env.ETHERSCAN_API_KEY ?? '';
  const MORALIS_KEY   = process.env.MORALIS_API_KEY ?? process.env.NEXT_PUBLIC_MORALIS_API_KEY ?? '';

  const results: any = { envKeys: { etherscan: !!ETHERSCAN_KEY, moralis: !!MORALIS_KEY }, tests: {} };

  // Test 1: Etherscan USDC on ETH
  try {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 10000);
    const url = `https://api.etherscan.io/v2/api?chainid=1&module=account&action=tokentx&contractaddress=0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48&page=1&offset=5&sort=desc&apikey=${ETHERSCAN_KEY}`;
    const r = await fetch(url, { signal: controller.signal });
    const d = await r.json();
    const first = d.result?.[0];
    results.tests.etherscan_v2 = {
      status: d.status, msg: d.message, count: d.result?.length,
      firstAmt: first ? parseFloat(first.value) / 1e6 : null,
      firstHash: first?.hash?.slice(0, 12),
    };
  } catch (e: any) {
    results.tests.etherscan_v2 = { error: e.message };
  }

  // Test 2: Etherscan v1
  try {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 10000);
    const url = `https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48&page=1&offset=5&sort=desc&apikey=${ETHERSCAN_KEY}`;
    const r = await fetch(url, { signal: controller.signal });
    const d = await r.json();
    const first = d.result?.[0];
    results.tests.etherscan_v1 = {
      status: d.status, msg: d.message, count: d.result?.length,
      firstAmt: first ? parseFloat(first.value) / 1e6 : null,
    };
  } catch (e: any) {
    results.tests.etherscan_v1 = { error: e.message };
  }

  // Test 3: Routescan Base
  try {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 10000);
    const url = `https://api.routescan.io/v2/network/mainnet/evm/8453/etherscan/api?module=account&action=tokentx&contractaddress=0x833589fcd6edb6e08f4c7c32d4f71b54bda02913&page=1&offset=5&sort=desc`;
    const r = await fetch(url, { signal: controller.signal });
    const d = await r.json();
    const first = d.result?.[0];
    results.tests.routescan_base = {
      status: d.status, msg: d.message, count: d.result?.length,
      firstAmt: first ? parseFloat(first.value) / 1e6 : null,
    };
  } catch (e: any) {
    results.tests.routescan_base = { error: e.message };
  }

  // Test 4: Moralis ERC20 transfers
  if (MORALIS_KEY) {
    try {
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 10000);
      const from = new Date(Date.now() - 10 * 60000).toISOString();
      const url = `https://deep-index.moralis.io/api/v2.2/erc20/transfers?chain=eth&from_date=${from}&limit=10`;
      const r = await fetch(url, { headers: { 'X-API-Key': MORALIS_KEY }, signal: controller.signal });
      const d = await r.json();
      const first = d.result?.[0];
      results.tests.moralis = {
        count: d.result?.length,
        firstSym: first?.token_symbol,
        firstAmt: first?.value_formatted,
        firstHash: first?.transaction_hash?.slice(0, 12),
      };
    } catch (e: any) {
      results.tests.moralis = { error: e.message };
    }
  }

  return NextResponse.json(results);
}
