// lib/providers/routescan.ts
import { ChainDetection, ScanResult } from '../types/scan';
import { fetchWithRetry, extractSettled } from '../utils/fetchWithRetry';

const ROUTESCAN_BASE = 'https://api.routescan.io/v2/network/mainnet/evm';
const ETHERSCAN_BASE = 'https://api.etherscan.io/api';

// Chains Routescan supports for free (Etherscan now paywalls these)
const ROUTESCAN_CHAIN_IDS = new Set([8453, 56, 10, 42161, 137, 43114, 250, 25, 100]);

export async function fetchContractData(
  detection: ChainDetection
): Promise<Partial<ScanResult> | null> {
  const { chainId, contractAddress, inputType } = detection;

  // Only applicable for EVM chains
  if (!chainId || inputType === 'solana_address' || inputType === 'sui_address') {
    return null;
  }

  try {
    const useRoutescan = ROUTESCAN_CHAIN_IDS.has(chainId);
    const baseUrl = useRoutescan
      ? `${ROUTESCAN_BASE}/${chainId}/etherscan/api`
      : ETHERSCAN_BASE;

    const apiKeyParam =
      !useRoutescan && process.env.ETHERSCAN_API_KEY
        ? `&apikey=${process.env.ETHERSCAN_API_KEY}`
        : '';

    // Fetch source code + contract creation in parallel
    const [sourceRes, creationRes] = await Promise.allSettled([
      fetchWithRetry(
        `${baseUrl}?module=contract&action=getsourcecode&address=${contractAddress}${apiKeyParam}`
      ),
      fetchWithRetry(
        `${baseUrl}?module=contract&action=getcontractcreation&contractaddresses=${contractAddress}${apiKeyParam}`
      ),
    ]);

    const source = extractSettled(sourceRes);
    const creation = extractSettled(creationRes);

    const sourceData = source?.result?.[0];
    const creationData = creation?.result?.[0];

    const isVerified =
      !!sourceData?.SourceCode &&
      sourceData?.ABI !== 'Contract source code not verified';

    const createdTimestampMs = creationData?.timestamp
      ? parseInt(creationData.timestamp, 10) * 1000
      : null;

    const contractAgeDays = createdTimestampMs
      ? Math.floor((Date.now() - createdTimestampMs) / 86_400_000)
      : null;

    const providerLabel = useRoutescan ? 'routescan' : 'etherscan';
    console.info(`[ContractData] Used ${providerLabel} for chainId ${chainId}`);

    return {
      isContractVerified: isVerified,
      isOpenSource: isVerified,
      contractCreator: creationData?.contractCreator ?? null,
      contractCreatedAt: createdTimestampMs
        ? new Date(createdTimestampMs).toISOString()
        : null,
      contractAgeDays,
      dataSource: [providerLabel],
    };
  } catch (err) {
    console.error(`[ContractData] Provider failed — ${err}`);
    return null;
  }
}
