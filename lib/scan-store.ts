// lib/scan-store.ts
// Lightweight in-memory store for recently scanned tokens.
// In production, replace with KV/Redis/DB for persistence across instances.

export interface ScanRecord {
    chain: string;
    address: string;
    tokenName: string;
    tokenSymbol: string;
    score: number;
    isHoneypot: boolean;
    scannedAt: number; // unix ms
}

declare global {
    // eslint-disable-next-line no-var
    var __apexScanStore: ScanRecord[] | undefined;
}

// Use a global to survive Next.js hot reloads in dev
if (!global.__apexScanStore) {
    global.__apexScanStore = [];
}

const MAX_RECORDS = 200;

export function recordScan(record: ScanRecord): void {
    const store = global.__apexScanStore!;
    // Deduplicate by address
    const existing = store.findIndex(r => r.address.toLowerCase() === record.address.toLowerCase());
    if (existing !== -1) store.splice(existing, 1);
    store.unshift(record);
    if (store.length > MAX_RECORDS) store.splice(MAX_RECORDS);
}

export function getRecentScans(limit = 20): ScanRecord[] {
    return (global.__apexScanStore ?? []).slice(0, limit);
}

export function getTodayCount(): number {
    const midnight = new Date();
    midnight.setHours(0, 0, 0, 0);
    return (global.__apexScanStore ?? []).filter(r => r.scannedAt >= midnight.getTime()).length;
}
