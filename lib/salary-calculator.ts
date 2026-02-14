// Crypto Salary Calculator - Core Calculation Engine

import {
    SalaryInput,
    SalaryConversionResult,
    PaycheckBreakdown,
    DCASimulation,
    DCADataPoint,
    BacktestResult,
    BacktestPeriod,
    PurchasingPowerResult,
    MonthlyExpenses,
    PurchasingPowerScenario,
    StrategyComparison,
    AllocationStrategy,
    TaxEstimate,
    Country,
    EmploymentType,
    PaymentFrequency,
    HistoricalPrice,
} from '@/types/salary-calculator';

// Payment frequency to annual multiplier
export function getAnnualMultiplier(frequency: PaymentFrequency): number {
    const multipliers: Record<PaymentFrequency, number> = {
        annual: 1,
        monthly: 12,
        biweekly: 26,
        weekly: 52,
    };
    return multipliers[frequency];
}

// Convert fiat salary to crypto per paycheck
export function calculateCryptoSalary(
    salaryInput: SalaryInput,
    cryptoPrices: Map<string, number>,
    cryptoMetadata: Map<string, { symbol: string; name: string }>
): SalaryConversionResult {
    const paychecksPerYear = getAnnualMultiplier(salaryInput.frequency);
    const perPaycheckFiat = salaryInput.fiatAmount / paychecksPerYear;

    const perPaycheck: PaycheckBreakdown[] = [];
    const annual: PaycheckBreakdown[] = [];

    for (const allocation of salaryInput.allocations) {
        const allocationFiat = perPaycheckFiat * (allocation.percentage / 100);
        const cryptoPrice = cryptoPrices.get(allocation.cryptoId) || 0;
        const metadata = cryptoMetadata.get(allocation.cryptoId);

        if (cryptoPrice > 0 && metadata) {
            const cryptoAmount = allocationFiat / cryptoPrice;
            const annualCrypto = cryptoAmount * paychecksPerYear;

            perPaycheck.push({
                cryptoId: allocation.cryptoId,
                cryptoAmount,
                cryptoSymbol: metadata.symbol.toUpperCase(),
                cryptoName: metadata.name,
                fiatValue: allocationFiat,
                priceAtPayment: cryptoPrice,
            });

            annual.push({
                cryptoId: allocation.cryptoId,
                cryptoAmount: annualCrypto,
                cryptoSymbol: metadata.symbol.toUpperCase(),
                cryptoName: metadata.name,
                fiatValue: allocationFiat * paychecksPerYear,
                priceAtPayment: cryptoPrice,
            });
        }
    }

    return {
        perPaycheck,
        annual,
        paychecksPerYear,
        totalFiatAnnual: salaryInput.fiatAmount,
        calculatedAt: new Date().toISOString(),
    };
}

// Simulate DCA strategy over time
export function simulateDCA(
    salaryInput: SalaryInput,
    cryptoId: string,
    cryptoSymbol: string,
    historicalPrices: HistoricalPrice[],
    startDate: Date,
    endDate: Date
): DCASimulation {
    const dataPoints: DCADataPoint[] = [];
    const paychecksPerYear = getAnnualMultiplier(salaryInput.frequency);
    const allocation = salaryInput.allocations.find(a => a.cryptoId === cryptoId);

    if (!allocation) {
        throw new Error(`Crypto ${cryptoId} not found in allocations`);
    }

    const perPaycheckFiat = (salaryInput.fiatAmount / paychecksPerYear) * (allocation.percentage / 100);

    // Calculate payment interval in milliseconds
    const yearMs = 365.25 * 24 * 60 * 60 * 1000;
    const paymentIntervalMs = yearMs / paychecksPerYear;

    let cumulativeCrypto = 0;
    let cumulativeFiat = 0;
    let currentPaymentDate = startDate.getTime();
    const endTime = endDate.getTime();

    const returns: number[] = [];
    let bestMonth = { date: '', return: -Infinity };
    let worstMonth = { date: '', return: Infinity };

    while (currentPaymentDate <= endTime) {
        // Find closest historical price
        const price = findClosestPrice(historicalPrices, currentPaymentDate);

        if (price) {
            const cryptoAmount = perPaycheckFiat / price.price;
            cumulativeCrypto += cryptoAmount;
            cumulativeFiat += perPaycheckFiat;

            const averageCostBasis = cumulativeFiat / cumulativeCrypto;
            const portfolioValue = cumulativeCrypto * price.price;
            const profitLoss = portfolioValue - cumulativeFiat;
            const profitLossPercentage = (profitLoss / cumulativeFiat) * 100;

            dataPoints.push({
                date: new Date(currentPaymentDate).toISOString().split('T')[0],
                timestamp: currentPaymentDate,
                cryptoAmount,
                cumulativeCrypto,
                fiatInvested: perPaycheckFiat,
                cumulativeFiat,
                cryptoPrice: price.price,
                portfolioValue,
                averageCostBasis,
                profitLoss,
                profitLossPercentage,
            });

            // Track best/worst returns
            if (dataPoints.length > 1) {
                const returnRate = profitLossPercentage;
                returns.push(returnRate);

                if (returnRate > bestMonth.return) {
                    bestMonth = { date: dataPoints[dataPoints.length - 1].date, return: returnRate };
                }
                if (returnRate < worstMonth.return) {
                    worstMonth = { date: dataPoints[dataPoints.length - 1].date, return: returnRate };
                }
            }
        }

        currentPaymentDate += paymentIntervalMs;
    }

    // Calculate volatility (standard deviation of returns)
    const volatility = calculateStandardDeviation(returns);

    const lastPoint = dataPoints[dataPoints.length - 1];

    return {
        cryptoId: cryptoId as any,
        cryptoSymbol,
        frequency: salaryInput.frequency,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        dataPoints,
        summary: {
            totalCryptoAccumulated: lastPoint?.cumulativeCrypto || 0,
            totalFiatInvested: lastPoint?.cumulativeFiat || 0,
            currentValue: lastPoint?.portfolioValue || 0,
            averageCostBasis: lastPoint?.averageCostBasis || 0,
            totalProfitLoss: lastPoint?.profitLoss || 0,
            totalProfitLossPercentage: lastPoint?.profitLossPercentage || 0,
            numberOfPayments: dataPoints.length,
            volatility,
            bestMonth,
            worstMonth,
        },
    };
}

// Run historical backtest (what-if analysis)
export function runBacktest(
    salaryInput: SalaryInput,
    cryptoId: string,
    cryptoSymbol: string,
    period: BacktestPeriod,
    historicalPrices: HistoricalPrice[]
): BacktestResult {
    const startDate = new Date(period.startDate);
    const endDate = new Date(period.endDate);

    const simulation = simulateDCA(
        salaryInput,
        cryptoId,
        cryptoSymbol,
        historicalPrices,
        startDate,
        endDate
    );

    const totalFiatSaved = simulation.summary.totalFiatInvested;
    const currentCryptoValue = simulation.summary.currentValue;
    const difference = currentCryptoValue - totalFiatSaved;
    const differencePercentage = (difference / totalFiatSaved) * 100;

    return {
        period,
        cryptoId: cryptoId as any,
        cryptoSymbol,
        salary: salaryInput,
        simulation,
        comparison: {
            cryptoStrategy: {
                totalCrypto: simulation.summary.totalCryptoAccumulated,
                currentValue: currentCryptoValue,
            },
            fiatStrategy: {
                totalSaved: totalFiatSaved,
                value: totalFiatSaved, // Assuming no interest
            },
            difference: {
                absolute: difference,
                percentage: differencePercentage,
            },
        },
    };
}

// Calculate purchasing power and budget scenarios
export function calculatePurchasingPower(
    cryptoBalance: number,
    currentCryptoPrice: number,
    monthlyExpenses: MonthlyExpenses,
    scenario: PurchasingPowerScenario
): PurchasingPowerResult {
    const scenarioPrice = currentCryptoPrice * scenario.cryptoPriceMultiplier;
    const totalMonthlyExpenses =
        monthlyExpenses.rent +
        monthlyExpenses.groceries +
        monthlyExpenses.utilities +
        monthlyExpenses.savings +
        monthlyExpenses.other;

    const cryptoNeededToSell = totalMonthlyExpenses / scenarioPrice;
    const remainingCryptoBalance = cryptoBalance - cryptoNeededToSell;
    const remainingFiatValue = remainingCryptoBalance * scenarioPrice;
    const monthsOfRunway = remainingCryptoBalance > 0
        ? remainingCryptoBalance / cryptoNeededToSell
        : 0;

    return {
        monthlyExpenses,
        totalMonthlyExpenses,
        cryptoNeededToSell,
        remainingCryptoBalance: Math.max(0, remainingCryptoBalance),
        remainingFiatValue: Math.max(0, remainingFiatValue),
        monthsOfRunway,
        scenario,
    };
}

// Predefined strategy presets
export const STRATEGY_PRESETS: AllocationStrategy[] = [
    {
        name: '100% Crypto',
        description: 'All-in on crypto for maximum upside potential',
        allocations: [{ cryptoId: 'bitcoin', percentage: 100 }],
        riskLevel: 'very-high',
        stabilityScore: 20,
        upsidePotential: 100,
        recommended: false,
    },
    {
        name: '50/50 Crypto + Stablecoin',
        description: 'Balanced exposure with stability',
        allocations: [
            { cryptoId: 'bitcoin', percentage: 50 },
            { cryptoId: 'usd-coin', percentage: 50 },
        ],
        riskLevel: 'medium',
        stabilityScore: 70,
        upsidePotential: 50,
        recommended: true,
    },
    {
        name: '80/20 Conservative',
        description: 'Mostly stable with some upside',
        allocations: [
            { cryptoId: 'usd-coin', percentage: 80 },
            { cryptoId: 'ethereum', percentage: 20 },
        ],
        riskLevel: 'low',
        stabilityScore: 90,
        upsidePotential: 25,
        recommended: false,
    },
    {
        name: 'Stablecoin + BTC/ETH Upside',
        description: 'Priority on stability with crypto exposure',
        allocations: [
            { cryptoId: 'usd-coin', percentage: 60 },
            { cryptoId: 'bitcoin', percentage: 25 },
            { cryptoId: 'ethereum', percentage: 15 },
        ],
        riskLevel: 'medium',
        stabilityScore: 75,
        upsidePotential: 40,
        recommended: true,
    },
];

// Educational tax estimation (US-focused)
export function estimateTaxes(
    annualSalary: number,
    country: Country,
    employmentType: EmploymentType
): TaxEstimate {
    // Default to US tax brackets (2024)
    const taxBrackets = getUSTaxBrackets();

    let incomeTax = 0;
    let remainingIncome = annualSalary;

    for (const bracket of taxBrackets) {
        const bracketMax = bracket.max || remainingIncome;
        const taxableInBracket = Math.min(remainingIncome, bracketMax - bracket.min);

        if (taxableInBracket > 0) {
            incomeTax += taxableInBracket * bracket.rate;
            remainingIncome -= taxableInBracket;
        }

        if (remainingIncome <= 0) break;
    }

    const effectiveRate = (incomeTax / annualSalary) * 100;

    // Self-employment tax for freelancers/DAO contributors
    const selfEmploymentTax = employmentType !== 'employee' ? annualSalary * 0.153 : 0;

    // Simplified capital gains estimates
    const shortTermCapitalGains = incomeTax * 0.1; // Rough estimate
    const longTermCapitalGains = annualSalary * 0.15; // 15% long-term rate

    const paychecksPerYear = 12; // Assume monthly for tax purposes
    const totalTaxableEvents = paychecksPerYear; // Each crypto receipt is taxable

    const totalTax = incomeTax + selfEmploymentTax;
    const netTakeHome = annualSalary - totalTax;

    return {
        country,
        employmentType,
        annualSalary,
        cryptoAllocations: [],
        estimates: {
            incomeTaxAtReceipt: incomeTax,
            incomeTaxRate: effectiveRate,
            capitalGainsShortTerm: shortTermCapitalGains,
            capitalGainsLongTerm: longTermCapitalGains,
            totalTaxableEvents,
            netTakeHome,
        },
        disclaimers: [
            'This is an educational estimate only, not tax advice.',
            'Actual tax obligations vary based on individual circumstances.',
            'Crypto received as salary is taxed as ordinary income at fair market value.',
            'Selling crypto may trigger capital gains/losses.',
            'Consult a qualified tax professional for your specific situation.',
            'Tax laws change frequently. This estimate uses 2024 US tax brackets.',
        ],
    };
}

// Helper: US Tax Brackets (2024, Single Filer)
function getUSTaxBrackets() {
    return [
        { min: 0, max: 11600, rate: 0.10 },
        { min: 11600, max: 47150, rate: 0.12 },
        { min: 47150, max: 100525, rate: 0.22 },
        { min: 100525, max: 191950, rate: 0.24 },
        { min: 191950, max: 243725, rate: 0.32 },
        { min: 243725, max: 609350, rate: 0.35 },
        { min: 609350, max: null, rate: 0.37 },
    ];
}

// Helper: Find closest historical price
function findClosestPrice(prices: HistoricalPrice[], targetTimestamp: number): HistoricalPrice | null {
    if (prices.length === 0) return null;

    let closest = prices[0];
    let minDiff = Math.abs(prices[0].timestamp - targetTimestamp);

    for (const price of prices) {
        const diff = Math.abs(price.timestamp - targetTimestamp);
        if (diff < minDiff) {
            minDiff = diff;
            closest = price;
        }
    }

    return closest;
}

// Helper: Calculate standard deviation
function calculateStandardDeviation(values: number[]): number {
    if (values.length === 0) return 0;

    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;

    return Math.sqrt(variance);
}

// Helper: Format currency
export function formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
}

// Helper: Format crypto amount
export function formatCrypto(amount: number, decimals: number = 8): string {
    return amount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: decimals,
    });
}
