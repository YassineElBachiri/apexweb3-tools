
"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { SALARY_ESTIMATOR_CONTENT } from "@/lib/seo-content/salary-estimator";

export function FAQ() {
    return (
        <section className="w-full py-12 px-4 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-8 text-center">
                Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="w-full space-y-4">
                {SALARY_ESTIMATOR_CONTENT.faq.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="border border-white/5 rounded-lg bg-brand-dark/30 px-4">
                        <AccordionTrigger className="text-gray-200 hover:text-white hover:no-underline font-medium text-left">
                            {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-400">
                            {item.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>

            {/* Schema.org markup for FAQ */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        "mainEntity": SALARY_ESTIMATOR_CONTENT.faq.map(item => ({
                            "@type": "Question",
                            "name": item.question,
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": item.answer
                            }
                        }))
                    })
                }}
            />
        </section>
    );
}
