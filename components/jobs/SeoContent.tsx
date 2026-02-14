import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export function SeoContent() {
    return (
        <section className="container py-16 max-w-4xl mx-auto px-4 sm:px-6 space-y-16">

            {/* SEO Intro Text */}
            <article className="prose prose-invert max-w-none">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-6">
                    Find the Best Web3 Jobs and Blockchain Careers
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>
                        The Web3 revolution is redefining the future of work, creating unprecedented opportunities for developers, marketers, designers, and community managers. Whether you are looking for <strong>remote crypto jobs</strong>, high-paying <strong>blockchain developer roles</strong>, or entry-level positions in DeFi, the ApexWeb3 Job Board is your gateway to the decentralized economy.
                    </p>
                    <p>
                        Our platform aggregates real-time listings from top companies in the space, including Ethereum foundations, leading DeFi protocols, NFT marketplaces, and DAO organizations. We prioritize <strong>clean, safe, and direct application links</strong>, ensuring you connect directly with employers without middlemen or hidden fees.
                    </p>
                    <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">Why Choose a Career in Web3?</h3>
                    <p>
                        Blockchain technology is one of the fastest-growing sectors globally. Working in Web3 offers not just competitive salaries but also the chance to build permissionless systems, own your digital identity, and participate in permissionless governance. From <strong>Smart Contract Engineering</strong> (Solidity, Rust) to <strong>Community Management</strong> and <strong>Tokenomics Design</strong>, the variety of roles is expanding every day.
                    </p>
                    <p>
                        Browse our curated list of opportunities today. Filter by "Remote Only" to find work-from-anywhere positions, or search for specific tags like "React", "Rust", or "Marketing" to tailor your job hunt to your skills.
                    </p>
                </div>
            </article>

            {/* FAQ Section */}
            <div className="bg-card/30 backdrop-blur-sm border rounded-2xl p-8">
                <h2 className="text-2xl font-bold mb-8">Frequently Asked Questions</h2>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>What are the most in-demand skills for Web3 jobs?</AccordionTrigger>
                        <AccordionContent>
                            The most in-demand technical skills include <strong>Solidity</strong> (for Ethereum), <strong>Rust</strong> (for Solana/Polkadot), typescript, and React for frontend integration. On the non-technical side, community management (Discord/Twitter), technical writing, and tokenomics expertise are highly sought after.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                        <AccordionTrigger>Can I work remotely in Web3?</AccordionTrigger>
                        <AccordionContent>
                            Yes! The vast majority of Web3 and crypto companies are "remote-first" or fully distributed organizations (DAOs). This makes the industry perfect for digital nomads and those seeking work-life flexibility. Use our "Remote Only" filter to find these roles easily.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3">
                        <AccordionTrigger>Do I need to be a developer to work in crypto?</AccordionTrigger>
                        <AccordionContent>
                            Absolutely not. While developers are critical, Web3 projects need marketers to build awareness, community managers to engage users, designers to create intuitive UIs, and legal experts to navigate regulations. There is a role for almost every skill set.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4">
                        <AccordionTrigger>How do I get paid in Web3? Crypto or Fiat?</AccordionTrigger>
                        <AccordionContent>
                            This depends on the company. Many established firms pay in stablecoins (USDC/USDT) or fiat currency (USD/EUR). Some startups and DAOs may offer a portion of compensation in their native project tokens, which can offer significant upside potential (but also risk).
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-5">
                        <AccordionTrigger>Is it safe to apply for jobs on this board?</AccordionTrigger>
                        <AccordionContent>
                            We prioritize safety. All "Apply" buttons on ApexWeb3 are <strong>direct links</strong> using <code>rel="follow"</code> to the official company hiring page or application form. We do not aggregate your data or act as a middleman.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-6">
                        <AccordionTrigger>What is a DAO?</AccordionTrigger>
                        <AccordionContent>
                            A DAO (Decentralized Autonomous Organization) is an organization represented by rules encoded as a computer program that is transparent, controlled by the organization members and not influenced by a central government. Working for a DAO often means more autonomy and direct participation in governance.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-7">
                        <AccordionTrigger>How often are new jobs added?</AccordionTrigger>
                        <AccordionContent>
                            Our job feed is updated hourly. We pull data from the most reliable sources in the industry to ensure you have access to the freshest opportunities as soon as they are posted.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-8">
                        <AccordionTrigger>How can I stand out when applying?</AccordionTrigger>
                        <AccordionContent>
                            Having a portfolio (GitHub for dev, writing samples for marketers) is key. Additionally, participating in the project's community (Discord, Governance Forums) <em>before</em> applying can verify your genuine interest and understanding of the protocol.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </section>
    );
}
