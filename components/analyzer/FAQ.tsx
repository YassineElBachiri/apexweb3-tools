"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export function AnalyzerFAQ() {
    return (
        <div className="mt-16 mb-16">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                    <AccordionTrigger>How accurate is the static analysis?</AccordionTrigger>
                    <AccordionContent>
                        Our tool uses heuristic patterns and regex-based detection to identify common vulnerabilities like Reentrancy and unsafe blocks.
                        While effective for quick checks, it <strong>cannot replace a full manual audit</strong> by a security professional.
                        Always audit your code before deploying to mainnet.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger>Does it support Solana and Sui?</AccordionTrigger>
                    <AccordionContent>
                        Yes! We support <strong>Solidity (EVM)</strong>, <strong>Rust (Solana/Anchor)</strong>, and <strong>Move (Sui)</strong>.
                        Simply select your language from the tabs above the editor to switch modes.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                    <AccordionTrigger>Is my code saved or shared?</AccordionTrigger>
                    <AccordionContent>
                        No. The analysis runs in a stateless environment. We do not store, share, or log your smart contract code.
                        Your intellectual property remains private.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                    <AccordionTrigger>What do the cost estimates mean?</AccordionTrigger>
                    <AccordionContent>
                        For Solidity, we estimate Gas based on operation complexity. For Solana and Sui, we estimate Compute Units or similar resource metrics.
                        These are approximations to help you optimize for cost efficiency.
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}
