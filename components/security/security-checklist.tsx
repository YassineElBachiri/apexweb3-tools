"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SecurityCheck } from "@/types";
import { CheckCircle, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface SecurityChecklistProps {
    checks: SecurityCheck[];
    overallRisk: "low" | "medium" | "high";
}

export function SecurityChecklist({ checks, overallRisk }: SecurityChecklistProps) {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const toggleExpand = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    const getRiskBadgeVariant = (risk: "low" | "medium" | "high") => {
        switch (risk) {
            case "low":
                return "success";
            case "medium":
                return "warning";
            case "high":
                return "destructive";
        }
    };

    const getOverallBadgeVariant = () => {
        return getRiskBadgeVariant(overallRisk);
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Security Checks</CardTitle>
                    <Badge variant={getOverallBadgeVariant()} className="text-sm px-3 py-1">
                        {overallRisk.toUpperCase()} RISK
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {checks.map((check, index) => (
                        <div
                            key={index}
                            className="glass rounded-lg border border-border overflow-hidden transition-smooth"
                        >
                            <button
                                onClick={() => toggleExpand(index)}
                                className="w-full p-4 flex items-start gap-4 hover:bg-background-hover transition-smooth"
                            >
                                {/* Pass/Fail Icon */}
                                <div className="flex-shrink-0 mt-0.5">
                                    {check.passed ? (
                                        <CheckCircle className="h-6 w-6 text-success" />
                                    ) : (
                                        <XCircle className="h-6 w-6 text-danger" />
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 text-left">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium">{check.name}</span>
                                        <Badge variant={getRiskBadgeVariant(check.riskLevel)} className="text-xs">
                                            {check.riskLevel}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {check.description}
                                    </p>
                                </div>

                                {/* Expand Icon */}
                                {check.details && (
                                    <div className="flex-shrink-0">
                                        {expandedIndex === index ? (
                                            <ChevronUp className="h-5 w-5 text-muted-foreground" />
                                        ) : (
                                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                                        )}
                                    </div>
                                )}
                            </button>

                            {/* Expanded Details */}
                            {expandedIndex === index && check.details && (
                                <div className="px-4 pb-4 pt-0 border-t border-border/50 animate-slideIn">
                                    <div className="bg-background-card rounded p-3 mt-3">
                                        <p className="text-sm text-muted-foreground">
                                            {check.details}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
