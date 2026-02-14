export interface Purchase {
    id: string;
    price: number;
    quantity: number;
    date?: string;
    notes?: string;
}

export interface CalculationResult {
    avgPrice: number;
    totalCost: number;
    totalQuantity: number;
    breakEven: number;
}

export interface PnLResult {
    currentValue: number;
    profitLoss: number;
    profitLossPercent: number;
    isProfit: boolean;
}

export interface SavedCalculation {
    id: string;
    assetSymbol: string;
    assetName: string;
    purchases: Purchase[];
    createdAt: string;
    updatedAt: string;
}

export interface Asset {
    id: string;
    symbol: string;
    name: string;
    current_price?: number;
    image?: string;
}
