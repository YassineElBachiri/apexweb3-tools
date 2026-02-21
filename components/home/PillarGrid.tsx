"use client";

import Link from 'next/link';
import { TOOLS, PILLAR_META, ToolPillar } from '@/lib/constants/tools';
import { ArrowRight } from 'lucide-react';

const PILLAR_ORDER: ToolPillar[] = ['Intelligence', 'Risk', 'Utilities', 'Careers'];

function ToolCard({ tool }: { tool: (typeof TOOLS)[0] }) {
    const Icon = tool.icon;
    const colorMap: Record<string, string> = {
        purple: 'bg-brand-purple/10 text-brand-purple border-brand-purple/20',
        blue: 'bg-brand-blue/10 text-brand-blue border-brand-blue/20',
        pink: 'bg-brand-pink/10 text-brand-pink border-brand-pink/20',
        green: 'bg-green-500/10 text-green-500 border-green-500/20',
        orange: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
        cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
        emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
        violet: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
        yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    };
    const iconClass = colorMap[tool.color] ?? 'bg-white/10 text-white border-white/10';

    return (
        <Link
            href={tool.href}
            className="group flex flex-col gap-4 p-5 rounded-2xl bg-white/3 border border-white/5 hover:border-white/15 hover:bg-white/5 transition-all duration-300"
        >
            <div className="flex items-start justify-between">
                <div className={`p-2.5 rounded-xl border ${iconClass}`}>
                    <Icon className="w-5 h-5" />
                </div>
                {tool.badge && (
                    <span className="text-[10px] font-bold bg-brand-pink/80 text-white px-2 py-0.5 rounded-full">
                        {tool.badge}
                    </span>
                )}
            </div>
            <div>
                <h4 className="font-bold text-white mb-1 group-hover:text-brand-blue transition-colors">
                    {tool.title}
                </h4>
                <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                    {tool.description}
                </p>
            </div>
            <div className="mt-auto flex items-center text-xs font-semibold text-gray-500 group-hover:text-white transition-colors">
                Open Tool <ArrowRight className="ml-1 w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
        </Link>
    );
}

export function PillarGrid() {
    return (
        <section id="pillars" className="py-24 bg-brand-dark relative">
            <div className="container mx-auto px-4">

                {/* Section Header */}
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <span className="text-brand-purple font-mono text-sm uppercase tracking-wider">The Platform</span>
                    <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
                        A System, Not a{' '}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-purple to-brand-blue">
                            Tool Directory
                        </span>
                    </h2>
                    <p className="text-gray-400 text-lg">
                        Four strategic pillars. Every tool serves a decision — not just curiosity.
                    </p>
                </div>

                {/* Pillar Overview Cards */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
                    {PILLAR_ORDER.map((pillarKey) => {
                        const meta = PILLAR_META[pillarKey];
                        const count = TOOLS.filter(t => t.pillar === pillarKey).length;
                        return (
                            <Link
                                key={pillarKey}
                                href={meta.href}
                                className={`group p-6 rounded-2xl border ${meta.borderColor} ${meta.bgColor} hover:scale-[1.02] transition-all duration-300`}
                            >
                                <div className={`text-3xl mb-3`}>{meta.emoji}</div>
                                <h3 className={`text-xl font-bold mb-2 ${meta.color}`}>
                                    {meta.label}
                                </h3>
                                <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                                    {meta.description}
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-600">{count} tools</span>
                                    <span className={`text-xs font-bold ${meta.color} flex items-center gap-1 group-hover:gap-2 transition-all`}>
                                        Explore <ArrowRight className="w-3 h-3" />
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Tools grouped by pillar */}
                <div className="space-y-20">
                    {PILLAR_ORDER.map((pillarKey) => {
                        const meta = PILLAR_META[pillarKey];
                        const pillarTools = TOOLS.filter(t => t.pillar === pillarKey);
                        return (
                            <div key={pillarKey}>
                                {/* Pillar section header */}
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <span className={`font-mono text-xs uppercase tracking-widest ${meta.color} mb-1 block`}>
                                            {meta.emoji} {meta.label}
                                        </span>
                                        <h3 className="text-2xl font-bold text-white">
                                            {meta.description}
                                        </h3>
                                    </div>
                                    <Link
                                        href={meta.href}
                                        className={`hidden sm:flex items-center gap-1 text-sm font-semibold ${meta.color} hover:opacity-80 transition-opacity`}
                                    >
                                        View all <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>

                                {/* Tool cards grid */}
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {pillarTools.map(tool => (
                                        <ToolCard key={tool.id} tool={tool} />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}
