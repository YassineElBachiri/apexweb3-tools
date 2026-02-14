import { ReactNode } from "react";

interface ContentSectionProps {
    id?: string;
    heading: string;
    headingLevel?: 'h2' | 'h3' | 'h4';
    children: ReactNode;
    className?: string;
}

export function ContentSection({
    id,
    heading,
    headingLevel = 'h2',
    children,
    className = ""
}: ContentSectionProps) {
    const HeadingTag = headingLevel;

    const headingStyles: Record<string, string> = {
        h2: "text-2xl md:text-3xl font-bold mb-4",
        h3: "text-xl md:text-2xl font-semibold mb-3",
        h4: "text-lg md:text-xl font-semibold mb-2"
    };

    return (
        <section id={id} className={`space-y-4 ${className}`}>
            <HeadingTag className={headingStyles[headingLevel]}>
                {heading}
            </HeadingTag>
            <div className="prose prose-invert max-w-none">
                {children}
            </div>
        </section>
    );
}
