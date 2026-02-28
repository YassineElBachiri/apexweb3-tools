import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy | ApexWeb3",
    description: "Our commitment to protecting and respecting your privacy. Learn how we collect and use your data.",
};

export default function PrivacyPolicyPage() {
    const lastUpdated = "February 28, 2026";

    return (
        <div className="min-h-screen bg-brand-dark text-white">
            <div className="container mx-auto px-4 pt-32 pb-24">
                <div className="max-w-4xl mx-auto">

                    {/* Header */}
                    <div className="mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
                        <p className="text-gray-500 font-medium">Last Updated: {lastUpdated}</p>
                    </div>

                    <div className="bg-white/3 border border-white/10 rounded-3xl p-8 md:p-12 space-y-12">

                        <section className="space-y-4">
                            <p className="text-gray-300 leading-relaxed">
                                At ApexWeb3, accessible from ApexWeb3, we are committed to protecting and respecting your privacy.
                                This Privacy Policy explains how we collect, use, and share your information when you visit our website.
                            </p>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-white border-l-4 border-brand-purple pl-4">1. Information We Collect</h2>
                            <div className="space-y-4 text-gray-400">
                                <div>
                                    <h3 className="text-white font-semibold mb-2">a. Personal Data</h3>
                                    <p>While using our site, we may ask you to provide personal information that can be used to contact or identify you, including but not limited to:</p>
                                    <ul className="list-disc list-inside mt-2 ml-4">
                                        <li>Email address (e.g., when subscribing to newsletters or contacting us)</li>
                                        <li>Name (if provided)</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold mb-2">b. Usage Data</h3>
                                    <p>We may collect information on how our website is accessed and used. This includes your device&apos;s IP address, browser type, version, pages you visit, and time spent on those pages.</p>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-white border-l-4 border-brand-pink pl-4">2. How We Use Your Information</h2>
                            <ul className="grid md:grid-cols-2 gap-4 text-gray-400">
                                <li className="bg-white/5 p-4 rounded-xl border border-white/5">Operate and maintain the blog and platform</li>
                                <li className="bg-white/5 p-4 rounded-xl border border-white/5">Improve and personalize your experience</li>
                                <li className="bg-white/5 p-4 rounded-xl border border-white/5">Send you newsletters or promotional content</li>
                                <li className="bg-white/5 p-4 rounded-xl border border-white/5">Analyze and understand usage patterns</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-white border-l-4 border-brand-blue pl-4">3. Sharing Your Information</h2>
                            <p className="text-gray-400 leading-relaxed">
                                We do not share, sell, or rent your personal data to third parties, except if required by law,
                                to protect our rights, or with your explicit consent.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-white">4. Cookies</h2>
                            <p className="text-gray-400 leading-relaxed">
                                We use cookies and similar tracking technologies to track activity on our site and store certain information.
                                You can set your browser to refuse cookies or alert you when cookies are being sent.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-white">5. Security</h2>
                            <p className="text-gray-400 leading-relaxed">
                                We strive to use commercially acceptable means to protect your personal information. However,
                                no method of transmission over the Internet is 100% secure.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-white">6. Your Data Protection Rights</h2>
                            <p className="text-gray-400 leading-relaxed">
                                You may have rights to access, correct, or delete your personal data.
                                For any requests, please contact our support team.
                            </p>
                        </section>

                    </div>

                    <div className="mt-12 text-center text-gray-500 text-sm">
                        <p>© 2026 ApexWeb3. All rights reserved.</p>
                    </div>

                </div>
            </div>
        </div>
    );
}
