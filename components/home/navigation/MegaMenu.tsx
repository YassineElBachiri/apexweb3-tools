
import Link from 'next/link';
import { TOOLS, PILLAR_META, ToolPillar } from '@/lib/constants/tools';
import { ChevronRight, Shield } from 'lucide-react';

interface MegaMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const PILLAR_ORDER: ToolPillar[] = ['Intelligence', 'Risk', 'Utilities', 'Careers'];

export function MegaMenu({ isOpen, onClose }: MegaMenuProps) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed top-20 left-0 w-full bg-brand-dark/90 backdrop-blur-xl border-b border-white/10 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200"
            onMouseLeave={onClose}
        >
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-5 gap-8">

                    {PILLAR_ORDER.map((pillarKey) => {
                        const meta = PILLAR_META[pillarKey];
                        const pillarTools = TOOLS.filter(t => t.pillar === pillarKey);

                        return (
                            <div key={pillarKey}>
                                {/* Pillar Header */}
                                <Link
                                    href={meta.href}
                                    onClick={onClose}
                                    className={`group flex items-center gap-1.5 font-bold mb-4 uppercase text-xs tracking-wider ${meta.color} hover:opacity-80 transition-opacity`}
                                >
                                    {meta.label}
                                    <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                                </Link>

                                {/* Tools in this pillar */}
                                <ul className="space-y-3">
                                    {pillarTools.map((tool) => {
                                        const Icon = tool.icon;
                                        const colorMap: Record<string, string> = {
                                            purple: 'bg-brand-purple/10 text-brand-purple',
                                            blue: 'bg-brand-blue/10 text-brand-blue',
                                            pink: 'bg-brand-pink/10 text-brand-pink',
                                            green: 'bg-green-500/10 text-green-500',
                                            orange: 'bg-orange-500/10 text-orange-500',
                                            cyan: 'bg-cyan-500/10 text-cyan-500',
                                            emerald: 'bg-emerald-500/10 text-emerald-500',
                                            indigo: 'bg-indigo-500/10 text-indigo-500',
                                            violet: 'bg-violet-500/10 text-violet-500',
                                            yellow: 'bg-yellow-500/10 text-yellow-400',
                                        };
                                        return (
                                            <li key={tool.id}>
                                                <Link
                                                    href={tool.href}
                                                    className="group flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                                                    onClick={onClose}
                                                >
                                                    <div className={`mt-0.5 p-1.5 rounded-md flex-shrink-0 ${colorMap[tool.color] ?? 'bg-white/10 text-white'}`}>
                                                        <Icon className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-white text-sm group-hover:text-brand-blue transition-colors flex items-center gap-1.5">
                                                            {tool.title}
                                                            {tool.badge && (
                                                                <span className="text-[10px] font-bold bg-brand-pink/80 text-white px-1.5 py-0.5 rounded-full leading-none">
                                                                    {tool.badge}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                                                            {tool.description}
                                                        </div>
                                                    </div>
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        );
                    })}

                    {/* Trust / Promo Card */}
                    <div className="col-span-1">
                        <div className="bg-gradient-to-br from-brand-purple/20 to-brand-blue/20 rounded-xl p-6 border border-white/10 h-full flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Shield className="w-5 h-5 text-brand-purple" />
                                    <span className="text-sm font-bold text-white">No Wallet Required</span>
                                </div>
                                <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                                    Every tool works out of the box — no sign-up, no wallet connection, no tracking.
                                </p>
                                <ul className="space-y-2 text-xs text-gray-400">
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-brand-purple flex-shrink-0" />
                                        Real-time market data
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-brand-blue flex-shrink-0" />
                                        10 professional tools
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-brand-pink flex-shrink-0" />
                                        100% free, always
                                    </li>
                                </ul>
                            </div>
                            <Link
                                href="/intelligence"
                                onClick={onClose}
                                className="mt-6 text-sm font-bold text-white hover:text-brand-purple flex items-center transition-colors"
                            >
                                Start with Intelligence <ChevronRight className="w-4 h-4 ml-1" />
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
