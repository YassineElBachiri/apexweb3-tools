"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQSectionProps {
    title?: string;
    faqs: FAQItem[];
    className?: string;
}

export function FAQSection({ title = "Frequently Asked Questions", faqs, className = "" }: FAQSectionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    // Generate FAQ schema for SEO
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };

    return (
        <section className={`space-y-6 ${className}`}>
            {/* Schema.org markup */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
                {title}
            </h2>

            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <Card
                        key={index}
                        className="border-primary/20 bg-gradient-to-br from-background to-background/50 overflow-hidden transition-all duration-300 hover:border-primary/40"
                    >
                        <button
                            onClick={() => toggleFAQ(index)}
                            className="w-full text-left p-6 flex items-start justify-between gap-4 cursor-pointer"
                            aria-expanded={openIndex === index}
                        >
                            <h3 className="text-lg font-semibold pr-4 flex-1">
                                {faq.question}
                            </h3>
                            <ChevronDown
                                className={`h-5 w-5 text-primary flex-shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''
                                    }`}
                            />
                        </button>

                        <div
                            className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                                }`}
                        >
                            <CardContent className="pt-0 pb-6 px-6">
                                <div className="prose prose-invert max-w-none">
                                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                                        {faq.answer}
                                    </p>
                                </div>
                            </CardContent>
                        </div>
                    </Card>
                ))}
            </div>
        </section>
    );
}
