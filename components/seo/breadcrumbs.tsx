import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    className?: string;
}

export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
    // Generate breadcrumb schema
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.label,
            ...(item.href && { "item": `https://tools.apexweb3.com${item.href}` })
        }))
    };

    return (
        <>
            {/* Schema.org markup */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />

            <nav aria-label="Breadcrumb" className={`flex items-center gap-2 text-sm ${className}`}>
                <Link
                    href="/"
                    className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                >
                    <Home className="h-4 w-4" />
                    <span>Home</span>
                </Link>

                {items.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        {item.href && index < items.length - 1 ? (
                            <Link
                                href={item.href}
                                className="text-muted-foreground hover:text-primary transition-colors"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span className="text-foreground font-medium">
                                {item.label}
                            </span>
                        )}
                    </div>
                ))}
            </nav>
        </>
    );
}
