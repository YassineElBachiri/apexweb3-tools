"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Web3Job } from "@/types/job";
import {
    BrainCircuit, ChevronDown, Loader2, FileText, MessageSquare,
    CheckCircle2, XCircle, Star, Lightbulb, HelpCircle, DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";

// --- Types ---
interface ResumeResult {
    fitScore: number;
    fitLabel: "Strong fit" | "Good fit" | "Partial fit" | "Long shot";
    strengths: string[];
    gaps: string[];
    rewrittenSummary: string;
    topTips: string[];
    interviewQuestions: string[];
    salaryAdvice: string;
}

interface QAResult {
    mode: "qa";
    answer: string;
    followUp: string;
}

type CoachResult = ResumeResult | QAResult;

interface CareerCoachPanelProps {
    job: Web3Job;
}

const fitLabelConfig: Record<ResumeResult["fitLabel"], { color: string; bg: string; border: string; bar: string }> = {
    "Strong fit": { color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20", bar: "bg-green-500" },
    "Good fit": { color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", bar: "bg-blue-500" },
    "Partial fit": { color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20", bar: "bg-yellow-500" },
    "Long shot": { color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", bar: "bg-red-500" },
};

export function CareerCoachPanel({ job }: CareerCoachPanelProps) {
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState<"resume" | "qa">("resume");
    const [resumeText, setResumeText] = useState("");
    const [question, setQuestion] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<CoachResult | null>(null);
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        if (mode === "resume" && !resumeText.trim()) {
            setError("Paste your resume text to get a fit analysis.");
            return;
        }
        if (mode === "qa" && !question.trim()) {
            setError("Ask a question about this role.");
            return;
        }

        setError("");
        setLoading(true);
        setResult(null);

        try {
            const res = await fetch("/api/jobs/career-coach", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    job: {
                        title: job.title,
                        company: job.company,
                        description: job.description || "",
                        tags: job.tags,
                        salary: job.salary,
                    },
                    resumeText: mode === "resume" ? resumeText : undefined,
                    userQuestion: mode === "qa" ? question : undefined,
                }),
            });

            if (!res.ok) throw new Error("Coach unavailable");
            const data = await res.json();
            setResult(data);
        } catch {
            setError("Career Coach is currently unavailable. Try again shortly.");
        } finally {
            setLoading(false);
        }
    };

    const isQAResult = (r: CoachResult): r is QAResult => "mode" in r && r.mode === "qa";
    const isResumeResult = (r: CoachResult): r is ResumeResult => !("mode" in r);

    return (
        <div className="rounded-2xl border border-white/5 bg-card/20 overflow-hidden">
            {/* Header Toggle */}
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition-colors"
                id="career-coach-toggle"
            >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/15 flex items-center justify-center shrink-0">
                        <BrainCircuit className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="text-left">
                        <p className="text-sm font-bold text-foreground">AI Career Coach</p>
                        <p className="text-xs text-muted-foreground">Resume fit analysis or role-specific Q&amp;A</p>
                    </div>
                </div>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden border-t border-white/5"
                    >
                        <div className="p-6 space-y-5">
                            {/* Mode Toggle */}
                            <div className="flex rounded-xl border border-white/5 overflow-hidden bg-background/30 p-1 gap-1">
                                <button
                                    onClick={() => { setMode("resume"); setResult(null); setError(""); }}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
                                        mode === "resume"
                                            ? "bg-purple-500/15 text-purple-300 border border-purple-500/20"
                                            : "text-muted-foreground hover:text-foreground"
                                    }`}
                                    id="coach-mode-resume"
                                >
                                    <FileText className="w-3.5 h-3.5" />
                                    Resume Review
                                </button>
                                <button
                                    onClick={() => { setMode("qa"); setResult(null); setError(""); }}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
                                        mode === "qa"
                                            ? "bg-purple-500/15 text-purple-300 border border-purple-500/20"
                                            : "text-muted-foreground hover:text-foreground"
                                    }`}
                                    id="coach-mode-qa"
                                >
                                    <MessageSquare className="w-3.5 h-3.5" />
                                    Ask a Question
                                </button>
                            </div>

                            {/* Resume Mode Input */}
                            {mode === "resume" && (
                                <div className="space-y-2">
                                    <label htmlFor="resume-text-input" className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                        Paste your resume (plain text)
                                    </label>
                                    <textarea
                                        id="resume-text-input"
                                        value={resumeText}
                                        onChange={(e) => setResumeText(e.target.value)}
                                        placeholder="Paste your resume text here — experience, skills, projects..."
                                        rows={6}
                                        className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-purple-500/40 focus:ring-1 focus:ring-purple-500/20 transition-colors resize-none"
                                    />
                                </div>
                            )}

                            {/* Q&A Mode Input */}
                            {mode === "qa" && (
                                <div className="space-y-2">
                                    <label htmlFor="coach-question-input" className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                        Your question about this role
                                    </label>
                                    <textarea
                                        id="coach-question-input"
                                        value={question}
                                        onChange={(e) => setQuestion(e.target.value)}
                                        placeholder="e.g. What token vesting structure should I negotiate? Is this a good team to join for L2 exposure?"
                                        rows={3}
                                        className="w-full bg-background/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-purple-500/40 focus:ring-1 focus:ring-purple-500/20 transition-colors resize-none"
                                    />
                                </div>
                            )}

                            {error && <p className="text-xs text-red-400">{error}</p>}

                            <Button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold shadow-md shadow-purple-500/10"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        {mode === "resume" ? "Analyzing your fit..." : "Getting Web3 advice..."}
                                    </>
                                ) : (
                                    <>
                                        <BrainCircuit className="w-4 h-4 mr-2" />
                                        {mode === "resume" ? "Analyze My Fit" : "Ask Coach"}
                                    </>
                                )}
                            </Button>

                            {/* Results */}
                            <AnimatePresence>
                                {result && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-4 pt-2 border-t border-white/5"
                                    >
                                        {/* Q&A Result */}
                                        {isQAResult(result) && (
                                            <div className="space-y-3">
                                                <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10">
                                                    <p className="text-sm text-foreground/90 leading-relaxed">{result.answer}</p>
                                                </div>
                                                <div className="flex items-start gap-2 p-3 rounded-xl bg-background/40 border border-white/5">
                                                    <Lightbulb className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5">Next Step</p>
                                                        <p className="text-xs text-foreground/80">{result.followUp}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Resume Result */}
                                        {isResumeResult(result) && (() => {
                                            const fitCfg = fitLabelConfig[result.fitLabel];
                                            return (
                                                <div className="space-y-4">
                                                    {/* Fit Score */}
                                                    <div className={`flex items-center gap-4 p-4 rounded-xl border ${fitCfg.bg} ${fitCfg.border}`}>
                                                        <div className="text-center shrink-0">
                                                            <p className={`text-3xl font-black ${fitCfg.color}`}>{result.fitScore}</p>
                                                            <p className="text-[10px] text-muted-foreground">/ 100</p>
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className={`text-sm font-bold ${fitCfg.color} mb-1`}>{result.fitLabel}</p>
                                                            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                                                                <div
                                                                    className={`h-full rounded-full ${fitCfg.bar} transition-all duration-700`}
                                                                    style={{ width: `${result.fitScore}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Strengths & Gaps */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        <div className="p-3 rounded-xl bg-green-500/5 border border-green-500/10 space-y-2">
                                                            <div className="flex items-center gap-1.5">
                                                                <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                                                                <p className="text-[10px] font-bold uppercase tracking-wider text-green-400/70">Strengths</p>
                                                            </div>
                                                            {result.strengths.map((s, i) => (
                                                                <p key={i} className="text-xs text-foreground/80 flex items-start gap-1.5">
                                                                    <span className="text-green-400 shrink-0">+</span>{s}
                                                                </p>
                                                            ))}
                                                        </div>
                                                        <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/10 space-y-2">
                                                            <div className="flex items-center gap-1.5">
                                                                <XCircle className="w-3.5 h-3.5 text-red-400" />
                                                                <p className="text-[10px] font-bold uppercase tracking-wider text-red-400/70">Gaps</p>
                                                            </div>
                                                            {result.gaps.map((g, i) => (
                                                                <p key={i} className="text-xs text-foreground/80 flex items-start gap-1.5">
                                                                    <span className="text-red-400 shrink-0">—</span>{g}
                                                                </p>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Rewritten Summary */}
                                                    <div className="p-4 rounded-xl bg-background/40 border border-white/5 space-y-2">
                                                        <div className="flex items-center gap-1.5">
                                                            <Star className="w-3.5 h-3.5 text-yellow-400" />
                                                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                                                Rewritten Professional Summary
                                                            </p>
                                                        </div>
                                                        <p className="text-sm text-foreground/90 leading-relaxed italic">
                                                            &ldquo;{result.rewrittenSummary}&rdquo;
                                                        </p>
                                                    </div>

                                                    {/* Top Tips */}
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-1.5">
                                                            <Lightbulb className="w-3.5 h-3.5 text-yellow-400" />
                                                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Top Tips</p>
                                                        </div>
                                                        {result.topTips.map((tip, i) => (
                                                            <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/10">
                                                                <span className="text-[10px] font-bold text-yellow-400 w-4 shrink-0 mt-0.5">0{i + 1}</span>
                                                                <p className="text-xs text-foreground/80">{tip}</p>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* Interview Questions */}
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-1.5">
                                                            <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
                                                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                                                Expect These Questions
                                                            </p>
                                                        </div>
                                                        {result.interviewQuestions.map((q, i) => (
                                                            <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-blue-500/5 border border-blue-500/10">
                                                                <span className="text-[10px] font-bold text-blue-400 shrink-0 mt-0.5">Q{i + 1}</span>
                                                                <p className="text-xs text-foreground/80">{q}</p>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* Salary Advice */}
                                                    {result.salaryAdvice && (
                                                        <div className="flex items-start gap-2 p-3 rounded-xl bg-green-500/5 border border-green-500/10">
                                                            <DollarSign className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                                                            <div>
                                                                <p className="text-[10px] font-bold uppercase tracking-wider text-green-400/70 mb-0.5">
                                                                    Salary Negotiation
                                                                </p>
                                                                <p className="text-xs text-foreground/80">{result.salaryAdvice}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })()}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
