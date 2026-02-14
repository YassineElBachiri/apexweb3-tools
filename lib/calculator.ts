import { Purchase, CalculationResult, PnLResult } from './types/calculator';

export function calculateAverageCost(purchases: Purchase[]): CalculationResult {
    if (!purchases || purchases.length === 0) {
        return {
            avgPrice: 0,
            totalCost: 0,
            totalQuantity: 0,
            breakEven: 0
        };
    }

    const totalCost = purchases.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    const totalQuantity = purchases.reduce((sum, p) => sum + p.quantity, 0);

    const avgPrice = totalQuantity > 0 ? totalCost / totalQuantity : 0;

    return {
        avgPrice,
        totalCost,
        totalQuantity,
        breakEven: avgPrice // In simple average cost, break even is the average price
    };
}

export function calculatePnL(
    avgPrice: number,
    currentPrice: number,
    quantity: number
): PnLResult {
    const currentValue = currentPrice * quantity;
    const totalCost = avgPrice * quantity;
    const profitLoss = currentValue - totalCost;
    const profitLossPercent = totalCost > 0 ? (profitLoss / totalCost) * 100 : 0;

    return {
        currentValue,
        profitLoss,
        profitLossPercent,
        isProfit: profitLoss >= 0
    };
}

export function generateId(): string {
    return Math.random().toString(36).substring(2, 9);
}
