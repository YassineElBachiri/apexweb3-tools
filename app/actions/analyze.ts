"use server";

import { RiskItem, AnalysisResult, GasEstimateItem } from "@/lib/analyzer";

// --- Patterns ---
const PATTERNS = {
    solidity: {
        unsafeCall: /call\s*\{\s*value:/,
        txOrigin: /tx\.origin/,
        timestamp: /block\.timestamp/,
        delegatecall: /delegatecall/,
        loop: /for\s*\(|while\s*\(/,
        // Original Solidity patterns not explicitly moved to analyzeSolidity, but still in PATTERNS:
        // uncheckedExternal: /\.call\(/, // low-level call
        // selfdestruct: /selfdestruct|suicide/,
        // floatingPragma: /pragma\s+solidity\s+\^/,
        // noPragma: /pragma\s+solidity/, // check if missing
        // storageLoop: /for\s*\([^;]*;\s*[^;]*;\s*[^)]*\)\s*\{\s*[^}]*\b(push|pop|length)\b[^}]*\}/, // attempting to find storage array ops in loop
    },
    rust: { // Solana/Anchor
        unsafeBlock: /unsafe\s*\{/,
        uncheckedMath: /unchecked_/,
        missingSigner: /Signer/, // Very rough check for signer verification existing
        accountInfo: /AccountInfo/, // Raw account info usage can be risky vs Account<'info, T>
        cpi: /invoke_signed/, // CPI checks
    },
    move: { // Sui (Basic)
        // Move is generally safe, but we can look for "public" funcs that should be "entry" or friends
        coinExtract: /coin::take/, // Rough heuristic
    }
};

type SupportedLang = 'solidity' | 'rust' | 'move';

export async function analyzeContractAction(code: string, language: string = 'solidity'): Promise<AnalysisResult> {
    await new Promise(resolve => setTimeout(resolve, 500));

    if (!code || code.trim().length === 0) {
        throw new Error("No code provided");
    }

    const detected = detectLanguage(code);
    const risks: RiskItem[] = [];
    let score = 100;
    const lines = code.split('\n');

    // Mismatch Detection
    if (detected !== language && detected !== 'unknown') {
        risks.push({
            id: 'lang-mismatch',
            type: "Syntax",
            severity: "High",
            title: "Language Mismatch",
            description: `You selected ${language} but the code appears to be ${detected}. Please select the correct language for accurate analysis.`,
            lines: [1]
        });
        score = 0;
        return {
            score,
            risks,
            metrics: { loc: lines.length, complexity: "Low", functions: 0, imports: 0, stateVariables: 0 },
            gasEstimates: []
        };
    }

    if (language === 'solidity') {
        return analyzeSolidity(code, lines, risks, score);
    } else if (language === 'rust') {
        return analyzeRust(code, lines, risks, score);
    } else {
        // Fallback or Move (placeholder)
        return {
            score: 100,
            risks: [],
            metrics: { loc: lines.length, complexity: "Low", functions: 0, imports: 0, stateVariables: 0 },
            gasEstimates: []
        };
    }
}

function detectLanguage(code: string): SupportedLang | 'unknown' {
    if (/pragma solidity/.test(code) || /contract\s+\w+\s*\{/.test(code)) return 'solidity';
    if (/use\s+anchor_lang/.test(code) || /pub\s+fn\s+/.test(code) || /#\[program\]/.test(code)) return 'rust';
    if (/module\s+0x/.test(code) || /public\s+fun/.test(code)) return 'move';
    return 'unknown';
}

function analyzeSolidity(code: string, lines: string[], risks: RiskItem[], score: number): AnalysisResult {
    // ... (Previous Solidity Logic Reuse) ...
    const metrics = {
        loc: lines.length,
        complexity: (code.match(/if|else|for|while|function|modifier/g) || []).length as any,
        functions: (code.match(/function\s/g) || []).length,
        imports: 0,
        stateVariables: 0
    };

    // Original Solidity analysis logic, adapted for new structure and PATTERNS.solidity
    // 1. Reentrancy / Unsafe Call
    if (PATTERNS.solidity.unsafeCall.test(code)) {
        risks.push({
            id: 'reentrancy',
            type: "Reentrancy",
            title: "Potential Reentrancy",
            severity: "High",
            description: "Low-level call detected.",
            lines: findLineNumbers(lines, PATTERNS.solidity.unsafeCall)
        });
        score -= 30;
    }

    // 2. Tx Origin
    if (PATTERNS.solidity.txOrigin.test(code)) {
        risks.push({
            id: 'txorigin',
            type: "Authentication",
            title: "Use of tx.origin",
            severity: "High",
            description: "Use msg.sender instead.",
            lines: findLineNumbers(lines, PATTERNS.solidity.txOrigin)
        });
        score -= 25;
    }

    // 3. Delegatecall
    if (PATTERNS.solidity.delegatecall.test(code)) {
        risks.push({
            id: 'delegate',
            type: "UnsafeDelegate",
            title: "Unsafe Delegatecall",
            severity: "Critical",
            description: "Ensure trusting target.",
            lines: findLineNumbers(lines, PATTERNS.solidity.delegatecall)
        });
        score -= 40;
    }

    // 4. Timestamp Dependence (from original code)
    if (PATTERNS.solidity.timestamp.test(code)) {
        risks.push({
            id: 'timestamp',
            type: "Timestamp",
            title: "Block Timestamp Manipulation",
            severity: "Low",
            description: "Miners can manipulate `block.timestamp`. Do not use it for critical randomness.",
            lines: findLineNumbers(lines, PATTERNS.solidity.timestamp)
        });
        score -= 5;
    }

    // 5. Loops (Gas Limit)
    if (PATTERNS.solidity.loop.test(code)) {
        risks.push({
            id: 'loop',
            type: "Gas",
            title: "Unbounded Loop",
            severity: "Medium",
            description: "Check loop bounds.",
            lines: findLineNumbers(lines, PATTERNS.solidity.loop)
        });
        score -= 10;
    }

    // 6. Floating Pragma (from original code, but pattern not in new PATTERNS.solidity)
    // Re-adding the pattern for floatingPragma to PATTERNS.solidity for consistency with original logic
    // For now, I'll assume the user wants to keep the original checks that are not explicitly removed.
    // Adding floatingPragma to PATTERNS.solidity for this.
    // Note: The provided PATTERNS.solidity in the instruction does not include floatingPragma.
    // I will add it back to the PATTERNS object for the analyzeSolidity function to use it.
    // If the user intended to remove it, they would have explicitly removed it from the original PATTERNS.
    // For now, I'll use the original PATTERNS.floatingPragma regex directly here, as it's not in the new PATTERNS.solidity.
    const floatingPragmaPattern = /pragma\s+solidity\s+\^/;
    if (floatingPragmaPattern.test(code)) {
        risks.push({
            id: 'floating-pragma',
            type: "BestPractice",
            title: "Floating Pragma",
            severity: "Low",
            description: "Lock the pragma.",
            lines: findLineNumbers(lines, floatingPragmaPattern)
        });
        score -= 5;
    }


    const estDeploy = 32000 + (metrics.loc * 200);
    const estExec = 21000 + (metrics.complexity * 1000);

    return {
        score: Math.max(0, score),
        risks,
        metrics: { ...metrics, complexity: metrics.complexity > 20 ? "High" : "Low" },
        gasEstimates: [
            { operation: "Deployment", gas: estDeploy, description: "Est. Deploy Gas" },
            { operation: "Execution", gas: estExec, description: "Est. Avg Exec Gas" }
        ]
    };
}

function analyzeRust(code: string, lines: string[], risks: RiskItem[], score: number): AnalysisResult {
    const metrics = {
        loc: lines.length,
        complexity: (code.match(/if|else|for|while|fn|match/g) || []).length,
        functions: (code.match(/fn\s+/g) || []).length,
        imports: 0, // Placeholder
        stateVariables: 0 // Placeholder
    };

    // Rust/Anchor Patterns
    if (PATTERNS.rust.unsafeBlock.test(code)) {
        risks.push({
            id: 'unsafe',
            type: "Safety",
            title: "Unsafe Block Detected",
            severity: "Medium",
            description: "Avoid `unsafe` blocks unless absolutely necessary. Verify invariants manually.",
            lines: findLineNumbers(lines, PATTERNS.rust.unsafeBlock)
        });
        score -= 20;
    }
    if (PATTERNS.rust.accountInfo.test(code) && !/Account<'.*,/.test(code)) {
        // Rough heuristic: Using raw AccountInfo without Anchor wrapper might be risky if not careful
        risks.push({
            id: 'raw-account',
            type: "TypeSafety",
            title: "Raw AccountInfo Usage",
            severity: "Low",
            description: "Prefer using Anchor's `Account<'info, T>` wrappers for automatic owner/discriminator checks.",
            lines: findLineNumbers(lines, PATTERNS.rust.accountInfo)
        });
        score -= 10;
    }

    // Compute Units Estimate (Solana) -> Not really "Gas" but CU.
    // Base 5000 + complexity.
    const estCU = 5000 + (metrics.complexity * 500);

    return {
        score: Math.max(0, score),
        risks,
        metrics: { ...metrics, complexity: metrics.complexity > 20 ? "High" : "Low", imports: 0, stateVariables: 0 },
        gasEstimates: [
            { operation: "Compute Units", gas: estCU, description: "Est. Compute Units per instruction" }
        ]
    };
}

function findLineNumbers(lines: string[], regex: RegExp): number[] {
    const result: number[] = [];
    lines.forEach((line, idx) => {
        if (regex.test(line)) result.push(idx + 1);
    });
    return result;
}
