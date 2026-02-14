const ETHERSCAN_BASE_URL = 'https://api.etherscan.io/api';
const API_KEY = process.env.ETHERSCAN_API_KEY;

export interface EtherscanTx {
    blockNumber: string;
    timeStamp: string;
    hash: string;
    nonce: string;
    blockHash: string;
    transactionIndex: string;
    from: string;
    to: string;
    value: string;
    gas: string;
    gasPrice: string;
    isError: string;
    txreceipt_status: string;
    input: string;
    contractAddress: string;
    cumulativeGasUsed: string;
    gasUsed: string;
    confirmations: string;
}

export async function fetchEtherBalance(address: string): Promise<number | null> {
    if (!API_KEY) {
        console.warn("⚠️ Etherscan: Missing ETHERSCAN_API_KEY in environment variables.");
        return null; // Fallback to behavior that might trigger other checks or return 0
    }

    console.log(`🔌 Etherscan: Fetching balance for ${address}...`);

    try {
        const url = `${ETHERSCAN_BASE_URL}?module=account&action=balance&address=${address}&tag=latest&apikey=${API_KEY}`;
        console.log(`Requests URL: ${ETHERSCAN_BASE_URL}?module=account&action=balance&address=${address}&tag=latest&apikey=***`); // Mask key in logs

        const response = await fetch(url);
        const data = await response.json();

        if (data.status === "1" && data.result) {
            // Convert Wei to Ether
            return parseFloat(data.result) / 1e18;
        }
        return null;
    } catch (error) {
        console.error("Etherscan balance fetch error:", error);
        return null;
    }
}

export async function fetchLatestBlockNumber(): Promise<number | null> {
    if (!API_KEY) return null;
    try {
        const response = await fetch(
            `${ETHERSCAN_BASE_URL}?module=proxy&action=eth_blockNumber&apikey=${API_KEY}`
        );
        const data = await response.json();
        if (data.result) {
            return parseInt(data.result, 16);
        }
        return null;
    } catch (error) {
        return null;
    }
}

export async function fetchBlockTransactions(blockNumber: number): Promise<EtherscanTx[]> {
    if (!API_KEY) return [];

    // Convert to hex
    const blockHex = '0x' + blockNumber.toString(16);

    try {
        const response = await fetch(
            `${ETHERSCAN_BASE_URL}?module=proxy&action=eth_getBlockByNumber&tag=${blockHex}&boolean=true&apikey=${API_KEY}`
        );
        const data = await response.json();

        if (data.result && data.result.transactions) {
            return data.result.transactions;
        }
        return [];
    } catch (error) {
        console.error("Etherscan block fetch error:", error);
        return [];
    }
}
