import { JSX } from "react";
import { TableOfContents, TocItem } from "./TableOfContents";

// Simple server-side HTML parser for headings
// In a real 2026 app you might use JSDOM or rehype, but regex works for a simple raw HTML approach.
export function parseHeadings(htmlContent: string): { html: string; toc: TocItem[] } {
    const toc: TocItem[] = [];

    // Regex to match <h2> and <h3> tags and their content
    const headingRegex = /<(h[23])([^>]*)>(.*?)<\/\1>/gi;

    // Replace the headings in the HTML to inject IDs, format: <h2 id="slugified-title">Title</h2>
    const newHtml = htmlContent.replace(headingRegex, (match, tag, attrs, content) => {
        // Strip out nested HTML inside heading for the slug
        const textContent = content.replace(/<[^>]*>?/gm, '');

        // Create a URL-friendly slug
        const slug = textContent
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');

        // Add to ToC list
        toc.push({
            id: slug,
            text: textContent,
            level: tag.toLowerCase() === 'h2' ? 2 : 3
        });

        // If it already has an ID, we could preserve it, but we'll overwrite for consistency
        // Return modified heading with id injected
        return `<${tag} id="${slug}" ${attrs}>${content}</${tag}>`;
    });

    return { html: newHtml, toc };
}

interface SidebarProps {
    toc: TocItem[];
}

export function Sidebar({ toc }: SidebarProps) {
    return (
        <aside className="sticky top-24 w-full h-fit flex-shrink-0">
            {/* Glassmorphism Container styling */}
            <div className="rounded-2xl border border-white/10 bg-brand-dark/40 backdrop-blur-md p-6 shadow-2xl">
                <TableOfContents toc={toc} />
            </div>

            {/* Newsletter or extra sidebar CTA could go here */}
            <div className="mt-6 rounded-2xl border border-brand-primary/20 bg-brand-primary/5 p-6 shadow-lg">
                <h4 className="text-sm font-bold text-white mb-2">Web3 Intelligence Daily</h4>
                <p className="text-xs text-slate-400 mb-4">
                    Get the latest tokenomics and security research straight to your inbox.
                </p>
                <div className="flex gap-2">
                    <input
                        type="email"
                        placeholder="Email address"
                        className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-white focus:border-brand-primary focus:outline-none"
                    />
                    <button className="rounded-lg bg-brand-primary px-3 py-2 text-sm font-bold text-brand-dark hover:bg-brand-primary/90 transition-colors">
                        Join
                    </button>
                </div>
            </div>
        </aside>
    );
}
