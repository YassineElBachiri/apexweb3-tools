"use client";

import { useState } from 'react';
import { TOOLS } from '@/lib/constants/tools';
import { ToolCard } from './ToolCard';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function ToolsGrid() {
    const [activeCategory, setActiveCategory] = useState<string>('All');
    const categories = ['All', 'Analysis', 'Tracking', 'Conversion', 'Calculation'];

    const filteredTools = activeCategory === 'All'
        ? TOOLS
        : TOOLS.filter(tool => tool.category === activeCategory);

    return (
        <section id="tools" className="py-24 bg-brand-dark relative">
            <div className="container mx-auto px-4">

                {/* Header */}
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <span className="text-brand-purple font-mono text-sm uppercase tracking-wider">Our Ecosystem</span>
                    <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
                        Everything You Need in <span className="gradient-text">One Platform</span>
                    </h2>
                    <p className="text-gray-400 text-lg">
                        We've built a comprehensive suite of professional-grade Web3 tools used by over 50,000 traders worldwide.
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap justify-center gap-3 mb-16">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border
                                ${activeCategory === cat
                                    ? 'bg-white text-brand-dark border-white'
                                    : 'bg-white/5 text-gray-400 border-white/5 hover:border-white/20 hover:text-white'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {filteredTools.map((tool) => (
                        <ToolCard key={tool.id} tool={tool} />
                    ))}
                </div>

                {/* Footer Link */}
                <div className="text-center mt-16">
                    <Link href="/tools" className="inline-flex items-center text-gray-400 hover:text-white transition-colors group">
                        Can't find what you need? View detailed directory <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

            </div>
        </section>
    );
}
