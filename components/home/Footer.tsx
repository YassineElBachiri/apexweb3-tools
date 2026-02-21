
import Link from "next/link";
import { Shield, Twitter, Github, Send } from "lucide-react";
import { FOOTER_LINKS } from "@/lib/constants/navigation";

export function Footer() {
    return (
        <footer className="bg-brand-dark border-t border-white/5 py-16">
            <div className="container mx-auto px-4">

                <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
                    {/* Brand Column */}
                    <div className="col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4 group">
                            <Shield className="w-8 h-8 text-brand-purple group-hover:animate-pulse" />
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                ApexWeb3
                            </span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Web3 intelligence, risk tools, and career clarity for active crypto participants.
                        </p>
                        <div className="flex gap-4">
                            {[Twitter, Github, Send].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Intelligence */}
                    <div>
                        <h4 className="font-bold text-brand-blue mb-4 text-sm uppercase tracking-wider">Intelligence</h4>
                        <ul className="space-y-2.5">
                            {FOOTER_LINKS.intelligence.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Risk + Utilities */}
                    <div>
                        <h4 className="font-bold text-brand-pink mb-4 text-sm uppercase tracking-wider">Risk</h4>
                        <ul className="space-y-2.5 mb-6">
                            {FOOTER_LINKS.risk.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <h4 className="font-bold text-brand-purple mb-4 text-sm uppercase tracking-wider">Utilities</h4>
                        <ul className="space-y-2.5">
                            {FOOTER_LINKS.utilities.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Careers */}
                    <div>
                        <h4 className="font-bold text-emerald-400 mb-4 text-sm uppercase tracking-wider">Careers</h4>
                        <ul className="space-y-2.5 mb-6">
                            {FOOTER_LINKS.careers.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Resources</h4>
                        <ul className="space-y-2.5">
                            {FOOTER_LINKS.resources.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Company</h4>
                        <ul className="space-y-2.5">
                            {FOOTER_LINKS.company.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p>© {new Date().getFullYear()} ApexWeb3. All rights reserved.</p>
                    <p className="mt-4 md:mt-0 flex items-center gap-1">
                        Built with <span className="text-red-500">❤️</span> for the crypto community
                    </p>
                </div>

            </div>
        </footer>
    );
}
