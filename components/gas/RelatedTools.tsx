"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { TOOLS } from "@/lib/constants/tools";

export function RelatedTools() {
    // Filter to show 3 relevant tools, excluding gas-fees
    const related = TOOLS.filter(t =>
        t.id !== 'gas-fees' &&
        (t.pillar === 'Utilities' || t.id === 'contract-analyzer' || t.id === 'converter')
    ).slice(0, 3);

    return (
        <div className="mt-20 border-t border-white/10 pt-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Explore More Developer Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {related.map((tool) => {
                    const Icon = tool.icon;
                    return (
                        <Link key={tool.id} href={tool.href} className="group">
                            <Card className="h-full border-white/10 bg-card/40 hover:bg-card/60 transition-all hover:-translate-y-1">
                                <CardHeader>
                                    <div className={`w-10 h-10 rounded-lg bg-${tool.color}-500/10 flex items-center justify-center mb-3 group-hover:bg-${tool.color}-500/20 transition-colors`}>
                                        <Icon className={`w-5 h-5 text-${tool.color}-500`} />
                                    </div>
                                    <CardTitle className="flex items-center justify-between">
                                        {tool.title}
                                        {tool.badge && <Badge variant="secondary" className="text-xs">{tool.badge}</Badge>}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                        {tool.description}
                                    </p>
                                    <div className="flex items-center text-sm font-medium text-primary">
                                        Open Tool <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
