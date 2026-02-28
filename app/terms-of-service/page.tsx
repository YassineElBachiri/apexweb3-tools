import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service | ApexWeb3",
    description: "Read our Terms of Service to understand your rights and responsibilities when using the ApexWeb3 platform.",
};

const terms = [
    {
        id: "1",
        title: "1. Acceptance of Terms",
        content: "By accessing ApexWeb3, you acknowledge that you have read, understood, and agree to these Terms of Service. If you do not agree with any part of these terms, you must discontinue using the site."
    },
    {
        id: "2",
        title: "2. Use of the Website",
        content: "ApexWeb3 provides information and tools related to blockchain, Web3 technologies, and decentralized applications. The content is for informational purposes only, and users should not interpret it as professional advice."
    },
    {
        id: "3",
        title: "3. Intellectual Property",
        content: "All content, including articles, blog posts, logos, and tools on ApexWeb3, are the property of ApexWeb3 and its contributors. You may not copy, distribute, or modify any content without prior written consent."
    },
    {
        id: "4",
        title: "4. User Conduct",
        content: "You agree not to use our website to violate any laws, transmit harmful content, or interfere with the functioning of the site, including hacking or phishing."
    },
    {
        id: "5",
        title: "5. Disclaimer of Warranties",
        content: "The content and services provided on ApexWeb3 are on an 'as is' and 'as available' basis. We make no warranties regarding the accuracy, completeness, or reliability of any content."
    },
    {
        id: "6",
        title: "6. Limitation of Liability",
        content: "To the fullest extent permitted by law, ApexWeb3 shall not be liable for any indirect, incidental, or consequential damages arising from your use of the site."
    }
];

export default function TermsOfServicePage() {
    const lastUpdated = "February 28, 2026";

    return (
        <div className="min-h-screen bg-brand-dark text-white">
            <div className="container mx-auto px-4 pt-32 pb-24">
                <div className="max-w-4xl mx-auto">

                    {/* Header */}
                    <div className="mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
                        <p className="text-gray-500 font-medium">Last Updated: {lastUpdated}</p>
                    </div>

                    <div className="space-y-6">
                        {terms.map((term) => (
                            <div key={term.id} className="bg-white/3 border border-white/5 hover:border-white/10 rounded-2xl p-6 md:p-8 transition-colors">
                                <h2 className="text-xl font-bold mb-4 text-brand-blue">{term.title}</h2>
                                <p className="text-gray-400 leading-relaxed">{term.content}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 p-8 rounded-3xl bg-brand-purple/5 border border-brand-purple/10 text-center">
                        <h2 className="text-2xl font-bold mb-4">Questions about our Terms?</h2>
                        <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                            If you have any questions regarding these terms, please reach out to us.
                            We're happy to clarify our policies.
                        </p>
                        <a href="/contact" className="inline-block px-8 py-4 rounded-full bg-brand-purple text-white font-bold hover:bg-brand-purple/90 transition-all">
                            Contact Support
                        </a>
                    </div>

                    <div className="mt-12 text-center text-gray-500 text-sm">
                        <p>© 2026 ApexWeb3. All rights reserved.</p>
                    </div>

                </div>
            </div>
        </div>
    );
}
