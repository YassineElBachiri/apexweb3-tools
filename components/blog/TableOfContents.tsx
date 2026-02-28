"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface TocItem {
    id: string;
    text: string;
    level: 2 | 3;
}

interface TableOfContentsProps {
    toc: TocItem[];
}

export function TableOfContents({ toc }: TableOfContentsProps) {
    const [activeId, setActiveId] = useState<string>("");

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: "0px 0px -80% 0px" } // Adjust to trigger when heading is near top
        );

        // Disconnect immediately if toc is empty
        if (!toc || toc.length === 0) return;

        toc.forEach((item) => {
            const element = document.getElementById(item.id);
            if (element) {
                observer.observe(element);
            }
        });

        return () => {
            toc.forEach((item) => {
                const element = document.getElementById(item.id);
                if (element) {
                    observer.unobserve(element);
                }
            });
            observer.disconnect();
        };
    }, [toc]);

    if (!toc || toc.length === 0) {
        return null; // Return nothing if no headings
    }

    return (
        <nav aria-label="Table of Contents" className="space-y-1">
            <h4 className="text-sm font-semibold tracking-wide text-white uppercase mb-4 pl-3">
                On This Page
            </h4>
            <ul className="space-y-2 text-sm">
                {toc.map((item) => (
                    <li
                        key={item.id}
                        className={cn(
                            "transition-colors duration-200",
                            item.level === 3 ? "pl-6" : "pl-3"
                        )}
                    >
                        <a
                            href={`#${item.id}`}
                            className={cn(
                                "block py-1 hover:text-brand-primary transition-colors",
                                activeId === item.id
                                    ? "text-brand-primary font-medium"
                                    : "text-slate-400"
                            )}
                            onClick={(e) => {
                                e.preventDefault();
                                const target = document.getElementById(item.id);
                                if (target) {
                                    target.scrollIntoView({
                                        behavior: "smooth",
                                        block: "start",
                                    });
                                    // Also update URL without causing jump
                                    window.history.pushState(null, "", `#${item.id}`);
                                }
                            }}
                        >
                            {/* Visual indicator for active item */}
                            <span className="relative">
                                {activeId === item.id && (
                                    <span className="absolute -left-3 top-2 h-1.5 w-1.5 rounded-full bg-brand-primary animate-pulse" />
                                )}
                                {item.text}
                            </span>
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
