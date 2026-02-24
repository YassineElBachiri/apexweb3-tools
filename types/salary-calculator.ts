// Crypto Salary Estimator Type Definitions

export type FiatCurrency = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'JPY' | 'CHF' | 'CNY';

export type CryptoAsset = 'bitcoin' | 'ethereum' | 'solana' | 'usd-coin' | 'tether' | 'binancecoin' | 'cardano' | 'polygon';

export type PaymentFrequency = 'annual' | 'monthly' | 'biweekly' | 'weekly';

export type EmploymentType = 'employee' | 'freelancer' | 'dao';

export type Country = 'US' | 'UK' | 'CA' | 'AU' | 'DE' | 'FR' | 'NL' | 'SG' | 'JP';
export type CryptoNetwork = 'ethereum' | 'base' | 'solana' | 'arbitrum';

export interface SalaryAllocation {
    asset: CryptoAsset;
    percent: number; // 0-100
}

export interface SalaryInput {
    fiatAmount: number;
    fiatCurrency: FiatCurrency;
    frequency: PaymentFrequency;
    allocations: SalaryAllocation[]; // Total should equal 100%
    network?: CryptoNetwork;
    isStakingActive?: boolean;
    monthlyExpensesUSD?: number;
    taxBracket?: number;
}

export interface PaycheckBreakdown {
    cryptoId: CryptoAsset;
    cryptoAmount: number;
    cryptoSymbol: string;
    cryptoName: string;
    fiatValue: number;
    priceAtPayment: number;
}

export interface SalaryConversionResult {
    perPaycheck: PaycheckBreakdown[];
    annual: PaycheckBreakdown[];
    paychecksPerYear: number;
    totalFiatAnnual: number;
    calculatedAt: string;
    stakingYieldAnnual?: number;
    gasFeesPerPaycheck?: number;
    volatilityShield?: {
        warning: string;
        suggestion: string;
        isRiskHigh: boolean;
    };
}

export interface DCADataPoint {
    date: string;
    timestamp: number;
    cryptoAmount: number;
    cumulativeCrypto: number;
    fiatInvested: number;
    cumulativeFiat: number;
    cryptoPrice: number;
    portfolioValue: number;
    averageCostBasis: number;
    profitLoss: number;
    profitLossPercentage: number;
}

export interface DCASimulation {
    cryptoId: CryptoAsset;
    cryptoSymbol: string;
    frequency: PaymentFrequency;
    startDate: string;
    endDate: string;
    dataPoints: DCADataPoint[];
    summary: {
        totalCryptoAccumulated: number;
        totalFiatInvested: number;
        currentValue: number;
        averageCostBasis: number;
        totalProfitLoss: number;
        totalProfitLossPercentage: number;
        numberOfPayments: number;
        volatility: number; // Standard deviation of returns
        bestMonth: { date: string; return: number };
        worstMonth: { date: string; return: number };
    };
}

export interface BacktestPeriod {
    startDate: string;
    endDate: string;
    label: string; // e.g., "1 Year", "5 Years"
}

export interface BacktestResult {
    period: BacktestPeriod;
    cryptoId: CryptoAsset;
    cryptoSymbol: string;
    salary: SalaryInput;
    simulation: DCASimulation;
    comparison: {
        cryptoStrategy: {
            totalCrypto: number;
            currentValue: number;
        };
        fiatStrategy: {
            totalSaved: number; // If kept as fiat
            value: number;
        };
        difference: {
            absolute: number;
            percentage: number;
        };
    };
}

export interface MonthlyExpenses {
    rent: number;
    groceries: number;
    utilities: number;
    savings: number;
    other: number;
}

export interface PurchasingPowerScenario {
    name: string;
    cryptoPriceMultiplier: number; // 1.0 = current, 0.5 = 50% crash, 2.0 = 2x pump
}

export interface PurchasingPowerResult {
    monthlyExpenses: MonthlyExpenses;
    totalMonthlyExpenses: number;
    cryptoNeededToSell: number;
    remainingCryptoBalance: number;
    remainingFiatValue: number;
    monthsOfRunway: number;
    scenario: PurchasingPowerScenario;
}

export interface AllocationStrategy {
    name: string;
    description: string;
    allocations: SalaryAllocation[];
    riskLevel: 'low' | 'medium' | 'high' | 'very-high';
    stabilityScore: number; // 0-100
    upsidePotential: number; // 0-100
    recommended: boolean;
}

export interface StrategyComparison {
    strategies: AllocationStrategy[];
    simulationPeriod: BacktestPeriod;
    results: {
        strategy: AllocationStrategy;
        backtest: BacktestResult[];
        totalValue: number;
        volatility: number;
        sharpeRatio?: number;
    }[];
}

export interface TaxBracket {
    min: number;
    max: number | null;
    rate: number;
}

export interface TaxEstimate {
    country: Country;
    employmentType: EmploymentType;
    annualSalary: number;
    cryptoAllocations: SalaryAllocation[];
    estimates: {
        incomeTaxAtReceipt: number;
        incomeTaxRate: number;
        capitalGainsShortTerm: number; // If sold within 1 year
        capitalGainsLongTerm: number; // If sold after 1 year
        totalTaxableEvents: number; // Number of times crypto received = taxable event
        netTakeHome: number;
    };
    disclaimers: string[];
}

export interface CryptoPrice {
    cryptoId: CryptoAsset;
    symbol: string;
    name: string;
    currentPrice: number;
    priceChange24h: number;
    lastUpdated: Date;
}

export interface HistoricalPrice {
    timestamp: number;
    date: string;
    price: number;
}

// Chart data types
export interface ChartDataPoint {
    date: string;
    value: number;
    label?: string;
}

export interface MultiSeriesChartData {
    date: string;
    [key: string]: number | string; // Dynamic keys for multiple series
}
