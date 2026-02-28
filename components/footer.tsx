import Link from "next/link";
import { Github, Twitter, Shield } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t border-border glass mt-auto">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Shield className="h-6 w-6 text-primary" />
                            <span className="text-lg font-bold gradient-text">ApexWeb3 Tools</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Real-time Web3 analytics for smart traders. Track portfolios, analyze tokenomics, and detect risks.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link href="/dashboard" className="hover:text-primary transition-smooth">
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link href="/jobs" className="hover:text-primary transition-smooth">
                                    Web3 Jobs
                                </Link>
                            </li>
                            <li>
                                <Link href="/analysis/whales" className="hover:text-primary transition-smooth">
                                    Whale Watch
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h3 className="font-semibold mb-4">Connect</h3>
                        <div className="flex gap-4">
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-primary transition-smooth"
                            >
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-primary transition-smooth"
                            >
                                <Github className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} ApexWeb3 Tools. Built for degens, by degens.</p>
                </div>
            </div>
        </footer>
    );
}
