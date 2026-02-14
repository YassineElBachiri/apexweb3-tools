
import Link from 'next/link';
import { TOOLS } from '@/lib/constants/tools';
import { ChevronRight } from 'lucide-react';

interface MegaMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export function MegaMenu({ isOpen, onClose }: MegaMenuProps) {
    if (!isOpen) return null;

    const categories = [
        { name: 'Analysis', color: 'text-brand-purple' },
        { name: 'Tracking', color: 'text-brand-blue' },
        { name: 'Conversion', color: 'text-brand-pink' },
        { name: 'Calculation', color: 'text-orange-400' },
    ];

    return (
        <div
            className="fixed top-20 left-0 w-full bg-brand-dark/95 backdrop-blur-xl border-b border-white/10 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200"
            onMouseLeave={onClose}
        >
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-5 gap-8">

                    {categories.map(({ name, color }) => {
                        const categoryTools = TOOLS.filter(t => t.category === name);
                        if (categoryTools.length === 0) return null;

                        return (
                            <div key={name}>
                                <h4 className={`font-bold mb-4 uppercase text-xs tracking-wider ${color}`}>
                                    {name}
                                </h4>
                                <ul className="space-y-4">
                                    {categoryTools.map((tool) => {
                                        const Icon = tool.icon;
                                        return (
                                            <li key={tool.id}>
                                                <Link
                                                    href={tool.href}
                                                    className="group flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                                                    onClick={onClose}
                                                >
                                                    <div className={`mt-1 p-1.5 rounded-md ${tool.color === 'purple' ? 'bg-brand-purple/10 text-brand-purple' :
                                                        tool.color === 'blue' ? 'bg-brand-blue/10 text-brand-blue' :
                                                            tool.color === 'green' ? 'bg-green-500/10 text-green-500' :
                                                                tool.color === 'orange' ? 'bg-orange-500/10 text-orange-500' :
                                                                    tool.color === 'cyan' ? 'bg-cyan-500/10 text-cyan-500' :
                                                                        tool.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-500' :
                                                                            tool.color === 'pink' ? 'bg-pink-500/10 text-pink-500' :
                                                                                tool.color === 'indigo' ? 'bg-indigo-500/10 text-indigo-500' :
                                                                                    'bg-white/10 text-white'
                                                        }`}>
                                                        <Icon className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-white text-sm group-hover:text-brand-blue transition-colors flex items-center gap-2">
                                                            {tool.title}
                                                            {tool.badge && (
                                                                <span className="text-[10px] font-bold bg-brand-pink/80 text-white px-1.5 py-0.5 rounded-full leading-none">
                                                                    {tool.badge}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-gray-400 line-clamp-1">
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

                    <div className="col-span-1">
                        <div className="bg-gradient-to-br from-brand-purple/20 to-brand-blue/20 rounded-xl p-6 border border-white/10 h-full flex flex-col justify-between">
                            <div>
                                <span className="bg-brand-pink text-white text-xs font-bold px-2 py-1 rounded-full mb-3 inline-block">NEW</span>
                                <h4 className="text-xl font-bold text-white mb-2">Web3 Jobs</h4>
                                <p className="text-sm text-gray-300 mb-4">
                                    Find your next career in Web3, DeFi, and Blockchain.
                                </p>
                            </div>
                            <Link href="/jobs" onClick={onClose} className="text-sm font-bold text-white hover:text-brand-pink flex items-center transition-colors">
                                Browse Jobs <ChevronRight className="w-4 h-4 ml-1" />
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
