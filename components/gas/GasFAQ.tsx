"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export function GasFAQ() {
    return (
        <div className="mt-16 mb-16">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                    <AccordionTrigger>What is Gwei?</AccordionTrigger>
                    <AccordionContent>
                        Gwei is a denomination of Ether (ETH) used to measure gas prices. 1 Gwei = 0.000000001 ETH.
                        It makes it easier to discuss small amounts of ETH required for transaction fees.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger>Why are gas fees so high?</AccordionTrigger>
                    <AccordionContent>
                        Fees increase when many users want to transact at the same time.
                        Block space is limited, so users bid up the gas price to get their transactions included by validators.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                    <AccordionTrigger>How can I save money on gas?</AccordionTrigger>
                    <AccordionContent>
                        <ul className="list-disc list-inside space-y-1">
                            <li><strong>Time your transactions:</strong> Weekends and UTC nights are often cheaper.</li>
                            <li><strong>Use Layer 2s:</strong> Networks like Arbitrum, Optimism, and Base offer much lower fees than Ethereum Mainnet.</li>
                            <li><strong>Set custom limits:</strong> Advanced wallets allow you to set a max fee, though this risks stuck transactions if set too low.</li>
                        </ul>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                    <AccordionTrigger>Do you support non-EVM chains?</AccordionTrigger>
                    <AccordionContent>
                        Yes! We now support <strong>Solana</strong> and <strong>Sui</strong>.
                        Select them from the network dropdown to see fees in Lamports or MIST.
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}
