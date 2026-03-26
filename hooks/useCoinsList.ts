import { useState, useEffect } from 'react';
import { POPULAR_COINS } from '@/lib/constants';

export interface CoinInfo {
    id: string;
    symbol: string;
    name: string;
}

let cachedAllCoins: CoinInfo[] | null = null;
let isFetching = false;
const fetchQueue: (() => void)[] = [];

export function useCoinsList() {
    const [coins, setCoins] = useState<CoinInfo[]>(cachedAllCoins || POPULAR_COINS);
    const [loading, setLoading] = useState(!cachedAllCoins);

    useEffect(() => {
        if (cachedAllCoins) {
            setCoins(cachedAllCoins);
            setLoading(false);
            return;
        }

        if (isFetching) {
            // Wait for existing fetch to complete
            const promise = new Promise<void>(resolve => {
                fetchQueue.push(() => resolve());
            });
            promise.then(() => {
                if (cachedAllCoins) setCoins(cachedAllCoins);
                setLoading(false);
            });
            return;
        }

        const fetchCoins = async () => {
            isFetching = true;
            try {
                const res = await fetch('/api/crypto?action=allCoins');
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    cachedAllCoins = data;
                    setCoins(data);
                }
            } catch (error) {
                console.error("Failed to load all coins", error);
            } finally {
                isFetching = false;
                setLoading(false);
                fetchQueue.forEach(resolve => resolve());
                fetchQueue.length = 0;
            }
        };

        fetchCoins();
    }, []);

    return { coins, loading };
}
