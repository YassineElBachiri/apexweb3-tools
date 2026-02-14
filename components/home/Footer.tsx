
import Link from "next/link";
import { Shield, Twitter, Github, Send } from "lucide-react";
import { FOOTER_LINKS } from "@/lib/constants/navigation";

export function Footer() {
    return (
        <footer className="bg-brand-dark border-t border-white/5 py-16">
            <div className="container mx-auto px-4">

                <div className="grid md:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-4 group">
                            <Shield className="w-8 h-8 text-brand-purple group-hover:animate-pulse" />
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                ApexWeb3
                            </span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Professional Web3 tools for the modern crypto trader.
                            Track, analyze, and convert — all in one place.
                        </p>
                        <div className="flex gap-4">
                            {[Twitter, Github, Send].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div>
                        <h4 className="font-bold text-white mb-6">Tools</h4>
                        <ul className="space-y-3">
                            {FOOTER_LINKS.tools.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-gray-400 hover:text-brand-purple transition-colors text-sm">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6">Resources</h4>
                        <ul className="space-y-3">
                            {FOOTER_LINKS.resources.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-gray-400 hover:text-brand-blue transition-colors text-sm">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6">Company</h4>
                        <ul className="space-y-3">
                            {FOOTER_LINKS.company.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-gray-400 hover:text-brand-pink transition-colors text-sm">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p>© 2024 ApexWeb3. All rights reserved.</p>
                    <p className="mt-4 md:mt-0 flex items-center gap-1">
                        Built with <span className="text-red-500">❤️</span> for the crypto community
                    </p>
                </div>

            </div>
        </footer>
    );
}
