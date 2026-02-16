"use client";

import { useState, useEffect } from "react";
import { AnalysisResult } from "@/lib/analyzer";
import { analyzeContractAction } from "@/app/actions/analyze";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lock, ShieldAlert, CheckCircle, Flame, Bug, Zap, Play, AlertTriangle } from "lucide-react";
import { CodeEditor } from "@/components/analyzer/CodeEditor";
import { AnalyzerFAQ } from "@/components/analyzer/FAQ";
import { RelatedTools } from "@/components/analyzer/RelatedTools";

const DEFAULT_CODE_SOLIDITY = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VulnerableBank {
    mapping(address => uint) public balances;

    function withdraw() public {
        (bool sent, ) = msg.sender.call{value: balances[msg.sender]}("");
        require(sent, "Failed");
        balances[msg.sender] = 0; 
    }
}`;

const DEFAULT_CODE_RUST = `use anchor_lang::prelude::*;

#[program]
pub mod vulnerable_game {
    use super::*;

    pub function withdraw_funds(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        // Missing signer check?
        let user_account = &mut ctx.accounts.user;
        // ... unsafe logic ...
        Ok(())
    }
}
`;

const DEFAULT_CODE_MOVE = `module 0x1::VulnerableCoin {
    use std::signer;

    struct Coin has key { value: u64 }

    public fun mint(account: &signer, value: u64) {
        // Missing caps?
        move_to(account, Coin { value })
    }
}
`;

export default function ContractAnalyzerPage() {
    const [language, setLanguage] = useState("solidity");
    const [code, setCode] = useState(DEFAULT_CODE_SOLIDITY);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [loading, setLoading] = useState(false);

    const handleLanguageChange = (val: string) => {
        setLanguage(val);
        setResult(null);
        if (val === "solidity") setCode(DEFAULT_CODE_SOLIDITY);
        if (val === "rust") setCode(DEFAULT_CODE_RUST);
        if (val === "move") setCode(DEFAULT_CODE_MOVE);
    };

    const handleAnalyze = async () => {
        setLoading(true);
        try {
            const res = await analyzeContractAction(code, language);
            setResult(res);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const detectedMismatch = result?.risks.find(r => r.id === 'lang-mismatch');

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="container mx-auto px-4 py-12 max-w-7xl">
                {/* Header */}
                <div className="mb-12 text-center space-y-4">
                    <Badge variant="outline" className="mb-2 bg-red-500/10 text-red-400 border-red-500/20 px-3 py-1">v2.0 Beta</Badge>
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 pb-2">
                        Smart Contract Security Analyzer
                    </h1>
                    <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
                        Instant static analysis for <strong>Solidity</strong>, <strong>Rust</strong>, and <strong>Move</strong>.
                        Detect vulnerabilities and estimate costs in seconds.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
                    {/* Input Section (Left - 7 cols) */}
                    <div className="lg:col-span-7 flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-2">
                            <Tabs value={language} onValueChange={handleLanguageChange} className="w-full sm:w-auto">
                                <TabsList className="bg-muted/50 border border-white/5">
                                    <TabsTrigger value="solidity">Solidity</TabsTrigger>
                                    <TabsTrigger value="rust">Rust (Solana)</TabsTrigger>
                                    <TabsTrigger value="move">Move (Sui)</TabsTrigger>
                                </TabsList>
                            </Tabs>

                            <Button
                                onClick={handleAnalyze}
                                disabled={loading}
                                size="lg"
                                className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 shadow-lg shadow-red-500/20 text-white font-semibold transition-all hover:scale-105 active:scale-95"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Scanning...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <Play className="w-4 h-4 fill-current" /> Run Analysis
                                    </span>
                                )}
                            </Button>
                        </div>

                        <div className="h-[600px] shadow-2xl shadow-black/50 rounded-lg overflow-hidden border border-white/10">
                            <CodeEditor
                                code={code}
                                language={language}
                                onChange={setCode}
                                placeholder={`// Paste your ${language} code here...`}
                            />
                        </div>
                    </div>

                    {/* Results Section (Right - 5 cols) */}
                    <div className="lg:col-span-5 space-y-6">
                        {detectedMismatch ? (
                            <Alert variant="destructive" className="border-red-500 bg-red-950/30 animate-in fade-in slide-in-from-top-4">
                                <AlertTriangle className="h-5 w-5" />
                                <AlertTitle className="text-lg font-bold">Language Mismatch</AlertTitle>
                                <AlertDescription className="mt-2 text-base opacity-90">
                                    {detectedMismatch.description}
                                </AlertDescription>
                            </Alert>
                        ) : result ? (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                                {/* Score Card */}
                                <Card className="border-white/10 bg-card/40 overflow-hidden relative">
                                    <div className={`absolute top-0 left-0 w-1 h-full ${result.score > 80 ? 'bg-green-500' : result.score > 50 ? 'bg-yellow-500' : 'bg-red-500'}`} />
                                    <CardContent className="p-6">
                                        <div className="flex items-baseline justify-between mb-2">
                                            <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Security Score</div>
                                            <Badge variant="outline" className="uppercase text-xs">{result.metrics.complexity} Complexity</Badge>
                                        </div>
                                        <div className="flex items-end gap-3">
                                            <div className={`text-6xl font-bold font-mono leading-none ${result.score > 80 ? 'text-green-500' : result.score > 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                                                {result.score}
                                            </div>
                                            <div className="text-xl text-muted-foreground pb-1">/100</div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Vulnerabilities */}
                                <div className="space-y-3">
                                    <h3 className="text-lg font-semibold flex items-center gap-2 text-white">
                                        <ShieldAlert className="w-5 h-5 text-red-500" /> Detected Detects
                                    </h3>
                                    <div className="max-h-[300px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                                        {result.risks.length === 0 ? (
                                            <div className="p-8 text-center border border-dashed border-green-500/30 bg-green-500/5 rounded-lg text-green-400">
                                                <CheckCircle className="w-10 h-10 mx-auto mb-2 opacity-50" />
                                                <p className="font-medium">No obvious basic risks found.</p>
                                                <p className="text-xs opacity-70 mt-1">Ready for manual audit.</p>
                                            </div>
                                        ) : (
                                            result.risks.map((risk, i) => (
                                                <div key={i} className={`p-4 rounded-lg border ${risk.severity === 'Critical' ? 'bg-red-950/40 border-red-500/50' : risk.severity === 'High' ? 'bg-red-900/20 border-red-500/30' : 'bg-card border-white/10'}`}>
                                                    <div className="flex items-start justify-between gap-2 mb-1">
                                                        <h4 className="font-semibold text-sm flex items-center gap-2">
                                                            <Bug className={`w-4 h-4 ${risk.severity === 'Critical' || risk.severity === 'High' ? 'text-red-500' : 'text-yellow-500'}`} />
                                                            {risk.title}
                                                        </h4>
                                                        <Badge variant={risk.severity === 'Critical' ? 'destructive' : 'outline'} className="text-[10px] h-5 px-1.5 uppercase">
                                                            {risk.severity}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                                        {risk.description}
                                                    </p>
                                                    {risk.lines.length > 0 && (
                                                        <div className="mt-2 text-[10px] font-mono text-white/40 bg-black/20 p-1 px-2 rounded w-fit">
                                                            Lines: {risk.lines.join(", ")}
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Resource Estimates */}
                                <Card className="border-white/10 bg-card/40">
                                    <CardHeader className="py-3 px-4 border-b border-white/5">
                                        <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground px-2">
                                            {language === 'solidity' ? <Flame className="w-4 h-4 text-orange-500" /> : <Zap className="w-4 h-4 text-yellow-500" />}
                                            Estimated Consumption
                                        </CardTitle>
                                    </CardHeader>
                                    <div className="divide-y divide-white/5">
                                        {result.gasEstimates.map((est, i) => (
                                            <div key={i} className="flex justify-between items-center py-3 px-6 hover:bg-white/5 transition-colors">
                                                <div>
                                                    <div className="text-sm font-medium text-white">{est.operation}</div>
                                                    <div className="text-[10px] text-muted-foreground uppercase">{est.description}</div>
                                                </div>
                                                <div className="font-mono text-sm text-orange-400 font-bold">
                                                    {est.gas.toLocaleString()}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </div>
                        ) : (
                            // Modern Empty State
                            <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-8 border border-white/5 bg-gradient-to-b from-white/5 to-transparent rounded-xl">
                                <div className="w-20 h-20 bg-gradient-to-br from-red-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mb-6 shadow-inner shadow-white/5">
                                    <Lock className="w-10 h-10 text-white opacity-80" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Security Audit Ready</h3>
                                <p className="text-muted-foreground max-w-sm mb-8 leading-relaxed">
                                    Paste your contract code to identify vulnerabilities, estimate gas costs, and check compliance with best practices.
                                </p>

                                <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
                                    {[
                                        { label: "Reentrancy", color: "red" },
                                        { label: "Access Control", color: "blue" },
                                        { label: "Gas Optimization", color: "orange" },
                                        { label: "Logic Errors", color: "purple" }
                                    ].map((tag) => (
                                        <div key={tag.label} className="flex items-center gap-2 p-3 rounded-lg bg-black/20 border border-white/5 text-xs font-medium text-muted-foreground">
                                            <div className={`w-2 h-2 rounded-full bg-${tag.color}-500/50`} />
                                            {tag.label}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Audit CTA */}
                        {result && (
                            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="text-center sm:text-left">
                                    <h4 className="font-semibold text-blue-300">Need a manual review?</h4>
                                    <p className="text-xs text-blue-200/60">Automated tools can miss logical flaws.</p>
                                </div>
                                <Button size="sm" variant="secondary" className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30">
                                    Book Audit
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Additional Content */}
                <AnalyzerFAQ />
                <RelatedTools />
            </div>
        </div>
    );
}
