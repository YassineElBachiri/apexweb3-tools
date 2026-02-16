export interface AnalysisResult {
    score: number; // 0-100
    risks: RiskItem[];
    metrics: ContractMetrics;
    gasEstimates: GasEstimateItem[];
}

export interface RiskItem {
    id: string;
    type: string; // e.g., "Reentrancy", "Gas", "BestPractice"
    severity: "Critical" | "High" | "Medium" | "Low";
    title: string;
    description: string;
    lines: number[];
}

export interface ContractMetrics {
    loc: number;
    functions: number;
    stateVariables: number;
    imports: number;
    complexity: "Low" | "Medium" | "High";
}

export interface GasEstimateItem {
    operation: string;
    gas: number;
    description: string;
}

/**
 * Performs simple static analysis on Solidity Source Code
 * Note: This is a client-side heuristic analyzer, not a full compiler.
 */
/**
 * Performs simple static analysis on Solidity Source Code
 * @deprecated Use Server Action `analyzeContractAction` instead for robust detection to avoid freezing main thread.
 */
export function analyzeSolidity(code: string): AnalysisResult {
    const lines = code.split('\n');
    const risks: RiskItem[] = [];

    let functionsCount = 0;
    let stateVarsCount = 0;
    let importsCount = 0;

    // --- 1. Metric Collection ---
    lines.forEach((line, i) => {
        const trimmed = line.trim();
        if (trimmed.startsWith('import ')) importsCount++;
        if (trimmed.startsWith('function ')) functionsCount++;
        // Rough state var check (inside contract, not function, has visibility or type)
        // This is hard to perfect with regex, assume typical "type visibility name;" pattern
        if (/^(mapping|address|uint|int|bool|string|bytes).*;$/.test(trimmed) && !trimmed.includes('return')) {
            stateVarsCount++;
        }
    });

    const complexity = functionsCount > 20 ? "High" : functionsCount > 10 ? "Medium" : "Low";

    // --- 2. Risk Detection (Regex Heuristics) ---

    // Reentrancy: Check for .call{value: ...} followed by state changes is too hard for regex.
    // Simpler: Just warn about .call{value: ...}
    const callValueRegex = /\.call\s*\{\s*value:/;
    const callValueLines = findLines(lines, callValueRegex);
    if (callValueLines.length > 0) {
        risks.push({
            id: "unsafe-external-call",
            type: "Reentrancy",
            severity: "High",
            title: "Unsafe External Call",
            description: "Low-level .call usage detected. Ensure you follow Checks-Effects-Interactions pattern to prevent reentrancy.",
            lines: callValueLines
        });
    }

    // tx.origin
    const txOriginLines = findLines(lines, /tx\.origin/);
    if (txOriginLines.length > 0) {
        risks.push({
            id: "tx-origin",
            type: "Auth",
            severity: "High",
            title: "Use of tx.origin",
            description: "Avoid using tx.origin for authentication. Use msg.sender instead.",
            lines: txOriginLines
        });
    }

    // Unchecked loops
    const loopLines = findLines(lines, /for\s*\(.*;.*;.*\)/);
    if (loopLines.length > 0) {
        risks.push({
            id: "gas-heavy-loop",
            type: "Gas",
            severity: "Medium",
            title: "Potential Gas-Heavy Loop",
            description: "Loops over dynamic arrays can exceed block gas limits. Consider pulling loop bounds from storage or using pagination.",
            lines: loopLines
        });
    }

    // Missing Visibility
    // Check functions without public/private/internal/external
    // Regex: function name(...) { - missing visibility keywords
    // Hard to strict match without parser, skip for now to avoid false positives.

    // Visibility: state variables default to internal, widely acceptable.

    // --- 3. Gas Estimates (Heuristics) ---
    // Base cost + cost per function + cost per state var
    const deployCost = 32000 + (lines.length * 200) + (functionsCount * 22000) + (stateVarsCount * 20000);

    // Calculate Score (100 - penalties)
    let score = 100;
    score -= (risks.filter(r => r.severity === "High").length * 25);
    score -= (risks.filter(r => r.severity === "Medium").length * 10);
    score -= (risks.filter(r => r.severity === "Low").length * 5);
    if (score < 0) score = 0;

    return {
        score,
        risks,
        metrics: {
            loc: lines.length,
            functions: functionsCount,
            stateVariables: stateVarsCount,
            imports: importsCount,
            complexity
        },
        gasEstimates: [
            { operation: "Deployment", gas: deployCost, description: "Estimated deployment cost based on code size and complexity." },
            { operation: "Function Call (Avg)", gas: 21000 + 5000, description: "Base cost + execution logic estimate." },
            { operation: "SSTORE (New)", gas: 22100, description: "Cost to store a new non-zero value." }
        ]
    };
}

function findLines(lines: string[], regex: RegExp): number[] {
    const matches: number[] = [];
    lines.forEach((line, i) => {
        if (regex.test(line)) matches.push(i + 1);
    });
    return matches;
}
