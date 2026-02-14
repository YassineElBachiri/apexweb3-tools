
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { Tool } from '@/lib/constants/tools';

interface ToolCardProps {
    tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
    const Icon = tool.icon;

    return (
        <Link href={tool.href} className="group relative block h-full">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-brand-purple/20 to-brand-blue/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />

            <div className="relative h-full bg-card border border-white/5 rounded-3xl p-8 transition-all duration-300 group-hover:-translate-y-2 group-hover:border-brand-purple/30 overflow-hidden">
                {/* Gradient Border Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Badge */}
                {tool.badge && (
                    <span className={`absolute top-6 right-6 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full 
                        ${tool.badge === 'New' ? 'bg-brand-pink/20 text-brand-pink' : 'bg-brand-purple/20 text-brand-purple'}`}>
                        {tool.badge}
                    </span>
                )}

                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-300
                    ${tool.color === 'purple' ? 'bg-brand-purple/10 text-brand-purple' :
                        tool.color === 'blue' ? 'bg-brand-blue/10 text-brand-blue' :
                            tool.color === 'green' ? 'bg-green-500/10 text-green-500' :
                                tool.color === 'orange' ? 'bg-orange-500/10 text-orange-500' :
                                    tool.color === 'cyan' ? 'bg-cyan-500/10 text-cyan-500' :
                                        tool.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-500' :
                                            'bg-brand-pink/10 text-brand-pink'
                    }`}>
                    <Icon className="w-7 h-7" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-brand-purple transition-colors">
                    {tool.title}
                </h3>
                <p className="text-gray-400 mb-6 line-clamp-2">
                    {tool.description}
                </p>

                {/* Features */}
                <ul className="space-y-2 mb-8">
                    {tool.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-500">
                            <Check className="w-4 h-4 mr-2 text-brand-blue" />
                            {feature}
                        </li>
                    ))}
                </ul>

                {/* CTA */}
                <div className="flex items-center text-sm font-bold text-white mt-auto">
                    Launch Tool <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </div>
            </div>
        </Link>
    );
}
