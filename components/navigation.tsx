"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Menu, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn, getCategoryUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MegaMenu } from "@/components/home/navigation/MegaMenu";
import { NAV_LINKS } from "@/lib/constants/navigation";
import { TOOLS, PILLAR_META, ToolPillar } from "@/lib/constants/tools";

const PILLAR_ORDER: ToolPillar[] = ['Intelligence', 'Risk', 'Utilities', 'Careers'];

interface NavigationProps {
    categories?: Array<{ name: string; slug: string; count: number }>;
}

export function Navigation({ categories = [] }: NavigationProps) {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [megaMenuOpen, setMegaMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 w-full z-50 bg-brand-dark/80 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-20">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="relative">
                            <Shield className="h-8 w-8 text-brand-purple group-hover:animate-pulse" />
                            <div className="absolute inset-0 blur-md bg-brand-purple/30 group-hover:bg-brand-purple/50 transition-opacity" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                            ApexWeb3
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-8">

                        {/* Tools — Mega Menu Trigger */}
                        <div
                            className="relative group h-20 flex items-center"
                            onMouseEnter={() => setMegaMenuOpen(true)}
                            onMouseLeave={() => setMegaMenuOpen(false)}
                        >
                            <button
                                aria-label="Browse all tools"
                                aria-expanded={megaMenuOpen}
                                className={`flex items-center gap-1 text-sm font-medium transition-colors ${megaMenuOpen ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                            >
                                Tools <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${megaMenuOpen ? 'rotate-180' : ''}`} />
                            </button>
                            <MegaMenu isOpen={megaMenuOpen} onClose={() => setMegaMenuOpen(false)} />
                        </div>

                        {NAV_LINKS.map(link => {
                            if (link.label === "Articles") {
                                return (
                                    <div key={link.href} className="relative group h-20 flex items-center">
                                        <Link
                                            href={link.href}
                                            className={cn(
                                                "flex items-center gap-1 text-sm font-medium transition-colors hover:text-white",
                                                pathname.startsWith(link.href) || pathname.startsWith("/category") ? "text-white" : "text-gray-400"
                                            )}
                                        >
                                            {link.label} <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                                        </Link>

                                        {/* Dropdown for Categories */}
                                        <div className="absolute top-20 left-0 hidden group-hover:block w-56 bg-brand-dark/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                                            <div className="p-2 flex flex-col">
                                                <Link href="/categories" className="px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors font-medium">
                                                    All Categories
                                                </Link>
                                                <div className="h-px bg-white/10 my-1 mx-2" />
                                                {categories.map(cat => (
                                                    <Link key={cat.slug} href={getCategoryUrl(cat.slug)} className="px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center justify-between">
                                                        <span>{cat.name}</span>
                                                        <span className="text-[10px] font-bold bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded-full">{cat.count}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "text-sm font-medium transition-colors hover:text-white",
                                        pathname === link.href ? "text-white" : "text-gray-400"
                                    )}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right Actions */}
                    <div className="hidden lg:flex items-center gap-4">
                        <Link href="/intelligence">
                            <Button className="bg-brand-purple hover:bg-brand-purple/90 text-white font-bold rounded-full px-6">
                                Start Here →
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                        className="lg:hidden text-white"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
                    </Button>

                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="lg:hidden py-4 border-t border-white/5 bg-brand-dark animate-in slide-in-from-top-4 max-h-[80vh] overflow-y-auto">
                        <div className="flex flex-col gap-1">

                            <Link
                                href="/"
                                onClick={() => setMobileMenuOpen(false)}
                                className="px-4 py-3 text-white hover:bg-white/5 font-medium"
                            >
                                Home
                            </Link>

                            {NAV_LINKS.map(link => {
                                if (link.label === "Articles") {
                                    return (
                                        <div key={link.href} className="flex flex-col">
                                            <Link
                                                href={link.href}
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 transition-colors font-medium flex items-center justify-between"
                                            >
                                                {link.label}
                                            </Link>
                                            <div className="pl-6 flex flex-col gap-1 py-1 border-l-2 border-white/5 ml-4">
                                                <Link href="/categories" onClick={() => setMobileMenuOpen(false)} className="text-sm text-brand-primary hover:text-teal-400 py-1.5 transition-colors font-medium">
                                                    Browse All Categories &rarr;
                                                </Link>
                                                {categories.map(cat => (
                                                    <Link key={cat.slug} href={getCategoryUrl(cat.slug)} onClick={() => setMobileMenuOpen(false)} className="text-sm text-gray-500 hover:text-white py-1.5 transition-colors">
                                                        {cat.name} ({cat.count})
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                }

                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                );
                            })}

                            <div className="border-t border-white/5 my-2" />

                            {/* Pillar sections in mobile */}
                            {PILLAR_ORDER.map((pillarKey) => {
                                const meta = PILLAR_META[pillarKey];
                                const pillarTools = TOOLS.filter(t => t.pillar === pillarKey);
                                return (
                                    <div key={pillarKey}>
                                        <Link
                                            href={meta.href}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={`px-4 py-2 font-bold uppercase text-xs tracking-wider ${meta.color} hover:opacity-80 block`}
                                        >
                                            {meta.label} →
                                        </Link>
                                        {pillarTools.map(tool => (
                                            <Link
                                                key={tool.id}
                                                href={tool.href}
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="px-6 py-2.5 text-gray-400 hover:text-white hover:bg-white/5 transition-colors block text-sm"
                                            >
                                                {tool.title}
                                            </Link>
                                        ))}
                                    </div>
                                );
                            })}

                            <div className="p-4 mt-2">
                                <Link href="/intelligence" onClick={() => setMobileMenuOpen(false)}>
                                    <Button className="w-full bg-brand-purple text-white font-bold py-6">
                                        Start with Intelligence →
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
